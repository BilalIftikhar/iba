'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '../../lib/api';
import Link from 'next/link';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminFetch<any[]>('/customers')
            .then(data => setCustomers(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="pb-6 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Customers</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage all customer accounts, profiles and subscriptions</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary font-bold text-slate-600">
                        + New Message
                    </button>
                    <button className="btn btn-primary font-bold shadow-sm">
                        + Create Booking
                    </button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative w-64 text-slate-500">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" placeholder="Search customers..." className="pl-9 py-2 pr-4 text-sm w-full outline-none border border-slate-200 rounded-lg focus:border-[#00c2ff] focus:ring-2 focus:ring-[#00c2ff]/10 transition-all font-medium" />
                </div>
                
                <select className="border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium text-slate-600 hover:border-slate-300 outline-none w-auto pr-8">
                    <option>All Plans</option>
                </select>
                
                <select className="border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium text-slate-600 hover:border-slate-300 outline-none w-auto pr-8">
                    <option>All Statuses</option>
                </select>

                <select className="border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium text-slate-600 hover:border-slate-300 outline-none w-auto pr-8 bg-blue-50/50">
                    <option>New Signups</option>
                </select>

                <button className="text-slate-400 text-sm font-semibold hover:text-slate-600 px-2 py-2">
                    Clear
                </button>
            </div>

            {/* Bubble Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
                <button className="px-4 py-1.5 rounded-full border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    All
                </button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    <span className="text-[#00c2ff]">💎</span> High Value
                </button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    <span className="text-slate-400">🏢</span> Enterprise
                </button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    <span className="text-amber-500">⚠️</span> At Risk
                </button>
                <button className="px-4 py-1.5 rounded-full border border-transparent bg-[#3b82f6] text-[13px] font-bold text-white shadow-sm flex items-center gap-1.5">
                    <span className="text-white text-xs px-1 bg-white/20 rounded">NEW</span> New Signups
                </button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    <span className="text-amber-500">⚡</span> Power Users
                </button>
                <button className="px-4 py-1.5 rounded-full border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    <span className="text-amber-500">🔔</span> Trial Users
                </button>
            </div>

            <div className="card overflow-hidden border border-slate-200">
                <div className="p-5 border-b border-slate-100 bg-white">
                    <h2 className="text-[16px] font-bold text-slate-800">All Customers <span className="text-slate-400 font-medium text-sm ml-1">— {customers.length} total</span></h2>
                </div>
                <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left bg-white">
                        <thead>
                            <tr>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Customer</th>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Company</th>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Plan</th>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Segments</th>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Bookings</th>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Joined</th>
                                <th className="pt-4 pb-3 px-5 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Status</th>
                                <th className="pt-4 pb-3 px-5 bg-white border-b-0"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-8 text-center border-t border-slate-100">
                                        <svg className="animate-spin w-6 h-6 text-[#00C2FF] mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                    </td>
                                </tr>
                            )}
                            {!loading && customers.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-6 text-center text-sm text-slate-500 font-medium border-t border-slate-100">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                            {!loading && customers.map(c => (
                                <tr key={c.id} className="border-t border-slate-100 group">
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                {c.first_name?.[0]}{c.last_name?.[0]}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-bold text-slate-800">{c.first_name} {c.last_name}</div>
                                                <div className="text-[12px] text-slate-500">{c.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className="text-[14px] font-bold text-slate-800">{c.company_name || 'Individual'}</span>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {c.subscription?.plan === 'pro' ? (
                                                <span className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Pro</span>
                                            ) : c.subscription?.plan === 'enterprise' ? (
                                                <span className="flex items-center gap-1.5 text-[12px] font-bold text-purple-600"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Enterprise</span>
                                            ) : (
                                                c.bookings?.length > 0 ? (
                                                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> New Signups</span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Trial Users</span>
                                                )
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className="text-[12px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">Basic</span>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className="text-[14px] font-medium text-slate-800">{c.bookings?.length || 0}</span>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className="text-[13px] font-bold text-slate-800">{new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className={`text-[12px] font-bold ${c.subscription?.plan ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {c.subscription?.plan ? 'Active' : 'Trial'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2 text-right">
                                            <Link href={`/customers/${c.id}`} className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                                                Manage
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
        </div>
    );
}
