'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '../lib/api';

export function ModalBackdrop({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[600px] flex flex-col md:max-h-[90vh] lg:max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
                {children}
            </div>
        </div>
    );
}

export function DeleteConfirmationModal({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Delete",
    isDeleting = false
}: {
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel: () => void,
    confirmText?: string,
    isDeleting?: boolean
}) {
    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onCancel}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px] p-6 animate-in zoom-in-95 duration-200 text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
                </div>
                <h3 className="text-[20px] font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-[14px] font-medium text-slate-500 leading-relaxed mb-6 px-4">
                    {message}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl text-[14px] hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl text-[14px] hover:bg-rose-600 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isDeleting && <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AutomationTemplateModal({
    onClose,
    onSave,
    initialData
}: {
    onClose: () => void,
    onSave?: (data: any) => void,
    initialData?: any
}) {
    const [visible, setVisible] = useState(false);
    const [form, setForm] = useState({
        id: initialData?.id,
        title: initialData?.title || '',
        type: initialData?.type || '',
        short_description: initialData?.short_description || '',
        full_description: initialData?.full_description || '',
        use_case: initialData?.use_case || '',
        time_saved_weekly: initialData?.time_saved_weekly || '',
        time_saved_yearly: initialData?.time_saved_yearly || '',
        roi_yearly: initialData?.roi_yearly || '',
        setup_time: initialData?.setup_time || '',
        difficulty: initialData?.difficulty || 'Easy',
        tools: initialData?.tools || '',
        run_schedule: initialData?.run_schedule || '',
        is_published: initialData?.is_published ?? true,
        display_order: initialData?.display_order || 10
    });

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSave = () => {
        if (onSave) onSave(form);
        handleClose();
    };

    const panelClass = `relative w-full max-w-[650px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`;

    return (
        <div className="fixed inset-0 z-[99999] flex justify-end">
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />

            <div className={panelClass}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between shrink-0">
                    <div>
                        <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">{initialData ? 'Edit Template' : 'New Template'}</h2>
                        <p className="text-[13px] text-slate-500 font-medium mt-1">Fill in the details below</p>
                    </div>
                    <button onClick={handleClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '32px', overflowY: 'auto', flex: 1, paddingBottom: '64px' }}>

                    {/* IDENTITY */}
                    <div style={{ paddingTop: '8px' }}>
                        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase" style={{ marginBottom: '16px' }}>Identity</div>

                        <div className="grid grid-cols-2 gap-5" style={{ marginBottom: '18px' }}>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Template Name *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. Lead Enrichment Pipeline"
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm placeholder:text-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Category *</label>
                                <select
                                    value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm bg-white"
                                >
                                    <option value="">— Select —</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Content">Content</option>
                                    <option value="Reporting">Reporting</option>
                                    <option value="Security">Security</option>
                                    <option value="HR">HR</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Short Description *</label>
                            <input
                                type="text"
                                value={form.short_description}
                                onChange={e => setForm({ ...form, short_description: e.target.value })}
                                placeholder="One-line description shown on the template card"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm placeholder:text-slate-400"
                            />
                        </div>

                        <div style={{ marginBottom: '0' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Full Description (Shown in Popup)</label>
                            <textarea
                                value={form.full_description}
                                onChange={e => setForm({ ...form, full_description: e.target.value })}
                                placeholder="Detailed description shown when customer clicks View Details..."
                                className="w-full border border-slate-200 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors min-h-[100px] shadow-sm placeholder:text-slate-400 resize-y"
                            />
                        </div>
                    </div>

                    {/* USE CASE */}
                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase" style={{ marginBottom: '16px' }}>Use Case Text</div>

                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Use Case (Auto-fills Customer Booking Form)</label>
                            <textarea
                                value={form.use_case}
                                onChange={e => setForm({ ...form, use_case: e.target.value })}
                                placeholder="The full use case that will be injected into the customer's booking form..."
                                className="w-full border border-slate-200 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors min-h-[120px] shadow-sm placeholder:text-slate-400 resize-y"
                            />
                        </div>
                    </div>

                    {/* STATS & ROI */}
                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase" style={{ marginBottom: '16px' }}>Stats & ROI</div>

                        <div className="grid grid-cols-2 gap-5" style={{ marginBottom: '18px' }}>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Time Saved (Weekly)</label>
                                <input
                                    type="text"
                                    value={form.time_saved_weekly}
                                    onChange={e => setForm({ ...form, time_saved_weekly: e.target.value })}
                                    placeholder="e.g. 5 hrs / week"
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Time Saved (Yearly)</label>
                                <input
                                    type="text"
                                    value={form.time_saved_yearly}
                                    onChange={e => setForm({ ...form, time_saved_yearly: e.target.value })}
                                    placeholder="e.g. 260 hrs / year"
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5" style={{ marginBottom: '18px' }}>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>ROI Expected (Yearly)</label>
                                <input
                                    type="text"
                                    value={form.roi_yearly}
                                    onChange={e => setForm({ ...form, roi_yearly: e.target.value })}
                                    placeholder="e.g. $2,400 / year"
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Setup Time</label>
                                <input
                                    type="text"
                                    value={form.setup_time}
                                    onChange={e => setForm({ ...form, setup_time: e.target.value })}
                                    placeholder="e.g. 3-5 days"
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Difficulty</label>
                            <select
                                value={form.difficulty}
                                onChange={e => setForm({ ...form, difficulty: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm bg-white"
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* TOOLS & SCHEDULE */}
                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase" style={{ marginBottom: '16px' }}>Tools & Schedule</div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Tools / Integrations (Comma-separated)</label>
                            <input
                                type="text"
                                value={form.tools}
                                onChange={e => setForm({ ...form, tools: e.target.value })}
                                placeholder="e.g. HubSpot, Clearbit, LinkedIn API, OpenAI GPT-4"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Run Schedule</label>
                            <input
                                type="text"
                                value={form.run_schedule}
                                onChange={e => setForm({ ...form, run_schedule: e.target.value })}
                                placeholder="e.g. Real-time on new lead"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm"
                            />
                        </div>
                    </div>

                    {/* PUBLISHING */}
                    <div style={{ marginTop: '24px', paddingTop: '20px', paddingBottom: '32px', borderTop: '1px solid #f1f5f9' }}>
                        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase" style={{ marginBottom: '16px' }}>Publishing</div>

                        <div
                            className={`border rounded-xl p-5 flex items-start gap-5 transition-all cursor-pointer ${form.is_published ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/50'}`}
                            onClick={() => setForm({ ...form, is_published: !form.is_published })}
                            style={{ marginBottom: '18px' }}
                        >
                            <div className="mt-1">
                                <div className={`w-12 h-6 rounded-full transition-colors relative ${form.is_published ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.is_published ? 'right-1' : 'left-1'}`}></div>
                                </div>
                            </div>
                            <div>
                                <div className="text-[15px] font-bold text-slate-800">{form.is_published ? 'Published — visible to customers' : 'Draft — hidden from customers'}</div>
                                <div className="text-[13px] text-slate-500 font-medium mt-0.5">Toggle to control visibility on the customer dashboard</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase" style={{ marginBottom: '8px' }}>Display Order (Lower = Appears First)</label>
                            <input
                                type="number"
                                value={form.display_order}
                                onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] transition-colors shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center gap-4 shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
                    <button onClick={handleSave} className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white font-bold py-2.5 px-6 rounded-full text-[14px] transition-colors shadow-sm flex items-center justify-center min-w-[150px]">
                        Save & Publish
                    </button>
                    <button onClick={handleClose} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold py-2.5 px-6 rounded-full text-[14px] transition-colors shadow-sm min-w-[100px]">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ChatClientModal({ onClose }: { onClose: () => void }) {
    return (
        <ModalBackdrop onClose={onClose}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-[18px] font-bold text-slate-800">New Chat Client</h2>
                <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-start">
                        <span className="pr-3 bg-white text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Identity</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Client Name *</label>
                        <input type="text" placeholder="e.g. Claude" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Provider</label>
                        <input type="text" placeholder="e.g. Anthropic" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Tagline / Best For</label>
                    <input type="text" placeholder="e.g. Best for document analysis, reasoning & long-context workflows" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Logo / Icon</label>
                    <div className="border border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-[#f8fafc]/50 mb-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </div>
                        <div className="text-[14px] font-bold text-slate-800 mb-1">Click to upload logo</div>
                        <div className="text-[12px] font-medium text-slate-400">PNG, JPG, SVG, WebP · Max 2MB · Recommended 64×64px</div>
                    </div>

                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-[12px] font-medium text-[#64748b]">or use emoji instead</span>
                        </div>
                    </div>

                    <input type="text" placeholder="e.g. 🤖 (used if no logo uploaded)" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Background Color <span className="text-slate-400 normal-case tracking-normal">(Used behind emoji / as fallback)</span></label>
                    <div className="flex gap-3">
                        <input type="text" defaultValue="#4a7bff" className="flex-1 border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors" />
                        <div className="w-12 rounded-lg bg-[#4a7bff] shrink-0 border border-slate-200 shadow-inner"></div>
                    </div>
                </div>

                <div className="relative pt-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-start">
                        <span className="pr-3 bg-white text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Publishing</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Display Order</label>
                        <input type="number" defaultValue="5" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Status</label>
                        <select className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors bg-white">
                            <option>Published</option>
                            <option>Draft</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-100 bg-white rounded-b-xl flex justify-between shrink-0">
                <div className="flex gap-3">
                    <button className="bg-[#3b82f6] text-white font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-blue-600 transition-colors shadow-sm">
                        Save Client
                    </button>
                    <button onClick={onClose} className="bg-white border border-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-slate-50 transition-colors shadow-sm">
                        Cancel
                    </button>
                </div>
                <button className="bg-rose-50 border border-slate-100 text-rose-500 font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-rose-100 transition-colors">
                    Delete
                </button>
            </div>
        </ModalBackdrop>
    );
}

export function ToolModal({ onClose }: { onClose: () => void }) {
    return (
        <ModalBackdrop onClose={onClose}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-[18px] font-bold text-slate-800">New Tool</h2>
                <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-start">
                        <span className="pr-3 bg-white text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Tool Details</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Tool Name *</label>
                        <input type="text" placeholder="e.g. Gmail" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Category *</label>
                        <select className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors bg-white">
                            <option>— Select —</option>
                            <option>Communication & Email</option>
                            <option>Productivity & Projects</option>
                            <option>CRM & Sales</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Logo / Icon</label>
                    <div className="border border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-[#f8fafc]/50 mb-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </div>
                        <div className="text-[14px] font-bold text-slate-800 mb-1">Click to upload logo</div>
                        <div className="text-[12px] font-medium text-slate-400">PNG, JPG, SVG, WebP · Max 2MB · Recommended 64×64px</div>
                    </div>

                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-[12px] font-medium text-[#64748b]">or use emoji instead</span>
                        </div>
                    </div>

                    <input type="text" placeholder="e.g. 📧 (used if no logo uploaded)" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Background Color <span className="text-slate-400 normal-case tracking-normal">(Used behind emoji / as fallback)</span></label>
                    <div className="flex gap-3">
                        <input type="text" defaultValue="#4a7bff" className="flex-1 border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors" />
                        <div className="w-12 rounded-lg bg-[#4a7bff] shrink-0 border border-slate-200 shadow-inner"></div>
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Description (Optional)</label>
                    <input type="text" placeholder="Short description of what this tool does" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Display Order</label>
                        <input type="number" defaultValue="10" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Status</label>
                        <select className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors bg-white">
                            <option>Published</option>
                            <option>Draft</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-100 bg-white rounded-b-xl flex justify-between shrink-0">
                <div className="flex gap-3">
                    <button className="bg-[#3b82f6] text-white font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-blue-600 transition-colors shadow-sm">
                        Save Tool
                    </button>
                    <button onClick={onClose} className="bg-white border border-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-slate-50 transition-colors shadow-sm">
                        Cancel
                    </button>
                </div>
                <button className="bg-rose-50 border border-slate-100 text-rose-500 font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-rose-100 transition-colors">
                    Delete
                </button>
            </div>
        </ModalBackdrop>
    );
}

export function AppTemplateModal({
    onClose,
    onSave,
    onDelete,
    initialData
}: {
    onClose: () => void,
    onSave?: (data: any) => void,
    onDelete?: (id: string) => void,
    initialData?: any
}) {
    const [visible, setVisible] = useState(false);
    const [form, setForm] = useState({
        id: initialData?.id,
        title: initialData?.title || '',
        category: initialData?.category || '',
        icon: initialData?.icon || '',
        short_description: initialData?.short_description || '',
        full_description: initialData?.full_description || '',
        use_case: initialData?.use_case || '',
        roi_yearly: initialData?.roi_yearly || '',
        delivery_time: initialData?.delivery_time || '',
        app_type: initialData?.app_type || 'Web App (React)',
        difficulty: initialData?.difficulty || 'Easy',
        key_features: initialData?.key_features || '',
        data_sources: initialData?.data_sources || '',
        best_for: initialData?.best_for || '',
        is_published: initialData?.is_published ?? true,
        display_order: initialData?.display_order || 4
    });

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSave = (publishedOverride?: boolean) => {
        const finalForm = { ...form };
        if (typeof publishedOverride === 'boolean') {
            finalForm.is_published = publishedOverride;
        }
        if (onSave) onSave(finalForm);
        handleClose();
    };

    const panelClass = `relative w-full max-w-[650px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`;

    return (
        <div className="fixed inset-0 z-[99999] flex justify-end">
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />

            <div className={panelClass}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">{initialData ? 'Edit App Template' : 'New App Template'}</h2>
                    <button onClick={handleClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>

                    {/* IDENTITY */}
                    <div>
                        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase border-b border-slate-100" style={{ marginBottom: '18px', paddingBottom: '8px' }}>Identity</div>

                        <div className="grid grid-cols-2 gap-5" style={{ marginBottom: '18px' }}>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>App Name *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. Client Portal"
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Category</label>
                                <input
                                    type="text"
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    placeholder="e.g. Business Operations"
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Icon (Emoji)</label>
                            <input
                                type="text"
                                value={form.icon}
                                onChange={e => setForm({ ...form, icon: e.target.value })}
                                placeholder="e.g. 🤝"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                            />
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Short Tagline</label>
                            <input
                                type="text"
                                value={form.short_description}
                                onChange={e => setForm({ ...form, short_description: e.target.value })}
                                placeholder="e.g. Manage tasks, share files, track invoices"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                            />
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Full Description</label>
                            <textarea
                                value={form.full_description}
                                onChange={e => setForm({ ...form, full_description: e.target.value })}
                                placeholder="Shown in the popup modal when customer clicks View Details..."
                                className="w-full border border-slate-200 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors min-h-[100px] placeholder:text-slate-400 resize-y"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Use Case (Auto-fills Booking Form)</label>
                            <textarea
                                value={form.use_case}
                                onChange={e => setForm({ ...form, use_case: e.target.value })}
                                placeholder="The text injected into the customer booking form when they click Build This App..."
                                className="w-full border border-slate-200 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors min-h-[120px] placeholder:text-slate-400 resize-y"
                            />
                        </div>
                    </div>

                    {/* STATS */}
                    <div style={{ marginTop: '32px' }}>
                        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase border-b border-slate-100" style={{ marginBottom: '18px', paddingBottom: '8px' }}>Stats</div>

                        <div className="grid grid-cols-2 gap-5" style={{ marginBottom: '18px' }}>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>ROI Expected / Year</label>
                                <input
                                    type="text"
                                    value={form.roi_yearly}
                                    onChange={e => setForm({ ...form, roi_yearly: e.target.value })}
                                    placeholder="e.g. $6,000 / year"
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Delivery Time</label>
                                <input
                                    type="text"
                                    value={form.delivery_time}
                                    onChange={e => setForm({ ...form, delivery_time: e.target.value })}
                                    placeholder="e.g. 10–14 days"
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5" style={{ marginBottom: '18px' }}>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>App Type</label>
                                <select
                                    value={form.app_type}
                                    onChange={e => setForm({ ...form, app_type: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors bg-white"
                                >
                                    <option>Web App (React)</option>
                                    <option>Web App + Mobile View</option>
                                    <option>Mobile App</option>
                                    <option>Internal Dashboard</option>
                                    <option>API / Backend only</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Complexity</label>
                                <select
                                    value={form.difficulty}
                                    onChange={e => setForm({ ...form, difficulty: e.target.value })}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors bg-white"
                                >
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Key Features (One per line)</label>
                            <textarea
                                value={form.key_features}
                                onChange={e => setForm({ ...form, key_features: e.target.value })}
                                placeholder={"Project & task tracker\nFile sharing & approvals\nInvoice & payment history"}
                                className="w-full border border-slate-200 rounded-lg py-3.5 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors min-h-[100px] placeholder:text-slate-400 resize-y"
                            />
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Compatible Data Sources (Comma-separated)</label>
                            <input
                                type="text"
                                value={form.data_sources}
                                onChange={e => setForm({ ...form, data_sources: e.target.value })}
                                placeholder="e.g. Airtable, Notion, Stripe, HubSpot"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                            />
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Best For</label>
                            <input
                                type="text"
                                value={form.best_for}
                                onChange={e => setForm({ ...form, best_for: e.target.value })}
                                placeholder="e.g. Agencies, consultants, service businesses"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Display Order</label>
                                <input
                                    type="number"
                                    value={form.display_order}
                                    onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Status</label>
                                <select
                                    value={form.is_published ? "Published" : "Draft"}
                                    onChange={e => setForm({ ...form, is_published: e.target.value === "Published" })}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors bg-white"
                                >
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
                    <div className="flex gap-4">
                        <button onClick={() => handleSave(true)} className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white font-bold py-3 px-6 rounded-lg text-[14px] transition-colors shadow-sm">
                            Save & Publish
                        </button>
                        <button onClick={() => handleSave(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold py-3 px-6 rounded-lg text-[14px] transition-colors shadow-sm">
                            Save as Draft
                        </button>
                    </div>
                    {initialData?.id && (
                        <button onClick={() => { if (onDelete) onDelete(initialData.id); handleClose(); }} className="bg-rose-100/50 hover:bg-rose-100 text-rose-500 font-bold py-3 px-6 rounded-lg text-[14px] transition-colors">
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function AiExampleModal({
    onClose,
    onSave,
    onDelete,
    initialData
}: {
    onClose: () => void,
    onSave?: (data: any) => void,
    onDelete?: (id: string) => void,
    initialData?: any
}) {
    const [visible, setVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        id: initialData?.id,
        title: initialData?.title || '',
        description: initialData?.description || '',
        icon_url: initialData?.icon_url || '',
        icon_emoji: initialData?.icon_emoji || '',
        is_published: initialData?.is_published ?? true,
        display_order: initialData?.display_order || 7
    });

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const { adminUploadFile } = await import('../lib/api');
            const res = await adminUploadFile(file);
            setForm(prev => ({ ...prev, icon_url: res.url, icon_emoji: '' }));
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = () => {
        if (onSave) onSave(form);
        handleClose();
    };

    const panelClass = `relative w-full max-w-[650px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`;

    return (
        <div className="fixed inset-0 z-[99999] flex justify-end">
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />

            <div className={panelClass}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">{initialData ? 'Edit Example' : 'New Example'}</h2>
                    <button onClick={handleClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>

                    {/* DETAILS */}
                    <div>
                        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase border-b border-slate-100" style={{ marginBottom: '18px', paddingBottom: '8px' }}>Example Details</div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Custom AI Sales Assistant"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                            />
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Description *</label>
                            <input
                                type="text"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="e.g. Built around your specific products & pricing logic"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* ICON */}
                    <div style={{ marginTop: '32px' }}>
                        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase border-b border-slate-100" style={{ marginBottom: '18px', paddingBottom: '8px' }}>Icon</div>

                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '12px' }}>Logo / Image</label>
                        <div className="flex items-center gap-6" style={{ marginBottom: '24px' }}>
                            <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative group">
                                {form.icon_url ? (
                                    <img src={form.icon_url} alt="Icon" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                )}
                                {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-[#4a8df8] border-t-transparent rounded-full animate-spin"></div></div>}
                            </div>
                            <div className="flex-1">
                                <label className="inline-block px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-all shadow-sm">
                                    {uploading ? 'Uploading...' : 'Upload icon or image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                </label>
                                <p className="text-[11px] text-slate-400 mt-2 font-medium">PNG, JPG, SVG · Max 2MB</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
                            <div className="h-[1px] bg-slate-100 flex-1"></div>
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">or use emoji</span>
                            <div className="h-[1px] bg-slate-100 flex-1"></div>
                        </div>

                        <div>
                            <input
                                type="text"
                                value={form.icon_emoji}
                                onChange={e => setForm({ ...form, icon_emoji: e.target.value, icon_url: '' })}
                                placeholder="e.g. 🤖"
                                className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* PUBLISHING */}
                    <div style={{ marginTop: '32px' }}>
                        <div className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase border-b border-slate-100" style={{ marginBottom: '18px', paddingBottom: '8px' }}>Publishing</div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Display Order</label>
                                <input
                                    type="number"
                                    value={form.display_order}
                                    onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '8px' }}>Status</label>
                                <select
                                    value={form.is_published ? "Published" : "Draft"}
                                    onChange={e => setForm({ ...form, is_published: e.target.value === "Published" })}
                                    className="w-full border border-slate-200 rounded-lg py-3 px-4 text-[14px] font-medium text-slate-800 outline-none focus:border-[#3b82f6] hover:border-slate-300 transition-colors bg-white"
                                >
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center gap-4 shrink-0">
                    <button onClick={handleSave} className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white font-bold py-3 px-8 rounded-lg text-[14px] transition-colors shadow-sm">
                        Save Example
                    </button>
                    <button onClick={handleClose} className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold py-3 px-8 rounded-lg text-[14px] transition-colors shadow-sm">
                        Cancel
                    </button>
                    {initialData?.id && (
                        <div className="flex-1 flex justify-end">
                            <button onClick={() => { if (onDelete) onDelete(initialData.id); handleClose(); }} className="text-rose-500 hover:text-rose-600 font-bold text-[13px] hover:underline">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ImplementationModal({ onClose }: { onClose: () => void }) {
    return (
        <ModalBackdrop onClose={onClose}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-[18px] font-bold text-slate-800">Implementation Details</h2>
                <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
            </div>
            <div className="p-6">
                <p className="text-slate-500 text-sm">Implementation modal content goes here.</p>
            </div>
        </ModalBackdrop>
    );
}

export function CustomerSegmentModal({
    onClose,
    onSave,
    onDelete,
    initialData
}: {
    onClose: () => void,
    onSave?: (data: any) => void,
    onDelete?: (id: string) => void,
    initialData?: any
}) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [color, setColor] = useState(initialData?.color || '#3b82f6');
    const [rulePlan, setRulePlan] = useState(initialData?.rule_plan || 'Any plan');
    const [ruleStatus, setRuleStatus] = useState(initialData?.rule_status || 'Any status');
    const [ruleBookings, setRuleBookings] = useState(initialData?.rule_bookings_min || '');
    const [ruleJoinedDays, setRuleJoinedDays] = useState(initialData?.rule_joined_days || '');
    const [ruleAutomationPct, setRuleAutomationPct] = useState(initialData?.rule_automation_pct || '');

    const [allCustomers, setAllCustomers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>(
        initialData?.manual_members?.map((m: any) => m.id) || []
    );

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!initialData?.id) return;
        setIsDeleting(true);
        try {
            await adminFetch(`/segments/${initialData.id}`, { method: 'DELETE' });
            if (onDelete) onDelete(initialData.id);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to delete segment');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    useEffect(() => {
        // Fetch everyone so we can select them
        adminFetch<any>('/customers?limit=1000')
            .then(res => {
                // Handle both array response or object with data property
                const list = Array.isArray(res) ? res : (res?.data || []);
                setAllCustomers(list);
            })
            .catch(err => {
                console.error('Failed to fetch customers for segment:', err);
            });
    }, []);

    const toggleMember = (id: string) => {
        setSelectedMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const colors = ['#3b82f6', '#a855f7', '#ef4444', '#10b981', '#f59e0b', '#14b8a6'];

    const handleSave = () => {
        const payload = {
            name, description, color,
            rule_plan: rulePlan,
            rule_status: ruleStatus,
            rule_bookings_min: ruleBookings,
            rule_joined_days: ruleJoinedDays,
            rule_automation_pct: ruleAutomationPct,
            manual_member_ids: selectedMembers
        };
        if (onSave) onSave(payload);
    };

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const panelClass = `relative w-full max-w-[600px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`;

    return (
        <div className="fixed inset-0 z-[99999] flex justify-end">
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />

            <div className={panelClass}>
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <h2 className="text-[18px] font-bold text-slate-800">{initialData ? 'Edit Segment' : 'New Segment'}</h2>
                    <button onClick={handleClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                    {/* Segment Details */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-start">
                            <span className="pr-3 bg-white text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Segment Details</span>
                        </div>
                    </div>

                    <div className="space-y-0">
                        <div style={{ marginBottom: '14px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '2px', marginTop: '3px' }}>Segment Name *</label>
                            <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="e.g. High Value Customers" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '2px', marginTop: '3px' }}>Description</label>
                            <input value={description} onChange={e => setDescription(e.target.value)} type="text" placeholder="What defines this segment?" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '2px', marginTop: '3px' }}>Colour</label>
                            <div className="flex items-center gap-3">
                                {colors.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-110'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Auto-Assignment Rules */}
                    <div className="relative pt-2">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-start">
                            <span className="pr-3 bg-white text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Auto-Assignment Rules</span>
                        </div>
                    </div>

                    <div className="bg-[#f8fafc]/50 border border-slate-100 rounded-xl p-4 text-[13px] font-medium text-slate-500 leading-relaxed shadow-sm">
                        Rules are used to automatically tag customers. Manual assignment is always available on the customer profile.
                    </div>

                    <div className="space-y-0">
                        <div style={{ marginBottom: '14px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '2px', marginTop: '3px' }}>Plan is</label>
                            <select value={rulePlan} onChange={e => setRulePlan(e.target.value)} className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors bg-white">
                                <option>Any plan</option>
                                <option>Basic</option>
                                <option>Pro</option>
                                <option>Enterprise</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '2px', marginTop: '3px' }}>Status is</label>
                            <select value={ruleStatus} onChange={e => setRuleStatus(e.target.value)} className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors bg-white">
                                <option>Any status</option>
                                <option>Active</option>
                                <option>Trial</option>
                                <option>Past Due</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '2px', marginTop: '3px' }}>Bookings count is at least</label>
                            <input value={ruleBookings} onChange={e => setRuleBookings(e.target.value)} type="text" placeholder="e.g. 2 (leave blank to ignore)" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '2px', marginTop: '3px' }}>Joined within last (days)</label>
                            <input value={ruleJoinedDays} onChange={e => setRuleJoinedDays(e.target.value)} type="text" placeholder="e.g. 30 (leave blank to ignore)" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '2px', marginTop: '3px' }}>Automation usage above (%)</label>
                            <input value={ruleAutomationPct} onChange={e => setRuleAutomationPct(e.target.value)} type="text" placeholder="e.g. 70 (leave blank to ignore)" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                        </div>
                    </div>

                    {/* Manual Members */}
                    <div className="relative pt-2">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-start">
                            <span className="pr-3 bg-white text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Manual Members</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase" style={{ marginBottom: '2px', marginTop: '3px' }}>Add specific customers</label>
                        <select
                            className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors bg-white"
                            onChange={(e) => {
                                if (e.target.value) toggleMember(e.target.value);
                                e.target.value = '';
                            }}
                        >
                            <option value="">— Select to add —</option>
                            {allCustomers.filter(c => !selectedMembers.includes(c.id)).map(c => (
                                <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.email})</option>
                            ))}
                        </select>
                        {selectedMembers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {selectedMembers.map(id => {
                                    const c = allCustomers.find(x => x.id === id) || initialData?.manual_members?.find((x: any) => x.id === id);
                                    if (!c) return null;
                                    return (
                                        <div key={id} className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[13px] font-medium shadow-sm transition-colors hover:bg-slate-100">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold mr-1">
                                                {c.first_name?.[0]}{c.last_name?.[0]}
                                            </div>
                                            {c.first_name} {c.last_name}
                                            <button onClick={() => toggleMember(id)} className="text-slate-400 hover:text-rose-500 ml-1 transition-colors">
                                                ×
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-slate-100 bg-white rounded-b-xl flex justify-between shrink-0">
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="bg-[#3b82f6] text-white font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-blue-600 transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                            Save Segment
                        </button>
                        <button onClick={handleClose} className="bg-white border border-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-slate-50 transition-colors shadow-sm">
                            Cancel
                        </button>
                    </div>
                    {initialData && (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-rose-50 border border-slate-100 text-rose-500 font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-rose-100 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {showDeleteConfirm && (
                <DeleteConfirmationModal
                    title="Delete Segment"
                    message={`Are you sure you want to delete "${name}"? This will not delete the customers, only the segment group.`}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}

export function CustomerSegmentViewPanel({
    segment,
    customers,
    onClose
}: {
    segment: any,
    customers: any[],
    onClose: () => void
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const panelClass = `relative w-full max-w-[600px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`;

    return (
        <div className="fixed inset-0 z-[99999] flex justify-end">
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />

            <div className={panelClass}>
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between shrink-0 bg-white">
                    <div>
                        <h2 className="text-[18px] font-bold text-slate-800 flex items-center gap-2">
                            {segment.name} <span className="text-slate-400 font-normal">— Customers</span>
                        </h2>
                        <p className="text-slate-500 text-[13px] font-medium mt-0.5">{customers.length} customers</p>
                    </div>
                    <button onClick={handleClose} className="px-4 py-1.5 border border-slate-200 text-slate-600 font-bold rounded-lg text-[13px] hover:bg-slate-50 transition-colors shadow-sm">
                        Close
                    </button>
                </div>

                <div className="p-0 overflow-y-auto flex-1 bg-white">
                    <table className="w-full text-left bg-white">
                        <thead>
                            <tr>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b border-slate-100">Customer</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b border-slate-100">Plan</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b border-slate-100">All Segments</th>
                                <th className="pt-4 pb-3 px-6 bg-white border-b border-slate-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c, idx) => (
                                <tr key={idx} className="border-b border-slate-50 group hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 ${['bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-emerald-500'][idx % 4]}`}>
                                                {c.first_name?.[0]}{c.last_name?.[0]}
                                            </div>
                                            <div className="text-[14px] font-semibold text-slate-800">{c.first_name} {c.last_name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[12px] font-bold capitalize text-[#00c2ff] bg-blue-50 px-2 py-0.5 rounded-md">{c.subscription?.plan || 'free'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            {/* Since mock, conditionally render pills matching the SS */}
                                            <span className="text-[11px] font-bold text-[#3b82f6] bg-blue-50 px-2 py-0.5 rounded-full">{segment.name}</span>
                                            {idx % 2 === 0 && <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">Power Users</span>}
                                            {idx % 2 !== 0 && <span className="text-[11px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">Enterprise Clients</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white transition-colors bg-slate-50">Open</button>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-[13px] font-medium">
                                        No customers found in this segment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


