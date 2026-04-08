'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '../../lib/api';
import Link from 'next/link';

export default function WorkflowsPage() {
    const [workflows, setWorkflows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminFetch<any[]>('/workflows')
            .then(data => setWorkflows(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="pb-6 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Workflows</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Link n8n automations to client bookings.</p>
                </div>
                <div>
                    <button className="btn btn-primary font-bold shadow-sm">
                        + Link Workflow
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden border border-slate-200">
                <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left bg-white">
                        <thead>
                            <tr>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Customer</th>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">n8n ID</th>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Name / Dept</th>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Status</th>
                                <th className="pt-4 pb-3 px-5 bg-white border-b-0"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center border-t border-slate-100">
                                        <svg className="animate-spin w-6 h-6 text-[#00C2FF] mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                    </td>
                                </tr>
                            )}
                            {!loading && workflows.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-6 text-center text-sm text-slate-500 font-medium border-t border-slate-100">
                                        No mapped workflows found.
                                    </td>
                                </tr>
                            )}
                            {!loading && workflows.map(w => (
                                <tr key={w.id} className="border-t border-slate-100 group">
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#00c2ff]/10 text-[#00c2ff] flex items-center justify-center text-xs font-bold shrink-0">
                                                {w.client?.first_name?.[0]}{w.client?.last_name?.[0]}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-bold text-slate-800">{w.client?.first_name} {w.client?.last_name}</div>
                                                <div className="text-[12px] text-slate-500">{w.client?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className="text-[13px] font-mono font-bold text-slate-600">{w.n8n_workflow_id}</span>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="text-[14px] font-bold text-slate-800">{w.name}</div>
                                        <div className="text-[12px] font-medium text-slate-500 uppercase tracking-widest">{w.department}</div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide
                                            ${w.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}
                                        `}>
                                            {w.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right whitespace-nowrap">
                                        <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                                            Edit
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
