'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CreateBookingModal } from './CreateBookingModal';
import { ReviewBookingPanel } from './ReviewBookingPanel';
import { CustomerProfilePanel } from './CustomerProfilePanel';
import { MessageReplyModal } from './MessageReplyModal';
import { getSocket } from '../lib/socket';

interface Booking {
    id: string;
    client: { first_name: string; last_name: string; email: string };
    type: string;
    status: string;
    booked_at: string;
}

interface MessageThread {
    id: string;
    client: { first_name: string; last_name: string; email: string };
    category: string;
    unreadCount: number;
    last_message_at: string;
    messages: { body: string }[];
}

interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    subscription?: { plan: string };
    bookings: { id: string }[];
}

interface DashboardData {
    totalCustomers: number;
    activeBookings: number;
    unreadMessages: number;
    mrr: number;
    newBookingsThisMonth: number;
    newCustomersThisMonth: number;
    recentBookings: Booking[];
    recentSignups: Customer[];
}

interface Props {
    data: DashboardData;
    threads: MessageThread[];
}

function StatCard({ label, value, trend, trendValue, isPositive }: { label: string, value: string | number, trend: string, trendValue: string, isPositive: boolean }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">{label}</h3>
            <div className="text-[32px] font-black text-slate-800 tracking-tight leading-none mb-3">{value}</div>
            <div className={`text-xs font-semibold flex items-center gap-1.5 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
                )}
                <span>{trendValue} {trend}</span>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string, classes: string }> = {
        submitted: { label: 'Submitted', classes: 'bg-amber-100 text-amber-700' },
        in_review: { label: 'In Review', classes: 'bg-blue-100 text-blue-700' },
        in_progress: { label: 'In Progress', classes: 'bg-indigo-100 text-indigo-700' },
        deployed: { label: 'Deployed', classes: 'bg-emerald-100 text-emerald-700' },
        booked: { label: 'Submitted', classes: 'bg-amber-100 text-amber-700' },
    };
    const mapped = map[status] || { label: status, classes: 'bg-slate-100 text-slate-600' };
    return (
        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide ${mapped.classes}`}>
            {mapped.label}
        </span>
    );
}

function TypeBadge({ type }: { type: string }) {
    const map: Record<string, { label: string, icon: React.ReactNode, textClass: string }> = {
        automation: { label: 'Automation', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>, textClass: 'text-blue-500' },
        custom_app: { label: 'Custom App', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>, textClass: 'text-rose-500' },
        cowork: { label: 'Co-Work', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, textClass: 'text-purple-500' },
        implementation: { label: 'Implementation', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>, textClass: 'text-emerald-500' },
    };
    const conf = map[type.toLowerCase()] || { label: type, icon: null, textClass: 'text-slate-500' };
    return (
        <div className={`flex items-center gap-1.5 text-xs font-semibold tracking-wide ${conf.textClass}`}>
            {conf.icon} {conf.label}
        </div>
    );
}

function timeAgo(dateString: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

// Reusable section card wrapper
function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
            {children}
        </div>
    );
}

// Section card header with consistent padding
function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
    return (
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
            <div>
                <h2 className="text-[15px] font-bold text-slate-800">{title}</h2>
                {subtitle && <p className="text-[12px] text-slate-400 font-medium mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

export function DashboardClient({ data, threads }: Props) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
    const [manageCustomerId, setManageCustomerId] = useState<string | null>(null);
    const [replyThreadId, setReplyThreadId] = useState<string | null>(null);
    const unreadThreads = threads.filter(t => t.unreadCount > 0).slice(0, 5);

    useEffect(() => {
        const socket = getSocket();
        
        const handleNewMessage = (data: any) => {
            console.log('[Dashboard] New live message received:', data);
            // Refresh data from server to get updated unread counts and lists
            window.location.reload(); 
            // In a more complex app, we'd use SWR's mutate() or similar for a partial silent refresh
        };

        socket.on('admin:new_message', handleNewMessage);
        
        return () => {
            socket.off('admin:new_message', handleNewMessage);
        };
    }, []);

    return (
        <>
            <div className="pt-4 pb-12 fade-in space-y-5">
                {/* ── Page Header ──────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-0.5 font-medium">Welcome back — here&apos;s what needs your attention</p>
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

            {/* ── Stat Cards ───────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard label="Total Customers" value={data.totalCustomers} trend="this month" trendValue={`↑ ${data.newCustomersThisMonth}`} isPositive={true} />
                <StatCard label="Active Bookings" value={data.activeBookings} trend="this week" trendValue={`↑ ${data.newBookingsThisMonth || 2}`} isPositive={true} />
                <StatCard label="Unread Messages" value={data.unreadMessages} trend="need reply" trendValue={`${data.unreadMessages}`} isPositive={false} />
                <StatCard label="MRR" value={`$${(data.mrr / 1000).toFixed(1)}k`} trend="vs last month" trendValue="↑ 12%" isPositive={true} />
            </div>

            {/* ── Two-col: Bookings + Messages ─────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* New Bookings */}
                <SectionCard>
                    <SectionHeader
                        title="New Bookings — Action Required"
                        subtitle="Submitted, waiting for your review"
                        action={
                            <Link href="/bookings" className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                                View all
                            </Link>
                        }
                    />
                    <div className="overflow-x-auto px-2 py-4">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Type</th>
                                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Status</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentBookings.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400 font-medium">
                                            No pending bookings right now.
                                        </td>
                                    </tr>
                                )}
                                {data.recentBookings.map(b => (
                                    <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#00c2ff]/10 text-[#00c2ff] flex items-center justify-center text-xs font-bold shrink-0">
                                                    {b.client.first_name[0]}{b.client.last_name[0]}
                                                </div>
                                                <span className="text-[13px] font-semibold text-slate-700">{b.client.first_name} {b.client.last_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <TypeBadge type={b.type} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={b.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => setReviewBookingId(b.id)}
                                                className="inline-flex items-center justify-center text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>

                {/* Unread Messages */}
                <SectionCard>
                    <SectionHeader
                        title="Unread Messages"
                        subtitle="Customers waiting for a reply"
                        action={
                            <Link href="/messages" className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                                View all
                            </Link>
                        }
                    />
                    <div className="overflow-x-auto px-2 py-4">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Re: Booking</th>
                                    <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Time</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {unreadThreads.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400 font-medium">
                                            No unread messages.
                                        </td>
                                    </tr>
                                )}
                                {unreadThreads.map(t => (
                                    <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                    {t.client.first_name[0]}{t.client.last_name[0]}
                                                </div>
                                                <span className="text-[13px] font-semibold text-slate-700">{t.client.first_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-[12px] font-bold text-slate-500 font-mono">{t.id.substring(0, 8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-[12px] font-medium text-slate-400">{timeAgo(t.last_message_at)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button 
                                                onClick={() => setReplyThreadId(t.id)}
                                                className="inline-flex items-center justify-center text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                Reply
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>
            </div>

            {/* ── Recent Signups ────────────────────────────── */}
            <SectionCard>
                <SectionHeader
                    title="Recent Customer Signups"
                    action={
                        <Link href="/customers" className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                            View all customers
                        </Link>
                    }
                />
                <div className="overflow-x-auto px-2 py-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Customer</th>
                                <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Plan</th>
                                <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Bookings</th>
                                <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Joined</th>
                                <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentSignups.map(c => (
                                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#00c2ff]/10 text-[#00c2ff] flex items-center justify-center text-xs font-bold shrink-0">
                                                {c.first_name[0]}{c.last_name[0]}
                                            </div>
                                            <div>
                                                <div className="text-[13px] font-bold text-slate-800">{c.first_name} {c.last_name}</div>
                                                <div className="text-[11px] text-slate-400 font-medium">{c.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {c.subscription?.plan === 'pro' ? (
                                            <span className="text-[11px] font-bold text-[#00c2ff] bg-[#00c2ff]/10 px-2.5 py-1 rounded-full">Pro</span>
                                        ) : c.subscription?.plan === 'enterprise' ? (
                                            <span className="text-[11px] font-bold text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full">Enterprise</span>
                                        ) : (
                                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Free</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[13px] font-semibold text-slate-700">{c.bookings?.length || 0}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[13px] text-slate-500">{new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Active</span>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button 
                                            onClick={() => setManageCustomerId(c.id)}
                                            className="inline-flex items-center justify-center text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            </div>

            {/* Modals outside transform bounds so fixed inset-0 attaches to viewport */}
            {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} onCreated={() => window.location.reload()} />}
            {reviewBookingId && <ReviewBookingPanel bookingId={reviewBookingId} onClose={() => setReviewBookingId(null)} onUpdated={() => window.location.reload()} />}
            {manageCustomerId && <CustomerProfilePanel customerId={manageCustomerId} onClose={() => setManageCustomerId(null)} onUpdated={() => window.location.reload()} />}
            {replyThreadId && <MessageReplyModal threadId={replyThreadId} onClose={() => setReplyThreadId(null)} onReplied={() => window.location.reload()} />}
        </>
    );
}
