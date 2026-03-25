'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSocket } from '../lib/socket';
import { fetchRuns } from '../lib/api';
import { type Run, type RunCompletedEvent } from '../lib/types';
import { RunStatusBadge } from './RunStatusBadge';
import { SkeletonRow } from './Skeletons';

interface Props {
    initialRuns: Run[];
    initialCursor: string | null;
    /** If set, keep the table filtered to this local IbaWorkflow.id */
    workflowId?: string;
    /** Show the full Execution History layout vs compact Recent Activity */
    fullView?: boolean;
}

function formatDuration(ms: number | null): string {
    if (ms == null) return '—';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
}

/** Converts a RunCompletedEvent (from WebSocket) to the Run shape used by the table */
function eventToRun(e: RunCompletedEvent): Run {
    return {
        execution_id: e.executionId,
        n8n_workflow_id: e.n8nWorkflowId,
        workflow_id: e.workflowId,
        workflow_name: e.workflowName,
        workflow_department: e.department,
        workflow_status: null,
        status: e.status as Run['status'],
        mode: e.mode,
        started_at: e.startedAt,
        stopped_at: e.stoppedAt,
        duration_ms: e.durationMs,
        retry_of: e.retryOf,
    };
}

export function ActivityTable({ initialRuns, initialCursor, workflowId, fullView = false }: Props) {
    const [runs, setRuns] = useState<Run[]>(initialRuns);
    const [cursor, setCursor] = useState<string | null>(initialCursor);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const [newRowIds, setNewRowIds] = useState<Set<string>>(new Set());
    const [liveCount, setLiveCount] = useState(0);
    const tableRef = useRef<HTMLDivElement>(null);

    // ── Socket.io: listen for live run.completed ────────────────
    useEffect(() => {
        const socket = getSocket();

        const handleRunCompleted = (event: RunCompletedEvent) => {
            // If filtering by workflow, only show events for that workflow
            if (workflowId && event.workflowId !== workflowId) return;

            const newRun = eventToRun(event);
            setRuns((prev) => [newRun, ...prev]);
            setNewRowIds((prev) => new Set(Array.from(prev).concat(newRun.execution_id)));
            setLiveCount((c) => c + 1);

            // Clear the flash class after animation completes
            setTimeout(() => {
                setNewRowIds((prev) => {
                    const next = new Set(prev);
                    next.delete(newRun.execution_id);
                    return next;
                });
            }, 1300);
        };

        socket.on('run.completed', handleRunCompleted);
        return () => { socket.off('run.completed', handleRunCompleted); };
    }, [workflowId]);

    // ── Load more (pagination) ──────────────────────────────────
    const loadMore = useCallback(async () => {
        if (!cursor || loading) return;
        setLoading(true);
        try {
            const res = await fetchRuns({ workflowId, cursor, limit: 20 });
            setRuns((prev) => [...prev, ...res.runs]);
            setCursor(res.nextCursor);
        } catch (err) {
            console.error('Failed to load more runs', err);
        } finally {
            setLoading(false);
        }
    }, [cursor, loading, workflowId]);

    // ── Filter ──────────────────────────────────────────────────
    const filtered = filter === 'all' ? runs : runs.filter((r) => r.status === filter);

    return (
        <div className="flex flex-col gap-4">
            {/* Table header / controls */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-[var(--text)]">
                        {fullView ? 'Execution History' : 'Recent Activity'}
                    </h2>
                    {liveCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--accent-glow)] text-[var(--accent-light)] border border-[var(--accent)]/20 slide-in">
                            <span className="live-dot" style={{ width: 6, height: 6 }} />
                            +{liveCount} live
                        </span>
                    )}
                </div>

                {/* Status filter chips */}
                <div className="flex items-center gap-1.5">
                    {['all', 'success', 'error', 'running', 'waiting'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === s
                                ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]'
                                : 'bg-[var(--bg-elevated)] text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)]'
                                }`}
                        >
                            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div ref={tableRef} className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                {['Workflow', 'Status', 'Mode', 'Started', 'Duration', 'Department'].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filtered.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-[var(--text-sub)]">
                                        No executions found
                                    </td>
                                </tr>
                            )}

                            {filtered.map((run) => (
                                <tr
                                    key={run.execution_id}
                                    className={`transition-colors hover:bg-[var(--bg-elevated)] ${newRowIds.has(run.execution_id) ? 'row-flash' : ''
                                        }`}
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-[var(--text)] truncate max-w-[180px]">
                                            {run.workflow_name}
                                        </div>
                                        <div className="text-[10px] text-[var(--text-sub)] font-mono mt-0.5 truncate max-w-[180px]">
                                            {run.execution_id}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <RunStatusBadge status={run.status} />
                                    </td>
                                    <td className="px-4 py-3 text-[var(--text-sub)] capitalize">{run.mode}</td>
                                    <td className="px-4 py-3 text-[var(--text-sub)] whitespace-nowrap">
                                        {formatTime(run.started_at)}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-[var(--text-sub)]">
                                        {formatDuration(run.duration_ms)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {run.workflow_department ? (
                                            <span className="px-2 py-0.5 rounded-md text-xs bg-[var(--bg-elevated)] text-[var(--text-sub)] border border-[var(--border)]">
                                                {run.workflow_department}
                                            </span>
                                        ) : (
                                            <span className="text-[var(--text-sub)]">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {loading && (
                                <>
                                    <SkeletonRow />
                                    <SkeletonRow />
                                    <SkeletonRow />
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Load more footer */}
                {cursor && (
                    <div className="px-4 py-3 border-t border-[var(--border)] flex justify-center">
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="px-5 py-2 rounded-lg text-sm font-medium bg-[var(--bg-elevated)] text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)] disabled:opacity-50 transition-all"
                        >
                            {loading ? 'Loading…' : 'Load more'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
