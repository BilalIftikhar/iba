'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { clearAdminToken, adminFetch } from '../lib/api';

const NAV_ITEMS = [
    {
        section: 'OVERVIEW',
        items: [
            {
                href: '/',
                label: 'Dashboard',
                icon: (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path d="M15.8203 4.17969V5.82031H12.5V4.17969H15.8203ZM7.5 4.17969V9.17969H4.17969V4.17969H7.5ZM15.8203 10.8203V15.8203H12.5V10.8203H15.8203ZM7.5 14.1797V15.8203H4.17969V14.1797H7.5ZM17.5 2.5H10.8203V7.5H17.5V2.5ZM9.17969 2.5H2.5V10.8203H9.17969V2.5ZM17.5 9.17969H10.8203V17.5H17.5V9.17969ZM9.17969 12.5H2.5V17.5H9.17969V12.5Z" fill="currentColor" />
                    </svg>
                ),
            },
        ]
    },
    {
        section: 'BOOKINGS',
        items: [
            {
                href: '/bookings',
                label: 'All Bookings',
                badgeKey: 'activeBookings',
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                ),
            },
        ]
    },
    {
        section: 'CUSTOMERS',
        items: [
            {
                href: '/customers',
                label: 'All Customers',
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                ),
            },
            {
                href: '/segments',
                label: 'Segments',
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12A10 10 0 1 1 12 2v0a10 10 0 0 1 10 10z" /><path d="M12 22A10 10 0 0 0 12 2Z" /><path d="M12 2A10 10 0 0 1 22 12Z" /><path d="M2 12A10 10 0 0 0 12 22Z" />
                    </svg>
                ),
            },
            {
                href: '/messages',
                label: 'Messages',
                badgeKey: 'unreadMessages',
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                ),
            },
        ]
    },
    {
        section: 'MANAGEMENT',
        items: [
            {
                href: '/content-cms',
                label: 'Content CMS',
                isFolder: true,
                icon: (
                    <span className="text-[16px] leading-none mb-0.5">📝</span>
                ),
            },
            {
                href: '/automation-templates',
                label: 'Automation Templates',
                isNested: true,
                icon: (
                    <span className="text-[16px] leading-none mb-0.5">⚡</span>
                ),
            },

            {
                href: '/app-templates',
                label: 'App Templates',
                isNested: true,
                icon: (
                    <span className="text-[16px] leading-none mb-0.5 max-w-[18px]">📱</span>
                ),
            },
            {
                href: '/implementation',
                label: 'Implementation',
                isNested: true,
                icon: (
                    <span className="text-[16px] leading-none mb-0.5 max-w-[18px]">🔄</span>
                ),
            },
            {
                href: '/subscriptions',
                label: 'Subscriptions',
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                ),
            },
            {
                href: '/coupons',
                label: 'Coupons',
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                ),
            },
            {
                href: '/team-access',
                label: 'Team Access',
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                ),
            },
            {
                href: '/workflows',
                label: 'Workflows',
                icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                ),
            },
        ]
    },
];

interface Props {
    badges?: { activeBookings?: number; unreadMessages?: number };
}

export function AdminSidebar({ badges }: Props) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [cmsOpen, setCmsOpen] = useState(true);
    const [profile, setProfile] = useState<{ first_name: string; last_name: string; email: string } | null>(null);

    useEffect(() => {
        if (['/automation-templates', '/app-templates', '/implementation', '/content-cms'].some(p => pathname.startsWith(p))) {
            setCmsOpen(true);
        }
    }, [pathname]);

    useEffect(() => {
        adminFetch<{ first_name: string; last_name: string; email: string }>('/auth/me')
            .then(d => setProfile(d))
            .catch(() => {});
    }, []);

    const handleLogout = () => {
        clearAdminToken();
        window.location.href = '/login';
    };

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <>
            {/* Mobile header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 z-40 shadow-sm">
                <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-slate-500">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-black text-white">IBA</span>
                    <span className="text-xl font-black text-rose-500">.</span>
                    <span className="ml-2 text-[10px] font-bold bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full uppercase">Admin</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#00C2FF]/10 flex items-center justify-center text-[#0099CC] text-xs font-bold">
                    {profile ? profile.first_name[0] : 'A'}
                </div>
            </header>

            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-[260px] bg-[#1e1e2f] border-r border-[#2a2a3b] shadow-sm transition-transform duration-300 lg:translate-x-0 overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="px-6 pt-6 pb-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-2xl font-black text-white tracking-tight">IBA</span>
                                <span className="text-2xl font-black text-rose-500">.</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold bg-rose-500/10 text-rose-500 px-2.5 py-1 rounded-full uppercase">Admin</span>
                    </div>
                    {/* Close btn on mobile */}
                    <button className="lg:hidden absolute top-5 right-5 p-1 text-slate-400" onClick={() => setIsOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 pb-4">
                    {NAV_ITEMS.map((group) => (
                        <div key={group.section}>
                            <p className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#6b6b7f]">
                                {group.section}
                            </p>
                            {group.items.map((item: any) => {
                                const isCMSChildActive = ['/automation-templates', '/app-templates', '/implementation', '/content-cms'].some(p => pathname.startsWith(p));
                                const active = isActive(item.href) || (item.label === 'Content CMS' && isCMSChildActive);
                                const badgeCount = item.badgeKey ? (badges?.[item.badgeKey as keyof typeof badges] ?? 0) : 0;
                                
                                if (item.isNested && !cmsOpen) return null;

                                const commonClasses = `flex items-center w-full gap-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 mb-0.5 ${
                                    active
                                        ? `bg-[#22243d] ${item.isNested ? 'text-white' : 'text-[#4f8ff7]'} font-semibold`
                                        : 'text-[#8b8b9f] hover:text-white hover:bg-white/5'
                                } ${item.isNested ? 'pl-10 pr-3' : 'px-3'}`;

                                const content = (
                                    <>
                                        <span className={`flex-shrink-0 ${active && !item.isNested ? 'text-[#4f8ff7]' : 'text-[#6b6b7f]'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="flex-1 truncate text-left">{item.label}</span>
                                        
                                        {item.isFolder && (
                                            <span className={`shrink-0 ml-auto ${active ? 'text-[#4f8ff7] text-[10px]' : 'text-[#6b6b7f]'}`}>
                                                {cmsOpen ? '▼' : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>}
                                            </span>
                                        )}
                                        
                                        {badgeCount > 0 && (
                                            <span className="ml-auto text-[11px] font-bold bg-[#ef4444] text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                                                {badgeCount > 99 ? '99+' : badgeCount}
                                            </span>
                                        )}
                                    </>
                                );

                                return item.isFolder ? (
                                    <button
                                        key={item.href}
                                        onClick={() => setCmsOpen(!cmsOpen)}
                                        className={commonClasses}
                                    >
                                        {content}
                                    </button>
                                ) : (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={commonClasses}
                                    >
                                        {content}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Profile footer — always pinned to bottom */}
                <div className="shrink-0 px-4 py-4 border-t border-[#2a2a3b] bg-[#1e1e2f]">
                    <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {profile ? profile.first_name[0] : 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate">
                                {profile ? `${profile.first_name} ${profile.last_name}` : 'Super Admin'}
                            </p>
                            <p className="text-[11px] text-[#8b8b9f] truncate">{profile?.email ?? 'admin@iba.ai'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="p-1.5 text-[#6b6b7f] hover:text-rose-400 transition-colors rounded-lg shrink-0"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
