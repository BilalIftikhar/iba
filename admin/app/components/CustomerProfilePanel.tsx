'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { useScrollLock } from '../lib/useScrollLock';
import { CreateBookingModal } from './CreateBookingModal';

interface CustomerProfilePanelProps {
    customerId: string;
    onClose: () => void;
    onUpdated?: () => void;
}

export function CustomerProfilePanel({ customerId, onClose, onUpdated }: CustomerProfilePanelProps) {
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sending, setSending] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showCreateBooking, setShowCreateBooking] = useState(false);

    // Form fields
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        phone: '',
        timezone: '',
        hourly_rate: '',
        plan: 'free',
        status: 'active',
        automations_limit: '1',
        billing_cycle: 'monthly',
        admin_notes: '',
        quick_message: '',
    });

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    useScrollLock();

    const fetchCustomer = () => {
        adminFetch<any>(`/customers/${customerId}`)
            .then(res => {
                const c = res;
                setCustomer(c);
                setForm({
                    first_name: c.first_name || '',
                    last_name: c.last_name || '',
                    company_name: c.company_name || '',
                    email: c.email || '',
                    phone: c.phone || '',
                    timezone: c.timezone || 'UTC',
                    hourly_rate: c.hourly_rate?.toString() || '0',
                    plan: c.subscription?.plan || 'free',
                    status: c.subscription?.status || 'active',
                    automations_limit: c.subscription?.automations_limit?.toString() || '1',
                    billing_cycle: c.subscription?.billing_cycle || 'monthly',
                    admin_notes: c.admin_notes || '',
                    quick_message: '',
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCustomer();
    }, [customerId]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 280);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminFetch(`/customers/${customerId}`, {
                method: 'PATCH',
                body: JSON.stringify(form)
            });
            onUpdated?.();
            handleClose();
        } catch (err) {
            console.error(err);
            alert('Failed to update customer');
        } finally {
            setSaving(false);
        }
    };

    const handleSendMessage = async () => {
        if (!form.quick_message.trim()) return;
        setSending(true);
        try {
            // Check if there's an existing thread or create a new one
            // For now, let's create a general support/admin thread
            await adminFetch(`/messages/new`, {
                method: 'POST',
                body: JSON.stringify({
                    client_id: customerId,
                    body: form.quick_message,
                    category: 'support'
                }),
            });
            setForm(f => ({ ...f, quick_message: '' }));
            alert('Message sent!');
        } catch (err) {
            console.error(err);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleRevealCredential = (cred: any) => {
        alert(`Requesting reveal for ${cred.name} (${cred.type}). Admin audit log will be created.`);
    };

    const formatBookingId = (id: string) => {
        if (!id) return '';
        const numPart = id.replace(/\D/g, '').slice(-4).padStart(4, '0');
        return `#BOOK-${numPart}`;
    };

    const panelClass = `relative bg-white w-full max-w-[550px] h-dvh shadow-2xl flex flex-col overflow-hidden panel-slide-in ${visible ? 'panel-slide-in--visible' : ''}`;

    if (loading || !customer) {
        return (
            <div className="fixed inset-0 z-[99999] flex justify-end" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
                <div className={panelClass}>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#4a8df8] rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    const bookings = customer.bookings || [];
    const teamMembers = customer.team_as_owner?.map((t: any) => ({
        id: t.member.id,
        name: `${t.member.first_name} ${t.member.last_name}`,
        initials: `${t.member.first_name?.[0] || ''}${t.member.last_name?.[0] || ''}`,
        role: t.role.charAt(0).toUpperCase() + t.role.slice(1)
    })) || [];
    
    const credentials = customer.credentials || [];

    const getStatusTextClasses = (s: string) => {
        const str = s.toLowerCase();
        if (str === 'submitted' || str === 'booked') return 'text-amber-500 bg-amber-50';
        if (str === 'deployed' || str === 'active') return 'text-emerald-500 bg-emerald-50';
        if (str === 'cancelled' || str === 'suspended' || str === 'past_due') return 'text-rose-500 bg-rose-50';
        return 'text-slate-500 bg-slate-50';
    };

    return (
        <div className="fixed inset-0 z-[99999] flex justify-end" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />

            <div className={panelClass}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                    <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">Customer Profile</h2>
                    <button onClick={handleClose} className="w-8 h-8 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 bg-white">
                    
                    {/* User Card */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[20px] font-bold shrink-0 shadow-sm">
                            {(customer.first_name?.[0] || 'S').toUpperCase()}{(customer.last_name?.[0] || 'A').toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-[18px] font-bold text-slate-800 leading-tight">
                                {customer.first_name || 'Sarah'} {customer.last_name || 'Al-Rashid'}
                            </h3>
                            <p className="text-[13px] font-medium text-slate-500 mt-0.5">{customer.email || 'sarah@acmecorp.ae'}</p>
                        </div>
                    </div>

                    {/* PROFILE DETAILS */}
                    <div className="space-y-6">
                        <SectionDivider title="Profile Details" />
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <label className="field-label">First Name</label>
                                <input type="text" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="form-input" />
                            </div>
                            <div>
                                <label className="field-label">Last Name</label>
                                <input type="text" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="form-input" />
                            </div>
                            <div className="col-span-2">
                                <label className="field-label">Company</label>
                                <input type="text" value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} className="form-input" />
                            </div>
                            <div>
                                <label className="field-label">Email</label>
                                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="form-input" />
                            </div>
                            <div>
                                <label className="field-label">Phone</label>
                                <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="form-input" />
                            </div>
                            <div>
                                <label className="field-label">Timezone</label>
                                <input type="text" value={form.timezone} onChange={e => setForm({...form, timezone: e.target.value})} className="form-input" />
                            </div>
                            <div>
                                <label className="field-label">Hourly Rate ($)</label>
                                <input type="number" value={form.hourly_rate} onChange={e => setForm({...form, hourly_rate: e.target.value})} className="form-input" />
                            </div>
                        </div>
                    </div>

                    {/* SUBSCRIPTION */}
                    <div className="space-y-6">
                        <SectionDivider title="Subscription" />
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <label className="field-label">Plan</label>
                                <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} className="form-input">
                                    <option value="free">Free</option>
                                    <option value="pro">Pro</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div>
                                <label className="field-label">Status</label>
                                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="form-input">
                                    <option value="active">Active</option>
                                    <option value="trialing">Trialing</option>
                                    <option value="past_due">Past Due</option>
                                    <option value="cancelled">Suspended</option>
                                </select>
                            </div>
                            <div>
                                <label className="field-label">Automations Limit</label>
                                <input type="number" value={form.automations_limit} onChange={e => setForm({...form, automations_limit: e.target.value})} className="form-input" />
                            </div>
                            <div>
                                <label className="field-label">Billing Cycle</label>
                                <select value={form.billing_cycle} onChange={e => setForm({...form, billing_cycle: e.target.value})} className="form-input">
                                    <option value="monthly">Monthly</option>
                                    <option value="annual">Yearly</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* TEAM MEMBERS */}
                    <div className="space-y-4">
                        <SectionDivider title="Team Members" />
                        {teamMembers.length > 0 ? (
                            <div className="space-y-3">
                                {teamMembers.map((tm: any) => (
                                    <div key={tm.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                                                {tm.initials}
                                            </div>
                                            <div className="text-[13px] font-bold text-slate-800">{tm.name}</div>
                                        </div>
                                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{tm.role}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-2.5">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                </div>
                                <p className="text-[13px] font-semibold text-slate-500">No team members yet</p>
                                <p className="text-[11px] text-slate-400 mt-1">Team members invited by this customer will appear here</p>
                            </div>
                        )}
                    </div>

                    {/* CUSTOMER BOOKINGS */}
                    <div className="space-y-4">
                        <SectionDivider title="Customer Bookings" />
                        {bookings.length > 0 ? (
                            <div className="space-y-3">
                                {bookings.map((b: any) => (
                                    <div key={b.id} className="flex flex-col gap-2 p-3.5 border border-slate-100 rounded-xl bg-white shadow-sm hover:border-[#4a8df8]/30 transition-colors cursor-pointer group">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-[14px] font-bold text-slate-800 group-hover:text-[#4a8df8] transition-colors">{b.title || 'Untitled Booking'}</div>
                                                <div className="text-[12px] font-bold font-mono text-slate-400 mt-1 tracking-widest">{formatBookingId(b.id)}</div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${getStatusTextClasses(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-2.5">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                </div>
                                <p className="text-[13px] font-semibold text-slate-500">No bookings yet</p>
                                <p className="text-[11px] text-slate-400 mt-1">Bookings created for this customer will appear here</p>
                                <button
                                    onClick={() => setShowCreateBooking(true)}
                                    className="mt-3 text-[12px] font-bold text-[#4a8df8] hover:text-[#3b82f6] transition-colors"
                                >
                                    + Create first booking
                                </button>
                            </div>
                        )}
                    </div>

                    {/* STORED CREDENTIALS */}
                    <div className="space-y-4">
                        <SectionDivider title="Stored Credentials" />
                        {credentials.length > 0 ? (
                            <div className="space-y-3">
                                {credentials.map((cred: any) => (
                                    <div 
                                        key={cred.id} 
                                        onClick={() => handleRevealCredential(cred)}
                                        className="flex items-start gap-3 p-4 border border-slate-100 rounded-xl bg-white shadow-sm hover:border-[#4a8df8]/30 transition-colors cursor-pointer group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-sm mt-0.5 group-hover:bg-blue-50 transition-colors">
                                            {cred.type === 'api_key' ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                                            ) : cred.type === 'software' ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-[14px] font-bold text-slate-800 group-hover:text-[#4a8df8] transition-colors">{cred.name}</h4>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                                    cred.type === 'api_key' ? 'bg-amber-50 text-amber-600' :
                                                    cred.type === 'software' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'
                                                }`}>{cred.type.replace('_', ' ').toUpperCase()}</span>
                                            </div>
                                            <p className="text-[12px] font-medium text-slate-500 mt-1 truncate max-w-[200px]">{cred.service} • {cred.environment}</p>
                                            <p className="text-[11px] font-medium text-slate-400 mt-1">Added {new Date(cred.added_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleRevealCredential(cred); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                Reveal
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-2.5">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                                </div>
                                <p className="text-[13px] font-semibold text-slate-500">No credentials stored</p>
                                <p className="text-[11px] text-slate-400 mt-1">API keys, software logins, and webhooks added by this customer will appear here</p>
                            </div>
                        )}
                    </div>

                    {/* ADMIN NOTES */}
                    <div className="space-y-4">
                        <SectionDivider title="Admin Notes" />
                        <textarea
                            value={form.admin_notes}
                            onChange={(e) => setForm({...form, admin_notes: e.target.value})}
                            placeholder="Internal notes about this customer..."
                            className="form-input min-h-[100px] resize-y"
                        />
                    </div>

                    {/* QUICK MESSAGE */}
                    <div className="space-y-4">
                        <SectionDivider title="Quick Message" />
                        <div className="space-y-3">
                            <textarea
                                value={form.quick_message}
                                onChange={(e) => setForm({...form, quick_message: e.target.value})}
                                placeholder="Send a direct message to this customer..."
                                className="form-input min-h-[100px] resize-y"
                            />
                            <p className="text-[11px] text-slate-400 font-medium italic">Sent to customer's dashboard and via notification preferences</p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 pt-5 pb-8 border-t-2 border-slate-100 bg-white flex items-center gap-3 shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] overflow-x-auto">
                    <button onClick={handleSave} disabled={saving} className="btn-save min-w-[120px]">
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button 
                        onClick={handleSendMessage} 
                        disabled={sending || !form.quick_message.trim()} 
                        className="btn-msg min-w-[120px]"
                    >
                        {sending ? 'Sending...' : 'Send Message'}
                    </button>
                    <button 
                        onClick={() => setShowCreateBooking(true)}
                        className="btn-booking min-w-[140px]"
                    >
                        + Create Booking
                    </button>
                    <button 
                        onClick={() => setForm({...form, status: 'cancelled'})}
                        className="btn-suspend"
                    >
                        Suspend
                    </button>
                </div>
            </div>

            {showCreateBooking && (
                <CreateBookingModal 
                    initialCustomerId={customerId}
                    onClose={() => setShowCreateBooking(false)} 
                    onCreated={() => {
                        setShowCreateBooking(false);
                        fetchCustomer();
                    }}
                />
            )}
            {/* Scoped CSS for standard inputs to reduce repetition */}
            <style jsx>{`
                .form-input {
                    display: block;
                    width: 100%;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.5rem;
                    padding: 0.75rem 1rem;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1e293b;
                    outline: none;
                    transition: border-color 0.2s, background-color 0.2s;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    background-color: white;
                }
                .form-input:focus {
                    border-color: #4a8df8;
                }
                .btn-save {
                    background-color: #4a8df8;
                    color: white;
                    font-weight: 700;
                    padding: 0.75rem 1.25rem;
                    border-radius: 0.75rem;
                    font-size: 13px;
                    transition: background-color 0.2s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .btn-save:hover { background-color: #3b82f6; }
                .btn-save:disabled { opacity: 0.5; }

                .btn-msg {
                    background-color: white;
                    border: 1px solid #e2e8f0;
                    color: #475569;
                    font-weight: 700;
                    padding: 0.75rem 1.25rem;
                    border-radius: 0.75rem;
                    font-size: 13px;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .btn-msg:hover { background-color: #f8fafc; color: #1e293b; }
                .btn-msg:disabled { opacity: 0.5; }

                .btn-booking {
                    background-color: #ecfdf5;
                    color: #059669;
                    border: 1px solid #a7f3d0;
                    font-weight: 700;
                    padding: 0.75rem 1.25rem;
                    border-radius: 0.75rem;
                    font-size: 13px;
                    transition: background-color 0.2s;
                }
                .btn-booking:hover { background-color: #d1fae5; }

                .btn-suspend {
                    background-color: #fff1f2;
                    color: #e11d48;
                    border: 1px solid #fecdd3;
                    font-weight: 700;
                    padding: 0.75rem 1.25rem;
                    border-radius: 0.75rem;
                    font-size: 13px;
                    transition: background-color 0.2s;
                }
                .btn-suspend:hover { background-color: #ffe4e6; }
            `}</style>
        </div>
    );
}

function SectionDivider({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-4 mb-5">
            <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase shrink-0">{title}</h3>
            <div className="h-px bg-slate-100 flex-1" />
        </div>
    );
}
