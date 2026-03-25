'use client';

import React from 'react';

import { HeaderBar } from './HeaderBar';

export default function SubscriptionClient() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="hidden lg:block px-8 pt-8 max-w-[1240px] mx-auto w-full">
                <HeaderBar title="Subscription" />
            </div>

            <div className="max-w-[1240px] mx-auto md:p-8 p-4 pt-0 lg:pt-0">
                {/* Header title */}
                <div className="text-center md:mb-12 mb-6 hidden md:block">
                    <h1 className="text-[32px] font-bold text-[#1E293B] mb-2 tracking-tight">Subscription</h1>
                    <p className="text-[15px] text-slate-500">Manage your plan, billing, and resource usage from a central dashboard.</p>
                </div>

                <div className="md:hidden mb-4">
                    <h1 className="text-[20px] font-bold text-[#1E293B]">Current Plan</h1>
                </div>

                {/* Top Section: Plan Details & Usage */}
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-12">
                    {/* Main Pro Plan Card */}
                    <div className="flex-1 bg-white md:rounded-[24px] rounded-[16px] md:p-8 p-0 pt-0 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col md:flex-row shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                        {/* Mobile Header Banner */}
                        <div className="md:hidden bg-gradient-to-r from-[#00C2FF]/20 to-[#00C2FF]/10 h-[100px] w-full flex items-center justify-center relative">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </div>
                        
                        {/* Desktop Icon & Content */}
                        <div className="p-5 md:p-0 flex-1 flex flex-row items-center md:items-start gap-4 md:gap-8">
                            {/* Desktop Icon Container */}
                            <div className="hidden md:flex flex-col items-center justify-center w-[160px] h-[160px] bg-[#E6F8F9] rounded-2xl shrink-0">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                                <span className="text-[11px] font-bold text-[#00C2FF] tracking-wider uppercase">PRO MEMBER</span>
                            </div>

                            {/* Plan Info */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1 md:mb-3">
                                    <h2 className="text-[18px] md:text-[28px] font-bold text-[#1E293B] leading-tight flex items-center gap-2">
                                        Pro Plan
                                        <span className="hidden md:flex bg-[#E6F8F9] text-[#00C2FF] text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase items-center h-fit ml-2">ACTIVE</span>
                                    </h2>
                                    {/* Mobile Active & Price combined */}
                                    <div className="md:hidden flex flex-col items-end">
                                        <div className="text-[16px] font-bold text-[#00C2FF]">$49.00<span className="text-[12px] text-slate-400 font-medium">/mo</span></div>
                                    </div>
                                </div>
                                <div className="text-[13px] md:text-[15px] text-slate-500 mb-4 md:mb-6">
                                    <span className="hidden md:inline">Your plan renews on </span>
                                    <span className="md:hidden text-slate-400">Renews on </span>
                                    <strong className="text-[#1E293B] font-medium">Oct 24, 2024</strong>
                                </div>
                                <div className="hidden md:flex items-end gap-1 mb-8">
                                    <span className="text-[40px] font-black text-[#1E293B] leading-none tracking-tighter">$49</span>
                                    <span className="text-[15px] text-slate-500 font-medium pb-1">/ per month</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="flex-1 md:flex-none bg-[#00C2FF] hover:bg-[#00A3D9] text-white px-5 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl font-semibold text-[13px] md:text-[14px] transition-colors shadow-sm flex items-center justify-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        Manage Billing
                                    </button>
                                    <button className="flex-1 md:flex-none bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl font-semibold text-[13px] md:text-[14px] transition-colors flex items-center justify-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="10"></circle></svg>
                                        View History
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Grid */}
                    <div className="w-full lg:w-[480px]">
                        <div className="md:hidden flex items-center justify-between mb-4 mt-2 px-1">
                            <h3 className="text-[16px] font-bold text-[#1E293B]">Usage Metrics</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:gap-4 h-full">
                            <UsageCard 
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline><polygon points="11 11 9 17 14 13 14 17 11 11"></polygon></svg>}
                                label="Automations"
                                iconColor="text-[#00C2FF]"
                                value="24"
                                total="50"
                                percentage={48}
                            />
                            <UsageCard 
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>}
                                label="API Calls"
                                iconColor="text-[#00C2FF]"
                                value="42k"
                                total="100k"
                                percentage={42}
                            />
                            <UsageCard 
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>}
                                label="Storage"
                                iconColor="text-[#00C2FF]"
                                value="47"
                                total="100 GB"
                                percentage={47}
                            />
                            <UsageCard 
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                                label="Team Seats"
                                iconColor="text-[#00C2FF]"
                                value="3"
                                total="5"
                                percentage={60}
                            />
                        </div>
                    </div>
                </div>

                {/* Available Plans */}
                <div className="mb-4 text-center mt-12 md:mt-16">
                    <h2 className="text-[18px] md:text-[20px] font-bold text-[#1E293B] hidden md:block">Available Plans</h2>
                    <div className="md:hidden flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[16px] font-bold text-[#1E293B]">Available Plans</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 px-1 md:px-0">
                    {/* Starter */}
                    <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div>
                            <div className="flex items-center justify-between mb-2 md:mb-3">
                                <h3 className="text-[18px] md:text-[20px] font-bold text-[#1E293B]">Starter</h3>
                                <div className="md:hidden text-[16px] font-bold text-[#1E293B]">$19<span className="text-[12px] text-slate-400 font-medium">/mo</span></div>
                            </div>
                            <p className="text-[13px] md:text-[14px] text-slate-500 mb-6 hidden md:block h-[40px]">Perfect for hobbyists and side projects.</p>
                            
                            <div className="hidden md:flex items-end gap-1 mb-6">
                                <span className="text-[36px] font-black text-[#1E293B] leading-none tracking-tighter">$0</span>
                                <span className="text-[14px] text-slate-500 font-medium pb-1">/ month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                <FeatureItem text="10 Automations" />
                                <FeatureItem text="25K API Calls" />
                                <FeatureItem text="10 GB Storage" />
                            </ul>
                        </div>
                        <button className="w-full border-2 border-[#E2E8F0] hover:border-[#CBD5E1] text-[#1E293B] font-semibold py-2.5 rounded-xl text-[14px] transition-colors">
                            Downgrade
                        </button>
                    </div>

                    {/* Pro */}
                    <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-between border-2 border-[#00C2FF] shadow-[0_8px_24px_rgba(0,194,255,0.12)] relative">
                        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#00C2FF] text-white text-[9px] md:text-[10px] font-bold px-3 py-1 md:py-1.5 rounded-full tracking-wider uppercase whitespace-nowrap shadow-sm">
                            CURRENT PLAN
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2 md:mb-3 mt-1 md:mt-2">
                                <h3 className="text-[18px] md:text-[20px] font-bold text-[#1E293B]">Pro</h3>
                                <div className="md:hidden text-[16px] font-bold text-[#1E293B]">$49<span className="text-[12px] text-slate-400 font-medium">/mo</span></div>
                            </div>
                            <p className="text-[13px] md:text-[14px] text-slate-500 mb-6 hidden md:block h-[40px]">Professional tools for growing teams.</p>
                            
                            <div className="hidden md:flex items-end gap-1 mb-6">
                                <span className="text-[36px] font-black text-[#1E293B] leading-none tracking-tighter">$49</span>
                                <span className="text-[14px] text-slate-500 font-medium pb-1">/ month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                <FeatureItem text="50 Automations" />
                                <FeatureItem text="100K API Calls" />
                                <FeatureItem text="100 GB Storage" />
                                <FeatureItem text="Priority Support" isPro />
                            </ul>
                        </div>
                        <button className="w-full bg-[#E6F8F9] text-[#00C2FF] font-semibold py-2.5 rounded-xl text-[14px] hover:bg-[#D4F4F6] transition-colors">
                            Active
                        </button>
                    </div>

                    {/* Enterprise */}
                    <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div>
                            <div className="flex items-center justify-between mb-2 md:mb-3">
                                <h3 className="text-[18px] md:text-[20px] font-bold text-[#1E293B]">Enterprise</h3>
                                <div className="md:hidden text-[16px] font-bold text-[#1E293B]">Custom</div>
                            </div>
                            <p className="text-[13px] md:text-[14px] text-slate-500 mb-6 hidden md:block h-[40px]">Advanced security and scale for organizations.</p>
                            
                            <div className="hidden md:flex items-end gap-1 mb-6">
                                <span className="text-[36px] font-black text-[#1E293B] leading-none tracking-tighter">$299</span>
                                <span className="text-[14px] text-slate-500 font-medium pb-1">/ month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                <FeatureItem text="Unlimited Automations" isPro />
                                <FeatureItem text="Custom API Limits" isPro />
                                <FeatureItem text="Dedicated Hosting" isPro />
                                <FeatureItem text="24/7 Phone Support" isPro />
                            </ul>
                        </div>
                        <button className="w-full bg-[#00C2FF] hover:bg-[#00A3D9] text-white font-semibold py-2.5 rounded-xl text-[14px] shadow-sm transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>

                {/* Footer Status Grid */}
                <div className="bg-white md:bg-[#F1F5F9] rounded-[20px] md:rounded-[24px] p-6 md:py-6 md:px-8 flex flex-wrap md:flex-nowrap items-center justify-between gap-6 md:gap-8 shadow-sm md:shadow-none border border-slate-100 md:border-none">
                    <FooterItem 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
                        label="LAST INVOICE"
                        value="#INV-8921"
                        sub="Sept 24, 2024"
                    />
                    <div className="hidden md:block w-[1px] h-10 bg-slate-200 shrink-0"></div>
                    <FooterItem 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>}
                        label="METHOD"
                        value="•••• 4242"
                    />
                    <div className="hidden md:block w-[1px] h-10 bg-slate-200 shrink-0"></div>
                    <FooterItem 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                        label="STATUS"
                        value={<span className="text-[#10A37F] flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10A37F]"></div>Healthy</span>}
                        color="text-[#10A37F]"
                    />
                    <div className="hidden md:block w-[1px] h-10 bg-slate-200 shrink-0"></div>
                    <div className="flex flex-col gap-1 w-[calc(50%-12px)] md:w-auto mt-2 md:mt-0">
                        <div className="flex items-center gap-2 text-slate-400">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            <span className="text-[10px] md:text-[11px] font-bold tracking-wider uppercase">SUPPORT</span>
                        </div>
                        <a href="#" className="font-semibold text-[14px] md:text-[15px] text-[#00C2FF] hover:underline flex items-center gap-1">Get Help →</a>
                    </div>
                </div>
                <div className="h-8 md:h-0"></div>
            </div>
        </div>
    );
}

function UsageCard({ icon, label, iconColor, value, total, percentage }: { icon: React.ReactNode, label: string, iconColor: string, value: string | number, total: string | number, percentage: number }) {
    return (
        <div className="bg-white p-4 md:p-5 rounded-[16px] md:rounded-[20px] shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={iconColor}>{icon}</div>
                    <span className="text-[12px] md:text-[13px] font-semibold text-slate-600">{label}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{percentage}%</div>
            </div>
            <div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[18px] md:text-[22px] font-bold text-[#1E293B] leading-none">{value}</span>
                    <span className="text-[11px] md:text-[12px] text-slate-400 font-medium">/ {total}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-[4px]">
                    <div className="bg-[#00C2FF] h-[4px] rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text, isPro = false }: { text: string, isPro?: boolean }) {
    return (
        <li className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5 w-[16px] h-[16px] rounded-full flex items-center justify-center bg-[#E5F9FF] text-[#00C2FF]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className={`text-[13px] md:text-[14px] leading-snug ${isPro ? 'text-[#1E293B] font-medium' : 'text-slate-600'}`}>{text}</span>
        </li>
    );
}

function FooterItem({ icon, label, value, sub, color }: { icon: React.ReactNode, label: string, value: string, sub: string, color?: string }) {
    return (
        <div className="flex flex-col gap-1 w-[calc(50%-12px)] md:w-auto">
            <div className="flex items-center gap-2 text-slate-400">
                {icon}
                <span className="text-[10px] md:text-[11px] font-bold tracking-wider uppercase">{label}</span>
            </div>
            <div className={`font-semibold text-[14px] md:text-[15px] ${color || 'text-[#1E293B]'}`}>{value}</div>
            {sub && <div className="text-[11px] md:text-[12px] text-slate-400">{sub}</div>}
        </div>
    );
}
