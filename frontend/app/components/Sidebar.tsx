'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PAGES_NAV = [
    {
        href: '/',
        label: 'Dashboard',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        href: '/bookings',
        label: 'Bookings',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
    },
    {
        href: '/history',
        label: 'History',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" /><polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
];

const AUTOMATE_NAV = [
    {
        href: '/automations',
        label: 'AI Automation & Agents',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" /><path d="M12 8v4" /><path d="M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" /><line x1="8" y1="18" x2="8" y2="18" /><line x1="16" y1="18" x2="16" y2="18" />
            </svg>
        ),
    },
    {
        href: '/ai-cowork',
        label: 'Ai Co-Work',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
        ),
    },
    {
        href: '/ai-apps',
        label: 'Ai Custom Apps',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" /><polyline points="8 21 12 17 16 21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
    {
        href: '/ai-implementation',
        label: <>AI Implementation &<br/>Transformation</>,
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
            </svg>
        ),
    },
];

const SETTINGS_NAV = [
    {
        href: '/credentials',
        label: 'Credentials',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        ),
    },
    {
        href: '/subscription',
        label: 'Subscription',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
    },
    {
        href: '/settings',
        label: 'Settings',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
];

function NavItem({ href, label, icon, onClick }: { href: string; label: React.ReactNode; icon: React.ReactNode; onClick?: () => void }) {
    const pathname = usePathname();
    const active = pathname === href || (href !== '/' && pathname.startsWith(href));

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
        flex items-center gap-3 px-3 py-2.5 rounded-l-none rounded-r-2xl text-[13.5px] font-medium transition-all duration-150
        ${active
                    ? 'bg-gradient-to-r from-[#e7f6ff] to-[#ccf2ff] text-[#00c2ff] font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
      `}
        >
            <span className={`flex-shrink-0 ${active ? 'text-[#00c2ff]' : 'text-slate-400'}`}>{icon}</span>
            <span className="truncate-multiline leading-tight">{label}</span>
        </Link>
    );
}

import { NotificationModal } from './NotificationModal';

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    };

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Top Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-slate-100 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-800 focus:outline-none"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-black text-slate-800 tracking-tight">IBA</span>
                        <span className="text-xl font-black text-blue-500">.</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsModalOpen(true)} className="text-slate-400 hover:text-slate-600 transition-colors relative">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>
                    <div className="relative">
                        <button onClick={() => { setIsOpen(false); setIsProfileOpen(!isProfileOpen); }} className="block focus:outline-none">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://ui-avatars.com/api/?name=Alex+Developer&background=e0f2fe&color=0284c7&bold=true" alt="User Profile" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
                        </button>
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                <div className="absolute top-[44px] right-0 z-50 w-[224px] bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(22,78,99,0.1)] p-1.5 flex flex-col gap-0.5 border border-slate-100">
                                    <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-800">Profile Settings</span>
                                    </Link>
                                    <Link href="/subscription" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600">
                                            <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                                        </svg>
                                        <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-800">Billing</span>
                                    </Link>
                                    <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors w-full text-left group">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                                        </svg>
                                        <span className="text-[13px] font-medium text-red-600">Logout</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>
            
            <NotificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Main Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 flex flex-col w-[260px] bg-white border-r border-slate-100 shadow-sm 
                transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo & Close Button */}
                <div className="px-6 pt-6 pb-4 relative">
                    <div>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-2xl font-black text-slate-800 tracking-tight">IBA</span>
                            <span className="text-2xl font-black text-blue-500">.</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium tracking-wide">Intelligent Business Automation</p>
                    </div>
                    <button
                        className="lg:hidden absolute top-6 right-5 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
                    {/* Pages */}
                    <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Pages</p>
                    {PAGES_NAV.map((item) => <NavItem key={item.href} {...item} onClick={() => setIsOpen(false)} />)}

                    {/* Automate */}
                    <p className="px-3 pt-5 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Automate</p>
                    {AUTOMATE_NAV.map((item) => <NavItem key={item.href} {...item} onClick={() => setIsOpen(false)} />)}

                    {/* Settings */}
                    <p className="px-3 pt-5 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Settings</p>
                    {SETTINGS_NAV.map((item) => <NavItem key={item.href} {...item} onClick={() => setIsOpen(false)} />)}
                </nav>

                {/* User profile */}
                <div className="px-4 py-4 mt-auto border-t border-slate-100 lg:border-t-0 relative">
                    <button onClick={() => { setIsOpen(false); setIsProfileOpen(!isProfileOpen); }} className="flex items-center gap-3 hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer w-full text-left focus:outline-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://ui-avatars.com/api/?name=Alex+Developer&background=e0f2fe&color=0284c7&bold=true" alt="User Profile" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-slate-800 truncate">Alex Developer</p>
                            <p className="text-[11px] text-slate-400 truncate">Pro Plan</p>
                        </div>
                    </button>
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute bottom-[72px] left-[16px] z-50 w-[224px] bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(22,78,99,0.1)] p-1.5 flex flex-col gap-0.5 border border-slate-100">
                                <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-800">Profile Settings</span>
                                </Link>
                                <Link href="/subscription" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600">
                                        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                                    </svg>
                                    <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-800">Billing</span>
                                </Link>
                                <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                                <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors w-full text-left group">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                                    </svg>
                                    <span className="text-[13px] font-medium text-red-600">Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </aside>
        </>
    );
}
