'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { useScrollLock } from '../lib/useScrollLock';

interface CustomerProfilePanelProps {
    customerId: string;
    onClose: () => void;
    onUpdated?: () => void;
}

export function CustomerProfilePanel({ customerId, onClose, onUpdated }: CustomerProfilePanelProps) {
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [visible, setVisible] = useState(false);

    // Form fields
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        company: '',
        email: '',
        phone: '',
        timezone: '',
        hourly_rate: '',
        plan: 'Free',
        status: 'Active',
        automations_limit: '0',
        billing_cycle: 'Monthly',
        admin_notes: '',
    });

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    useScrollLock();

    useEffect(() => {
        // Fetch customer data — using dummy data mapping for now if API doesn't return full details
        adminFetch<any>(`/customers/${customerId}`)
            .then(res => {
                const c = res;
                setCustomer(c);
                setForm({
                    first_name: c.first_name || '',
                    last_name: c.last_name || '',
                    company: c.company || '',
                    email: c.email || '',
                    phone: c.phone || '',
                    timezone: c.timezone || 'Asia/Dubai',
                    hourly_rate: c.hourly_rate?.toString() || '85',
                    plan: c.subscription?.plan || 'Free',
                    status: c.status || 'Active',
                    automations_limit: c.subscription?.automations_limit?.toString() || '0',
                    billing_cycle: c.subscription?.billing_cycle || 'Monthly',
                    admin_notes: c.admin_notes || '',
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
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

    const formatBookingId = (id: string) => {
        if (!id) return '';
        const numPart = id.replace(/\D/g, '').slice(-4).padStart(4, '0');
        return `#BOOK-${numPart}`;
    };

    const panelClass = `relative bg-white w-full max-w-[500px] h-dvh shadow-2xl flex flex-col overflow-hidden panel-slide-in ${visible ? 'panel-slide-in--visible' : ''}`;

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

    // Dummy lists for UI demonstration (replace with real data traversing `customer` obj)
    const bookings = customer.bookings || [
        { id: '1231', title: 'Lead Scoring Automation', status: 'submitted' },
        { id: '2342', title: 'Social Media Scheduler', status: 'deployed' }
    ];
    const teamMembers = customer.team_members || [
        { id: '1', name: 'Khalid Al-Rashid', role: 'Editor', initials: 'KA' },
        { id: '2', name: 'Noura R.', role: 'Viewer', initials: 'NR' }
    ];
    const credentials = customer.credentials || [
        { id: '1', name: 'Google Sheets API', type: 'API Key', details: 'Google Sheets • Production', icon: 'key' },
        { id: '2', name: 'HubSpot CRM Login', type: 'Software', details: 'HubSpot • Production', icon: 'lock' },
        { id: '3', name: 'Order Notifications', type: 'Webhook', details: 'Stripe • Production', icon: 'link' }
    ];

    const getStatusTextClasses = (s: string) => {
        const str = s.toLowerCase();
        if (str === 'submitted' || str === 'booked') return 'text-amber-500 bg-amber-50';
        if (str === 'deployed') return 'text-emerald-500 bg-emerald-50';
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
                                <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="form-input" />
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
                                    <option value="Free">Free</option>
                                    <option value="Pro">Pro</option>
                                    <option value="Enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div>
                                <label className="field-label">Status</label>
                                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="form-input">
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>
                            <div>
                                <label className="field-label">Automations Limit</label>
                                <input type="number" value={form.automations_limit} onChange={e => setForm({...form, automations_limit: e.target.value})} className="form-input" />
                            </div>
                            <div>
                                <label className="field-label">Billing Cycle</label>
                                <select value={form.billing_cycle} onChange={e => setForm({...form, billing_cycle: e.target.value})} className="form-input">
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* TEAM MEMBERS */}
                    <div className="space-y-4">
                        <SectionDivider title="Team Members" />
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
                    </div>

                    {/* CUSTOMER BOOKINGS */}
                    <div className="space-y-4">
                        <SectionDivider title="Customer Bookings" />
                        <div className="space-y-3">
                            {bookings.map((b: any) => (
                                <div key={b.id} className="flex flex-col gap-2 p-3.5 border border-slate-100 rounded-xl bg-white shadow-sm hover:border-[#4a8df8]/30 transition-colors cursor-pointer group">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-[14px] font-bold text-slate-800 group-hover:text-[#4a8df8] transition-colors">{b.title}</div>
                                            <div className="text-[12px] font-bold font-mono text-slate-400 mt-1 tracking-widest">{formatBookingId(b.id)}</div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${getStatusTextClasses(b.status)}`}>
                                            {b.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* STORED CREDENTIALS */}
                    <div className="space-y-4">
                        <SectionDivider title="Stored Credentials" />
                        <div className="space-y-3">
                            {credentials.map((cred: any) => (
                                <div key={cred.id} className="flex items-start gap-3 p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-sm mt-0.5">
                                        {cred.icon === 'key' ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                                        ) : cred.icon === 'lock' ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-[14px] font-bold text-slate-800">{cred.name}</h4>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                                cred.type === 'API Key' ? 'bg-blue-50 text-blue-600' :
                                                cred.type === 'Software' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'
                                            }`}>{cred.type}</span>
                                        </div>
                                        <p className="text-[12px] font-medium text-slate-500 mt-1 truncate max-w-[200px]">{cred.type === 'API Key' ? 'API Key: AIza...' : cred.type === 'Software' ? 'Email: sarah****@acmecorp.ae' : 'Endpoint URL: https://api.***.com'}</p>
                                        <p className="text-[11px] font-medium text-slate-400 mt-1">{cred.details}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            Reveal
                                        </button>
                                        <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
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

                </div>

                {/* Footer */}
                <div className="px-6 pt-5 pb-8 border-t-2 border-slate-100 bg-white flex items-center gap-3 shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] overflow-x-auto">
                    <button onClick={handleSave} disabled={saving} className="btn btn-primary bg-[#4a8df8] hover:bg-[#3b82f6] text-white flex-1 py-3 text-[13px] shadow-sm">
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button className="btn btn-secondary flex-1 py-3 bg-white text-[13px] border-slate-200 text-slate-600 shadow-sm border-2">
                        Send Message
                    </button>
                    <button className="btn flex-1 py-3 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-[13px] hover:bg-emerald-100 shadow-sm transition-colors">
                        + Create Booking
                    </button>
                    <button className="btn flex-initial w-auto px-5 py-3 bg-rose-50 text-rose-500 border border-rose-100 font-bold text-[13px] hover:bg-rose-100 shadow-sm transition-colors">
                        Suspend
                    </button>
                </div>
            </div>
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
