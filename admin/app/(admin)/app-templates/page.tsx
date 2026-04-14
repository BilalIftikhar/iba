'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CreateBookingModal } from '../../components/CreateBookingModal';
import { AppTemplateModal } from '../../components/Modals';
import { adminFetch } from '../../lib/api';

interface AppTemplate {
    id: string;
    title: string;
    category: string;
    icon: string;
    short_description: string;
    full_description: string;
    use_case: string;
    roi_yearly: string;
    delivery_time: string;
    app_type: string;
    difficulty: string;
    key_features: string;
    data_sources: string;
    best_for: string;
    is_published: boolean;
    display_order: number;
    bookings_count: number;
}

export default function AppTemplatesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<AppTemplate | null>(null);
    const [templates, setTemplates] = useState<AppTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTemplates = () => {
        adminFetch<AppTemplate[]>('/cms/app-templates')
            .then(data => setTemplates(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchTemplates(); }, []);

    const handleSave = async (data: any) => {
        try {
            if (data.id) {
                await adminFetch(`/cms/app-templates/${data.id}`, { method: 'PUT', body: JSON.stringify(data) });
            } else {
                const { id, ...createData } = data;
                await adminFetch('/cms/app-templates', { method: 'POST', body: JSON.stringify(createData) });
            }
            setLoading(true);
            fetchTemplates();
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await adminFetch(`/cms/app-templates/${id}`, { method: 'DELETE' });
            setLoading(true);
            fetchTemplates();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleTogglePublish = async (t: AppTemplate) => {
        try {
            await adminFetch(`/cms/app-templates/${t.id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...t, is_published: !t.is_published })
            });
            setTemplates(prev => prev.map(x => x.id === t.id ? { ...x, is_published: !x.is_published } : x));
        } catch (err) {
            console.error('Toggle failed:', err);
        }
    };

    const published = templates.filter(t => t.is_published);
    const mostBooked = templates.reduce((prev, curr) => (prev.bookings_count > curr.bookings_count) ? prev : curr, templates[0] || {} as AppTemplate);
    const totalBookings = templates.reduce((sum, t) => sum + (t.bookings_count || 0), 0);

    return (
        <>
        <div style={{ paddingBottom: '48px' }} className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">AI Custom Apps CMS</h1>
                    <p className="text-slate-500 text-sm font-medium" style={{ marginTop: '4px' }}>Manage app templates shown on the Custom Apps page</p>
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

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', marginTop: '20px', marginBottom: '32px' }}>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]" style={{ marginBottom: '12px' }}>App Templates</h3>
                    <div className="text-[32px] font-black text-slate-800 tracking-tight leading-none">{loading ? '—' : templates.length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]" style={{ marginBottom: '12px' }}>Published</h3>
                    <div className="text-[32px] font-black text-emerald-500 tracking-tight leading-none">{loading ? '—' : published.length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]" style={{ marginBottom: '12px' }}>Most Booked</h3>
                    <div className="text-[18px] font-black text-slate-800 tracking-tight leading-tight" style={{ marginTop: '6px' }}>{mostBooked?.title || 'N/A'}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]" style={{ marginBottom: '12px' }}>Total Bookings</h3>
                    <div className="text-[32px] font-black text-slate-800 tracking-tight leading-none">{loading ? '—' : totalBookings}</div>
                </div>
            </div>

            {/* Helper + New Template */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '20px', marginBottom: '24px' }}>
                <p className="text-[13px] text-slate-500 font-medium">App templates appear in the &quot;OR CHOOSE FROM POPULAR APP TEMPLATES&quot; section on the AI Custom Apps page</p>
                <button 
                    onClick={() => { setEditingTemplate(null); setShowModal(true); }}
                    className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white text-[14px] font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    + New App Template
                </button>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', marginTop: '20px' }}>
                {loading && (
                    <div style={{ gridColumn: '1 / -1', padding: '80px 0', textAlign: 'center' }} className="text-slate-400 font-medium flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-[#4a8df8]/10 border-t-[#4a8df8] rounded-full animate-spin" style={{ marginBottom: '16px' }}></div>
                        Loading app templates...
                    </div>
                )}
                {!loading && templates.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '80px 0', textAlign: 'center' }} className="text-slate-400 font-medium">
                        No app templates found. Click &quot;+ New App Template&quot; to create one.
                    </div>
                )}
                {!loading && templates.map((t) => {
                    const features = (t.key_features || '').split('\n').filter(Boolean);
                    const sources = (t.data_sources || '').split(',').map(s => s.trim()).filter(Boolean);
                    return (
                        <div key={t.id} className="bg-white border border-slate-100 rounded-2xl hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 group flex flex-col" style={{ overflow: 'hidden' }}>
                            {/* Card body */}
                            <div style={{ padding: '28px', flex: 1 }}>
                                {/* Top: Icon + Category + Bookings */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                            {t.icon || '📱'}
                                        </div>
                                        <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                                            {t.category || 'App'}
                                        </span>
                                    </div>
                                    <span className="text-[12px] font-bold text-slate-400">{t.bookings_count || 0} bookings</span>
                                </div>

                                {/* Title + Description */}
                                <h3 className="text-[18px] font-bold text-slate-800 tracking-tight leading-tight group-hover:text-[#4a8df8] transition-colors cursor-pointer" 
                                    onClick={() => { setEditingTemplate(t); setShowModal(true); }}
                                    style={{ marginBottom: '8px' }}>
                                    {t.title}
                                </h3>
                                <p className="text-[13px] font-medium text-slate-500 leading-relaxed" style={{ marginBottom: '20px' }}>
                                    {t.short_description || t.use_case?.substring(0, 80)}
                                </p>

                                {/* Stat Pills: ROI, Delivery, Difficulty */}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                    {t.roi_yearly && (
                                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', textAlign: 'center' }}>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">ROI</div>
                                            <div className="text-[13px] font-black text-slate-800">{t.roi_yearly}</div>
                                        </div>
                                    )}
                                    {t.delivery_time && (
                                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', textAlign: 'center' }}>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Delivery</div>
                                            <div className="text-[13px] font-black text-slate-800">{t.delivery_time}</div>
                                        </div>
                                    )}
                                    {t.difficulty && (
                                        <div style={{ 
                                            border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', textAlign: 'center',
                                            backgroundColor: t.difficulty === 'Easy' ? '#f0fdf4' : t.difficulty === 'Hard' ? '#fef2f2' : '#fffbeb',
                                            borderColor: t.difficulty === 'Easy' ? '#bbf7d0' : t.difficulty === 'Hard' ? '#fecaca' : '#fde68a'
                                        }}>
                                            <div className="text-[13px] font-black" style={{
                                                color: t.difficulty === 'Easy' ? '#16a34a' : t.difficulty === 'Hard' ? '#dc2626' : '#d97706'
                                            }}>{t.difficulty}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Key Features */}
                                {features.length > 0 && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide" style={{ marginBottom: '8px' }}>Key Features</div>
                                        {features.slice(0, 3).map((f, i) => (
                                            <div key={i} className="text-[12px] font-medium text-slate-600" style={{ marginBottom: '3px' }}>✓ {f}</div>
                                        ))}
                                        {features.length > 3 && (
                                            <div className="text-[11px] font-bold text-slate-400" style={{ marginTop: '4px' }}>+{features.length - 3} more</div>
                                        )}
                                    </div>
                                )}

                                {/* Data Sources */}
                                {sources.length > 0 && (
                                    <div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide" style={{ marginBottom: '8px' }}>Data Sources</div>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {sources.map((s, i) => (
                                                <span key={i} className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div style={{ padding: '16px 28px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div
                                        style={{ width: '36px', height: '20px', borderRadius: '9999px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: t.is_published ? '#10b981' : '#cbd5e1' }}
                                        onClick={() => handleTogglePublish(t)}
                                    >
                                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '3px', transition: 'all 0.2s', ...(t.is_published ? { right: '3px' } : { left: '3px' }) }}></div>
                                    </div>
                                    <span className="text-[12px] font-bold" style={{ color: t.is_published ? '#10b981' : '#94a3b8' }}>
                                        {t.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => { setEditingTemplate(t); setShowModal(true); }}
                                    className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-all bg-white"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <AppTemplateModal
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
