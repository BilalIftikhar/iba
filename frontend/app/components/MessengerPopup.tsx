'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

import { createPortal } from 'react-dom';

interface MessengerPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MessengerPopup({ isOpen, onClose }: MessengerPopupProps) {
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const portalPlaceholderRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (isOpen && portalPlaceholderRef.current) {
        const updatePosition = () => {
            if (portalPlaceholderRef.current) {
                const rect = portalPlaceholderRef.current.parentElement?.getBoundingClientRect();
                if (rect) {
                    // Position 16px above the button
                    // On mobile we might want a different logic but for now fixed width
                    const isMobile = window.innerWidth < 640;
                    const popupWidth = isMobile ? window.innerWidth - 32 : 380;
                    
                    setCoords({
                        top: rect.top - (isMobile ? 10 : 8), // Just above the button
                        left: isMobile ? 16 : rect.right - popupWidth
                    });
                }
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return <div ref={portalPlaceholderRef} className="hidden" />;

  const content = (
    <div 
      ref={containerRef}
      className="fixed z-[9999]"
      style={{ 
        top: `${coords.top}px`, 
        left: `${coords.left}px`,
        transform: 'translateY(-100%)', // Move up 100% to sit ABOVE the button
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="w-[calc(100vw-32px)] sm:w-[380px] max-w-[380px] bg-white rounded-[24px] shadow-[0_30px_60px_-12px_rgba(50,50,93,0.25),0_18px_36px_-18px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-slate-100"
        style={{ animation: 'slideUp 0.3s ease-out', transformOrigin: 'bottom right' }}
      >
        {/* Header */}
        <div className="p-4 px-5 flex items-center justify-between border-b border-slate-50 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/messenger_avatar.png" alt="Support" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://ui-avatars.com/api/?name=IBA+Support&background=E0FCF9&color=00C2FF'} />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1E293B] leading-tight">IBA Support</h3>
              <p className="text-[12px] font-medium text-slate-400 mt-0.5">Active now</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Chat Body */}
        <div 
          ref={scrollRef}
          className="flex-1 min-h-[240px] max-h-[300px] overflow-y-auto p-4 flex flex-col gap-4 bg-white"
        >
          {/* Date Divider */}
          <div className="flex items-center justify-center mb-1">
            <span className="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase">TODAY</span>
          </div>

          {/* Support Message */}
          <div className="flex gap-2.5 max-w-[90%]">
            <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex-shrink-0 mt-1 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-[16px] rounded-tl-none p-3 px-3.5">
                <p className="text-[13px] text-[#334155] leading-relaxed">
                  Hello! 👋 How can I help you with your credentials today?
                </p>
              </div>
              <span className="text-[10px] text-slate-400 ml-1 mt-1 block font-medium">09:41 AM</span>
            </div>
          </div>

          {/* User Message */}
          <div className="flex flex-col items-end gap-1 max-w-[90%] self-end">
            <div className="bg-[#00D1FF] rounded-[16px] rounded-tr-none p-3 px-3.5 shadow-lg shadow-cyan-400/10">
              <p className="text-[13px] text-white leading-relaxed font-medium">
                I&apos;m having trouble adding my certification from last week. It says the ID is invalid.
              </p>
            </div>
            <span className="text-[10px] text-slate-400 mr-1 font-medium">09:42 AM</span>
          </div>

          {/* Support Message */}
          <div className="flex gap-2.5 max-w-[90%]">
            <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex-shrink-0 mt-1 flex items-center justify-center" />
            <div>
              <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-[18px] rounded-tl-none p-3 px-3.5">
                <p className="text-[13px] text-[#334155] leading-relaxed">
                  I&apos;m sorry to hear that. Could you please provide the 12-digit reference number on your receipt?
                </p>
              </div>
              <span className="text-[10px] text-slate-400 ml-1 mt-1 block font-medium">09:43 AM</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2.5 ml-11">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-100 bg-white text-[12px] font-bold text-[#00C2FF] hover:bg-cyan-50 transition-all shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                Upload Receipt
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-100 bg-white text-[12px] font-bold text-[#00C2FF] hover:bg-cyan-50 transition-all shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                Where is it?
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 px-5 border-t border-slate-50 bg-white flex flex-col gap-4">
            <div className="relative">
                <button className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                </button>
                <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full h-12 pl-12 pr-12 bg-[#F8FAFC] border-none rounded-[16px] text-[14px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                </button>
            </div>
            <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-4 text-slate-400">
                    <button className="hover:text-slate-600 transition-colors">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </button>
                    <button className="hover:text-slate-600 transition-colors">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                    </button>
                </div>
                <button 
                    className="bg-[#00D1FF] hover:bg-[#00B8E0] text-white px-7 py-2.5 rounded-2xl text-[14px] font-black transition-all shadow-lg shadow-cyan-400/20 flex items-center gap-2"
                    disabled={!message.trim()}
                >
                    Send 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  return (
    <>
        <div ref={portalPlaceholderRef} className="hidden" />
        {createPortal(content, document.body)}
    </>
  );
}


