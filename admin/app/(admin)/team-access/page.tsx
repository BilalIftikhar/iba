'use client';
import { useState } from 'react';
import { CreateBookingModal } from '../../components/CreateBookingModal';

export default function TeamAccessPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    return (
        <div className="pb-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Team Access</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage your IBA admin team members and their access levels</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary font-bold text-slate-600 bg-white">
                        + New Message
                    </button>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary font-bold shadow-sm"
                    >
                        + Create Booking
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100 bg-white">
                    <h2 className="text-[18px] font-bold text-slate-800">Role Permissions</h2>
                    <p className="text-[13px] text-slate-500 font-medium">What each role can access in the admin panel</p>
                </div>
                
                <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left bg-white">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b border-slate-100 w-[40%]">Feature / Section</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase bg-white border-b border-slate-100 text-center">
                                    <div className="flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Super Admin</div>
                                </th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase bg-white border-b border-slate-100 text-center">
                                    <div className="flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Admin</div>
                                </th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase bg-white border-b border-slate-100 text-center">
                                    <div className="flex items-center justify-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> User</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { name: 'Dashboard Overview', icon: '📊', sa: true, a: true, u: true },
                                { name: 'All Bookings', icon: '📋', sa: true, a: true, u: true },
                                { name: 'AI Automations & Agents', icon: '⚡', sa: true, a: true, u: true },
                                { name: 'AI Co-Work', icon: '🤝', sa: true, a: true, u: true },
                                { name: 'AI Custom Apps', icon: '📱', sa: true, a: true, u: true },
                                { name: 'AI Implementation', icon: '⚙️', sa: true, a: true, u: true },
                                { name: 'Messages', icon: '💬', sa: true, a: true, u: true },
                                { name: 'All Customers', icon: '👥', sa: true, a: true, u: true },
                                { name: 'Customer Profiles (edit)', icon: '✏️', sa: true, a: true, u: true },
                                { name: 'Customer Credentials', icon: '🔐', sa: true, a: true, u: false },
                                { name: 'Customer Segments', icon: '🎯', sa: true, a: true, u: false },
                                { name: 'Subscriptions', icon: '💳', sa: true, a: false, u: false },
                                { name: 'Coupons & Discounts', icon: '🏷️', sa: true, a: false, u: false },
                                { name: 'Content CMS - Automation Templates', icon: '⚡', sa: true, a: false, u: false },
                            ].map((row, i) => (
                                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-400 text-sm grayscale">{row.icon}</span>
                                            <span className="text-[14px] font-bold text-slate-700">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-emerald-500 font-bold">
                                        {row.sa ? '✓' : <span className="text-slate-300 font-normal">—</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center text-emerald-500 font-bold">
                                        {row.a ? '✓' : <span className="text-slate-300 font-normal">—</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center text-emerald-500 font-bold">
                                        {row.u ? '✓' : <span className="text-slate-300 font-normal">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} />}
        </div>
    );
}
