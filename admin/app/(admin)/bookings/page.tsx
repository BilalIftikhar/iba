'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '../../lib/api';
import Link from 'next/link';
import { CreateBookingModal } from '../../components/CreateBookingModal';
import { ReviewBookingPanel } from '../../components/ReviewBookingPanel';
import { CustomerProfilePanel } from '../../components/CustomerProfilePanel';
import { MessageReplyModal } from '../../components/MessageReplyModal';

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string, classes: string }> = {
        submitted: { label: 'Submitted', classes: 'bg-amber-100 text-amber-800' },
        in_review: { label: 'In Review', classes: 'bg-blue-100 text-blue-800' },
        in_progress: { label: 'In Progress', classes: 'bg-indigo-100 text-indigo-800' },
        deployed: { label: 'Deployed', classes: 'bg-emerald-100 text-emerald-800' },
        booked: { label: 'Submitted', classes: 'bg-amber-100 text-amber-800' }, // Map 'booked' to 'Submitted' for UI
    };
    const mapped = map[status] || { label: status, classes: 'bg-slate-100 text-slate-800' };
    return (
        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide ${mapped.classes}`}>
            {mapped.label}
        </span>
    );
}

function TypeBadge({ type }: { type: string }) {
    const map: Record<string, { label: string, icon: React.ReactNode, textClass: string }> = {
        automation: { label: 'Automation', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, textClass: 'text-blue-500' },
        custom_app: { label: 'Custom App', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>, textClass: 'text-rose-500' },
        // cowork: { label: 'Co-Work', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, textClass: 'text-purple-500' },
        implementation: { label: 'Implementation', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>, textClass: 'text-emerald-500' },
    };
    
    const conf = map[type.toLowerCase()] || { label: type, icon: null, textClass: 'text-slate-500' };
    
    return (
        <div className={`flex items-center gap-1.5 text-xs font-semibold tracking-wide ${conf.textClass}`}>
            {conf.icon} {conf.label}
        </div>
    );
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
    const [manageCustomerId, setManageCustomerId] = useState<string | null>(null);
    const [replyThreadId, setReplyThreadId] = useState<string | null>(null);
    const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');

    const loadBookings = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterStatus) params.append('status', filterStatus);
        if (filterType) params.append('type', filterType);
        if (searchTerm) params.append('search', searchTerm);

        adminFetch<any[]>(`/bookings?${params.toString()}`)
            .then(data => {
                setBookings(data);
                setCurrentPage(1);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleOpenChat = async (bookingId: string) => {
        setChatLoadingId(bookingId);
        try {
            const threadRes = await adminFetch<any>(`/bookings/${bookingId}/thread`);
            const targetId = threadRes?.id || threadRes?.data?.id;
            if (targetId) {
                setReplyThreadId(targetId);
            } else {
                alert("No chat thread found for this booking.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to open chat thread");
        } finally {
            setChatLoadingId(null);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadBookings();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, filterStatus, filterType]);

    // Pagination logic
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
        <div className="pb-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ marginBottom: '15px' }}>
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">All Bookings</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Every booking across all customers and service types</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/messages" className="btn btn-secondary font-bold text-[#00C2FF]">
                        + New Message
                    </Link>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary font-bold shadow-sm"
                    >
                        + Create Booking
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-t-xl flex overflow-x-auto border border-b-0 border-slate-200 fade-in" style={{ marginTop: '15px', marginBottom: '15px' }}>
                <button 
                    onClick={() => setFilterType('')}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 text-[14px] font-bold transition-all whitespace-nowrap ${filterType === '' ? 'border-[#00c2ff] text-[#00c2ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    All Bookings
                    <span className={`${filterType === '' ? 'bg-[#00c2ff] text-white' : 'bg-slate-100 text-slate-500'} text-[11px] px-2 py-0.5 rounded-full ml-1`}>{bookings.length}</span>
                </button>
                <button 
                    onClick={() => setFilterType('automation')}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 text-[14px] font-semibold transition-all whitespace-nowrap ${filterType === 'automation' ? 'border-[#00c2ff] text-[#00c2ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    AI Automations
                </button>
                <button 
                    onClick={() => setFilterType('custom_app')}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 text-[14px] font-semibold transition-all whitespace-nowrap ${filterType === 'custom_app' ? 'border-[#00c2ff] text-[#00c2ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    AI Custom Apps
                </button>
                <button 
                    onClick={() => setFilterType('implementation')}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 text-[14px] font-semibold transition-all whitespace-nowrap ${filterType === 'implementation' ? 'border-[#00c2ff] text-[#00c2ff]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                    Implementation
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full flex-nowrap overflow-x-auto pb-1 clip-scroll" style={{ marginBottom: '15px' }}>
                <div className="relative text-slate-500 shrink-0" style={{ width: '35%', minWidth: '200px' }}>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search bookings, customers..." 
                        className="pl-4 py-2.5 pr-4 text-[13.5px] w-full outline-none border border-slate-200 rounded-lg focus:border-[#00c2ff] focus:ring-2 focus:ring-[#00c2ff]/10 transition-all font-medium bg-white" 
                    />
                </div>
                
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ width: '15%', minWidth: '140px' }}
                    className="shrink-0 border border-slate-200 rounded-lg py-2.5 px-4 text-[13.5px] font-medium text-slate-600 hover:border-slate-300 outline-none bg-white cursor-pointer"
                >
                    <option value="">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="in_review">In Review</option>
                    <option value="in_progress">In Progress</option>
                    <option value="deployed">Deployed</option>
                    <option value="paused">Paused</option>
                </select>
                
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ width: '15%', minWidth: '140px' }}
                    className="shrink-0 border border-slate-200 rounded-lg py-2.5 px-4 text-[13.5px] font-medium text-slate-600 hover:border-slate-300 outline-none bg-white cursor-pointer"
                >
                    <option value="">All Types</option>
                    <option value="automation">AI Automation</option>
                    <option value="custom_app">AI Custom App</option>
                    <option value="implementation">Implementation</option>
                </select>
            </div>

            <div className="card overflow-hidden border border-slate-200">
                <div className="p-5 border-b border-slate-100 bg-white shadow-sm flex items-center justify-between">
                    <h2 className="text-[16px] font-bold text-slate-800">All Bookings <span className="text-slate-400 font-medium text-sm ml-1">— {bookings.length} total</span></h2>
                    
                    {/* Pagination Info */}
                    {totalPages > 1 && (
                        <div className="text-[12px] text-slate-500 font-bold uppercase tracking-wider">
                           Page {currentPage} of {totalPages}
                        </div>
                    )}
                </div>
                <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left bg-white">
                        <thead>
                            <tr>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">ID</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Customer</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Service</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Type</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Status</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Date</th>
                                <th className="pt-4 pb-3 px-6 bg-white border-b-0 text-right text-[10px] font-bold tracking-widest text-slate-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center border-t border-slate-100">
                                        <svg className="animate-spin w-6 h-6 text-[#00C2FF] mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                    </td>
                                </tr>
                            )}
                            {!loading && bookings.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-6 text-center text-sm text-slate-500 font-medium border-t border-slate-100">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                            {!loading && paginatedBookings.map(b => (
                                <tr key={b.id} className="border-t border-slate-100 group hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[13px] font-semibold text-slate-600 font-mono text-xs">{b.id.startsWith('BOOK-') ? `#${b.id}` : `#BOOK-${b.id.substring(b.id.length - 4)}`}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-800">
                                        <div className="flex items-center gap-3 cursor-pointer group/prof" onClick={() => setManageCustomerId(b.client?.id || b.client_id)}>
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm group-hover/prof:scale-110 transition-transform">
                                                {b.client?.first_name?.[0] || '?'}{b.client?.last_name?.[0] || '?'}
                                            </div>
                                            <div>
                                                <div className="text-[13px] font-bold text-slate-800 group-hover/prof:text-[#00c2ff] transition-colors">{b.client?.first_name || 'Unknown'} {b.client?.last_name || 'Client'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-[14px] font-bold text-slate-700">{b.title || 'Lead Scoring Automation'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <TypeBadge type={b.type} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={b.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[13px] font-bold text-slate-800">{b.booked_at ? new Date(b.booked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Draft'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2 text-right">
                                            <button onClick={() => setReviewBookingId(b.id)} className="text-[12px] font-black border border-slate-200 px-4 py-1.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                                                {['submitted', 'in_review'].includes(b.status) ? 'Review' : 'Open'}
                                            </button>
                                            <button 
                                                disabled={chatLoadingId === b.id}
                                                onClick={() => handleOpenChat(b.id)} 
                                                className={`text-[12px] font-black border border-slate-200 p-2 rounded-xl transition-all shadow-sm flex items-center justify-center ${chatLoadingId === b.id ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                {chatLoadingId === b.id ? (
                                                    <svg className="animate-spin w-[15px] h-[15px] text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                                                ) : (
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[13px] font-bold text-slate-400">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, bookings.length)} of {bookings.length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[13px] font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all active:scale-95 shadow-sm"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-9 h-9 rounded-xl border text-[13px] font-black transition-all active:scale-95 shadow-sm ${currentPage === i + 1 ? 'bg-[#00c2ff] border-[#00c2ff] text-white shadow-[#00c2ff]/20' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[13px] font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all active:scale-95 shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Modals outside transform bounds so fixed inset-0 attaches to viewport */}
        {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} onCreated={loadBookings} />}
        {reviewBookingId && <ReviewBookingPanel bookingId={reviewBookingId} onClose={() => setReviewBookingId(null)} onUpdated={loadBookings} />}
        {manageCustomerId && <CustomerProfilePanel customerId={manageCustomerId} onClose={() => setManageCustomerId(null)} onUpdated={loadBookings} />}
        {replyThreadId && <MessageReplyModal threadId={replyThreadId} onClose={() => setReplyThreadId(null)} />}
        </>
    );
}
