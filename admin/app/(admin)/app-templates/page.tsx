'use client';

import { useState, useEffect } from 'react';
import { AppTemplateModal } from '../../components/Modals';
import { adminFetch } from '../../lib/api';

export default function AppTemplatesPage() {
    const [showModal, setShowModal] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminFetch<any[]>('/cms/app-templates')
            .then(data => setTemplates(data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="pb-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">AI Custom Apps CMS</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage app templates shown on the Custom Apps page</p>
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
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">App Templates</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">{loading ? '-' : templates.length}</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Published</h3>
                    <div className="text-3xl font-black text-emerald-500 tracking-tight mb-2">{loading ? '-' : templates.length}</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Most Booked</h3>
                    <div className="text-xl font-black text-slate-800 tracking-tight mb-1 mt-3">{templates[0]?.title || 'N/A'}</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Bookings</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">-</div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] text-slate-500 font-medium">App templates appear in the "OR CHOOSE FROM POPULAR APP TEMPLATES" section on the AI Custom Apps page</p>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-[#3b82f6] text-white text-[12px] font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition-colors"
                >
                    + New App Template
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && (
                    <div className="col-span-full py-12 text-center text-slate-500 font-medium flex flex-col items-center">
                        <svg className="animate-spin w-8 h-8 text-[#00c2ff] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" stroke="#e2e8f0"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path></svg>
                        Loading custom app templates...
                    </div>
                )}
                {!loading && templates.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 font-medium tracking-tight">
                        No dynamic app templates found in the database.
                    </div>
                )}
                {!loading && templates.map((t, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        <div className="p-5 flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[11px] font-bold text-blue-500 flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Custom App
                                </span>
                                <span className="text-[12px] font-bold text-slate-500">#{idx + 1}</span>
                            </div>
                            <h3 className="text-[16px] font-bold text-slate-800 mb-2 leading-tight">{t.title || 'Dynamic App'}</h3>
                            <p className="text-[13px] font-medium text-slate-500 mb-3 leading-relaxed">
                                {t.use_case || 'Dynamic app description driven by backend records.'}
                            </p>
                            
                            <div className="flex justify-between items-end mt-6 border-t border-slate-100 pt-4">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase mb-1">Time to Delivery</div>
                                    <div className="text-[14px] font-black text-slate-800">~2 Weeks</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-slate-400 tracking-wide uppercase mb-1">Price</div>
                                    <div className="text-[14px] font-black text-slate-800">Custom</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-4 bg-emerald-500 rounded-full flex items-center px-0.5 relative">
                                    <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 shadow-sm"></div>
                                </div>
                                <span className="text-[12px] font-bold text-emerald-600">Published</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-all bg-white">Edit</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && <AppTemplateModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
