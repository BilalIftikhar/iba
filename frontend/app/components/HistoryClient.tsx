'use client';

import React, { useState } from 'react';
import { PipelineOverviewModal } from './PipelineOverviewModal';

// ─── Types ────────────────────────────────────────────────────────
export interface RunRow {
    id: string;
    automation: string;
    department: string;
    lastRun: string;
    status: 'Running' | 'Completed' | 'Failed' | 'Waiting';
    icon?: React.ReactNode;
}

// ─── Alert Severity ───────────────────────────────────────────────
type AlertSeverity = 'error' | 'warning' | 'success';
interface Alert { title: string; subtitle: string; severity: AlertSeverity; time?: string; }

const alertIcon: Record<AlertSeverity, JSX.Element> = {
    error: (
        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    warning: (
        <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    success: (
        <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
};
const alertRowStyle: Record<AlertSeverity, string> = {
    error: 'bg-red-50 border border-red-100',
    warning: 'bg-amber-50 border border-amber-100',
    success: 'bg-emerald-50 border border-emerald-100',
};
const alertTitleColor: Record<AlertSeverity, string> = {
    error: 'text-red-600', warning: 'text-amber-600', success: 'text-emerald-600',
};

function AlertCard({ alert }: { alert: Alert }) {
    return (
        <div className={`flex items-start gap-3 rounded-xl p-3 ${alertRowStyle[alert.severity]}`}>
            <div className="flex-shrink-0 mt-0.5">{alertIcon[alert.severity]}</div>
            <div className="min-w-0 flex-1">
                <p className={`text-[13px] font-bold leading-tight ${alertTitleColor[alert.severity]}`}>{alert.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{alert.subtitle}</p>
            </div>
            {alert.time && <span className="text-[10px] text-slate-400 font-medium flex-shrink-0 mt-0.5">{alert.time}</span>}
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────
type RunStatus = 'Running' | 'Completed' | 'Failed' | 'Waiting';

const statusBadge: Record<RunStatus, string> = {
    Running: 'bg-[#ebfcfa] text-[#00c2ff] border-[#00c2ff]/30',
    Completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Failed: 'bg-red-50 text-red-600 border-red-200',
    Waiting: 'bg-amber-50 text-amber-600 border-amber-200',
};
const statusDot: Record<RunStatus, string> = {
    Running: 'bg-[#00c2ff]', Completed: 'bg-emerald-500', Failed: 'bg-red-500', Waiting: 'bg-amber-400',
};

function StatusPill({ status }: { status: RunStatus }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${statusBadge[status]}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${statusDot[status]} ${status === 'Running' ? 'animate-pulse' : ''}`} />
            {status}
        </span>
    );
}

// ─── Throughput Chart ─────────────────────────────────────────────
function ThroughputChart() {
    const bars = [55, 70, 45, 80, 60, 90, 75, 50, 85, 65, 40, 95, 70, 55];
    const labels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mt-4">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">Throughput Overview</h2>
                <span className="text-[11px] text-slate-400 font-medium">Daily Volume · Last 7 Days</span>
            </div>
            {/* Bar Chart */}
            <div className="flex items-end gap-1.5 h-24">
                {bars.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                            className="w-full rounded-t-md transition-all duration-300 hover:opacity-80 cursor-default"
                            style={{
                                height: `${(h / 100) * 100}%`,
                                background: 'linear-gradient(180deg, #00c2ff22 0%, #00c2ff66 100%)',
                                border: '1px solid #00c2ff33',
                            }}
                            title={`${h} runs`}
                        />
                    </div>
                ))}
            </div>
            {/* X axis labels */}
            <div className="flex justify-between mt-3">
                {labels.map((l, i) => (
                    <span key={i} className="text-[10px] font-semibold text-slate-400">{l}</span>
                ))}
            </div>
        </div>
    );
}

// ─── Mobile Log Card ──────────────────────────────────────────────
function MobileLogCard({ row, onViewDetails }: { row: RunRow; onViewDetails: () => void }) {
    return (
        <div 
            onClick={onViewDetails}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
        >
            <div className="w-10 h-10 rounded-xl bg-[#ebfcfa] flex items-center justify-center text-[#00c2ff] flex-shrink-0">
                {row.icon ?? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
                    </svg>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-800 truncate">{row.automation}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{row.department} · {row.lastRun}</p>
            </div>
            <div className="flex-shrink-0">
                <StatusPill status={row.status} />
            </div>
        </div>
    );
}

// ─── Execution Log Table (Desktop) ────────────────────────────────
const ROWS_PER_PAGE = 10;
interface LogTableProps { rows: RunRow[]; onViewDetails: () => void; }

function ExecutionLog({ rows, onViewDetails }: LogTableProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    const statuses = ['All', 'Running', 'Completed', 'Failed', 'Waiting'];

    const filtered = rows.filter(r => {
        const matchSearch = r.automation.toLowerCase().includes(search.toLowerCase()) ||
            r.department.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || r.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

    const pageNumbers = () => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push('...');
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
            if (page < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-4">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-1">
                    <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">Detailed Execution Log</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Showing {filtered.length.toLocaleString()} results</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                    {/* Search */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-400 flex-1 sm:w-40 sm:flex-none">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            className="bg-transparent outline-none text-slate-700 placeholder-slate-400 w-full text-[13px]"
                            placeholder="Search..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    {/* Filter pills — hidden on smallest mobile, shown sm+ */}
                    <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                        {statuses.map(s => (
                            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${statusFilter === s ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                    {/* Mobile filter: hidden on mobile */}
                    <select
                        className="hidden sm:block px-3 py-2 bg-slate-100 border-0 rounded-xl text-[12px] font-semibold text-slate-700 outline-none"
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {/* Export */}
                    <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 text-white rounded-xl text-[12px] font-semibold hover:bg-slate-700 transition-colors">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export
                    </button>
                </div>
            </div>

            {/* Mobile: card list */}
            <div className="md:hidden p-4 space-y-3">
                {paged.length === 0 ? (
                    <p className="text-center text-slate-400 text-[14px] py-8">No results found</p>
                ) : paged.map(row => <MobileLogCard key={row.id} row={row} onViewDetails={onViewDetails} />)}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100">
                            {['Automation', 'Department', 'Last Run', 'Status', 'Action'].map((col, i) => (
                                <th key={col} className={`px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-400 ${i === 4 ? 'text-right' : ''}`}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paged.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-[14px] font-medium">No results found</td>
                            </tr>
                        ) : paged.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/60 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#ebfcfa] flex items-center justify-center text-[#00c2ff] flex-shrink-0">
                                            {row.icon ?? (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-700">{row.automation}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[13px] text-slate-500 font-medium">{row.department}</td>
                                <td className="px-6 py-4 text-[13px] text-slate-400">{row.lastRun}</td>
                                <td className="px-6 py-4"><StatusPill status={row.status} /></td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={onViewDetails}
                                        className="text-[13px] font-semibold text-[#00c2ff] hover:text-blue-600 transition-colors"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <p className="text-[12px] text-slate-400 font-medium hidden sm:block">
                    Showing {Math.min((page - 1) * ROWS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length.toLocaleString()} results
                </p>
                <div className="flex items-center gap-1 ml-auto">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    {pageNumbers().map((p, i) => (
                        p === '...'
                            ? <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-[12px]">…</span>
                            : <button
                                key={p}
                                onClick={() => setPage(p as number)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-bold transition-all ${page === p
                                    ? 'bg-[#00c2ff] text-white shadow-[0_2px_8px_rgba(0,194,255,0.35)]'
                                    : 'border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                    }`}
                            >
                                {p}
                            </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Export ──────────────────────────────────────────────────
interface HistoryClientProps {
    totalRuns?: number;
    successRate?: number;
    dataProcessed?: string;
    errorsResolved?: number;
    runs?: RunRow[];
}

const DEMO_ROWS: RunRow[] = [
    {
        id: '1', automation: 'Invoice Processing v2', department: 'Finance & Operations',
        lastRun: '2 mins ago', status: 'Running',
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    },
    {
        id: '2', automation: 'Customer Outreach Sync', department: 'Marketing',
        lastRun: '45 mins ago', status: 'Completed',
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
    {
        id: '3', automation: 'Inventory Rebalance', department: 'Logistics',
        lastRun: '1h 12m ago', status: 'Failed',
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    },
    {
        id: '4', automation: 'Employee Onboarding', department: 'Human Resources',
        lastRun: '3h 04m ago', status: 'Completed',
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
    {
        id: '5', automation: 'Security Log Scraper', department: 'IT & Security',
        lastRun: '6h 15m ago', status: 'Completed',
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    },
    {
        id: '6', automation: 'Payroll Batch #42', department: 'Finance & Operations',
        lastRun: '8h 00m ago', status: 'Completed',
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    },
    {
        id: '7', automation: 'CRM Data Normalization', department: 'Sales',
        lastRun: '10h 30m ago', status: 'Waiting',
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
    },
    {
        id: '8', automation: 'Lead Scoring Engine', department: 'Marketing',
        lastRun: '12h 02m ago', status: 'Running',
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    },
];

const RECENT_ALERTS: Alert[] = [
    { title: 'High Latency Detected', subtitle: 'API response time exceeded 2.5s in EU-West 1', severity: 'warning', time: '2 MIN AGO' },
    { title: 'Database Connection Timeout', subtitle: 'Auth-Service unable to reach main-db instance', severity: 'error', time: '15 MIN AGO' },
];

import { HeaderBar } from './HeaderBar';

export function HistoryClient({ totalRuns, successRate, dataProcessed, errorsResolved, runs }: HistoryClientProps) {
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const displayRuns = runs && runs.length > 0 ? runs : DEMO_ROWS;
    const displayTotal = totalRuns ?? 1284;
    const displaySuccessRate = successRate ?? 98.2;
    const displayData = dataProcessed ?? '4.2 TB';
    const displayErrors = errorsResolved ?? 12;

    return (
        <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-[1264px]">

            {/* ── Top Bar — hidden on mobile (inside sidebar on mobile) ── */}
            <HeaderBar title="History" />

            {/* ── Page heading ── */}
            <div className="mb-6 text-center">
                <h1 className="text-[24px] lg:text-[28px] font-black text-slate-800 tracking-tight">Execution History</h1>
                <p className="text-[12px] lg:text-[13px] text-slate-400 mt-1.5">
                    Real-time monitoring and lifecycle management of automation workflows.
                </p>
            </div>

            {/* ════════════════════════════════════════════
                MOBILE LAYOUT  (< lg)
                ════════════════════════════════════════════ */}
            <div className="lg:hidden space-y-4">

                {/* Stat cards: 2×2 grid — icon at top, no opacity, 1rem */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Total Runs */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                        <svg style={{ width: '1rem', height: '1rem' }} className="text-[#00c2ff] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="2" width="18" height="20" rx="3" />
                            <line x1="7" y1="9" x2="17" y2="9" /><line x1="7" y1="13" x2="14" y2="13" /><line x1="7" y1="17" x2="16" y2="17" />
                        </svg>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Runs</p>
                        <p className="text-[26px] font-black text-slate-800 tracking-tight leading-none">{displayTotal.toLocaleString()}</p>
                        <span className="text-[11px] font-bold text-emerald-500 mt-1 block">↑5.2%</span>
                    </div>

                    {/* Success Rate */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                        <svg style={{ width: '1rem', height: '1rem' }} className="text-[#00c2ff] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Success Rate</p>
                        <p className="text-[26px] font-black text-slate-800 tracking-tight leading-none">{displaySuccessRate}%</p>
                        <span className="text-[11px] font-bold text-emerald-500 mt-1 block">↑0.1%</span>
                    </div>

                    {/* Data Processed */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                        <svg style={{ width: '1rem', height: '1rem' }} className="text-[#00c2ff] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <ellipse cx="12" cy="5" rx="9" ry="3" />
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Data Processed</p>
                        <p className="text-[26px] font-black text-slate-800 tracking-tight leading-none">{displayData}</p>
                        <span className="text-[11px] font-bold text-emerald-500 mt-1 block">↑12%</span>
                    </div>

                    {/* Errors */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                        <svg style={{ width: '1rem', height: '1rem' }} className="text-red-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="7" x2="12" y2="13" strokeLinecap="round" />
                            <circle cx="12" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
                        </svg>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Errors</p>
                        <p className="text-[26px] font-black text-slate-800 tracking-tight leading-none">{displayErrors}</p>
                        <span className="text-[11px] font-bold text-red-500 mt-1 block">↓2%</span>
                    </div>
                </div>

                {/* Throughput Chart */}
                <ThroughputChart />

                {/* Execution Log — mobile cards */}
                <ExecutionLog rows={displayRuns} onViewDetails={() => setIsDetailModalOpen(true)} />

                {/* Recent Alerts */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                    <h2 className="text-[14px] font-bold text-slate-800 mb-3">Recent Alerts</h2>
                    <div className="space-y-2.5">
                        {RECENT_ALERTS.map((a, i) => <AlertCard key={i} alert={a} />)}
                    </div>
                </div>

            </div>

            {/* ════════════════════════════════════════════
                DESKTOP LAYOUT  (lg+)
                ════════════════════════════════════════════ */}
            <div className="hidden lg:block">

                {/* Stat section: Left tall card + Right 3-card column */}
                <div className="grid grid-cols-2 gap-5 mb-6 items-stretch">

                    {/* LEFT: Operational Health + Recent Alerts */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden flex flex-col h-full">
                        {/* Ghost icon */}
                        <div className="absolute top-8 right-4 opacity-20 pointer-events-none">
                            <svg style={{ width: '2rem', height: '2rem' }} className="text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="7" x2="12" y2="13" strokeLinecap="round" />
                                <circle cx="12" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
                            </svg>
                        </div>
                        <div className="mb-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Operational Health</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[38px] font-black text-slate-800 leading-none">{displayErrors}</span>
                                <span className="text-[15px] font-semibold text-slate-500">Errors Resolved</span>
                                <span className="text-[13px] font-bold text-emerald-500 ml-1">↑5%</span>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 mb-5" />
                        <div className="flex-1">
                            <h2 className="text-[15px] font-bold text-slate-800 mb-4">Recent Alerts</h2>
                            <div className="space-y-2.5">
                                {[
                                    { title: 'Database Connection Timeout', subtitle: 'Inventory Sync failed 3 times. Check DB pool settings.', severity: 'error' as AlertSeverity },
                                    { title: 'High Latency Detected', subtitle: 'Marketing Hub response exceeded 2s threshold.', severity: 'warning' as AlertSeverity },
                                    { title: 'Security Audit Passed', subtitle: 'Weekly compliance check completed successfully.', severity: 'success' as AlertSeverity },
                                ].map((a, i) => <AlertCard key={i} alert={a} />)}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: 3 stat cards */}
                    <div className="flex flex-col gap-5 h-full">
                        <div className="grid grid-cols-2 gap-5">
                            {/* Total Runs */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                                    <svg style={{ width: '2rem', height: '2rem' }} className="text-[#00c2ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="2" width="18" height="20" rx="3" />
                                        <line x1="7" y1="9" x2="17" y2="9" /><line x1="7" y1="13" x2="14" y2="13" /><line x1="7" y1="17" x2="16" y2="17" />
                                    </svg>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Total Runs</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[34px] font-black text-slate-800 tracking-tight leading-none">{displayTotal.toLocaleString()}</span>
                                    <span className="text-[12px] font-bold text-red-500">↓12%</span>
                                </div>
                            </div>
                            {/* Success Rate */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                                    <svg style={{ width: '2rem', height: '2rem' }} className="text-[#00c2ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Success Rate</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[34px] font-black text-slate-800 tracking-tight leading-none">{displaySuccessRate}%</span>
                                    <span className="text-[12px] font-bold text-emerald-500">↑0.4%</span>
                                </div>
                            </div>
                        </div>
                        {/* Data Processed */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden flex-1 flex items-center">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                                <svg style={{ width: '2rem', height: '2rem' }} className="text-[#00c2ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Data Processed</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[34px] font-black text-slate-800 tracking-tight leading-none">{displayData}</span>
                                    <span className="text-[12px] font-bold text-red-500">↓2%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Execution Log Table */}
                <ExecutionLog rows={displayRuns} onViewDetails={() => setIsDetailModalOpen(true)} />

                {/* Throughput Chart */}
                <ThroughputChart />

            </div>
            <PipelineOverviewModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
            />
        </div>
    );
}
