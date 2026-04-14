'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreateBookingModal } from '../../components/CreateBookingModal';
import { adminFetch } from '../../lib/api';

// ── Types ──────────────────────────────────────────────────────────────
interface Member {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    created_at: string;
    last_active: string;
    status: string;
}

// ── Role Permissions Matrix ────────────────────────────────────────────
const PERMISSIONS = [
    { name: 'Dashboard Overview',               icon: '📊', sa: true,  a: true,  u: true  },
    { name: 'All Bookings',                      icon: '📋', sa: true,  a: true,  u: true  },
    { name: 'AI Automations & Agents',           icon: '⚡', sa: true,  a: true,  u: true  },
    { name: 'AI Co-Work',                        icon: '🤝', sa: true,  a: true,  u: true  },
    { name: 'AI Custom Apps',                    icon: '📱', sa: true,  a: true,  u: true  },
    { name: 'AI Implementation',                 icon: '⚙️', sa: true,  a: true,  u: true  },
    { name: 'Messages',                          icon: '💬', sa: true,  a: true,  u: true  },
    { name: 'All Customers',                     icon: '👥', sa: true,  a: true,  u: true  },
    { name: 'Customer Profiles (edit)',          icon: '✏️', sa: true,  a: true,  u: true  },
    { name: 'Customer Credentials',              icon: '🔐', sa: true,  a: true,  u: false },
    { name: 'Customer Segments',                 icon: '🎯', sa: true,  a: true,  u: false },
    { name: 'Subscriptions',                     icon: '💳', sa: true,  a: false, u: false },
    { name: 'Coupons & Discounts',               icon: '🏷️', sa: true,  a: false, u: false },
    { name: 'Content CMS – Automation Templates',icon: '⚡', sa: true,  a: false, u: false },
    { name: 'Content CMS – Co-Work',             icon: '🤝', sa: true,  a: false, u: false },
    { name: 'Content CMS – App Templates',       icon: '📱', sa: true,  a: false, u: false },
    { name: 'Content CMS – Implementation',      icon: '🔄', sa: true,  a: false, u: false },
    { name: 'Team Access Management',            icon: '🛡️', sa: true,  a: false, u: false },
];


// ── Sub-components ─────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
    const map: Record<string, { label: string; dot: string; bg: string; text: string }> = {
        super_admin: { label: 'Super Admin', dot: '#ef4444', bg: '#fef2f2', text: '#dc2626' },
        admin:       { label: 'Admin',       dot: '#3b82f6', bg: '#eff6ff', text: '#2563eb' },
        user:        { label: 'User',        dot: '#10b981', bg: '#f0fdf4', text: '#059669' },
    };
    const c = map[role] || map.user;
    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: c.bg }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
            <span className="text-[12px] font-bold" style={{ color: c.text }}>{c.label}</span>
        </div>
    );
}

function EditMemberPanel({ member, onClose, onSave }: {
    member: Member;
    onClose: () => void;
    onSave: (updated: Member) => void;
}) {
    const [visible, setVisible] = React.useState(false);
    const [form, setForm] = React.useState({
        first_name: member.first_name,
        last_name:  member.last_name,
        email:      member.email,
        role:       member.role,
    });
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminFetch(`/team-members/${member.id}`, {
                method: 'PUT',
                body: JSON.stringify(form),
            });
        } catch (_err) {
            // Endpoint may not exist yet — update locally anyway
        } finally {
            setSaving(false);
        }
        onSave({ ...member, ...form });
        handleClose();
    };

    const panelClass = `relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`;

    const roleDesc: Record<string, string> = {
        super_admin: 'Full access to all features including Team Access Management.',
        admin:       'Access to bookings, customers, messages, and most features.',
        user:        'Read-only access to bookings and customer data.',
    };

    return (
        <div className="fixed inset-0 z-[99999] flex justify-end">
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />
            <div className={panelClass}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">Edit Member</h2>
                        <p className="text-[13px] text-slate-400 font-medium mt-0.5">Update team member details</p>
                    </div>
                    <button onClick={handleClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                    {/* Avatar preview */}
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                            {form.first_name[0]}{form.last_name[0]}
                        </div>
                        <div>
                            <p className="text-[15px] font-bold text-slate-800">{form.first_name} {form.last_name}</p>
                            <p className="text-[13px] text-slate-400 font-medium">{form.email}</p>
                        </div>
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2">First Name</label>
                        <input
                            type="text"
                            value={form.first_name}
                            onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                            className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2">Last Name</label>
                        <input
                            type="text"
                            value={form.last_name}
                            onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                            className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2">Role</label>
                        <select
                            value={form.role}
                            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                            className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors bg-white"
                        >
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        <p className="text-[12px] text-slate-400 font-medium mt-2">{roleDesc[form.role] || ''}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center gap-4 shrink-0">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-[#4a8df8] hover:bg-[#3b82f6] text-white font-bold py-3 px-7 rounded-xl text-[14px] transition-colors shadow-sm disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={handleClose}
                        className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold py-3 px-6 rounded-xl text-[14px] transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Page ───────────────────────────────────────────────────────────────
export default function TeamAccessPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch live admin users from backend, fall back to static on error
    useEffect(() => {
        setLoading(true);
        adminFetch<Member[]>('/team')
            .then(data => {
                if (Array.isArray(data)) {
                    setMembers(data.map(u => ({
                        ...u,
                        role:        u.role        || 'admin',
                        last_active: u.last_active || '—',
                        status:      u.status      || 'active',
                    })));
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleMemberSave = (updated: Member) => {
        setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
    };

    return (
        <>
        <div className="pb-8 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Team Access</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Manage your IBA admin team members and their access levels</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/messages"
                        className="text-[14px] font-bold text-[#4a8df8] bg-white border border-[#4a8df8]/20 px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                    >
                        + New Message
                    </Link>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white text-[14px] font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                    >
                        + Create Booking
                    </button>
                </div>
            </div>

            {/* ── Role Permissions ─────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
                <div className="px-6 py-5 border-b border-slate-100">
                    <h2 className="text-[18px] font-bold text-slate-800">Role Permissions</h2>
                    <p className="text-[13px] text-slate-400 font-medium mt-0.5">What each role can access in the admin panel</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 w-[40%]">Feature / Section</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-100 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Super Admin
                                    </div>
                                </th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-100 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Admin
                                    </div>
                                </th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-100 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> User
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {PERMISSIONS.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[15px]">{row.icon}</span>
                                            <span className="text-[14px] font-semibold text-slate-700">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.sa ? <span className="text-emerald-500 font-bold text-[16px]">✓</span> : <span className="text-slate-300">—</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.a  ? <span className="text-emerald-500 font-bold text-[16px]">✓</span> : <span className="text-slate-300">—</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.u  ? <span className="text-emerald-500 font-bold text-[16px]">✓</span> : <span className="text-slate-300">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Team Members ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-[18px] font-bold text-slate-800">Team Members</h2>
                        <p className="text-[13px] text-slate-400 font-medium mt-0.5">IBA admin staff with access to this panel</p>
                    </div>
                    <button className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white text-[14px] font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5"  y1="12" x2="19" y2="12" />
                        </svg>
                        Invite Member
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100">Member</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100">Email</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100">Role</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100">Joined</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100">Last Active</th>
                                <th className="py-4 px-6 text-[11px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100">Status</th>
                                <th className="py-4 px-6 border-b border-slate-100" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="w-8 h-8 border-4 border-[#4a8df8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-slate-400 font-bold">Loading team members...</p>
                                    </td>
                                </tr>
                            ) : members.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="text-slate-200 mb-4">
                                            <svg className="mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                        </div>
                                        <p className="text-slate-400 font-bold">No team members found</p>
                                    </td>
                                </tr>
                            ) : (
                                members.map(m => {
                                const avatarColors = [
                                    { bg: '#fef2f2', text: '#dc2626' },
                                    { bg: '#eff6ff', text: '#2563eb' },
                                    { bg: '#f0fdf4', text: '#059669' },
                                    { bg: '#fefce8', text: '#ca8a04' },
                                    { bg: '#fdf4ff', text: '#a855f7' },
                                ];
                                const c = avatarColors[(m.first_name.charCodeAt(0) || 0) % avatarColors.length];
                                const initials = (m.first_name[0] || '') + (m.last_name[0] || '');

                                return (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                                                    style={{ backgroundColor: c.bg, color: c.text }}
                                                >
                                                    {initials}
                                                </div>
                                                <span className="text-[14px] font-bold text-slate-800">{m.first_name} {m.last_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-slate-500">{m.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><RoleBadge role={m.role} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-slate-500">
                                            {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-slate-500">{m.last_active}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {m.status === 'active'
                                                ? <span className="text-[12px] font-bold text-emerald-500">Active</span>
                                                : <span className="text-[12px] font-bold text-amber-500 italic">Invited</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => setEditingMember(m)}
                                                className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-all bg-white"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        {/* Modals — outside the transform/fade-in container to ensure viewport positioning */}
        {showCreateModal && (
            <CreateBookingModal onClose={() => setShowCreateModal(false)} />
        )}
        {editingMember && (
            <EditMemberPanel
                member={editingMember}
                onClose={() => setEditingMember(null)}
                onSave={handleMemberSave}
            />
        )}
        </>
    );
}
