'use client';

import React from 'react';
import Link from 'next/link';

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

// ─── Modal Items Mock Data ─────────────────────────────────────────────────
const MODAL_NOTIFICATIONS = [
  {
    id: 1,
    icon: <CheckCircleIcon color="#10B981" />,
    iconBg: '#D1FAE5',
    text: "Your lead enrichment pipeline has successfully completed its run.",
    time: "2 mins ago",
    unread: true,
  },
  {
    id: 2,
    icon: <CalendarIcon color="#0EA5E9" />,
    iconBg: '#E0F2FE',
    text: "A new booking has been received for the 'Marketing Automation' flow.",
    time: "45 mins ago",
    unread: true,
  },
  {
    id: 3,
    icon: <WarningIcon color="#D97706" />,
    iconBg: '#FEF3C7',
    text: "System maintenance scheduled for Feb 15th at 02:00 AM UTC.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 4,
    icon: <GraphIcon color="#64748B" />,
    iconBg: '#F1F5F9',
    text: "Global traffic spike detected in EU-West region. Scaling active nodes...",
    time: "3 hours ago",
    unread: false,
  }
];

export const UNREAD_COUNT = MODAL_NOTIFICATIONS.filter(n => n.unread).length;

export function NotificationModal({ isOpen, onClose, onRead }: { isOpen: boolean; onClose: () => void; onRead?: () => void }) {
  const [readIds, setReadIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      // Mark all as read when modal opens
      setReadIds(MODAL_NOTIFICATIONS.map(n => n.id));
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
        <div className="px-4 sm:px-5 pb-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          {MODAL_NOTIFICATIONS.map((notif) => (
            <div key={notif.id} className={`rounded-[16px] p-3 sm:p-4 pr-5 sm:pr-6 flex items-start gap-3 sm:gap-4 hover:bg-slate-50 transition-colors cursor-pointer border ${notif.unread && !readIds.includes(notif.id) ? 'bg-[#F0FAFF] border-cyan-100' : 'bg-[#F8FAFC] border-transparent hover:border-slate-100'}`}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: notif.iconBg }}>
                {notif.icon}
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5 flex-1">
                <p className="text-[13px] sm:text-[14px] leading-snug font-medium text-[#334155]">{notif.text}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] sm:text-[12px] font-semibold text-slate-400">{notif.time}</p>
                  {notif.unread && !readIds.includes(notif.id) && (
                    <span className="text-[10px] font-bold text-white bg-red-500 rounded-full px-1.5 py-0.5">NEW</span>
                  )}
                </div>
              </div>
            </div>
          ))}
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

