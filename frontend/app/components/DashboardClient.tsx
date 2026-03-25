'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { StatsSummary, Run, RunsResponse, RunCompletedEvent } from '../lib/types';
import { fetchRuns } from '../lib/api';
import { getSocket } from '../lib/socket';

interface Props {
    summary: StatsSummary | null;
    initialRuns: RunsResponse;
}

import { HeaderBar } from './HeaderBar';

// ── Stat Card ──────────────────────────────────────────────────
function StatCard({
    label, value, trend, trendUp, icon,
}: {
    label: string; value: string; trend: string; trendUp: boolean; icon: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#E6F8F9] flex items-center justify-center text-[#00C2FF] shrink-0">
                    {icon}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {trend}
                </span>
            </div>
            <div>
                <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
            </div>
        </div>
    );
}

// ── System Activity ─────────────────────────────────────────────
const SYSTEM_ACTIVITY = [
    { name: "Pipeline 'Data Sync Core'", time: '2 min ago', status: 'success' },
    { name: "New booking 'In Review'", time: 'Just now', status: 'success' },
    { name: "Draft created: 'Customer Support'", time: 'Retrying...', status: 'warning' },
    { name: 'Global traffic spike detected', time: '45 min ago', status: 'success' },
];

function SystemActivity() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-bold text-slate-800">System Activity</h2>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Updates
                </span>
            </div>
            <div className="space-y-2 flex-1">
                {SYSTEM_ACTIVITY.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] border border-slate-100 hover:border-slate-200 hover:shadow-sm bg-white transition-all cursor-pointer group">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-slate-700 truncate">{item.name}</p>
                            <p className="text-[11px] font-medium text-slate-400">{item.time}</p>
                        </div>
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Performance Chart ──────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CHART_DATA = [68, 82, 55, 91, 76, 43, 88];
const MAX_VAL = Math.max(...CHART_DATA);

function PerformanceChart({ totalOps }: { totalOps: number }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col h-full">
            <div className="flex items-start justify-between mb-1">
                <div>
                    <h2 className="text-[15px] font-bold text-slate-800">Performance (7 days)</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Total success: {totalOps.toLocaleString()} operations
                    </p>
                </div>
                <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 cursor-pointer hover:border-slate-300 transition-colors">
                    Daily
                    <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>
            {/* Bar chart */}
            <div className="mt-5 flex items-end gap-2 h-36 flex-1">
                {CHART_DATA.map((val, i) => {
                    const height = Math.round((val / MAX_VAL) * 100);
                    const isHighlight = i === 3; // Thu highlighted
                    return (
                        <div key={DAYS[i]} className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full flex flex-col justify-end" style={{ height: '120px' }}>
                                <div
                                    className={`w-full rounded-lg transition-all duration-500 ${isHighlight ? 'bg-[#00C2FF]' : 'bg-slate-100 hover:bg-slate-200'}`}
                                    style={{ height: `${height}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">{DAYS[i]}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Upgrade Card ───────────────────────────────────────────────
function UpgradeCard() {
    return (
        <div className="bg-gradient-to-b from-[#00C2FF] to-[#0099CC] rounded-2xl shadow-sm p-5 flex flex-col justify-between text-white relative overflow-hidden h-full min-h-[240px]">
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute top-8 -right-2 w-14 h-14 rounded-full bg-white/10 pointer-events-none" />

            <div className="relative z-10">
                <h3 className="text-[15px] font-bold text-white mb-1">Upgrade to Pro</h3>
                <p className="text-[12px] text-white/80 leading-relaxed max-w-[200px]">
                    Get access to real-time analytics and unlimited pipelines.
                </p>
            </div>

            <div className="relative z-10 mt-4">
                <div className="bg-white/20 rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">USAGE THRESHOLD</p>
                        <p className="text-[11px] font-bold text-white">12/15 Pipelines</p>
                    </div>
                    <p className="text-[28px] font-black text-white leading-none mb-2">84%</p>
                    <div className="w-full h-1.5 bg-white/20 rounded-full">
                        <div className="h-full w-[84%] bg-white rounded-full" />
                    </div>
                </div>

                <Link
                    href="/subscription"
                    className="block w-full bg-[#0B1521] hover:bg-[#162232] text-white text-center font-bold py-2.5 rounded-xl text-[13px] transition-colors"
                >
                    View Plans
                </Link>
            </div>
        </div>
    );
}

// ── Recent Activity Table ──────────────────────────────────────
function formatDuration(ms: number | null): string {
    if (!ms) return '—';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        + ' • '
        + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function StatusPill({ status }: { status: Run['status'] }) {
    const map = {
        success: { label: 'Completed', classes: 'bg-emerald-50 text-emerald-600' },
        error: { label: 'Warning', classes: 'bg-amber-50 text-amber-600' },
        running: { label: 'Running', classes: 'bg-blue-50 text-blue-600' },
        waiting: { label: 'Waiting', classes: 'bg-slate-100 text-slate-500' },
        unknown: { label: 'Unknown', classes: 'bg-slate-100 text-slate-400' },
    };
    const { label, classes } = map[status] ?? map.unknown;
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${classes}`}>
            {label}
        </span>
    );
}

const ICON_COLORS = [
    { bg: 'bg-[#E6F8F9]', text: 'text-[#00C2FF]' },
    { bg: 'bg-violet-50', text: 'text-violet-500' },
    { bg: 'bg-amber-50', text: 'text-amber-500' },
    { bg: 'bg-emerald-50', text: 'text-emerald-500' },
    { bg: 'bg-pink-50', text: 'text-pink-500' },
    { bg: 'bg-cyan-50', text: 'text-cyan-500' },
];

function WorkflowIcon({ name, idx }: { name: string; idx: number }) {
    const color = ICON_COLORS[idx % ICON_COLORS.length];
    const initials = name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
    return (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${color.bg} ${color.text}`}>
            {initials}
        </div>
    );
}

// Static mock data for when no API data is available
const MOCK_RUNS = [
    { execution_id: '1', workflow_name: 'User Data Migration', status: 'success' as const, duration: '4.2s', date: 'Mar 24, 2024 • 14:32' },
    { execution_id: '2', workflow_name: 'Invoice Generation', status: 'success' as const, duration: '1.8s', date: 'Mar 24, 2024 • 14:15' },
    { execution_id: '3', workflow_name: 'Slack Alert Broadcast', status: 'error' as const, duration: '12.5s', date: 'Mar 24, 2024 • 13:58' },
];

function RecentActivity({ runs, onLoadMore, hasMore, loading }: {
    runs: Run[];
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
}) {
    const hasRealData = runs.length > 0;
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-slate-800">Recent Activity</h2>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-slate-300 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="21" y1="6" x2="3" y2="6" /><line x1="15" y1="12" x2="3" y2="12" /><line x1="9" y1="18" x2="3" y2="18" />
                    </svg>
                    Filter
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {['Operation Name', 'Status', 'Duration', 'Date', 'Action'].map((h) => (
                                <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {hasRealData ? runs.map((run, idx) => (
                            <tr key={run.execution_id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <WorkflowIcon name={run.workflow_name} idx={idx} />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">{run.workflow_name}</p>
                                            {run.workflow_department && (
                                                <p className="text-xs text-slate-400">{run.workflow_department}</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><StatusPill status={run.status} /></td>
                                <td className="px-6 py-4 text-sm text-slate-500 tabular-nums">{formatDuration(run.duration_ms)}</td>
                                <td className="px-6 py-4 text-sm text-slate-500 tabular-nums whitespace-nowrap">{formatDate(run.started_at)}</td>
                                <td className="px-6 py-4">
                                    <button className="text-slate-300 hover:text-slate-500 transition-colors text-lg font-bold leading-none">•••</button>
                                </td>
                            </tr>
                        )) : MOCK_RUNS.map((run, idx) => (
                            <tr key={run.execution_id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <WorkflowIcon name={run.workflow_name} idx={idx} />
                                        <p className="text-sm font-semibold text-slate-700">{run.workflow_name}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><StatusPill status={run.status} /></td>
                                <td className="px-6 py-4 text-sm text-slate-500 tabular-nums">{run.duration}</td>
                                <td className="px-6 py-4 text-sm text-slate-500 tabular-nums whitespace-nowrap">{run.date}</td>
                                <td className="px-6 py-4">
                                    <button className="text-slate-300 hover:text-slate-500 transition-colors text-lg font-bold leading-none">•••</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {hasRealData && hasMore && (
                <div className="px-6 py-4 border-t border-slate-100 text-center">
                    <button
                        onClick={onLoadMore}
                        disabled={loading}
                        className="text-sm font-semibold text-[#00C2FF] hover:text-[#00A3D9] disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Loading…' : 'Load more'}
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Main Dashboard Client Component ───────────────────────────
export function DashboardClient({ summary, initialRuns }: Props) {
    const [runs, setRuns] = useState<Run[]>(initialRuns.runs);
    const [cursor, setCursor] = useState<string | null>(initialRuns.nextCursor);
    const [loadingMore, setLoadingMore] = useState(false);

    const timeSaved = summary ? `${summary.estimated_hours_saved.toFixed(0)} hrs` : '124 hrs';
    const roiAchieved = summary ? `$${(summary.total_runs * 9.5).toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '$12,540';
    const activeAutomations = summary ? String(summary.active_workflows) : '42';
    const successRate = summary ? `${summary.success_rate_pct}%` : '99.8%';
    const totalOps = summary?.total_runs ?? 2410;

    useEffect(() => {
        const socket = getSocket();
        const handler = (event: RunCompletedEvent) => {
            const newRun: Run = {
                execution_id: event.executionId,
                n8n_workflow_id: event.n8nWorkflowId,
                workflow_id: event.workflowId,
                workflow_name: event.workflowName,
                workflow_department: event.department,
                workflow_status: null,
                status: event.status === 'success' ? 'success' : 'error',
                mode: event.mode,
                started_at: event.startedAt,
                stopped_at: event.stoppedAt,
                duration_ms: event.durationMs,
                retry_of: event.retryOf,
            };
            setRuns((prev) => [newRun, ...prev].slice(0, 50));
        };
        socket.on('run.completed', handler);
        return () => { socket.off('run.completed', handler); };
    }, []);

    const loadMore = useCallback(async () => {
        if (!cursor || loadingMore) return;
        setLoadingMore(true);
        try {
            const res = await fetchRuns({ limit: 10, cursor });
            setRuns((prev) => [...prev, ...res.runs]);
            setCursor(res.nextCursor);
        } finally {
            setLoadingMore(false);
        }
    }, [cursor, loadingMore]);

    return (
        <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-[1360px] mx-auto w-full">
            <HeaderBar title="Dashboard" />

            {/* Page heading */}
            <div className="text-center mb-6 lg:mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-sm text-slate-400 mt-1 hidden lg:block">
                    Welcome back! Here&apos;s an overview of your automations and usage.
                </p>
            </div>

            {/* Stat cards — 4 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-5">
                <StatCard
                    label="Time Saved"
                    value={timeSaved}
                    trend="+12%"
                    trendUp={true}
                    icon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                    }
                />
                <StatCard
                    label="ROI Achieved"
                    value={roiAchieved}
                    trend="+8.2%"
                    trendUp={true}
                    icon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" />
                        </svg>
                    }
                />
                <StatCard
                    label="Active Automations"
                    value={activeAutomations}
                    trend="+5%"
                    trendUp={true}
                    icon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                    }
                />
                <StatCard
                    label="Success Rate"
                    value={successRate}
                    trend="-0.2%"
                    trendUp={false}
                    icon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    }
                />
            </div>

            {/* Middle row: System Activity + Performance Chart + Upgrade Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 mb-5">
                <SystemActivity />
                <PerformanceChart totalOps={totalOps} />
                <UpgradeCard />
            </div>

            {/* Recent Activity */}
            <RecentActivity
                runs={runs}
                onLoadMore={loadMore}
                hasMore={!!cursor}
                loading={loadingMore}
            />
        </div>
    );
}
