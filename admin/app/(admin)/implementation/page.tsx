'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '../../lib/api';
import { AiExampleModal } from '../../components/Modals';
import { CreateBookingModal } from '../../components/CreateBookingModal';
import Link from 'next/link';

interface AiExample {
    id: string;
    title: string;
    description: string;
    icon_url: string | null;
    icon_emoji: string | null;
    display_order: number;
    is_published: boolean;
    view_count: number;
    enquiry_count: number;
}

export default function AiExamplesPage() {
    const [templates, setTemplates] = useState<AiExample[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<AiExample | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchTemplates = () => {
        adminFetch<AiExample[]>('/cms/ai-examples')
            .then(data => setTemplates(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchTemplates(); }, []);

    const handleSave = async (data: any) => {
        try {
            if (data.id) {
                await adminFetch(`/cms/ai-examples/${data.id}`, { method: 'PUT', body: JSON.stringify(data) });
            } else {
                const { id, ...createData } = data;
                await adminFetch('/cms/ai-examples', { method: 'POST', body: JSON.stringify(createData) });
            }
            fetchTemplates();
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this example?')) return;
        try {
            await adminFetch(`/cms/ai-examples/${id}`, { method: 'DELETE' });
            fetchTemplates();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleTogglePublish = async (t: AiExample) => {
        try {
            await adminFetch(`/cms/ai-examples/${t.id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...t, is_published: !t.is_published })
            });
            setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, is_published: !x.is_published } : x));
        } catch (err) {
            console.error('Toggle failed:', err);
        }
    };

    const handleReorder = async (t: AiExample, direction: 'up' | 'down') => {
        const sorted = [...templates].sort((a, b) => a.display_order - b.display_order);
        const idx = sorted.findIndex(x => x.id === t.id);
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return;
        const other = sorted[swapIdx];
        try {
            await adminFetch(`/cms/ai-examples/${t.id}`, { method: 'PUT', body: JSON.stringify({ display_order: other.display_order }) });
            await adminFetch(`/cms/ai-examples/${other.id}`, { method: 'PUT', body: JSON.stringify({ display_order: t.display_order }) });
            fetchTemplates();
        } catch (err) {
            console.error('Reorder failed:', err);
        }
    };

    const stats = {
        total: templates.length,
        published: templates.filter(t => t.is_published).length,
        enquiries: templates.reduce((sum, t) => sum + (t.enquiry_count || 0), 0),
        mostViewed: templates.reduce((prev, curr) => (prev.view_count > curr.view_count) ? prev : curr, templates[0] || { title: 'None' } as AiExample)
    };

    return (
        <>
        <div style={{ paddingBottom: '48px' }} className="fade-in">
            
            {/* Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">AI Implementation CMS</h1>
                    <p className="text-slate-500 text-sm font-medium" style={{ marginTop: '4px' }}>Manage "Examples of What We Build" shown on the Implementation page</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link href="/messages" className="text-[14px] font-bold text-[#4a8df8] bg-white border border-[#4a8df8]/20 px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                        + New Message
                    </Link>
                    <button onClick={() => setShowCreateModal(true)} className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white text-[14px] font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95">
                        + Create Booking
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '32px' }}>
                {[
                    { label: 'EXAMPLES', value: stats.total, color: 'slate' },
                    { label: 'PUBLISHED', value: stats.published, color: 'emerald' },
                    { label: 'ENQUIRIES', value: stats.enquiries, sub: 'this month', color: 'slate' },
                    { label: 'MOST VIEWED', value: stats.mostViewed.title, color: 'slate' }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-7 rounded-[24px] border border-slate-100 shadow-sm">
                        <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em]" style={{ marginBottom: '12px' }}>{s.label}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <div className={`text-[32px] font-black ${s.color === 'emerald' ? 'text-emerald-500' : 'text-slate-800'}`}>{s.value}</div>
                            {s.sub && <div className="text-[13px] font-bold text-emerald-500">{s.sub}</div>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Banner */}
            <div style={{ backgroundColor: '#ebf2ff', border: '1px solid #d0e1ff', padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <span style={{ fontSize: '20px' }}>💡</span>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#3b66b0', margin: 0 }}>
                    <strong style={{ color: '#1e3a8a' }}>How this works:</strong> These example cards appear in the "Examples of What We Build" grid on the AI Implementation & Transformation page. Add, edit, reorder or hide any example — changes reflect immediately on the customer dashboard.
                </p>
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                        type="text" 
                        placeholder="Search examples.." 
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#4a8df8] w-[260px] shadow-sm transition-all"
                    />
                    <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#4a8df8] shadow-sm cursor-pointer">
                        <option>All</option>
                        <option>Published</option>
                        <option>Drafts</option>
                    </select>
                </div>
                <button 
                    onClick={() => { setEditingTemplate(null); setShowModal(true); }}
                    className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white text-[14px] font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Example
                </button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-10 h-10 border-4 border-[#4a8df8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500 font-bold">Loading examples...</p>
                    </div>
                ) : templates.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
                        <p className="text-slate-400 font-bold">No examples found. Add your first one!</p>
                    </div>
                ) : templates.map((t, idx) => (
                    <div key={t.id} className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all group">
                        <div className="p-7 flex items-start gap-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100/50">
                                {t.icon_url ? (
                                    <img src={t.icon_url} alt="" className="w-10 h-10 object-contain" />
                                ) : (
                                    <span className="text-3xl">{t.icon_emoji || '🤖'}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-[17px] font-black text-slate-800 tracking-tight">{t.title}</h3>
                                    <span className="text-[12px] font-bold text-slate-300">#{idx + 1}</span>
                                </div>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{t.description}</p>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50/50 border-t border-slate-100 px-7 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="flex items-center gap-3">
                                    <div 
                                        onClick={() => handleTogglePublish(t)}
                                        style={{ width: '40px', height: '20px', borderRadius: '9999px', position: 'relative', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: t.is_published ? '#10b981' : '#cbd5e1' }}
                                    >
                                        <div style={{ width: '14px', height: '14px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', transition: 'all 0.2s', ...(t.is_published ? { right: '3px' } : { left: '3px' }) }}></div>
                                    </div>
                                    <span className={`text-[12px] font-bold ${t.is_published ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {t.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleReorder(t, 'up')} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                                </button>
                                <button onClick={() => handleReorder(t, 'down')} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                                </button>
                                <button 
                                    onClick={() => { setEditingTemplate(t); setShowModal(true); }}
                                    className="bg-white border border-slate-200 text-slate-700 font-bold text-[12px] px-4 py-2 rounded-lg hover:bg-slate-50 transition-all shadow-sm ml-2"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <AiExampleModal
                    initialData={editingTemplate}
                    onClose={() => { setShowModal(false); setEditingTemplate(null); }}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
        {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} />}
        </>
    );
}
