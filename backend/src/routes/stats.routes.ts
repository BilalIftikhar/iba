/**
 * stats.routes.ts
 * Live execution statistics fetched directly from n8n — never stored in Postgres.
 *
 * Routes:
 *   GET /api/v1/stats/summary  — Aggregate counts + time-saved for the authed user's workflows
 *   GET /api/v1/stats/runs     — Paginated execution log joined with local IbaWorkflow metadata
 */
import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { n8nService, N8nExecution } from '../services/n8n.service';

export const statsRouter = Router();

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Derive a human-readable duration string from two ISO timestamps */
const durationMs = (startedAt: string, stoppedAt: string | null): number | null => {
    if (!stoppedAt) return null;
    return new Date(stoppedAt).getTime() - new Date(startedAt).getTime();
};

// ─────────────────────────────────────────────────────────────
// GET /api/v1/stats/summary
//
// Returns an aggregate summary for all workflows owned by the
// authenticated client, joining live n8n execution stats with
// local IbaWorkflow.time_saving_multiplier for ROI calculations.
//
// Response shape:
// {
//   total_workflows: number,
//   active_workflows: number,
//   total_runs: number,
//   successful_runs: number,
//   failed_runs: number,
//   success_rate_pct: number,           // 0–100
//   estimated_hours_saved: number,      // based on time_saving_multiplier
//   per_workflow: [{ ... }]
// }
// ─────────────────────────────────────────────────────────────
statsRouter.get('/summary', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;

        // 1. Fetch all active IbaWorkflow records for this user
        const workflows = await prisma.ibaWorkflow.findMany({
            where: { client_id: userId },
            select: {
                id: true,
                n8n_workflow_id: true,
                name: true,
                department: true,
                status: true,
                time_saving_multiplier: true,
            },
        });

        if (workflows.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    total_workflows: 0,
                    active_workflows: 0,
                    total_runs: 0,
                    successful_runs: 0,
                    failed_runs: 0,
                    success_rate_pct: 0,
                    estimated_hours_saved: 0,
                    per_workflow: [],
                },
            });
        }

        // 2. Fetch recent executions from n8n for each workflow in parallel.
        //    We cap at 100 per workflow to keep the response fast.
        const executionResults = await Promise.allSettled(
            workflows.map((wf) =>
                n8nService.getAllExecutions({ workflowId: wf.n8n_workflow_id, limit: 100 }),
            ),
        );

        // 3. Aggregate stats
        let totalRuns = 0;
        let successfulRuns = 0;
        let failedRuns = 0;
        let estimatedMinutesSaved = 0;

        const perWorkflow = workflows.map((wf, i) => {
            const result = executionResults[i];
            if (result.status === 'rejected') {
                console.warn(`[stats/summary] n8n fetch failed for workflow ${wf.n8n_workflow_id}:`, result.reason);
                return {
                    workflow_id: wf.id,
                    n8n_workflow_id: wf.n8n_workflow_id,
                    name: wf.name,
                    department: wf.department,
                    status: wf.status,
                    runs: 0,
                    successful: 0,
                    failed: 0,
                    estimated_minutes_saved: 0,
                    error: 'Failed to fetch from n8n',
                };
            }

            const executions: N8nExecution[] = result.value.data;
            const runs = executions.length;
            const successful = executions.filter((e) => e.status === 'success').length;
            const failed = executions.filter((e) => e.status === 'error').length;
            const minutesSaved = (wf.time_saving_multiplier ?? 0) * successful;

            totalRuns += runs;
            successfulRuns += successful;
            failedRuns += failed;
            estimatedMinutesSaved += minutesSaved;

            return {
                workflow_id: wf.id,
                n8n_workflow_id: wf.n8n_workflow_id,
                name: wf.name,
                department: wf.department,
                status: wf.status,
                runs,
                successful,
                failed,
                success_rate_pct: runs > 0 ? Math.round((successful / runs) * 100) : 0,
                estimated_minutes_saved: minutesSaved,
            };
        });

        const successRatePct = totalRuns > 0
            ? Math.round((successfulRuns / totalRuns) * 100)
            : 0;

        return res.status(200).json({
            success: true,
            data: {
                total_workflows: workflows.length,
                active_workflows: workflows.filter((w) => w.status === 'active').length,
                total_runs: totalRuns,
                successful_runs: successfulRuns,
                failed_runs: failedRuns,
                success_rate_pct: successRatePct,
                estimated_hours_saved: Math.round((estimatedMinutesSaved / 60) * 100) / 100,
                per_workflow: perWorkflow,
            },
        });
    } catch (error: any) {
        console.error('[GET /stats/summary]', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch stats summary.' });
    }
});

// ─────────────────────────────────────────────────────────────
// GET /api/v1/stats/runs
//
// Returns a paginated feed of execution runs across all of the
// user's workflows, enriched with local IbaWorkflow metadata.
//
// Query params:
//   ?workflowId=<local IbaWorkflow.id>   (optional filter)
//   ?status=success|error|waiting|running (optional filter)
//   ?limit=<number, default 20, max 100>
//   ?cursor=<n8n pagination cursor>
//
// Execution data is NEVER stored — returned live from n8n.
// ─────────────────────────────────────────────────────────────
statsRouter.get('/runs', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const {
            workflowId: localWorkflowId,
            status,
            cursor,
        } = req.query as Record<string, string | undefined>;

        const limit = Math.min(parseInt((req.query.limit as string) ?? '20', 10), 100);

        // 1. Resolve the local IbaWorkflow(s) for this user
        const workflowWhere = localWorkflowId
            ? { client_id: userId, id: localWorkflowId }
            : { client_id: userId };

        const workflows = await prisma.ibaWorkflow.findMany({
            where: workflowWhere,
            select: { id: true, n8n_workflow_id: true, name: true, department: true, status: true },
        });

        if (workflows.length === 0) {
            return res.status(200).json({
                success: true,
                data: { runs: [], nextCursor: null },
            });
        }

        // 2. Build a lookup map: n8nWorkflowId → local workflow metadata
        const workflowMap = new Map(workflows.map((wf) => [wf.n8n_workflow_id, wf]));

        // 3. If filtering by a single workflow, pass its n8n ID directly.
        //    Otherwise fetch across all n8n workflow IDs for this user.
        //    NOTE: n8n's API only filters by one workflowId at a time, so for
        //    multi-workflow feeds we fetch all and filter client-side.
        let rawExecutions: N8nExecution[] = [];
        let nextCursor: string | null = null;

        if (localWorkflowId && workflows.length === 1) {
            const result = await n8nService.getAllExecutions({
                workflowId: workflows[0].n8n_workflow_id,
                status: status as N8nExecution['status'] | undefined,
                limit,
                cursor,
            });
            rawExecutions = result.data;
            nextCursor = result.nextCursor;
        } else {
            // Fetch all workflows' executions in parallel and merge
            const results = await Promise.allSettled(
                workflows.map((wf) =>
                    n8nService.getAllExecutions({
                        workflowId: wf.n8n_workflow_id,
                        status: status as N8nExecution['status'] | undefined,
                        limit,
                    }),
                ),
            );
            for (const r of results) {
                if (r.status === 'fulfilled') rawExecutions.push(...r.value.data);
            }
            // Sort merged results by startedAt descending and apply limit
            rawExecutions.sort(
                (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
            );
            rawExecutions = rawExecutions.slice(0, limit);
        }

        // 4. Enrich with local metadata — no DB write, read-only join
        const runs = rawExecutions.map((exec) => {
            const localWf = workflowMap.get(exec.workflowId);
            return {
                execution_id: exec.id,
                n8n_workflow_id: exec.workflowId,
                // Local IbaWorkflow fields (null if n8n workflow isn't registered locally)
                workflow_id: localWf?.id ?? null,
                workflow_name: localWf?.name ?? exec.workflowId,
                workflow_department: localWf?.department ?? null,
                workflow_status: localWf?.status ?? null,
                // Execution fields
                status: exec.status,
                mode: exec.mode,
                started_at: exec.startedAt,
                stopped_at: exec.stoppedAt,
                duration_ms: durationMs(exec.startedAt, exec.stoppedAt),
                retry_of: exec.retryOf,
            };
        });

        return res.status(200).json({
            success: true,
            data: { runs, nextCursor },
        });
    } catch (error: any) {
        console.error('[GET /stats/runs]', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch execution runs.' });
    }
});
