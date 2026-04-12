'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreateBookingModal } from '../../components/CreateBookingModal';
import { adminFetch } from '../../lib/api';
import Link from 'next/link';
import { CustomerProfilePanel } from '../../components/CustomerProfilePanel';
import { MessageReplyModal } from '../../components/MessageReplyModal';

export default function CustomersPage() {
    return (
        <Suspense fallback={
            <div className="p-12 text-center text-slate-500 font-medium text-sm flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Initializing customers module...
            </div>
        }>
            <CustomersList />
        </Suspense>
    );
}

function CustomersList() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterSegment, setFilterSegment] = useState('');

    const searchParams = useSearchParams();
    const [manageCustomerId, setManageCustomerId] = useState<string | null>(null);
    const [replyThreadId, setReplyThreadId] = useState<string | null>(null);
    const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const id = searchParams.get('manage');
        if (id) setManageCustomerId(id);
    }, [searchParams]);

    const loadCustomers = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterStatus) params.append('status', filterStatus);
        if (filterPlan) params.append('plan', filterPlan);
        if (filterSegment) params.append('segment', filterSegment);
        if (searchTerm) params.append('search', searchTerm);

        adminFetch<any[]>(`/customers?${params.toString()}`)
            .then(data => {
                setCustomers(data);
                setCurrentPage(1);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleOpenChat = async (customerId: string) => {
        setChatLoadingId(customerId);
        try {
            const threadRes = await adminFetch<any>(`/customers/${customerId}/thread`);
            const targetId = threadRes?.id || threadRes?.data?.id;
            if (targetId) {
                setReplyThreadId(targetId);
            } else {
                alert("No chat thread found for this customer.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to open chat thread");
        } finally {
            setChatLoadingId(null);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadCustomers();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, filterStatus, filterPlan, filterSegment]);

    // Pagination logic
    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
        <div className="pb-6 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ marginBottom: '15px' }}>
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Customers</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage all customer accounts, profiles and subscriptions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/messages" className="btn btn-secondary font-bold text-[#00C2FF]">
                        + New Message
                    </Link>
                    <button onClick={() => setShowCreateModal(true)} className="btn btn-primary font-bold shadow-sm">
                        + Create Booking
                    </button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3 w-full flex-nowrap overflow-x-auto pb-1 clip-scroll" style={{ marginBottom: '15px' }}>
                <div className="relative text-slate-500 shrink-0" style={{ width: '35%', minWidth: '200px' }}>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search customers..." 
                        className="pl-4 py-2.5 pr-4 text-[13.5px] w-full outline-none border border-slate-200 rounded-lg focus:border-[#00c2ff] focus:ring-2 focus:ring-[#00c2ff]/10 transition-all font-medium bg-white" 
                    />
                </div>
                
                <select 
                    value={filterPlan}
                    onChange={(e) => setFilterPlan(e.target.value)}
                    style={{ width: '15%', minWidth: '130px' }}
                    className="shrink-0 border border-slate-200 rounded-lg py-2.5 px-3 text-[13.5px] font-medium text-slate-600 hover:border-slate-300 outline-none bg-white cursor-pointer"
                >
                    <option value="">All Plans</option>
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                </select>
                
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ width: '15%', minWidth: '130px' }}
                    className="shrink-0 border border-slate-200 rounded-lg py-2.5 px-3 text-[13.5px] font-medium text-slate-600 hover:border-slate-300 outline-none bg-white cursor-pointer"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="trial">Trial</option>
                    <option value="past_due">Past Due</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <select 
                    value={filterSegment}
                    onChange={(e) => setFilterSegment(e.target.value)}
                    style={{ width: '15%', minWidth: '130px' }}
                    className="shrink-0 border border-slate-200 rounded-lg py-2.5 px-3 text-[13.5px] font-medium text-slate-600 hover:border-slate-300 outline-none bg-white cursor-pointer"
                >
                    <option value="">All Segments</option>
                    <option value="high_value">High Value</option>
                    <option value="enterprise_clients">Enterprise Clients</option>
                    <option value="at_risk">At Risk</option>
                    <option value="new_signups">New Signups</option>
                    <option value="power_users">Power Users</option>
                    <option value="trial_users">Trial Users</option>
                </select>

                <button 
                    onClick={() => { setSearchTerm(''); setFilterPlan(''); setFilterStatus(''); setFilterSegment(''); }}
                    className="shrink-0 px-4 py-2 border border-[#00c2ff] text-[#00c2ff] hover:bg-[#00c2ff] hover:text-white rounded-full text-[13px] font-bold transition-colors"
                >
                    Clear
                </button>
            </div>

            {/* Bubble Filters */}
            <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: '15px' }}>
                <button 
                    onClick={() => setFilterSegment('')}
                    className={`px-4 py-1.5 rounded-full border text-[13px] font-bold transition-colors ${filterSegment === '' ? 'border-[#3b82f6] bg-[#3b82f6] text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilterSegment('high_value')}
                    className={`px-4 py-1.5 rounded-full border text-[13px] font-bold transition-colors flex items-center gap-1.5 ${filterSegment === 'high_value' ? 'border-[#3b82f6] bg-[#3b82f6] text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span className={filterSegment === 'high_value' ? '' : 'text-[#00c2ff]'}>💎</span> High Value
                </button>
                <button 
                    onClick={() => setFilterSegment('enterprise_clients')}
                    className={`px-4 py-1.5 rounded-full border text-[13px] font-bold transition-colors flex items-center gap-1.5 ${filterSegment === 'enterprise_clients' ? 'border-[#3b82f6] bg-[#3b82f6] text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span className={filterSegment === 'enterprise_clients' ? '' : 'text-slate-400'}>🏢</span> Enterprise
                </button>
                <button 
                    onClick={() => setFilterSegment('at_risk')}
                    className={`px-4 py-1.5 rounded-full border text-[13px] font-bold transition-colors flex items-center gap-1.5 ${filterSegment === 'at_risk' ? 'border-[#3b82f6] bg-[#3b82f6] text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span className={filterSegment === 'at_risk' ? '' : 'text-amber-500'}>⚠️</span> At Risk
                </button>
                <button 
                    onClick={() => setFilterSegment('new_signups')}
                    className={`px-4 py-1.5 rounded-full border text-[13px] font-bold transition-colors flex items-center gap-1.5 ${filterSegment === 'new_signups' ? 'border-[#3b82f6] bg-[#3b82f6] text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span className="text-white text-[10px] font-black px-1.5 py-0.5 bg-emerald-500 rounded">NEW</span> New Signups
                </button>
                <button 
                    onClick={() => setFilterSegment('power_users')}
                    className={`px-4 py-1.5 rounded-full border text-[13px] font-bold transition-colors flex items-center gap-1.5 ${filterSegment === 'power_users' ? 'border-[#3b82f6] bg-[#3b82f6] text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span className={filterSegment === 'power_users' ? '' : 'text-amber-500'}>⚡</span> Power Users
                </button>
                <button 
                    onClick={() => setFilterSegment('trial_users')}
                    className={`px-4 py-1.5 rounded-full border text-[13px] font-bold transition-colors flex items-center gap-1.5 ${filterSegment === 'trial_users' ? 'border-[#3b82f6] bg-[#3b82f6] text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span className={filterSegment === 'trial_users' ? '' : 'text-amber-500'}>🔔</span> Trial Users
                </button>
            </div>

            <div className="card overflow-hidden border border-slate-200">
                <div className="p-5 border-b border-slate-100 bg-white shadow-sm flex items-center justify-between">
                    <h2 className="text-[16px] font-bold text-slate-800">All Customers <span className="text-slate-400 font-medium text-sm ml-1">— {customers.length} total</span></h2>
                    {totalPages > 1 && (
                        <div className="text-[12px] text-slate-500 font-bold uppercase tracking-wider">
                           Page {currentPage} of {totalPages}
                        </div>
                    )}
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
                            {!loading && paginatedCustomers.map(c => (
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
                                            <button 
                                                onClick={() => setManageCustomerId(c.id)}
                                                className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm bg-white"
                                            >
                                                Manage
                                            </button>
                                            <button 
                                                disabled={chatLoadingId === c.id}
                                                onClick={() => handleOpenChat(c.id)} 
                                                className={`text-[12px] font-black border border-slate-200 p-2 rounded-xl transition-all shadow-sm flex items-center justify-center ${chatLoadingId === c.id ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 bg-white'}`}
                                            >
                                                {chatLoadingId === c.id ? (
                                                    <svg className="animate-spin w-[15px] h-[15px] text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                                                ) : (
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[13px] font-bold text-slate-400">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, customers.length)} of {customers.length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[13px] font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all active:scale-95 shadow-sm"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-9 h-9 rounded-xl border text-[13px] font-black transition-all active:scale-95 shadow-sm ${currentPage === i + 1 ? 'bg-[#00c2ff] border-[#00c2ff] text-white shadow-[#00c2ff]/20' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[13px] font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all active:scale-95 shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {manageCustomerId && (
            <CustomerProfilePanel 
                customerId={manageCustomerId} 
                onClose={() => setManageCustomerId(null)} 
            />
        )}
        
        {replyThreadId && (
            <MessageReplyModal 
                threadId={replyThreadId} 
                onClose={() => setReplyThreadId(null)} 
            />
        )}        {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} />}
        
        </>
    );
}
