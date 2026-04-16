'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CreateBookingModal } from '../../components/CreateBookingModal';

export default function SubscriptionsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <div className="pb-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Subscriptions</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Customer plans, billing and usage</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Active Paid</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">18</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">On Trial</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">4</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">MRR</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">$4.2k</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Churn Risk</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">2</div>
                    <div className="text-xs font-semibold text-rose-500">past due</div>
                </div>
            </div>

            <div className="card overflow-hidden border border-slate-200">
                <div className="p-5 border-b border-slate-100 bg-white">
                    <h2 className="text-[16px] font-bold text-slate-800">Customer Subscriptions</h2>
                </div>
                <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left bg-white">
                        <thead>
                            <tr>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Customer</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Plan</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Billing</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Next Bill</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Status</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Automations Used</th>
                                <th className="pt-4 pb-3 px-6 bg-white border-b-0"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sarah */}
                            <tr className="border-t border-slate-100 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            SA
                                        </div>
                                        <div className="text-[14px] font-semibold text-slate-800">Sarah Al-Rashid</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-bold text-[#00c2ff]">Pro</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-medium text-slate-700">Monthly</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-medium text-slate-700">Apr 1, 2026</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[12px] font-bold text-emerald-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-[#3b82f6] rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-700">12/20</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Edit</button>
                                </td>
                            </tr>
                            
                            {/* Mohammed */}
                            <tr className="border-t border-slate-100 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            MK
                                        </div>
                                        <div className="text-[14px] font-semibold text-slate-800">Mohammed Khalid</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-md">Enterprise</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-medium text-slate-700">Annual</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-medium text-slate-700">Jan 1, 2027</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[12px] font-bold text-emerald-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-purple-500 rounded-full w-4"></div>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-700">∞/∞</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Edit</button>
                                </td>
                            </tr>

                            {/* Lena */}
                            <tr className="border-t border-slate-100 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-400 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            LT
                                        </div>
                                        <div className="text-[14px] font-semibold text-slate-800">Lena Torres</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Basic</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-medium text-slate-700">Monthly</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-medium text-slate-700">Apr 10, 2026</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[12px] font-bold text-amber-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Trial</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '20%' }}></div>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-700">1/5</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Edit</button>
                                </td>
                            </tr>

                            {/* James */}
                            <tr className="border-t border-slate-100 group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            JL
                                        </div>
                                        <div className="text-[14px] font-semibold text-slate-800">James Liu</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-bold text-[#00c2ff]">Pro</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-medium text-slate-700">Monthly</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-medium text-slate-700">Mar 28, 2026</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[12px] font-bold text-rose-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Past Due</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-rose-500 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-700">15/20</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>        {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} />}
        
        </div>
    );
}
