'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchBookings } from '../lib/api';

// ─── Icons ───────────────────────────────────────────────────────

const IconShare = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);
const IconStack = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
);
const IconChartSquare = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <path d="M7 17V13"/><path d="M12 17V7"/><path d="M17 17v-5"/>
    </svg>
);
const IconCheckSquare = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <polyline points="9 11 12 14 22 4"/>
    </svg>
);
const IconDotsSquare = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="16" cy="12" r="1"/>
    </svg>
);
const IconReviewSquare = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <path d="M15 3v6h6"/><path d="M10 14h4"/><path d="M12 12v4"/>
        <polyline points="16 21 19 18 22 21"/>
    </svg>
);
const IconDraftSquare = ({ cls = '' }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h4"/>
    </svg>
);

import { HeaderBar } from './HeaderBar';

import { StopAutomationModal } from './StopAutomationModal';
import { PipelineOverviewModal } from './PipelineOverviewModal';
import { MessengerPopup } from './MessengerPopup';



// ─── Stat Card ────────────────────────────────────────────────────
function StatCard({ label, value, trend, trendUp, icon, iconColor, bgHighlight }: {
    label: string; value: string | number; trend?: string; trendUp?: boolean;
    icon: React.ReactNode; iconColor: string; bgHighlight: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 flex-1 min-w-[140px] hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-1">
                <div className={`w-8 h-8 rounded border border-slate-100 flex items-center justify-center ${bgHighlight} ${iconColor}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-[10px] font-bold ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-[9px] text-slate-400 font-black mb-1.5 uppercase tracking-widest">{label}</p>
                <p className="text-[24px] font-bold text-slate-800 tracking-tight leading-none">{value}</p>
            </div>
        </div>
    );
}

// ─── Pipeline Fleet Manager ───────────────────────────────────────
type TabKey = 'deployed' | 'review' | 'drafts';
interface PipelineRow {
    id: string;
    name: string;
    node: string;
    version: string;
    status: string;
    efficiency: number;
    barColor: string;
    icon: React.ReactNode;
    iconBg: string;
    statusColor: string;
    rawStatus: string;
}

function PipelineFleetManager({ rows, isMobile, onStopRequest, onShowSummary }: { rows: PipelineRow[], isMobile?: boolean; onStopRequest?: () => void; onShowSummary?: () => void }) {
    const [tab, setTab] = useState<TabKey>('deployed');
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [openMessengerIndex, setOpenMessengerIndex] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const tabs: { key: TabKey; label: string }[] = [
        { key: 'deployed', label: 'Deployed' },
        { key: 'review', label: 'Review' },
        { key: 'drafts', label: 'Drafts' },
    ];

    const filteredRows = rows.filter(r => {
        if (tab === 'deployed') return r.rawStatus === 'deployed';
        if (tab === 'review') return r.rawStatus === 'in_review' || r.rawStatus === 'in_progress' || r.rawStatus === 'booked';
        if (tab === 'drafts') return r.rawStatus === 'draft';
        return true;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [tab]);

    // Pagination logic
    const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRows = filteredRows.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm mt-8 overflow-hidden">
            <div className={`px-6 py-4 flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'}`}>
                <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">Pipeline Fleet Manager</h2>
                <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-100 rounded-[10px]">
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`px-4 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all duration-150 ${tab === t.key ? 'bg-white text-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                    <thead>
                        <tr className="border-b border-slate-100 bg-transparent">
                            <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-widest text-[#94A3B8]">System Entity</th>
                            <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-widest text-[#94A3B8]">Status Profile</th>
                            <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-widest text-[#94A3B8]">Operational Efficiency</th>
                            <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-widest text-[#94A3B8] text-right">Node Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedRows.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                                        </div>
                                        <p className="text-[15px] font-bold text-slate-700">No bookings found</p>
                                        <p className="text-[13px] text-slate-500">There are no bookings matching the selected tab.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedRows.map((row, i) => (
                                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${row.iconBg}`}>
                                                {row.icon}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-700">{row.name.substring(0, 32)}{row.name.length > 32 ? '...' : ''}</p>
                                                <p className="text-[11px] text-[#94A3B8] mt-0.5">ID: {row.id} • {row.version}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] text-[11px] font-bold ${row.statusColor}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 max-w-[200px]">
                                            <div className="flex-1 bg-slate-100 h-1 rounded-full overflow-hidden">
                                                <div className="h-1 rounded-full" style={{ width: `${row.efficiency}%`, backgroundColor: row.barColor }} />
                                            </div>
                                            <span className="text-[12px] font-bold text-slate-700 w-8">{row.efficiency}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-right">
                                            {tab !== 'drafts' && (
                                                <div className="relative z-20">
                                                    <button 
                                                        onClick={() => setOpenMessengerIndex(openMessengerIndex === i ? null : i)}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-bold transition-colors ${openMessengerIndex === i ? 'bg-[#E0FCF9] text-[#00c2ff]' : 'bg-[#F8FAFC] text-slate-600 hover:bg-slate-100/80'}`}
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                                        Message
                                                    </button>
                                                    <MessengerPopup 
                                                        isOpen={openMessengerIndex === i} 
                                                        onClose={() => setOpenMessengerIndex(null)} 
                                                        relatedEntityId={row.id}
                                                        category="booking"
                                                    />
                                                </div>
                                            )}
                                            {tab === 'deployed' && (
                                                <>
                                                    <button 
                                                        onClick={onStopRequest}
                                                        className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-[#F8FAFC] text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                                                    </button>
                                                    <div className="relative">
                                                        <button 
                                                            onClick={() => setOpenMenuIndex(openMenuIndex === i ? null : i)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-[#F8FAFC] text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                                        </button>
                                                        
                                                        {openMenuIndex === i && (
                                                            <>
                                                                <div className="fixed inset-0 z-10" onClick={() => setOpenMenuIndex(null)} />
                                                                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden text-left">
                                                                    <button 
                                                                        onClick={() => {
                                                                            onShowSummary?.();
                                                                            setOpenMenuIndex(null);
                                                                        }}
                                                                        className="w-full px-4 py-2.5 text-left text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                                                    >
                                                                        Show Summary
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-slate-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[12px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all active:scale-95"
                        >
                            Prev
                        </button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[12px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all active:scale-95"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Export ──────────────────────────────────────────────────
export function BookingsClient() {
    const [isStopModalOpen, setIsStopModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        fetchBookings().then((res: any) => {
            if (Array.isArray(res)) {
                setBookings(res);
            } else if (res && res.data) {
                setBookings(res.data);
            }
        }).catch(console.error);
    }, []);

    const handleConfirmStop = () => {
        setIsStopModalOpen(false);
        // Add actual stop logic here if needed
    };

    const formatToRow = (b: any): PipelineRow => {
        let statusColor = 'text-slate-500 bg-slate-50';
        let barColor = '#cbd5e1';
        let eff = 0;
        
        const rawStatus = b.status || 'draft';
        const type = b.type || 'automation';

        if (rawStatus === 'deployed') {
            statusColor = 'text-blue-500 bg-blue-50';
            barColor = '#3b82f6';
            eff = Math.floor(Math.random() * 20) + 80;
        } else if (rawStatus === 'in_progress') {
            statusColor = 'text-amber-500 bg-amber-50';
            barColor = '#f59e0b';
            eff = Math.floor(Math.random() * 30) + 40;
        } else if (rawStatus === 'booked' || rawStatus === 'in_review') {
            statusColor = 'text-purple-500 bg-purple-50';
            barColor = '#a855f7';
            eff = 10;
        } else if (rawStatus === 'draft') {
            statusColor = 'text-emerald-500 bg-emerald-50';
            barColor = '#10b981';
            eff = 0;
        }

        let icon = <IconStack cls="w-5 h-5" />;
        let iconBg = 'bg-[#ebf4ff] text-blue-500';
        if (type === 'automation') {
            icon = <IconShare cls="w-5 h-5" />;
            iconBg = 'bg-[#e0fcf9] text-[#00c2ff]';
        }
        
        let name = b.title || b.use_case;
        if (!name || name === 'null') {
            name = 'Untitled Booking';
        }

        return {
            id: b.id || 'N/A',
            name: name,
            node: type === 'automation' ? 'US-EAST-1' : 'EU-CENTRAL-1',
            version: type.replace('_', ' ').toUpperCase(),
            status: rawStatus.replace('_', ' ').toUpperCase(),
            efficiency: eff,
            barColor,
            icon,
            iconBg,
            statusColor,
            rawStatus: rawStatus
        };
    };

    const rows = bookings.map(formatToRow);
    const totalBookings = bookings.length;
    const countDeployed = bookings.filter(b => b.status === 'deployed').length;
    const countInProgress = bookings.filter(b => b.status === 'in_progress').length;
    const countInReview = bookings.filter(b => b.status === 'in_review' || b.status === 'booked').length;
    const countDrafts = bookings.filter(b => b.status === 'draft').length;

    return (
        <div className="min-h-full bg-slate-100/50 flex flex-col items-center">
            {/* ── DESKTOP LAYOUT ── */}
            <div className="hidden lg:block w-full px-8 py-8">
                <HeaderBar title="Bookings" />

                <div className="bg-[#EEF2F6] rounded-[24px] p-8 border border-slate-200/50 shadow-inner min-h-[calc(100vh-140px)]">
                    {/* Header Area */}
                    <div className="relative mb-6">
                        <div className="text-center">
                            <h1 className="text-[24px] font-bold text-slate-800 tracking-tight">Your Bookings</h1>
                            <p className="text-[13px] text-[#64748B] mt-1.5">Real-time monitoring and management of automated pipelines.</p>
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <Link 
                                href="/automations"
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#00c2ff] text-white rounded-full text-[13px] font-bold shadow-[0_4px_16px_rgba(0,194,255,0.3)] hover:bg-[#00b0e8] transition-colors"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                New Booking
                            </Link>
                        </div>
                    </div>

                    {/* Stat Cards Row */}
                    <div className="flex flex-nowrap gap-4 w-full justify-between pb-2">
                        <StatCard label="Total Bookings" value={totalBookings}
                            iconColor="text-[#00c2ff]" icon={<IconChartSquare cls="w-4 h-4" />} bgHighlight="bg-[#ebfcfa]" />
                        <StatCard label="Deployed" value={countDeployed}
                            iconColor="text-blue-500" icon={<IconCheckSquare cls="w-4 h-4" />} bgHighlight="bg-[#eff6ff]" />
                        <StatCard label="In Progress" value={countInProgress}
                            iconColor="text-amber-500" icon={<IconDotsSquare cls="w-4 h-4" />} bgHighlight="bg-[#fffbeb]" />
                        <StatCard label="In Review" value={countInReview}
                            iconColor="text-purple-500" icon={<IconReviewSquare cls="w-4 h-4" />} bgHighlight="bg-[#faf5ff]" />
                        <StatCard label="Drafts" value={countDrafts}
                            iconColor="text-emerald-500" icon={<IconDraftSquare cls="w-4 h-4" />} bgHighlight="bg-[#ecfdf5]" />
                    </div>

                    {/* Pipeline Fleet Manager */}
                    <PipelineFleetManager 
                        rows={rows}
                        onStopRequest={() => setIsStopModalOpen(true)} 
                        onShowSummary={() => setIsSummaryModalOpen(true)} 
                    />
                </div>
            </div>

            {/* ── MOBILE LAYOUT ── */}
            <div className="lg:hidden w-full h-full pb-10">

                <div className="px-4">
                    <div className="bg-[#EEF2F6] rounded-2xl p-5 border border-slate-200/50 shadow-inner">
                        {/* Page header */}
                        <div className="text-center mb-6">
                            <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">Your Bookings</h1>
                            <p className="text-[12px] text-[#64748B] mt-1 mb-4">Real-time monitoring and management.</p>
                            <Link 
                                href="/automations"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00c2ff] text-white rounded-full text-[13px] font-bold shadow-md w-full justify-center"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                New Booking
                            </Link>
                        </div>

                        {/* Flex card horizontal scroll */}
                        <div className="flex flex-col gap-3">
                            <StatCard label="Total Bookings" value={totalBookings} iconColor="text-[#00c2ff]" icon={<IconChartSquare cls="w-4 h-4" />} bgHighlight="bg-[#ebfcfa]" />
                            <div className="grid grid-cols-2 gap-3">
                                <StatCard label="Deployed" value={countDeployed} iconColor="text-blue-500" icon={<IconCheckSquare cls="w-4 h-4" />} bgHighlight="bg-[#eff6ff]" />
                                <StatCard label="In Progress" value={countInProgress} iconColor="text-amber-500" icon={<IconDotsSquare cls="w-4 h-4" />} bgHighlight="bg-[#fffbeb]" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <StatCard label="In Review" value={countInReview} iconColor="text-purple-500" icon={<IconReviewSquare cls="w-4 h-4" />} bgHighlight="bg-[#faf5ff]" />
                                <StatCard label="Drafts" value={countDrafts} iconColor="text-emerald-500" icon={<IconDraftSquare cls="w-4 h-4" />} bgHighlight="bg-[#ecfdf5]" />
                            </div>
                        </div>

                        {/* Pipeline Fleet Manager */}
                        <PipelineFleetManager 
                            rows={rows}
                            isMobile 
                            onStopRequest={() => setIsStopModalOpen(true)} 
                            onShowSummary={() => setIsSummaryModalOpen(true)}
                        />
                    </div>
                </div>
            </div>

            <StopAutomationModal 
                isOpen={isStopModalOpen} 
                onClose={() => setIsStopModalOpen(false)}
                onConfirm={handleConfirmStop}
            />
            <PipelineOverviewModal 
                isOpen={isSummaryModalOpen} 
                onClose={() => setIsSummaryModalOpen(false)} 
            />
        </div>
    );
}
