'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CreateBookingModal } from '../../components/CreateBookingModal';
import { AutomationTemplateModal } from '../../components/Modals';
import { adminFetch } from '../../lib/api';

export default function AutomationTemplatesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [editingTemplate, setEditingTemplate] = useState<any>(null);

    const categories = ['All', 'Marketing', 'Sales', 'Finance', 'Content', 'Reporting', 'Security', 'HR'];

    const fetchData = () => {
        setLoading(true);
        adminFetch<any[]>('/cms/automation-templates')
            .then(data => setTemplates(data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (data: any) => {
        const url = data.id ? `/cms/automation-templates/${data.id}` : '/cms/automation-templates';
        const method = data.id ? 'PUT' : 'POST';
        
        try {
            await adminFetch(url, { method, body: JSON.stringify(data) });
            fetchData();
        } catch (err) {
            console.error('Failed to save template:', err);
        }
    };

    const filteredTemplates = templates.filter(t => {
        const matchesSearch = t.title?.toLowerCase().includes(search.toLowerCase()) || 
                             t.short_description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || t.type === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const mostUsed = templates.reduce((prev, current) => (prev.bookings_count > current.bookings_count) ? prev : current, templates[0] || {});

    return (
        <div className="pb-12 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">AI Automation Templates CMS</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage automation & agents templates shown on the customer dashboard</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/messages" className="text-[14px] font-bold text-[#4a8df8] bg-white border border-[#4a8df8]/20 px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                        + New Message
                    </Link>
                    <button onClick={() => setShowCreateModal(true)} className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white text-[14px] font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95">
                        + Create Booking
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Total Templates</h3>
                    <div className="text-[32px] font-black text-slate-800 tracking-tight leading-none">{loading ? '—' : templates.length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Published</h3>
                    <div className="text-[32px] font-black text-slate-800 tracking-tight leading-none mb-2">{loading ? '—' : templates.filter(t => t.is_published).length}</div>
                    <div className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">All live</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Categories</h3>
                    <div className="text-[32px] font-black text-slate-800 tracking-tight leading-none">{loading ? '—' : new Set(templates.map(t => t.type)).size}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Most Used</h3>
                    <div className="text-[18px] font-black text-slate-800 tracking-tight mb-0.5 truncate">{mostUsed.title || 'N/A'}</div>
                    <div className="text-xs font-bold text-[#00c2ff]">{mostUsed.bookings_count || 0} bookings</div>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group w-full sm:w-[280px]">
                        <input 
                            type="text" 
                            placeholder="Search templates..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-4 py-3 pr-4 text-[14px] w-full outline-none border border-slate-200 rounded-xl focus:border-[#4a8df8] focus:ring-4 focus:ring-[#4a8df8]/5 transition-all font-medium bg-white placeholder:text-slate-400" 
                        />
                    </div>
                    <select 
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="border border-slate-200 rounded-xl py-3 px-4 text-[14px] font-bold text-slate-600 outline-none w-full sm:w-auto min-w-[120px] bg-white cursor-pointer focus:border-[#4a8df8] transition-all"
                    >
                        <option value="All">All Categories</option>
                        {categories.slice(1).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <button 
                    onClick={() => { setEditingTemplate(null); setShowModal(true); }}
                    className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white text-[14px] font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                    + New Template
                </button>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-6 py-2 rounded-full border text-[13px] font-bold transition-all ${
                            categoryFilter === cat 
                                ? 'bg-[#4a8df8] border-[#4a8df8] text-white shadow-md shadow-blue-500/20' 
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading && (
                    <div className="col-span-full py-20 text-center text-slate-400 font-medium flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-[#4a8df8]/10 border-t-[#4a8df8] rounded-full animate-spin mb-4"></div>
                        <p className="text-[15px] font-bold tracking-tight">Syncing Template Cloud...</p>
                    </div>
                )}
                {!loading && filteredTemplates.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                        </div>
                        <h4 className="text-[16px] font-bold text-slate-800 mb-1">No templates found</h4>
                        <p className="text-slate-400 text-[14px] font-medium">Try adjusting your filters or search term.</p>
                    </div>
                )}
                {!loading && filteredTemplates.map((t, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 group relative flex flex-col">
                        {/* Top Row: Icon & Category */}
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                t.type === 'Marketing' ? 'bg-orange-50 text-orange-400' :
                                t.type === 'Sales' ? 'bg-indigo-50 text-indigo-400' :
                                t.type === 'Finance' ? 'bg-emerald-50 text-emerald-400' :
                                t.type === 'Content' ? 'bg-blue-50 text-blue-400' :
                                'bg-sky-50 text-sky-400'
                            }`}>
                                {t.type === 'Marketing' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
                                {t.type === 'Sales' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
                                {t.type === 'Finance' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20"/></svg>}
                                {t.type === 'Content' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
                                {!['Marketing', 'Sales', 'Finance', 'Content'].includes(t.type) && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                                {t.type || 'Automation'}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 cursor-pointer" onClick={() => { setEditingTemplate(t); setShowModal(true); }}>
                            <h3 className="text-[20px] font-bold text-slate-800 mb-3 tracking-tight leading-tight group-hover:text-[#4a8df8] transition-colors">{t.title}</h3>
                            <p className="text-[14px] font-medium text-slate-500 mb-6 leading-relaxed line-clamp-3">
                                {t.short_description || t.use_case}
                            </p>

                            {/* Stat Pills */}
                            <div className="flex items-center gap-2 mb-8">
                                <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-100/50 text-sky-500 px-3 py-1.5 rounded-full">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span className="text-[11px] font-bold">Save {t.time_saved_weekly || '12h/week'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-100/50 text-sky-500 px-3 py-1.5 rounded-full">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                                    <span className="text-[11px] font-bold">{t.roi_yearly || '4.2x ROI'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer: Avatars & Visibility Toggle */}
                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex -space-x-2 mr-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-[10px] font-bold text-white">12+</div>
                                </div>
                                <button 
                                    onClick={() => { setEditingTemplate(t); setShowModal(true); }}
                                    className="text-[12px] font-bold text-slate-800 hover:text-[#4a8df8] transition-colors"
                                >
                                    View Details
                                </button>
                            </div>

                            {/* Admin Controls */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                                    <div 
                                        className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${t.is_published ? 'bg-[#4a8df8]' : 'bg-slate-200'}`}
                                        onClick={() => handleSave({...t, is_published: !t.is_published})}
                                    >
                                        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all ${t.is_published ? 'right-0.75' : 'left-0.75'}`}></div>
                                    </div>
                                    <span className={`text-[11px] font-black uppercase tracking-tight ${t.is_published ? 'text-[#4a8df8]' : 'text-slate-400'}`}>
                                        {t.is_published ? 'Visible' : 'Hidden'}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => { setEditingTemplate(t); setShowModal(true); }}
                                    className="p-2 text-slate-400 hover:text-[#4a8df8] hover:bg-sky-50 rounded-lg transition-all"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {showModal && (
                <AutomationTemplateModal 
                    initialData={editingTemplate} 
                    onClose={() => { setShowModal(false); setEditingTemplate(null); }} 
                    onSave={handleSave}
                />
            )}
            {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} />}
        </div>
    );
}
