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

export function AutomationTemplateModal({ onClose }: { onClose: () => void }) {
    return (
        <ModalBackdrop onClose={onClose}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-[18px] font-bold text-slate-800">New Template</h2>
                    <p className="text-[13px] text-slate-500 font-medium">Fill in the details below</p>
                </div>
                <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Difficulty</label>
                    <select className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors bg-white appearance-none">
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>

                <div className="relative pt-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-start">
                        <span className="pr-3 bg-white text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Tools & Schedule</span>
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Tools / Integrations (Comma-separated)</label>
                    <input type="text" placeholder="e.g. HubSpot, Clearbit, LinkedIn API, OpenAI GPT-4" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Run Schedule</label>
                    <input type="text" placeholder="e.g. Real-time on new lead" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                </div>

                <div className="relative pt-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-start">
                        <span className="pr-3 bg-white text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Publishing</span>
                    </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors bg-[#f8fafc]/50">
                    <div className="mt-0.5">
                        <div className="w-11 h-6 bg-[#10b981] rounded-full p-1 transition-colors relative">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                        </div>
                    </div>
                    <div>
                        <div className="text-[14px] font-bold text-slate-800">Published — visible to customers</div>
                        <div className="text-[13px] text-slate-500 font-medium mt-0.5">Toggle off to save as draft without showing to customers</div>
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Display Order (Lower = appears first)</label>
                    <input type="number" defaultValue="10" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors" />
                </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-100 bg-white rounded-b-xl flex gap-3 shrink-0">
                <button className="bg-[#3b82f6] text-white font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-blue-600 transition-colors shadow-sm">
                    Save & Publish
                </button>
                <button className="bg-white border border-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-slate-50 transition-colors shadow-sm">
                    Save as Draft
                </button>
            </div>
        </ModalBackdrop>
    );
}

export function ChatClientModal({ onClose }: { onClose: () => void }) {
    return (
        <ModalBackdrop onClose={onClose}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-[18px] font-bold text-slate-800">New Chat Client</h2>
                <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
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

export function AppTemplateModal({ onClose }: { onClose: () => void }) {
    return (
        <ModalBackdrop onClose={onClose}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-[18px] font-bold text-slate-800">New App Template</h2>
                <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            
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
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">App Name *</label>
                        <input type="text" placeholder="e.g. Client Portal" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Category</label>
                        <input type="text" placeholder="e.g. Business Operations" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Icon (Emoji)</label>
                    <input type="text" placeholder="e.g. 🤝" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Short Tagline</label>
                    <input type="text" placeholder="e.g. Manage tasks, share files, track invoices" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Full Description</label>
                    <textarea placeholder="Shown in the popup modal when customer clicks View Details..." className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400 min-h-[80px] resize-y"></textarea>
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Use Case (Auto-fills booking form)</label>
                    <textarea placeholder="The text injected into the customer booking form when they click Build This App..." className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400 min-h-[80px] resize-y"></textarea>
                </div>

                <div className="relative pt-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-start">
                        <span className="pr-3 bg-white text-[11px] font-bold tracking-widest text-[#64748b] uppercase">Stats</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">ROI Expected / Year</label>
                        <input type="text" placeholder="e.g. $6,000 / year" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Delivery Time</label>
                        <input type="text" placeholder="e.g. 10–14 days" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">App Type</label>
                        <select className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors bg-white">
                            <option>Web App (React)</option>
                            <option>Mobile App</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Complexity</label>
                        <select className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors bg-white">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-bold tracking-widest text-[#64748b] uppercase mb-2">Key Features (One per line)</label>
                    <textarea placeholder="Project & task tracker&#10;File sharing & approvals" className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-[14px] font-medium text-slate-700 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] hover:border-slate-300 transition-colors placeholder:text-slate-400 min-h-[80px] resize-y"></textarea>
                </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-100 bg-white rounded-b-xl flex justify-between shrink-0">
                <div className="flex gap-3">
                    <button className="bg-[#3b82f6] text-white font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-blue-600 transition-colors shadow-sm">
                        Save & Publish
                    </button>
                    <button onClick={onClose} className="bg-white border border-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-slate-50 transition-colors shadow-sm">
                        Save as Draft
                    </button>
                </div>
                <button className="bg-rose-50 border border-slate-100 text-rose-500 font-bold py-2.5 px-6 rounded-lg text-[14px] hover:bg-rose-100 transition-colors">
                    Delete
                </button>
            </div>
        </ModalBackdrop>
    );
}

export function ImplementationModal({ onClose }: { onClose: () => void }) {
    return (
        <ModalBackdrop onClose={onClose}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-[18px] font-bold text-slate-800">Implementation Details</h2>
                <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="p-6">
                <p className="text-slate-500 text-sm">Implementation modal content goes here.</p>
            </div>
        </ModalBackdrop>
    );
}
