import { fetchRuns, fetchStatsSummary } from '../../lib/api';
import { HistoryClient } from '../../components/HistoryClient';
import type { StatsSummary, RunsResponse, Run } from '../../lib/types';

export const metadata = {
    title: 'Execution History — IBA Dashboard',
    description: 'Real-time monitoring and lifecycle management of automation workflows.',
};

export const revalidate = 30;
export const dynamic = 'force-dynamic';

const STATUS_MAP: Record<string, 'Running' | 'Completed' | 'Failed' | 'Waiting'> = {
    running: 'Running',
    success: 'Completed',
    error: 'Failed',
    waiting: 'Waiting',
};

export default async function HistoryPage({
    searchParams,
}: {
    searchParams: { workflowId?: string; status?: string; cursor?: string };
}) {
    let summary: StatsSummary | null = null;
    let initialRuns: RunsResponse = { runs: [], nextCursor: null };

    try {
        [summary, initialRuns] = await Promise.all([
            fetchStatsSummary(),
            fetchRuns({
                workflowId: searchParams.workflowId,
                status: searchParams.status,
                limit: 40,
                cursor: searchParams.cursor,
            }),
        ]);
    } catch (err) {
        console.error('[History] Failed to fetch data:', err);
    }

    // Transform runs into display rows
    const rows = initialRuns.runs.map((r: Run, idx: number) => ({
        id: r.execution_id ?? String(idx),
        automation: r.workflow_name ?? 'Unknown Automation',
        department: r.workflow_department ?? '—',
        lastRun: r.started_at
            ? new Date(r.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today'
            : '—',
        status: STATUS_MAP[r.status as string] ?? 'Waiting',
    }));

    return (
        <HistoryClient
            totalRuns={summary?.total_runs}
            successRate={summary?.success_rate_pct}
            dataProcessed={
                summary?.estimated_hours_saved != null
                    ? `${(summary.estimated_hours_saved / 500).toFixed(1)} TB`
                    : undefined
            }
            errorsResolved={summary?.failed_runs}
            runs={rows}
        />
    );
}
