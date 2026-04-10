'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';
import { useScrollLock } from '../lib/useScrollLock';

export function ReviewBookingPanel({ 
    bookingId, 
    onClose, 
    onUpdated 
}: { 
    bookingId: string; 
    onClose: () => void; 
    onUpdated?: () => void; 
}) {
    const [booking, setBooking] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sending, setSending] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);
    const [visible, setVisible] = useState(false);

    // Form fields
    const [form, setForm] = useState({
        status: '',
        title: '',
        use_case: '',
        timeline_setup_days: '',
        deployment_date: '',
        tools_list: '',
        schedule_frequency: '',
        admin_notes: '',
        quick_message: '',
    });

    // Trigger slide-in animation
    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    // Lock background scroll
    useScrollLock();

    useEffect(() => {
        const loadBooking = async () => {
            try {
                const b = await adminFetch<any>(`/bookings/${bookingId}`);
                setBooking(b);
                setForm({
                    status: b.status || 'submitted',
                    title: b.title || '',
                    use_case: b.use_case || '',
                    timeline_setup_days: b.timeline_setup_days?.toString() || '',
                    deployment_date: b.deployment_date ? new Date(b.deployment_date).toISOString().split('T')[0] : '',
                    tools_list: b.tools_list ? (Array.isArray(b.tools_list) ? b.tools_list.join(', ') : b.tools_list) : '',
                    schedule_frequency: b.schedule_frequency || '',
                    admin_notes: b.admin_notes || '',
                    quick_message: '',
                });

                // Load thread messages
                const threadRes = await adminFetch<any>(`/bookings/${bookingId}/thread`);
                if (threadRes?.data?.messages) {
                    setMessages(threadRes.data.messages);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadBooking();
    }, [bookingId]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 280);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSending(true);
        try {
            const up = await adminUploadFile(file);
            await adminFetch(`/bookings/${bookingId}/message`, {
                method: 'POST',
                body: JSON.stringify({ attachment_url: up.url, attachment_name: up.name }),
            });
            // Refresh messages
            const threadRes = await adminFetch<any>(`/bookings/${bookingId}/thread`);
            if (threadRes?.data?.messages) {
                setMessages(threadRes.data.messages);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to upload file');
        } finally {
            setSending(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminFetch(`/bookings/${bookingId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: form.status,
                    title: form.title,
                    use_case: form.use_case,
                    timeline_setup_days: parseInt(form.timeline_setup_days) || undefined,
                    deployment_date: form.deployment_date || undefined,
                    tools_list: form.tools_list,
                    schedule_frequency: form.schedule_frequency,
                    admin_notes: form.admin_notes,
                })
            });
            onUpdated?.();
            handleClose();
        } catch (err) {
            console.error(err);
            alert('Failed to update booking');
        } finally {
            setSaving(false);
        }
    };

    const handleSendMessage = async () => {
        if (!form.quick_message.trim()) return;
        setSending(true);
        const body = form.quick_message;
        setForm(f => ({ ...f, quick_message: '' }));

        try {
            const res = await adminFetch<any>(`/bookings/${bookingId}/message`, {
                method: 'POST',
                body: JSON.stringify({ message: body }),
            });
            
            if (res?.data) {
                setMessages(prev => [...prev, res.data]);
            }
        } catch {
            alert('Failed to send message');
            setForm(f => ({ ...f, quick_message: body }));
        } finally {
            setSending(false);
        }
    };

    const handleCancelBooking = async () => {
        setCancelling(true);
        try {
            await adminFetch(`/bookings/${bookingId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'cancelled' }),
            });
            onUpdated?.();
            handleClose();
        } catch {
            alert('Failed to cancel booking');
        } finally {
            setCancelling(false);
        }
    };

    // Format booking ID like #BOOK-2051
    const formatBookingId = (id: string) => {
        if (!id) return '';
        // If it already looks like a number, format it as BOOK-XXXX
        const numPart = id.replace(/\D/g, '').slice(-4).padStart(4, '0');
        return `#BOOK-${numPart}`;
    };

    const serviceTypeLabel = (type: string) => {
        const map: Record<string, string> = {
            automation: 'AI Automation & Agents',
            custom_app: 'AI Custom App',
            cowork: 'AI Co-Work',
            implementation: 'Implementation',
        };
        return map[type?.toLowerCase()] || type;
    };

    const panelClass = `relative bg-white w-full max-w-[600px] h-dvh shadow-2xl flex flex-col overflow-hidden panel-slide-in ${visible ? 'panel-slide-in--visible' : ''}`;

    if (loading || !booking) {
        return (
            <div
            className="fixed inset-0 z-[99999] flex justify-end"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
        >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
            <div className={panelClass}>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#4a8df8] rounded-full animate-spin" />
                            <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-[99999] flex justify-end"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={panelClass}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between shrink-0 bg-white">
                    <div>
                        <h2 className="text-[20px] font-bold text-slate-800 tracking-tight leading-tight">
                            {booking.title || 'Untitled Booking'}
                        </h2>
                        <p className="text-[12px] text-slate-400 font-semibold font-mono mt-1 tracking-wider">
                            {formatBookingId(booking.id)}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-md flex items-center justify-center transition-colors mt-0.5 shrink-0"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 bg-white">

                    {/* STATUS & TIMELINE */}
                    <div className="space-y-6">
                        <div className="mb-6"><SectionDivider title="Status & Timeline" /></div>
                        <div className="grid grid-cols-2 gap-y-7 gap-x-5">
                            <div>
                                <label className="field-label">Current Status</label>
                                <div className="relative">
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-lg py-3 px-3.5 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] shadow-sm appearance-none bg-white transition-colors"
                                    >
                                        <option value="submitted">Submitted</option>
                                        <option value="in_review">In Review</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="deployed">Deployed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="field-label">Service Type</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={serviceTypeLabel(booking.type)}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-3.5 text-[14px] font-medium text-slate-500 bg-slate-50 shadow-sm outline-none cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="field-label">Setup Days</label>
                                <input
                                    type="text"
                                    value={form.timeline_setup_days}
                                    onChange={(e) => setForm(f => ({ ...f, timeline_setup_days: e.target.value }))}
                                    placeholder="e.g. 7"
                                    className="w-full border border-slate-200 rounded-lg py-3 px-3.5 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors placeholder:text-slate-400 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="field-label">Deployment Date</label>
                                <input
                                    type="date"
                                    value={form.deployment_date}
                                    onChange={(e) => setForm(f => ({ ...f, deployment_date: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-3.5 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* BOOKING SUMMARY */}
                    <div className="space-y-6">
                        <div className="mb-6"><SectionDivider title="Booking Summary" /></div>
                        <div>
                            <label className="field-label">Customer</label>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="w-8 h-8 rounded-full bg-[#00c2ff]/10 text-[#00c2ff] flex items-center justify-center text-xs font-bold shrink-0">
                                    {booking.client?.first_name?.[0]}{booking.client?.last_name?.[0]}
                                </div>
                                <span className="text-[15px] font-bold text-slate-800">
                                    {booking.client?.first_name} {booking.client?.last_name}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="field-label">Service / Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                                className="w-full border border-slate-200 rounded-lg py-3 px-3.5 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="field-label">Use Case Description</label>
                            <textarea
                                value={form.use_case}
                                onChange={(e) => setForm(f => ({ ...f, use_case: e.target.value }))}
                                className="w-full border border-slate-200 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors min-h-[90px] resize-y shadow-sm leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* TOOLS / INTEGRATIONS */}
                    <div className="space-y-6">
                        <div className="mb-6"><SectionDivider title="Tools / Integrations" /></div>
                        <input
                            type="text"
                            value={form.tools_list}
                            onChange={(e) => setForm(f => ({ ...f, tools_list: e.target.value }))}
                            placeholder="e.g. HubSpot, Clearbit, LinkedIn API"
                            className="w-full border border-slate-200 rounded-lg py-3 px-3.5 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm placeholder:text-slate-400"
                        />
                    </div>

                    {/* SCHEDULE */}
                    <div className="space-y-6">
                        <div className="mb-6"><SectionDivider title="Schedule" /></div>
                        <input
                            type="text"
                            value={form.schedule_frequency}
                            onChange={(e) => setForm(f => ({ ...f, schedule_frequency: e.target.value }))}
                            placeholder="e.g. Real-time on new lead"
                            className="w-full border border-slate-200 rounded-lg py-3 px-3.5 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors shadow-sm placeholder:text-slate-400"
                        />
                    </div>

                    {/* ADMIN NOTES */}
                    <div className="space-y-6">
                        <div className="mb-6"><SectionDivider title="Admin Notes" /></div>
                        <textarea
                            value={form.admin_notes}
                            onChange={(e) => setForm(f => ({ ...f, admin_notes: e.target.value }))}
                            placeholder="Internal notes visible only to the IBA team..."
                            className="w-full border border-slate-200 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors min-h-[90px] resize-y shadow-sm placeholder:text-slate-400"
                        />
                    </div>

                    {/* BOOKING CHAT (Successor to Quick Message) */}
                    <div className="space-y-6">
                        <div className="mb-2"><SectionDivider title="Booking Conversation" /></div>
                        
                        {/* Messages Area */}
                        <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4 max-h-[400px] overflow-y-auto flex flex-col gap-4">
                            {messages.length === 0 ? (
                                <div className="py-8 text-center text-slate-400 text-[13px] font-medium italic">
                                    No messages yet. Send your first message below.
                                </div>
                            ) : (
                                messages.map((m: any) => {
                                    const isAdmin = m.sender_type === 'admin';
                                    return (
                                        <div key={m.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-[13px] font-medium leading-relaxed ${
                                                isAdmin 
                                                    ? 'bg-[#4a8df8] text-white rounded-tr-sm shadow-sm' 
                                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                                            }`}>
                                                {m.body}
                                                {m.attachment_url && (
                                                    <div className={`mt-2 pt-2 border-t ${isAdmin ? 'border-white/10' : 'border-slate-100'}`}>
                                                        <a href={m.attachment_url} target="_blank" rel="noopener noreferrer" className={`text-[11px] font-bold underline ${isAdmin ? 'text-white' : 'text-blue-500'}`}>
                                                            📎 {m.attachment_name || 'Attachment'}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold mt-1 px-1 opacity-70">
                                                {isAdmin ? 'IBA Admin' : (booking.client?.first_name || 'Client')} · {new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="space-y-3">
                            <textarea
                                value={form.quick_message}
                                onChange={(e) => setForm(f => ({ ...f, quick_message: e.target.value }))}
                                onKeyDown={(e) => {
                                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Send a message to the customer about this booking..."
                                className="w-full border border-slate-200 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-colors min-h-[90px] resize-none shadow-sm mb-1 placeholder:text-slate-400"
                            />
                            <div className="flex items-center justify-between">
                                <input type="file" id="booking-chat-upload" className="hidden" onChange={handleFileUpload} />
                                <button 
                                    onClick={() => document.getElementById('booking-chat-upload')?.click()}
                                    className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-full text-[11px] font-bold text-slate-500 hover:bg-slate-50 transition-colors bg-white shadow-sm disabled:opacity-50"
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                    Attach File
                                </button>
                                <span className="text-[11px] text-slate-400 font-medium italic">Sent instantly to customer (Ctrl+Enter to send)</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer — always pinned, never scrolls */}
                <div className="px-8 pt-5 pb-8 border-t-2 border-slate-100 bg-white flex items-center justify-between shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white font-bold py-2.5 px-5 rounded-lg text-[13px] transition-colors shadow-sm disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleSendMessage}
                            disabled={sending || !form.quick_message.trim()}
                            className="bg-white border border-slate-200 text-slate-600 hover:text-slate-800 font-bold py-2.5 px-5 rounded-lg text-[13px] hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40"
                        >
                            {sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>

                    {confirmCancel ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[12px] text-slate-500 font-medium">Sure?</span>
                            <button
                                onClick={handleCancelBooking}
                                disabled={cancelling}
                                className="text-[12px] font-bold text-rose-600 hover:text-rose-700 transition-colors disabled:opacity-50"
                            >
                                {cancelling ? 'Cancelling...' : 'Yes, cancel'}
                            </button>
                            <button
                                onClick={() => setConfirmCancel(false)}
                                className="text-[12px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                No
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirmCancel(true)}
                            className="text-rose-500 hover:text-rose-600 border border-rose-100 hover:border-rose-200 bg-rose-50 hover:bg-rose-100 font-bold py-2.5 px-4 rounded-lg text-[13px] transition-colors"
                        >
                            Cancel Booking
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function SectionDivider({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-4">
            <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase shrink-0">{title}</h3>
            <div className="h-px bg-slate-100 flex-1" />
        </div>
    );
}
