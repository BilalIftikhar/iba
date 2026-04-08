'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '../../lib/api';

export default function ContentCMSPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminFetch<any[]>('/cms/automation-templates')
            .then(data => setTemplates(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="pb-6 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Content CMS</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage suggested automation templates and dynamic content.</p>
                </div>
                <div>
                    <button className="btn btn-primary font-bold shadow-sm">
                        + Add Template
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden border border-slate-200">
                <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left bg-white">
                        <thead>
                            <tr>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Use Case / Title</th>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Type</th>
                                <th className="pt-4 pb-3 px-5 bg-white border-b-0 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={3} className="px-5 py-8 text-center border-t border-slate-100">
                                        <svg className="animate-spin w-6 h-6 text-[#00C2FF] mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                    </td>
                                </tr>
                            )}
                            {!loading && templates.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-5 py-6 text-center text-sm text-slate-500 font-medium border-t border-slate-100">
                                        No templates found.
                                    </td>
                                </tr>
                            )}
                            {!loading && templates.map((t, i) => (
                                <tr key={i} className="border-t border-slate-100 group">
                                    <td className="px-5 py-4">
                                        <div className="text-[14px] font-bold text-slate-800">{t.title || 'Untitled'}</div>
                                        <div className="text-[13px] text-slate-500 max-w-[400px] truncate">{t.use_case}</div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className="text-[12px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md capitalize">{t.type}</span>
                                    </td>
                                    <td className="px-5 py-4 text-right whitespace-nowrap">
                                        <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors mr-2">
                                            Edit
                                        </button>
                                        <button className="text-[12px] font-bold border border-red-100 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
