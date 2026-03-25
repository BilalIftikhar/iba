'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileOnboardingClient() {
    const [step, setStep] = useState(1);
    const router = useRouter();

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(Math.max(1, step - 1));
    const handleFinish = () => router.push('/dashboard');

    return (
        <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans relative pb-16">
            
            {/* Steps Progress Header for Step 1 and 2 */}
            {step < 3 && (
                <div className="w-full max-w-[800px] mx-auto pt-16 px-6">
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <div className="text-[10px] font-extrabold text-[#00C2FF] uppercase tracking-widest mb-1.5">STEP 1 OF 3</div>
                            <div className="text-[14px] font-bold text-[#1E293B]">1. Choose Plan</div>
                        </div>
                        <div className="text-[13px] font-semibold text-slate-500 mb-1">
                            Next: 2. Profile
                        </div>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="relative w-full h-1.5 bg-slate-200 rounded-full mb-2 overflow-hidden">
                        <div 
                            className="absolute top-0 left-0 h-full bg-[#00C2FF] transition-all duration-300 rounded-full" 
                            style={{ width: step === 1 ? '55%' : '100%' }}
                        />
                    </div>
                    {/* Progress Labels */}
                    <div className="flex justify-between text-[11px] font-medium text-slate-400">
                        <span className="text-[#1E293B]">Choose Plan</span>
                        <span className={step >= 1 ? 'text-[#1E293B] text-center w-[100px] -ml-[50px] absolute left-1/2' : 'text-center w-[100px] -ml-[50px] absolute left-1/2'}>Profile</span>
                        <span>Workspace</span>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className={`flex-1 flex flex-col ${step === 3 ? 'justify-center items-center' : 'mt-12 md:mt-16'} px-4 md:px-6`}>
                
                {/* STEP 1: Profile */}
                {step === 1 && (
                    <div className="w-full max-w-[800px] mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#1E293B] mb-2 tracking-tight">Tell us about yourself</h1>
                            <p className="text-[15px] text-slate-500">Please provide your professional details to personalize your experience.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                            {/* Profile Photo */}
                            <div className="bg-white rounded-[20px] p-6 flex flex-col items-center justify-center border border-slate-100 shadow-sm md:col-span-1 min-h-[160px]">
                                <div className="w-[64px] h-[64px] rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center relative mb-4">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                    <button className="absolute -bottom-1 -right-1 w-[22px] h-[22px] bg-[#00C2FF] rounded-full flex items-center justify-center text-white border-2 border-white">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                    </button>
                                </div>
                                <div className="text-[14px] font-bold text-[#1E293B] mb-1">Profile Photo</div>
                                <div className="text-[11px] text-slate-400 font-medium">PNG, JPG up to 5MB</div>
                            </div>

                            {/* First & Last Name */}
                            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-sm md:col-span-2 flex flex-col md:flex-row gap-5">
                                <div className="flex-1">
                                    <label className="block text-[12px] font-bold text-[#1E293B] mb-2 pl-1">First Name</label>
                                    <input type="text" defaultValue="John" className="w-full bg-[#F8FAFC] border border-slate-200 text-[#1E293B] text-[14px] px-4 py-3 rounded-[12px] focus:outline-none focus:border-[#00C2FF] transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[12px] font-bold text-[#1E293B] mb-2 pl-1">Last Name</label>
                                    <input type="text" defaultValue="Doe" className="w-full bg-[#F8FAFC] border border-slate-200 text-[#1E293B] text-[14px] px-4 py-3 rounded-[12px] focus:outline-none focus:border-[#00C2FF] transition-colors" />
                                </div>
                            </div>

                            {/* Company & Role */}
                            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-sm md:col-span-3 flex flex-col md:flex-row gap-5">
                                <div className="flex-1">
                                    <label className="block text-[12px] font-bold text-[#1E293B] mb-2 pl-1 flex items-center gap-1.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                        Company Name
                                    </label>
                                    <input type="text" defaultValue="Acme Inc." className="w-full bg-[#F8FAFC] border border-slate-200 text-[#1E293B] text-[14px] px-4 py-3 rounded-[12px] focus:outline-none focus:border-[#00C2FF] transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[12px] font-bold text-[#1E293B] mb-2 pl-1 flex items-center gap-1.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        Your Role
                                    </label>
                                    <input type="text" defaultValue="Product Designer" className="w-full bg-[#F8FAFC] border border-slate-200 text-[#1E293B] text-[14px] px-4 py-3 rounded-[12px] focus:outline-none focus:border-[#00C2FF] transition-colors" />
                                </div>
                            </div>

                            {/* Information Box */}
                            <div className="bg-[#EAFCFC] md:col-span-3 rounded-[20px] p-5 border border-[#BFF1F4] flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#00C2FF] flex items-center justify-center shrink-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                                </div>
                                <div>
                                    <div className="text-[14px] font-bold text-[#1E293B] mb-0.5 mt-0.5">Why do we need this?</div>
                                    <div className="text-[13px] text-slate-600 leading-relaxed max-w-[600px]">We use this information to tailor your workspace experience and suggested templates based on your role.</div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-between border-t border-slate-200 pt-8 mt-4 max-w-[800px] mx-auto pb-4">
                            <button onClick={handleBack} className="bg-white hover:bg-slate-50 border border-slate-200 text-[#1E293B] font-bold px-8 py-3 rounded-[12px] text-[14px] transition-colors">
                                Back
                            </button>
                            <button onClick={handleNext} className="bg-[#00C2FF] hover:bg-[#00A3D9] text-white font-bold px-8 py-3 rounded-[12px] text-[14px] shadow-sm transition-colors">
                                Continue to Workspace
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Workspace */}
                {step === 2 && (
                    <div className="w-full max-w-[800px] mx-auto">
                        <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#1E293B] mb-6 tracking-tight">Name your workspace</h1>
                        
                        <div className="mb-10">
                            <label className="block text-[13px] font-medium text-slate-500 mb-2 pl-1">Workspace Name</label>
                            <input 
                                type="text" 
                                defaultValue="leo inc" 
                                className="w-full max-w-[400px] bg-white border border-slate-200 text-[#1E293B] text-[15px] font-medium px-4 py-3 rounded-[12px] focus:outline-none focus:border-[#00C2FF] transition-colors shadow-sm" 
                            />
                        </div>

                        <h2 className="text-[18px] font-bold text-[#1E293B] mb-4">What are you here for?</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {/* Card 1 - Selected */}
                            <div className="bg-[#EAFCFC] rounded-[20px] p-5 border-2 border-[#00C2FF] relative cursor-pointer shadow-sm">
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#00C2FF] rounded-full flex items-center justify-center text-white border-2 border-[#F7F8FA]">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-[#00C2FF] flex items-center justify-center mb-4">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                </div>
                                <h3 className="text-[14px] font-bold text-[#1E293B] mb-1">AI Automations & Agents</h3>
                                <p className="text-[12px] text-slate-500 leading-relaxed pr-6">Deploy autonomous agents to handle repetitive tasks.</p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white hover:bg-slate-50 rounded-[20px] p-5 border border-slate-200 cursor-pointer transition-colors shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] border border-slate-200 flex items-center justify-center mb-4">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                </div>
                                <h3 className="text-[14px] font-bold text-[#1E293B] mb-1">AI Co-Work</h3>
                                <p className="text-[12px] text-slate-500 leading-relaxed">Collaborate with AI side-by-side in your daily workflow.</p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white hover:bg-slate-50 rounded-[20px] p-5 border border-slate-200 cursor-pointer transition-colors shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] border border-slate-200 flex items-center justify-center mb-4">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                </div>
                                <h3 className="text-[14px] font-bold text-[#1E293B] mb-1">AI Custom Apps</h3>
                                <p className="text-[12px] text-slate-500 leading-relaxed">Build tailored AI solutions for specific business needs.</p>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-white hover:bg-slate-50 rounded-[20px] p-5 border border-slate-200 cursor-pointer transition-colors shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] border border-slate-200 flex items-center justify-center mb-4">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                                </div>
                                <h3 className="text-[14px] font-bold text-[#1E293B] mb-1">AI Implementation & Transformation</h3>
                                <p className="text-[12px] text-slate-500 leading-relaxed">Scale AI across your entire organization efficiently.</p>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-[14px] font-bold text-[#1E293B] mb-3 flex items-center gap-2">Team size <span className="text-[12px] text-slate-400 font-normal">(optional)</span></h2>
                            <div className="flex flex-wrap items-center gap-3">
                                <button className="bg-[#00C2FF] text-white font-bold text-[13px] px-5 py-2.5 rounded-[10px] border border-[#00C2FF] shadow-sm">Just me</button>
                                <button className="bg-white hover:bg-slate-50 text-[#1E293B] font-bold text-[13px] px-5 py-2.5 rounded-[10px] border border-slate-200 shadow-sm transition-colors">2-10</button>
                                <button className="bg-white hover:bg-slate-50 text-[#1E293B] font-bold text-[13px] px-5 py-2.5 rounded-[10px] border border-slate-200 shadow-sm transition-colors">11-50</button>
                                <button className="bg-white hover:bg-slate-50 text-[#1E293B] font-bold text-[13px] px-5 py-2.5 rounded-[10px] border border-slate-200 shadow-sm transition-colors">50+</button>
                            </div>
                        </div>

                        <div className="mt-8 mb-16">
                            <button onClick={handleNext} className="bg-[#00C2FF] hover:bg-[#00A3D9] text-white font-bold px-8 py-3.5 rounded-[12px] text-[15px] shadow-sm transition-colors flex items-center gap-2">
                                Launch my workspace <span className="text-[16px]">🚀</span>
                            </button>
                            <p className="text-[11px] text-slate-500 font-medium mt-3">You can always change these settings later in your workspace preferences.</p>
                        </div>
                        
                        {/* Footer links relative to Step 2 form */}
                        <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-200 pt-8 text-[11px] text-slate-400 font-semibold mb-8">
                            <div className="flex items-center gap-1.5 mb-4 md:mb-0 bg-slate-100 px-3 py-1.5 rounded-full text-slate-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                Enterprise grade security
                            </div>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                                <a href="#" className="hover:text-slate-600 transition-colors">Help Center</a>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Setup Complete */}
                {step === 3 && (
                    <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center pt-8">
                        {/* Main Banner */}
                        <div className="bg-white rounded-[24px] p-0 flex flex-col md:flex-row items-center shadow-sm border border-slate-100 w-full mb-6 overflow-hidden">
                            
                            <div className="p-10 md:p-14 flex-1 flex flex-col items-start justify-center">
                                <span className="bg-[#EAFCFC] text-[#00C2FF] text-[10px] font-extrabold px-2.5 py-1.5 rounded tracking-widest uppercase mb-6 shadow-sm border border-[#BFF1F4] flex items-center gap-1.5">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    SETUP COMPLETE
                                </span>
                                <h1 className="text-[36px] md:text-[44px] font-extrabold text-[#1E293B] leading-tight mb-4 tracking-tight">
                                    Welcome to the<br />
                                    <span className="text-[#00C2FF]">future of work.</span>
                                </h1>
                                <p className="text-[15px] md:text-[16px] text-slate-500 leading-relaxed max-w-[340px]">
                                    Your workspace is officially ready. We&apos;ve optimized everything for your productivity.
                                </p>
                            </div>
                            
                            <div className="p-8 md:p-14 bg-slate-50 md:bg-[#F8FAFC] border-t md:border-t-0 md:border-l border-slate-100 w-full md:w-[380px] flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-[#EAFCFC] rounded-2xl border-2 border-[#00C2FF] flex items-center justify-center mb-6 shadow-[0_8px_24px_rgba(0,194,255,0.2)]">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.62 15M4 14.899A7 7 0 1 0 15.62 15m-11.62-.101L2 22l6.899-2m6.721-5L22 2l-6.899 2M15.62 15A7 7 0 1 1 4 14.899"></path></svg>
                                </div>
                                <h3 className="text-[18px] font-bold text-[#1E293B] mb-2">Ready to launch?</h3>
                                <p className="text-[13px] text-slate-500 mb-8 max-w-[200px] leading-relaxed">
                                    Explore your new dashboard and start building your first project.
                                </p>
                                <button onClick={handleFinish} className="bg-[#00C2FF] hover:bg-[#00A3D9] text-white font-bold w-full py-3.5 rounded-[12px] text-[14px] shadow-sm transition-colors flex items-center justify-center gap-2">
                                    Go to my dashboard
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </button>
                            </div>

                        </div>

                        {/* Four feature cards grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10">
                            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow cursor-default">
                                <div className="w-8 h-8 rounded-lg bg-[#E6F8F9] text-[#00C2FF] flex items-center justify-center mb-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <h4 className="text-[12px] font-bold text-[#1E293B] mb-1">Secure Environment</h4>
                                <p className="text-[11px] text-slate-500 leading-tight">Enterprise-grade encryption active.</p>
                            </div>
                            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow cursor-default">
                                <div className="w-8 h-8 rounded-lg bg-[#E6F8F9] text-[#00C2FF] flex items-center justify-center mb-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                </div>
                                <h4 className="text-[12px] font-bold text-[#1E293B] mb-1">Workspace Active</h4>
                                <p className="text-[11px] text-slate-500 leading-tight">All nodes are healthy and running.</p>
                            </div>
                            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow cursor-default">
                                <div className="w-8 h-8 rounded-lg bg-[#E6F8F9] text-[#00C2FF] flex items-center justify-center mb-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                </div>
                                <h4 className="text-[12px] font-bold text-[#1E293B] mb-1">Collaboration Ready</h4>
                                <p className="text-[11px] text-slate-500 leading-tight">Invite team members to your space.</p>
                            </div>
                            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow cursor-default">
                                <div className="w-8 h-8 rounded-lg bg-[#E6F8F9] text-[#00C2FF] flex items-center justify-center mb-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                </div>
                                <h4 className="text-[12px] font-bold text-[#1E293B] mb-1">Customization Options</h4>
                                <p className="text-[11px] text-slate-500 leading-tight">Personalize your new dashboard.</p>
                            </div>
                        </div>

                        {/* Social proof and Links footer */}
                        <div className="flex flex-col md:flex-row items-center justify-between w-full text-[11px] font-medium text-slate-500 gap-4 mt-auto">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-[#F7F8FA]"></div>
                                    <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-[#F7F8FA]"></div>
                                    <div className="w-6 h-6 rounded-full bg-[#00C2FF] border-2 border-[#F7F8FA]"></div>
                                </div>
                                <span>Join 12,000+ builders in the community</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-slate-700 transition-colors">Documentation</a>
                                <a href="#" className="hover:text-slate-700 transition-colors">Support</a>
                                <a href="#" className="hover:text-slate-700 transition-colors">Changelog</a>
                            </div>
                        </div>

                    </div>
                )}
            </div>
            
            {/* Global Footer for Step 1 */}
            {step === 1 && (
                <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-medium text-slate-400 px-4">
                    © 2024 Platform Inc. All rights reserved. <a href="#" className="hover:text-slate-600">Privacy Policy</a> • <a href="#" className="hover:text-slate-600">Terms of Service</a>
                </div>
            )}
        </div>
    );
}
