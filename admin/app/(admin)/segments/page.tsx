'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreateBookingModal } from '../../components/CreateBookingModal';
import { CustomerSegmentModal, CustomerSegmentViewPanel } from '../../components/Modals';
import { adminFetch } from '../../lib/api';

export default function SegmentsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    const [segments, setSegments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [showSegmentModal, setShowSegmentModal] = useState(false);
    const [editingSegment, setEditingSegment] = useState<any>(null);
    const [viewingSegment, setViewingSegment] = useState<any>(null);

    const fetchSegments = async () => {
        setLoading(true);
        try {
            const data = await adminFetch<any[]>('/segments');
            setSegments(data || []);
        } catch (err) {
            console.error('Failed to fetch segments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSegments();
    }, []);

    const handleSaveSegment = async (payload: any) => {
        try {
            if (editingSegment) {
                await adminFetch(`/segments/${editingSegment.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
            } else {
                await adminFetch('/segments', { method: 'POST', body: JSON.stringify(payload) });
            }
            setShowSegmentModal(false);
            setEditingSegment(null);
            fetchSegments();
        } catch (err) {
            console.error('Failed to save segment:', err);
        }
    };

    const handleDeleteSegment = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this segment?')) return;
        try {
            await adminFetch(`/segments/${id}`, { method: 'DELETE' });
            fetchSegments();
        } catch (err) {
            console.error('Failed to delete segment:', err);
        }
    };

    return (
        <>
            <div className="pb-6 fade-in">
                {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4" style={{ marginTop: '15px', marginBottom: '30px' }}>
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Customer Segments</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Group customers by behaviour, plan, or custom criteria</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/messages" className="btn btn-secondary font-bold text-[#00C2FF] bg-white">
                        + New Message
                    </Link>
                    <button onClick={() => setShowCreateModal(true)} className="btn btn-primary font-bold shadow-sm">
                        + Create Booking
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginBottom: '30px' }}>
                <div className="card p-5 border border-slate-200">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Segments</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">{loading ? '_' : segments.length}</div>
                </div>
                <div className="card p-5 border border-slate-200">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Largest Segment</h3>
                    <div className="text-2xl font-black text-slate-800 tracking-tight mb-1 truncate">
                        {segments.length > 0 ? [...segments].sort((a,b) => b.manual_members.length - a.manual_members.length)[0].name : 'N/A'}
                    </div>
                    <div className="text-xs font-semibold text-emerald-500">
                        {segments.length > 0 ? [...segments].sort((a,b) => b.manual_members.length - a.manual_members.length)[0].manual_members.length : 0} customers
                    </div>
                </div>
                <div className="card p-5 border border-slate-200">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Customers Tagged</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                        {new Set(segments.flatMap(s => s.manual_members.map((m: any) => m.id))).size}
                    </div>
                    <div className="text-xs font-semibold text-emerald-500">100% coverage</div>
                </div>
                <div className="card p-5 border border-slate-200">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Coupons Tied</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">2</div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold text-slate-800">All Segments</h2>
                <button 
                    onClick={() => { setEditingSegment(null); setShowSegmentModal(true); }}
                    className="btn btn-primary btn-sm font-bold shadow-sm"
                >
                    + New Segment
                </button>
            </div>

            <div className="card overflow-hidden border border-slate-200 shadow-sm" style={{ marginBottom: '15px' }}>
                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500 font-medium text-sm flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading dynamic segments...
                        </div>
                    ) : segments.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center bg-slate-50/50">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 shadow-sm ring-4 ring-white">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                            </div>
                            <h3 className="text-[16px] font-bold text-slate-800 mb-1">No Segments Created</h3>
                            <p className="text-[14px] font-medium text-slate-500 mb-6 max-w-sm">Build powerful auto-assigned groups based on activity, plan, or custom filters to manage your base.</p>
                            <button onClick={() => { setEditingSegment(null); setShowSegmentModal(true); }} className="btn btn-primary font-bold shadow-sm">
                                Create your first segment
                            </button>
                        </div>
                    ) : (
                        segments.map(segment => (
                            <div key={segment.id} className="flex flex-col animate-in fade-in duration-300">
                                <div 
                                    className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 transition-colors group cursor-pointer ${viewingSegment?.id === segment.id ? 'bg-slate-50/50' : 'bg-white hover:bg-slate-50'}`} 
                                    onClick={() => setViewingSegment(viewingSegment?.id === segment.id ? null : segment)}
                                >
                                    <div className="flex items-start gap-4 w-full md:w-1/2">
                                        <span className="w-4 h-4 rounded-full mt-1 shrink-0 shadow-sm ring-4 ring-white" style={{ backgroundColor: segment.color || '#3b82f6' }}></span>
                                        <div>
                                            <h3 className="text-[15px] font-bold text-slate-800">{segment.name}</h3>
                                            <p className="text-[13px] font-medium text-slate-500 mt-0.5">{segment.description || 'Custom defined segment filter'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center min-w-[80px]">
                                        <span className="text-[16px] font-bold text-slate-800">{segment.manual_members.length}</span>
                                        <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">customers</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center min-w-[80px]">
                                        <span className="text-[12px] font-bold text-emerald-600">0 coupons</span>
                                        <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">assigned</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setViewingSegment(viewingSegment?.id === segment.id ? null : segment); }}
                                            className={`text-[12px] font-bold border px-4 py-1.5 rounded-lg transition-all shadow-sm ${viewingSegment?.id === segment.id ? 'bg-slate-200 border-slate-300 text-slate-700' : 'border-slate-200 text-slate-600 hover:bg-white bg-slate-50'}`}
                                        >
                                            {viewingSegment?.id === segment.id ? 'Close' : 'View'}
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setEditingSegment(segment); setShowSegmentModal(true); }}
                                            className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Expanded Customer View — Separate Card Below */}
            {viewingSegment && (
                <div className="card border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-top-2 duration-300" style={{ marginTop: '16px', marginBottom: '15px' }}>
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: viewingSegment.color || '#3b82f6' }}></span>
                            <div>
                                <h4 className="text-[15px] font-bold text-slate-800">
                                    {viewingSegment.name} <span className="text-slate-400 font-normal">— Customers</span>
                                </h4>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{viewingSegment.manual_members.length} customers</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setViewingSegment(null)}
                            className="px-4 py-1.5 border border-slate-200 text-slate-500 font-bold rounded-lg text-[12px] hover:bg-white hover:text-slate-700 transition-colors shadow-sm bg-white"
                        >
                            Close
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="py-3 px-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">Customer</th>
                                    <th className="py-3 px-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">Plan</th>
                                    <th className="py-3 px-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">All Segments</th>
                                    <th className="py-3 px-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {viewingSegment.manual_members.map((c: any, idx: number) => (
                                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-[10px] font-black shrink-0 ${['bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-emerald-500'][idx % 4]}`}>
                                                    {c.first_name?.[0]}{c.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <div className="text-[13px] font-bold text-slate-800">{c.first_name} {c.last_name}</div>
                                                    <div className="text-[11px] text-slate-400 font-medium">{c.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                c.subscription?.plan === 'pro' ? 'text-blue-600 bg-blue-50' : 
                                                c.subscription?.plan === 'enterprise' ? 'text-purple-600 bg-purple-50' : 
                                                'text-slate-500 bg-slate-100'
                                            }`}>
                                                {c.subscription?.plan || 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${viewingSegment.color}18`, color: viewingSegment.color }}>
                                                    {viewingSegment.name}
                                                </span>
                                                {idx === 0 && <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">Power Users</span>}
                                                {idx > 0 && <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">Enterprise Clients</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <Link href={`/customers?manage=${c.id}`} className="inline-flex items-center justify-center text-[11px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                                                Open
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {viewingSegment.manual_members.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-[13px] font-medium text-slate-400 italic">
                                            No customers assigned to this segment yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            </div>

            {/* Viewport Modals */}
            {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} />}
            
            {showSegmentModal && (
                <CustomerSegmentModal 
                    onClose={() => { setShowSegmentModal(false); setEditingSegment(null); }}
                    initialData={editingSegment}
                    onSave={handleSaveSegment}
                    onDelete={(id) => {
                        setSegments(prev => prev.filter(s => s.id !== id));
                        setViewingSegment(null);
                    }}
                />
            )}
        </>
    );
}
