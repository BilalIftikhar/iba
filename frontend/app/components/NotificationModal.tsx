'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchNotifications, markNotificationsAsRead } from '../lib/api';

function timeAgo(dateString: string) {
  if (!dateString) return '';
  const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'message': return { icon: <MailIcon />, bg: '#DBEAFE' };
    case 'booking': return { icon: <CalendarIcon />, bg: '#E0FCF9' };
    case 'workflow': return { icon: <CheckCircleIcon />, bg: '#D1FAE5' };
    default: return { icon: <BellIcon />, bg: '#F1F5F9' };
  }
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────
function BellCyanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckCircleIcon({ color = "#10B981" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function CalendarIcon({ color = "#0EA5E9" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function WarningIcon({ color = "#F59E0B" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function GraphIcon({ color = "#64748B" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─── Modal Implementation ─────────────────────────────────────────────────

export function NotificationModal({ isOpen, onClose, onRead }: { isOpen: boolean; onClose: () => void; onRead?: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchNotifications()
        .then(data => setNotifications((data || []).slice(0, 8)))
        .finally(() => setLoading(false));
      
      // Mark all as read on the backend
      markNotificationsAsRead().catch(() => {});
      onRead?.();
    }
  }, [isOpen, onRead]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="w-full max-w-[480px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellCyanIcon />
            <h2 className="text-[16px] sm:text-[18px] font-bold text-[#1E293B]">Notifications</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal List */}
        <div className="px-4 sm:px-5 pb-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto min-h-[100px]">
          {loading && notifications.length === 0 ? (
             <div className="text-center py-10 text-slate-400 font-medium">Loading alerts...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-medium">No new notifications</div>
          ) : (
            notifications.map((notif) => {
              const { icon, bg } = getNotificationIcon(notif.type);
              return (
                <div key={notif.id} className={`rounded-[16px] p-3 sm:p-4 pr-5 sm:pr-6 flex items-start gap-3 sm:gap-4 bg-[#F8FAFC] border border-transparent hover:border-slate-100 transition-colors cursor-pointer`}>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: bg }}>
                    {icon}
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-1.5 flex-1">
                    <p className="text-[13px] sm:text-[14px] leading-snug font-medium text-[#334155]">{notif.title}: {notif.body}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] sm:text-[12px] font-semibold text-slate-400">{timeAgo(notif.created_at)}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Button */}
        <div className="px-4 sm:px-5 pb-5 pt-2">
          <Link href="/notifications" onClick={onClose} className="w-full bg-[#00C2FF] hover:bg-[#00b0e8] text-white font-bold py-3 sm:py-3.5 rounded-[12px] text-[14px] sm:text-[15px] flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-200">
            View all notifications
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}

