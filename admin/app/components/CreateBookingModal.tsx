'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { useScrollLock } from '../lib/useScrollLock';

interface Props {
    onClose: () => void;
    onCreated?: () => void;
    initialCustomerId?: string;
}

export function CreateBookingModal({ onClose, onCreated, initialCustomerId }: Props) {
    useScrollLock();
    const [saving, setSaving] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);

    useEffect(() => {
        adminFetch<any>('/customers?limit=100')
            .then(res => {
                const list = Array.isArray(res) ? res : (res.data || []);
                setCustomers(list);
            })
            .catch(console.error);
    }, []);

    const [form, setForm] = useState({
        client_id: initialCustomerId || '',
        type: 'automation',
        title: '',
        use_case: '',
        status: 'submitted',
        custom_booking_id: '',
        extra_automations: '0',
        extra_cowork_agents: '0',
        extra_custom_apps: '0',
        free_impl_hours: '0',
        note_to_customer: '',
        timeline_setup_days: '',
        deployment_date: '',
        admin_notes: '',
        notify_message: '',
    });

    const handleCreate = async () => {
        if (!form.client_id || !form.title) return;
        setSaving(true);
        try {
            await adminFetch('/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    client_id: form.client_id,
                    id: form.custom_booking_id || undefined,
                    type: form.type,
                    title: form.title,
                    use_case: form.use_case,
                    status: form.status,
                    notify_customer: !!form.notify_message.trim(),
                    notify_message: form.notify_message.trim() || undefined,
                    timeline_setup_days: parseInt(form.timeline_setup_days) || undefined,
                    deployment_date: form.deployment_date || undefined,
                }),
            });
            onCreated?.();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to create booking');
        } finally {
            setSaving(false);
        }
    };

    const typeOptions = [
        { value: 'automation', label: 'AI Automation & Agents', icon: '⚡' },
        // { value: 'cowork', label: 'AI Co-Work', icon: '🤝' },
        { value: 'custom_app', label: 'AI Custom App', icon: '📱' },
        { value: 'implementation', label: 'Implementation', icon: '🔄' },
    ];

    const getLineDividerLabel = () => {
        const option = typeOptions.find(o => o.value === form.type);
        return option ? `${option.icon} ${option.label.split('&')[0].toUpperCase()} DETAILS` : '⚡ AUTOMATION DETAILS';
    };

    const selectedCustomer = customers.find(c => c.id === form.client_id);

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-6"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
        >
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[760px] flex flex-col max-h-[90vh] overflow-hidden panel-fade-in">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between shrink-0">
                    <div>
                        <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">Create Booking</h2>
                        <p className="text-[13px] text-slate-500 font-medium mt-1">
                            {selectedCustomer ? `For: ${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''} (${selectedCustomer.email})` : 'Select a customer to begin'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors shrink-0"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
                    
                    {/* CUSTOMER */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                            Customer *
                        </label>
                        <select
                            value={form.client_id}
                            onChange={(e) => setForm(f => ({ ...f, client_id: e.target.value }))}
                            className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm bg-white"
                        >
                            <option value="">— Select customer —</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{(c.first_name || '') + ' ' + (c.last_name || '')} ({c.email})</option>
                            ))}
                        </select>
                    </div>

                    {/* SERVICE TYPE */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-3">
                            Service Type *
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {typeOptions.map(opt => {
                                const selected = form.type === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                                        className={`flex flex-col items-center justify-center text-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                            selected
                                                ? 'border-[#4a8df8] bg-blue-50/50'
                                                : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="text-[20px] mb-1">{opt.icon}</span>
                                        <span className={`text-[12px] font-bold leading-tight ${selected ? 'text-[#4a8df8]' : 'text-slate-700'}`}>
                                            {opt.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SERVICE TITLE & DESCRIPTION */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                                Service / Project Title *
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="e.g. Lead Enrichment Pipeline"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                                Use Case / Description
                            </label>
                            <textarea
                                value={form.use_case}
                                onChange={(e) => setForm(f => ({ ...f, use_case: e.target.value }))}
                                placeholder="Describe what this should do..."
                                className="w-full border border-slate-200 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors min-h-[100px] resize-y shadow-sm placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* STATUS & ID */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                                Status
                            </label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm bg-white"
                            >
                                <option value="submitted">Submitted</option>
                                <option value="in_review">In Review</option>
                                <option value="in_progress">In Progress</option>
                                <option value="deployed">Deployed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                                Booking ID (Auto if blank)
                            </label>
                            <input
                                type="text"
                                value={form.custom_booking_id}
                                onChange={(e) => setForm(f => ({ ...f, custom_booking_id: e.target.value }))}
                                placeholder="BOOK-XXXX"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="flex items-center gap-4 py-1">
                        <div className="px-3 py-1.5 bg-amber-50 rounded-lg shrink-0">
                            <span className="text-[11px] font-bold tracking-widest text-amber-600 uppercase">{getLineDividerLabel()}</span>
                        </div>
                        <div className="h-px bg-slate-100 flex-1" />
                    </div>

                    {/* SUBSCRIPTION ADD-ONS */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-4">
                            Subscription Add-ons (Optional)
                        </label>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                                    Extra Automations
                                </label>
                                <input
                                    type="number"
                                    value={form.extra_automations}
                                    onChange={(e) => setForm(f => ({ ...f, extra_automations: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                                    Extra Co-work Agents
                                </label>
                                <input
                                    type="number"
                                    value={form.extra_cowork_agents}
                                    onChange={(e) => setForm(f => ({ ...f, extra_cowork_agents: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                                    Extra Custom Apps
                                </label>
                                <input
                                    type="number"
                                    value={form.extra_custom_apps}
                                    onChange={(e) => setForm(f => ({ ...f, extra_custom_apps: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                                    Free Impl. Hours
                                </label>
                                <input
                                    type="number"
                                    value={form.free_impl_hours}
                                    onChange={(e) => setForm(f => ({ ...f, free_impl_hours: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* NOTES TO CUSTOMER */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                            Note to Customer
                        </label>
                        <input
                            type="text"
                            value={form.note_to_customer}
                            onChange={(e) => setForm(f => ({ ...f, note_to_customer: e.target.value }))}
                            placeholder="e.g. Complimentary extra automation included"
                            className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm placeholder:text-slate-400"
                        />
                    </div>

                    {/* TIMELINE */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                                Setup Days
                            </label>
                            <input
                                type="number"
                                value={form.timeline_setup_days}
                                onChange={(e) => setForm(f => ({ ...f, timeline_setup_days: e.target.value }))}
                                placeholder="e.g. 7"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                                Deploy Date
                            </label>
                            <input
                                type="date"
                                value={form.deployment_date}
                                onChange={(e) => setForm(f => ({ ...f, deployment_date: e.target.value }))}
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm bg-white"
                            />
                        </div>
                    </div>

                    {/* ADMIN NOTES */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                            Admin Notes (Internal)
                        </label>
                        <textarea
                            value={form.admin_notes}
                            onChange={(e) => setForm(f => ({ ...f, admin_notes: e.target.value }))}
                            placeholder="Notes for the IBA team only..."
                            className="w-full border border-slate-100 bg-slate-50 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] focus:bg-white transition-colors min-h-[100px] resize-y shadow-inner placeholder:text-slate-400"
                        />
                    </div>

                    {/* NOTIFY CUSTOMER */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2.5">
                            Notify Customer
                        </label>
                        <textarea
                            value={form.notify_message}
                            onChange={(e) => setForm(f => ({ ...f, notify_message: e.target.value }))}
                            placeholder="Message sent to customer on booking creation..."
                            className="w-full border border-slate-200 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors min-h-[100px] resize-y shadow-sm placeholder:text-slate-400"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 bg-white flex items-center gap-3 shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
                    <button
                        onClick={handleCreate}
                        disabled={saving || !form.client_id || !form.title}
                        className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white font-bold py-3 px-7 rounded-xl text-[14px] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[160px]"
                    >
                        {saving ? 'Creating...' : 'Create Booking'}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold py-3 px-6 rounded-xl text-[14px] transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
