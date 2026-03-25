'use client';

import React, { useState } from 'react';

// ─── Icons ─────────────────────────────────────────────────────────────────
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

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

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function AIButtonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

// Data specific icons
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

function AlertCircleIcon({ color = "#EF4444" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function MailIcon({ color = "#3B82F6" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ClockIcon({ color = "#8B5CF6" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UserPlusIcon({ color = "#64748B" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

function StarIcon({ color = "#F97316" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
    time: "2 mins ago"
  },
  {
    id: 2,
    icon: <CalendarIcon color="#0EA5E9" />,
    iconBg: '#E0F2FE',
    text: "A new booking has been received for the 'Marketing Automation' flow.",
    time: "45 mins ago"
  },
  {
    id: 3,
    icon: <WarningIcon color="#D97706" />, // Darker yellow for accessibility on light bg
    iconBg: '#FEF3C7',
    text: "System maintenance scheduled for Feb 15th at 02:00 AM UTC.",
    time: "2 hours ago"
  },
  {
    id: 4,
    icon: <GraphIcon color="#64748B" />,
    iconBg: '#F1F5F9',
    text: "Global traffic spike detected in EU-West region. Scaling active nodes...",
    time: "3 hours ago"
  }
];

// ─── Page Details Component Data ───────────────────────────────────────────
const NOTIFICATION_DETAILS_LEFT = [
  {
    id: 1,
    title: "Pipeline Success",
    time: "2m ago",
    text: "Your lead enrichment pipeline has successfully completed its run.",
    icon: <CheckCircleIcon color="#10B981" />,
    iconBg: '#D1FAE5',
    badgeText: "ID: #ENR-992B",
    badgeStyles: { bg: '#F1F5F9', color: '#64748B' }
  },
  {
    id: 2,
    title: "Maintenance",
    time: "2h ago",
    text: "System maintenance scheduled for Feb 15th at 02:00 AM UTC.",
    icon: <WarningIcon color="#D97706" />,
    iconBg: '#FEF3C7',
    actionText: "VIEW SCHEDULE",
    actionColor: "#64748B"
  },
  {
    id: 3,
    title: "New Report Ready",
    time: "5h ago",
    text: "Your weekly performance analytics report is now available.",
    icon: <MailIcon color="#3B82F6" />,
    iconBg: '#DBEAFE',
    badgeText: "WEEKLY SUMMARY",
    badgeStyles: { bg: '#EFF6FF', color: '#3B82F6' }
  },
  {
    id: 4,
    title: "Member Joined",
    time: "Yesterday",
    text: "David Chen has joined your organization workspace.",
    icon: <UserPlusIcon color="#64748B" />,
    iconBg: '#F1F5F9',
    badgeText: "SALES TEAM",
    badgeStyles: { bg: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }
  }
];

const NOTIFICATION_DETAILS_RIGHT = [
  {
    id: 5,
    title: "New Booking",
    time: "45m ago",
    text: "A new booking has been received for 'Marketing Automation'.",
    icon: <CalendarIcon color="#00C2FF" />,
    iconBg: '#E0FCF9',
    badgeText: "SARAH JENKINS",
    badgeStyles: { bg: '#E0FCF9', color: '#00C2FF' }
  },
  {
    id: 6,
    title: "Traffic Spike",
    time: "3h ago",
    text: "EU-West region scaling active nodes due to high traffic.",
    icon: <AlertCircleIcon color="#EF4444" />,
    iconBg: '#FEE2E2',
    isProgress: true,
    progressLabel: "LOAD: 85%",
    progressRegion: "EU-WEST",
    progressValue: "85%"
  },
  {
    id: 7,
    title: "Update Available",
    time: "8h ago",
    text: "A new version of the CRM connector is available for install.",
    icon: <ClockIcon color="#8B5CF6" />,
    iconBg: '#F3E8FF',
    actionText: "WHAT'S NEW?",
    actionColor: "#8B5CF6"
  },
  {
    id: 8,
    title: "Campaign Goal",
    time: "Yesterday",
    text: "Outbound Flow 'Q1 Promo' reached 85% of its lead target.",
    icon: <StarIcon color="#F97316" />,
    iconBg: '#FFEDD5',
    badgeText: "MILESTONE REACHED",
    badgeStyles: { bg: '#FFF7ED', color: '#F97316', border: '1px solid #FFEDD5' }
  }
];

// ─── Component Code ────────────────────────────────────────────────────────
export function NotificationsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-16">
      {/* ── Top Bar ── */}
      <div className="bg-[#F5F7FA] px-8 py-8 flex items-center justify-between hidden lg:flex">
        <nav className="flex items-center gap-1.5 text-[13px] text-slate-400 font-medium tracking-wide">
          <span className="hover:text-slate-600 transition-colors cursor-pointer">Pages</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold cursor-pointer">Notifications</span>
        </nav>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#00C2FF] hover:bg-[#00b0e8] text-white rounded-[10px] text-[13px] font-bold transition-all shadow-sm shadow-cyan-200">
            <AIButtonIcon />
            Ai Automation and Agents
          </button>
          <button 
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-white text-slate-400 hover:text-slate-600 border border-slate-200 shadow-sm transition-all"
          >
            <BellIcon />
          </button>
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-[13px] shadow-sm w-[200px]">
            <span className="text-slate-300"><SearchIcon /></span>
            <input type="text" placeholder="Search systems..." className="w-full outline-none bg-transparent placeholder-slate-400 font-medium text-slate-700" />
          </div>
        </div>
      </div>

      {/* ── Notification Modal overlay ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div 
            className="w-[480px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellCyanIcon />
                <h2 className="text-[18px] font-bold text-[#1E293B]">Notifications</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal List */}
            <div className="px-5 pb-4 flex flex-col gap-3">
              {MODAL_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className="bg-[#F8FAFC] rounded-[16px] p-4 pr-6 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: notif.iconBg }}>
                    {notif.icon}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[14px] leading-snug font-medium text-[#334155]">{notif.text}</p>
                    <p className="text-[12px] font-semibold text-slate-400">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Bottom Button */}
            <div className="px-5 pb-5 pt-2">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-[#00C2FF] hover:bg-[#00b0e8] text-white font-bold py-3.5 rounded-[12px] text-[15px] flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-200"
              >
                View all notifications
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Page Implementation ── */}
      <div className="px-8 max-w-[1700px] mx-auto pb-12">
        <div className="mb-10 block text-center">
          <h1 className="text-[28px] md:text-[32px] font-[800] text-[#1E293B] mb-2 tracking-tight">Your Notifications</h1>
          <p className="text-[15px] text-[#64748B] font-medium">Stay updated with your latest account activity and system status.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-[1200px] mx-auto">
          {/* Left Column */}
          <div className="flex flex-col gap-5">
            {NOTIFICATION_DETAILS_LEFT.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col gap-5">
            {NOTIFICATION_DETAILS_RIGHT.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual notification cards
type NotificationItem = {
  id: number;
  title: string;
  time: string;
  text: string;
  icon: React.ReactNode;
  iconBg: string;
  badgeText?: string;
  badgeStyles?: { bg: string; color: string; border?: string };
  actionText?: string;
  actionColor?: string;
  isProgress?: boolean;
  progressLabel?: string;
  progressRegion?: string;
  progressValue?: string;
};

function NotificationCard({ item }: { item: NotificationItem }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[20px] p-6 hover:shadow-md transition-shadow duration-300 flex items-start gap-5 cursor-pointer flex-col sm:flex-row shadow-sm">
      <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.iconBg }}>
        {item.icon}
      </div>
      <div className="flex-1 w-full relative">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[16px] font-bold text-[#1E293B]">{item.title}</h3>
          <span className="text-[12px] font-semibold text-slate-400 absolute sm:static right-0 top-0 sm:top-auto sm:right-auto">
            {item.time}
          </span>
        </div>
        <p className="text-[14px] text-[#475569] leading-relaxed mb-4 max-w-[90%]">
          {item.text}
        </p>

        {/* Dynamic bottom area */}
        {item.badgeText && !item.isProgress && (
          <span 
            className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg"
            style={{ 
              backgroundColor: item.badgeStyles?.bg, 
              color: item.badgeStyles?.color,
              border: item.badgeStyles?.border || 'none'
            }}
          >
            {item.badgeText}
          </span>
        )}

        {item.actionText && (
          <button 
            className="text-[11px] font-bold uppercase tracking-wider transition-opacity hover:opacity-70"
            style={{ color: item.actionColor }}
          >
            <span className={item.actionColor === '#64748B' ? 'border-b-2 border-slate-400 pb-0.5' : ''}>
              {item.actionText}
            </span>
          </button>
        )}

        {item.isProgress && (
          <div className="w-full">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 mt-1">
              <span>{item.progressLabel}</span>
              <span>{item.progressRegion}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: item.progressValue }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
