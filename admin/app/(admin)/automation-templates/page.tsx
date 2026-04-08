'use client';

import { useState, useEffect } from 'react';
import { AutomationTemplateModal } from '../../components/Modals';
import { adminFetch } from '../../lib/api';

export default function AutomationTemplatesPage() {
    const [showModal, setShowModal] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminFetch<any[]>('/cms/automation-templates')
            .then(data => setTemplates(data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="pb-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">AI Automation Templates CMS</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage automation & agents templates shown on the customer dashboard</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary font-bold text-slate-600 bg-white">
                        + New Message
                    </button>
                    <button className="btn btn-primary font-bold shadow-sm">
                        + Create Booking
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Templates</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">{loading ? '-' : templates.length}</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Published</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">{loading ? '-' : templates.length}</div>
                    <div className="text-xs font-semibold text-emerald-500">All live</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">{loading ? '-' : new Set(templates.map(t => t.type)).size}</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Most Used</h3>
                    <div className="text-xl font-black text-slate-800 tracking-tight mb-1">{templates[0]?.title || 'N/A'}</div>
                    <div className="text-xs font-semibold text-emerald-500">Popular</div>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex gap-3">
                    <div className="relative w-64 text-slate-500">
                        <input type="text" placeholder="Search templates.." className="pl-4 py-2 pr-4 text-sm w-full outline-none border border-slate-200 rounded-lg focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10 transition-all font-medium bg-white" />
                    </div>
                    <select className="border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium text-slate-600 outline-none w-24 pr-8 bg-white">
                        <option>All</option>
                    </select>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-[#3b82f6] hover:bg-blue-600 text-white text-[13px] font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                    + New Template
                </button>
            </div>

            {/* Bubble Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
                <button className="px-4 py-1.5 rounded-full border border-transparent bg-[#3b82f6] text-[13px] font-bold text-white shadow-sm transition-colors">All</button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">Marketing</button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">Sales</button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">Finance</button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">Content</button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">Reporting</button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">Security</button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">HR</button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && (
                    <div className="col-span-full py-12 text-center text-slate-500 font-medium flex flex-col items-center">
                        <svg className="animate-spin w-8 h-8 text-[#00c2ff] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" stroke="#e2e8f0"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path></svg>
                        Loading dynamic templates...
                    </div>
                )}
                {!loading && templates.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 font-medium tracking-tight">
                        No dynamic templates found in the database.
                    </div>
                )}
                {!loading && templates.map((t, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        <div className="p-5 flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[11px] font-bold text-blue-500 flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> {t.type || 'Automation'}
                                </span>
                                <span className="text-[12px] font-bold text-slate-500">#{idx + 1}</span>
                            </div>
                            <h3 className="text-[16px] font-bold text-slate-800 mb-2 leading-tight">{t.title || 'Dynamic Template'}</h3>
                            <p className="text-[13px] font-medium text-slate-500 mb-6 leading-relaxed">
                                {t.use_case || 'This template is generated dynamically from your database usage records.'}
                            </p>
                            
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase mb-1">Time Saved</div>
                                    <div className="text-[14px] font-black text-emerald-600">~12 hrs</div>
                                </div>
                                <div className="text-center flex flex-col items-center">
                                    <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase mb-1">Status</div>
                                    <span className="text-[11px] font-bold text-emerald-500 py-1">Active</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-4 bg-emerald-500 rounded-full flex items-center px-0.5 relative">
                                    <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 shadow-sm"></div>
                                </div>
                                <span className="text-[12px] font-bold text-emerald-600">Published</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">Preview</button>
                                <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">Edit</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && <AutomationTemplateModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
