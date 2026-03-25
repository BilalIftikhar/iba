'use client';

import React, { useState } from 'react';
import { HeaderBar } from './HeaderBar';

export default function SettingsClient() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [slackAlerts, setSlackAlerts] = useState(true);
    const [whatsappAlerts, setWhatsappAlerts] = useState(false);
    const [twoFactor, setTwoFactor] = useState(true);
    const [loginAlerts, setLoginAlerts] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Desktop header wrapper config if needed, we'll put inside the max-w container or outside */}
            <div className="hidden lg:block px-8 pt-8 max-w-[1240px] mx-auto w-full">
                <HeaderBar title="Settings" />
            </div>

            <div className="max-w-[1240px] mx-auto md:p-8 p-4 pt-0 lg:pt-0">
                {/* Header title */}
                <div className="text-center md:mb-12 mb-6 hidden md:block">
                    <h1 className="text-[32px] font-bold text-[#1E293B] mb-2 tracking-tight">System Configuration</h1>
                    <p className="text-[15px] text-slate-500">Manage your profile, platform security, and organization notifications.</p>
                </div>

                <div className="md:hidden mb-6">
                    <h1 className="text-[24px] font-bold text-[#1E293B] mb-1">Settings</h1>
                    <p className="text-[13px] text-slate-500">Manage your account and preferences</p>
                </div>

                {/* Grid Layout Container */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 pb-12">
                    
                    {/* 1. Profile - spans 8 cols on desktop */}
                    <div className="bg-white rounded-[20px] md:rounded-3xl p-5 md:p-8 shadow-sm border border-slate-100 flex flex-col justify-between md:col-span-8 md:row-start-1 order-1">
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8 md:mb-10">
                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
                                <div className="relative">
                                    <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full bg-[#64A69E] overflow-hidden">
                                        <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">A</div>
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-[24px] h-[24px] md:w-[32px] md:h-[32px] bg-[#00C2FF] rounded-full flex items-center justify-center text-white border-2 border-white hover:bg-[#00A3D9] transition-colors">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                    </button>
                                </div>
                                <div>
                                    <h2 className="text-[20px] md:text-[24px] font-bold text-[#1E293B] leading-tight mb-1">Ahmed Hassan</h2>
                                    <p className="text-[13px] md:text-[14px] text-slate-500 mb-2 md:mb-3">ahmed.hassan@ibasolutions.com</p>
                                    <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                                        <span className="text-[10px] font-bold text-[#00C2FF] bg-[#E6F8F9] px-2.5 py-1 rounded uppercase tracking-wider">ADMINISTRATOR</span>
                                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded text-center">IBA SOLUTIONS FZ-LLC</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full md:w-auto bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] font-semibold px-6 py-2.5 rounded-[12px] md:rounded-xl text-[13px] md:text-[14px] transition-colors mt-2 md:mt-0">
                                Edit Profile
                            </button>
                        </div>
                        
                        {/* Timezone & Language */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-5 md:pt-6">
                            <div className="flex md:flex-col justify-between items-center md:items-start gap-1">
                                <label className="text-[10px] md:text-[11px] font-bold tracking-wider text-slate-400 uppercase">TIMEZONE</label>
                                <div className="flex items-center gap-2 text-[13px] md:text-[14px] font-medium text-[#1E293B]">
                                    <span className="text-slate-400">🕒</span> Dubai (GMT+4)
                                </div>
                            </div>
                            <div className="flex md:flex-col justify-between items-center md:items-start gap-1">
                                <label className="text-[10px] md:text-[11px] font-bold tracking-wider text-slate-400 uppercase">PREFERRED LANGUAGE</label>
                                <div className="flex items-center gap-2 text-[13px] md:text-[14px] font-medium text-[#1E293B]">
                                    <span className="text-slate-400">🌐</span> English (US)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Appearance  - spans 4 cols on desktop */}
                    <div className="bg-white rounded-[20px] md:rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col md:col-span-4 md:row-start-3 order-2 md:order-6">
                        <div className="flex items-center gap-2 mb-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            <h3 className="text-[15px] md:text-[16px] font-bold text-[#1E293B]">Appearance</h3>
                        </div>
                        <p className="text-[12px] md:text-[13px] text-slate-500 mb-6 leading-relaxed">Customize the look and feel of your AI dashboard workspace.</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-auto">
                            <button 
                                onClick={() => setTheme('light')}
                                className={`flex flex-col items-center gap-3 p-3 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-[#00C2FF] bg-[#F8FAFC]' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                            >
                                <div className="w-full flex items-center justify-between px-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme === 'light' ? '#00C2FF' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? 'border-[#00C2FF]' : 'border-slate-300'}`}>
                                        {theme === 'light' && <div className="w-2 h-2 rounded-full bg-[#00C2FF]"></div>}
                                    </div>
                                </div>
                                <div className="w-full h-[60px] bg-white border border-slate-200 rounded-lg shadow-sm"></div>
                                <span className={`text-[12px] font-semibold ${theme === 'light' ? 'text-[#1E293B]' : 'text-slate-500'}`}>Light Mode</span>
                            </button>

                            <button 
                                onClick={() => setTheme('dark')}
                                className={`flex flex-col items-center gap-3 p-3 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-[#00C2FF] bg-[#1E293B]' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                            >
                                <div className="w-full flex items-center justify-between px-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? 'white' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-[#00C2FF]' : 'border-slate-300'}`}>
                                        {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-[#00C2FF]"></div>}
                                    </div>
                                </div>
                                <div className="w-full h-[60px] bg-[#0F172A] border border-[#1E293B] rounded-lg shadow-sm"></div>
                                <span className={`text-[12px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>Dark Mode</span>
                            </button>
                        </div>
                    </div>

                    {/* 3. Security - spans 4 cols on desktop */}
                    <div className="bg-white rounded-[20px] md:rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col justify-between md:col-span-4 md:row-start-1 order-3 md:order-2">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                                <h3 className="text-[15px] md:text-[16px] font-bold text-[#1E293B]">Security</h3>
                            </div>
                            
                            <ToggleSetting 
                                label="Two-factor Auth" 
                                description="Secure your login" 
                                active={twoFactor} 
                                onToggle={() => setTwoFactor(!twoFactor)} 
                            />
                            
                            <ToggleSetting 
                                label="Login Alerts" 
                                description="Notify on new device" 
                                active={loginAlerts} 
                                onToggle={() => setLoginAlerts(!loginAlerts)} 
                            />
                        </div>

                        <button className="w-full mt-6 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] font-semibold py-2.5 rounded-xl text-[13px] md:text-[14px] transition-colors">
                            Change Password
                        </button>
                    </div>

                    {/* 4. Notifications - spans 4 cols on desktop */}
                    <div className="bg-white rounded-[20px] md:rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col justify-between md:col-span-4 md:row-start-2 order-4 md:order-3">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                <h3 className="text-[15px] md:text-[16px] font-bold text-[#1E293B]">Notifications</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <CheckboxSetting 
                                    label="Email Alerts" 
                                    description="Weekly reports and security notices." 
                                    active={emailAlerts} 
                                    onToggle={() => setEmailAlerts(!emailAlerts)} 
                                    mobileToggle
                                />
                                
                                <CheckboxSetting 
                                    label="Slack" 
                                    description="Direct channel updates for workflow triggers." 
                                    active={slackAlerts} 
                                    onToggle={() => setSlackAlerts(!slackAlerts)} 
                                    mobileToggle
                                />
                                
                                <CheckboxSetting 
                                    label="WhatsApp" 
                                    description="Critical alerts via messaging app." 
                                    active={whatsappAlerts} 
                                    onToggle={() => setWhatsappAlerts(!whatsappAlerts)} 
                                    mobileToggle
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5. Team - spans 8 cols on desktop */}
                    <div className="bg-white rounded-[20px] md:rounded-3xl p-5 md:p-8 shadow-sm border border-slate-100 flex flex-col md:col-span-8 md:row-start-2 order-5 md:order-4">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                <h3 className="text-[15px] md:text-[16px] font-bold text-[#1E293B]">Team Members</h3>
                            </div>
                            <button className="text-[12px] md:text-[13px] font-semibold text-[#00C2FF] hover:text-[#00A3D9] transition-colors">
                                <span className="hidden md:inline">Add New Member</span>
                                <span className="md:hidden">Manage</span>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-x-auto no-scrollbar">
                            <table className="w-full min-w-[320px] text-left">
                                <thead className="hidden md:table-header-group">
                                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                                        <th className="pb-3 pl-2">Name</th>
                                        <th className="pb-3 text-center">Role</th>
                                        <th className="pb-3 text-center">Last Active</th>
                                        <th className="pb-3 text-right pr-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <TeamRow 
                                        name="Sarah Chen" 
                                        email="sarah@ibasolutions.com" 
                                        role="ADMIN" 
                                        time="2 mins ago" 
                                        avatarColor="bg-[#E5A58A]" 
                                        online={true} 
                                    />
                                    <TeamRow 
                                        name="Marco Rossi" 
                                        email="m.rossi@ibasolutions.com" 
                                        role="EDITOR" 
                                        time="1 hour ago" 
                                        avatarColor="bg-slate-200" 
                                        online={true} 
                                    />
                                    <TeamRow 
                                        name="Elena Vance" 
                                        email="elena.v@ibasolutions.com" 
                                        role="VIEWER" 
                                        time="Yesterday" 
                                        avatarColor="bg-[#64A69E]" 
                                        online={false} 
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 6. API Connectivity - spans 8 cols on desktop */}
                    <div className="bg-white md:bg-[#0B1521] rounded-[20px] md:rounded-3xl p-6 shadow-sm border border-slate-100 md:border-none md:col-span-8 md:row-start-3 order-6 md:order-5 relative overflow-hidden flex flex-col justify-between group">
                        {/* Decorative Background for Desktop */}
                        <div className="hidden md:block absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00C2FF]/10 to-transparent pointer-events-none"></div>
                        
                        <div>
                            <div className="flex items-center gap-2 mb-2 relative z-10">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                                <h3 className="text-[16px] md:text-[18px] font-bold text-[#1E293B] md:text-white">API Connectivity</h3>
                            </div>
                            <p className="text-[13px] text-slate-500 md:text-[#10A37F] mb-6 max-w-[400px] leading-relaxed relative z-10">
                                Connect your custom applications and workflows via IBA systems API endpoints.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 relative z-10">
                            <button className="bg-[#00C2FF] hover:bg-[#00A3D9] text-white font-semibold px-5 py-2.5 rounded-xl text-[13px] shadow-sm transition-colors mb-0 md:bg-[#00C2FF]">
                                Generate Key
                            </button>
                            <button className="bg-[#F1F5F9] md:bg-white/10 hover:bg-[#E2E8F0] md:hover:bg-white/20 text-[#1E293B] md:text-white font-semibold px-5 py-2.5 rounded-xl text-[13px] transition-colors border border-transparent md:border-white/10">
                                Documentation
                            </button>
                        </div>
                        
                        {/* Desktop Icons Top Right */}
                        <div className="hidden md:flex absolute top-6 right-6 gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#00C2FF] border border-white/10"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#00C2FF] border border-white/10"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg></div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

function ToggleSetting({ label, description, active, onToggle }: { label: string, description: string, active: boolean, onToggle: () => void }) {
    return (
        <div className="flex items-center justify-between mb-4 last:mb-0">
            <div>
                <div className="text-[13px] font-bold text-[#1E293B]">{label}</div>
                <div className="text-[11px] text-slate-500">{description}</div>
            </div>
            <button 
                onClick={onToggle}
                className={`relative inline-flex h-[20px] w-[36px] items-center rounded-full transition-colors ${active ? 'bg-[#00C2FF]' : 'bg-slate-200'}`}
            >
                <span className={`inline-block h-[16px] w-[16px] transform rounded-full bg-white transition-transform ${active ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
            </button>
        </div>
    );
}

function CheckboxSetting({ label, description, active, onToggle, mobileToggle = false }: { label: string, description?: string, active: boolean, onToggle: () => void, mobileToggle?: boolean }) {
    return (
        <div className="flex items-start md:items-center justify-between">
            <div>
                <div className="text-[13px] font-bold text-[#1E293B]">{label}</div>
                <div className="text-[11px] text-slate-500 leading-tight mt-0.5 max-w-[200px] hidden md:block">{description}</div>
            </div>
            
            {/* Desktop Checkbox */}
            <button 
                onClick={onToggle}
                className={`hidden md:flex w-[18px] h-[18px] rounded border items-center justify-center transition-colors shrink-0 ${active ? 'bg-[#00C2FF] border-[#00C2FF] text-white' : 'bg-slate-50 border-slate-300'}`}
            >
                {active && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
            </button>

            {/* Mobile Toggle Alternative */}
            {mobileToggle && (
                <button 
                    onClick={onToggle}
                    className={`md:hidden relative inline-flex h-[20px] w-[36px] items-center rounded-full transition-colors shrink-0 ${active ? 'bg-[#00C2FF]' : 'bg-slate-200'}`}
                >
                    <span className={`inline-block h-[16px] w-[16px] transform rounded-full bg-white transition-transform ${active ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                </button>
            )}
        </div>
    );
}

function TeamRow({ name, email, role, time, avatarColor, online }: { name: string, email: string, role: string, time: string, avatarColor: string, online: boolean }) {
    return (
        <tr className="border-b border-slate-50 last:border-0 group flex flex-col md:table-row py-3 md:py-0">
            <td className="py-0 md:py-3 pl-2 w-full md:w-auto">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${avatarColor} shrink-0`}></div>
                    <div>
                        <div className="text-[13px] font-bold text-[#1E293B] flex items-center gap-1">
                            {name}
                            {/* Mobile Role Badge inline */}
                            <span className="md:hidden ml-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded tracking-wider">{role}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{email}</div>
                    </div>
                </div>
            </td>
            {/* Desktop Role */}
            <td className="py-3 text-center hidden md:table-cell">
                <span className="text-[10px] font-bold text-slate-500 bg-[#F1F5F9] px-2 py-1 rounded tracking-wider">{role}</span>
            </td>
            {/* Desktop Last Active */}
            <td className="py-3 text-center hidden md:table-cell text-[12px] font-medium text-slate-500">
                {time}
            </td>
            {/* Mobile Actions / Online status */}
            <td className="py-1 md:py-3 text-right pr-2 absolute md:relative right-4 md:right-auto mt-2 md:mt-0 items-center h-full">
                <div className="flex items-center justify-end gap-3 h-full">
                   <div className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-400' : 'bg-slate-300'} md:hidden`}></div>
                   <button className="text-slate-400 hover:text-slate-600 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                   </button>
                </div>
            </td>
        </tr>
    );
}
