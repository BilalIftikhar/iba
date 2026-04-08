import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchUnreadCount } from '../lib/api';
import { NotificationModal } from './NotificationModal';

interface HeaderBarProps {
  title: string;
}

export function HeaderBar({ title }: HeaderBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
        const data = await fetchUnreadCount();
        setBadgeCount(data.count);
    } catch (e) { }
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  useEffect(() => {
    const socket = (window as any).socket;
    if (!socket) return;
    
    const handleNewNotif = () => setBadgeCount(prev => prev + 1);
    socket.on('client:new_notification', handleNewNotif);
    return () => socket.off('client:new_notification', handleNewNotif);
  }, []);

  return (
    <>
      <div className="hidden lg:flex items-center justify-between mb-8 relative z-10">
        <nav className="flex items-center gap-1.5 text-[13px] text-slate-400 font-medium">
          <span className="hover:text-slate-600 cursor-pointer transition-colors">Pages</span>
          <span className="mx-0.5 text-slate-300">/</span>
          <span className="text-slate-700 font-bold">{title}</span>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/automations" className="flex items-center gap-2 px-4 py-2 bg-[#00C2FF] text-white rounded-[8px] text-[13px] font-bold hover:bg-[#00b0e8] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            Ai Automation and Agents
          </Link>

          {/* Bell button with unread badge */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-[#FFFFFF] text-slate-400 hover:bg-slate-50 border border-slate-200 transition-colors relative"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {badgeCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-md shadow-red-200 ring-2 ring-white"
                style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}
              >
                {badgeCount > 9 ? '9+' : badgeCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] border border-slate-200 rounded-[8px] text-sm text-slate-400 w-52">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search systems..." className="w-full bg-transparent outline-none text-[13px] text-slate-600 placeholder-slate-400" />
          </div>
        </div>
      </div>
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRead={() => setBadgeCount(0)}
      />
    </>
  );
}
