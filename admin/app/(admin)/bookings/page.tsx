'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '../../lib/api';
import Link from 'next/link';
import { CreateBookingModal } from '../../components/CreateBookingModal';

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
        cowork: { label: 'Co-Work', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, textClass: 'text-purple-500' },
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

    const loadBookings = () => {
        setLoading(true);
        adminFetch<any[]>('/bookings')
            .then(data => setBookings(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadBookings();
    }, []);

    return (
        <div className="pb-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">All Bookings</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Every booking across all customers and service types</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary font-bold text-slate-600">
                        + New Message
                    </button>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary font-bold shadow-sm"
                    >
                        + Create Booking
                    </button>
                </div>
            </div>

            {/* Sub-Tabs Row */}
            <div className="bg-white rounded-t-xl mb-4 flex overflow-x-auto border border-b-0 border-slate-200">
                <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-[#00c2ff] text-[14px] font-bold text-[#00c2ff]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    All Bookings
                    <span className="bg-[#00c2ff] text-white text-[11px] px-2 py-0.5 rounded-full ml-1">{bookings.length}</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent text-[14px] font-semibold text-slate-500 hover:text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    AI Automations
                    <span className="bg-slate-100 text-slate-500 text-[11px] px-2 py-0.5 rounded-full ml-1">3</span>
                </button>

                <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent text-[14px] font-semibold text-slate-500 hover:text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    AI Custom Apps
                    <span className="bg-slate-100 text-slate-500 text-[11px] px-2 py-0.5 rounded-full ml-1">2</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent text-[14px] font-semibold text-slate-500 hover:text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                    Implementation
                    <span className="bg-slate-100 text-slate-500 text-[11px] px-2 py-0.5 rounded-full ml-1">1</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative w-72 text-slate-500">
                    <input type="text" placeholder="Search bookings, customers..." className="pl-4 py-2.5 pr-4 text-[13.5px] w-full outline-none border border-slate-200 rounded-lg focus:border-[#00c2ff] focus:ring-2 focus:ring-[#00c2ff]/10 transition-all font-medium bg-white" />
                </div>
                
                <select className="border border-slate-200 rounded-lg py-2.5 px-4 text-[13.5px] font-medium text-slate-600 hover:border-slate-300 outline-none w-36 bg-white pr-8">
                    <option>All Statuses</option>
                </select>
                
                <select className="border border-slate-200 rounded-lg py-2.5 px-4 text-[13.5px] font-medium text-slate-600 hover:border-slate-300 outline-none w-36 bg-white pr-8">
                    <option>All Types</option>
                </select>
            </div>

            <div className="card overflow-hidden border border-slate-200">
                <div className="p-5 border-b border-slate-100 bg-white">
                    <h2 className="text-[16px] font-bold text-slate-800">All Bookings <span className="text-slate-400 font-medium text-sm ml-1">— {bookings.length} total</span></h2>
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
                            {!loading && bookings.map(b => (
                                <tr key={b.id} className="border-t border-slate-100 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[13px] font-semibold text-slate-600 font-mono">#BOOK-{Math.abs(b.id.hashCode?.() || parseInt(b.id.substring(0,8), 16) % 10000)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                {b.client?.first_name?.[0]}{b.client?.last_name?.[0]}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-semibold text-slate-800">{b.client?.first_name} {b.client?.last_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-[14px] font-medium text-slate-700">{b.title || 'Lead Scoring Automation'}</div>
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
                                            <Link href={`/bookings/${b.id}`} className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                                                {['submitted', 'in_review'].includes(b.status) ? 'Review' : 'Open'}
                                            </Link>
                                            <Link href={`/messages`} className="text-[12px] font-bold border border-slate-200 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} onCreated={loadBookings} />}
        </div>
    );
}
