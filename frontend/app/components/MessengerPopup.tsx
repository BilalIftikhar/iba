'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
    fetchMessageThreads, 
    fetchMessageThread, 
    sendMessage, 
    createMessageThread,
    uploadFile
} from '../lib/api';
import { getSocket } from '../lib/socket';

interface MessengerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  relatedEntityId?: string;
  category?: string;
}

export function MessengerPopup({ isOpen, onClose, relatedEntityId, category = 'support' }: MessengerPopupProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
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
                    const isMobile = window.innerWidth < 640;
                    const popupWidth = isMobile ? window.innerWidth - 32 : 380;
                    setCoords({
                        top: rect.top - (isMobile ? 10 : 8),
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
    if (isOpen) {
        loadThread();
    } else {
        setMessages([]);
        setThreadId(null);
    }
  }, [isOpen, relatedEntityId]);

  const loadThread = async () => {
    setLoading(true);
    try {
        const threads: any = await fetchMessageThreads();
        const existing = threads.find((t: any) => t.related_entity_id === relatedEntityId);
        
        if (existing) {
            setThreadId(existing.id);
            const detail: any = await fetchMessageThread(existing.id);
            setMessages(detail.messages || []);
        } else {
            // No thread yet, will create on first message or just stay empty
            setMessages([]);
        }
    } catch (err) {
        console.error('Failed to load thread', err);
    } finally {
        setLoading(false);
    }
  };

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
  }, [isOpen, onClose, messages]);

  useEffect(() => {
    const socket = getSocket();
    
    const handleNewMessage = (data: any) => {
        if (data.thread_id === threadId) {
            setMessages(prev => [...prev, data.message]);
        }
    };

    socket.on('client:new_message', handleNewMessage);
    
    return () => {
        socket.off('client:new_message', handleNewMessage);
    };
  }, [threadId]);

  const handleSend = async () => {
    if ((!message.trim() && !selectedFile) || sending || uploading) return;

    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please select a smaller file.');
        return;
    }

    setSending(true);
    
    const body = message.trim();
    const file = selectedFile;
    
    setMessage('');
    setSelectedFile(null);

    try {
        let attachment_url = undefined;
        let attachment_name = undefined;

        if (file) {
            setUploading(true);
            const uploadRes = await uploadFile(file);
            attachment_url = uploadRes.url;
            attachment_name = uploadRes.name;
            setUploading(false);
        }

        if (!threadId) {
            const newThread: any = await createMessageThread(category, relatedEntityId || null, body, attachment_url, attachment_name);
            setThreadId(newThread.id);
            setMessages(newThread.messages || []);
        } else {
            const newMsg: any = await sendMessage(threadId, body, attachment_url, attachment_name);
            setMessages(prev => [...prev, newMsg]);
        }
    } catch (err) {
        console.error('Failed to send message', err);
        setMessage(body);
        setSelectedFile(file);
    } finally {
        setSending(false);
        setUploading(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error('Download failed', err);
        window.open(url, '_blank');
    }
  };

  if (!isOpen) return <div ref={portalPlaceholderRef} className="hidden" />;

  const formatTime = (ts: string) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const content = (
    <div 
      ref={containerRef}
      className="fixed z-[9999]"
      style={{ 
        top: `${coords.top}px`, 
        left: `${coords.left}px`,
        transform: 'translateY(-100%)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="w-[calc(100vw-32px)] sm:w-[380px] max-w-[380px] bg-white rounded-[24px] shadow-[0_30px_60px_-12px_rgba(50,50,93,0.25),0_18px_36px_-18px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-slate-100"
        style={{ animation: 'slideUp 0.3s ease-out', transformOrigin: 'bottom right' }}
      >
        <div className="p-4 px-5 flex items-center justify-between border-b border-slate-50 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-100">
                <img src="/images/messenger_avatar.png" alt="Support" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://ui-avatars.com/api/?name=IBA+Support&background=E0FCF9&color=00C2FF'} />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1E293B] leading-tight">IBA Support</h3>
              <p className="text-[12px] font-medium text-slate-400 mt-0.5">Active now</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-500 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 min-h-[240px] max-h-[400px] overflow-y-auto p-4 flex flex-col gap-4 bg-white">
          {loading ? (
             <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">Loading conversation...</div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#00c2ff]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <p className="text-[13px] font-bold text-slate-700">No messages yet</p>
                <p className="text-[12px] text-slate-400">Send a message to start a conversation with our support team.</p>
            </div>
          ) : (
            <>
                <div className="flex items-center justify-center mb-1">
                    <span className="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase">CONVERSATION</span>
                </div>
                {messages.map((msg) => {
                    const isUser = msg.sender_type === 'client';
                    return (
                        <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1 max-w-[90%] ${isUser ? 'self-end' : 'self-start'}`}>
                            {!isUser && (
                                <div className="flex gap-2.5 items-start">
                                    <div className="w-6 h-6 rounded bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-[16px] rounded-tl-none p-3 px-3.5">
                                            <p className="text-[13px] text-[#334155] leading-relaxed">{msg.body}</p>
                                            {msg.attachment_url && (
                                                <div className="mt-2 pt-2 border-t border-slate-100">
                                                    {msg.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                        <div className="flex flex-col gap-2">
                                                            <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer">
                                                                <img src={msg.attachment_url} alt="Attachment" className="max-w-full rounded-lg" />
                                                            </a>
                                                            <button onClick={() => handleDownload(msg.attachment_url!, msg.attachment_name || 'image.jpg')} className="text-[10px] text-blue-500 font-bold hover:underline flex items-center gap-1">
                                                                📥 Download Image
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleDownload(msg.attachment_url!, msg.attachment_name || 'file')}
                                                            className="text-xs text-blue-500 font-bold underline text-left"
                                                        >
                                                            📎 {msg.attachment_name || 'File'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-slate-400 ml-1 mt-1 font-medium">{formatTime(msg.sent_at)}</span>
                                    </div>
                                </div>
                            )}
                            {isUser && (
                                <>
                                    <div className="bg-[#00D1FF] rounded-[16px] rounded-tr-none p-3 px-3.5 shadow-lg shadow-cyan-400/10">
                                        <p className="text-[13px] text-white leading-relaxed font-medium">{msg.body}</p>
                                        {msg.attachment_url && (
                                            <div className="mt-2 pt-2 border-t border-white/20">
                                                {msg.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                    <div className="flex flex-col gap-2">
                                                        <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer">
                                                            <img src={msg.attachment_url} alt="Attachment" className="max-w-full rounded-lg" />
                                                        </a>
                                                        <button onClick={() => handleDownload(msg.attachment_url!, msg.attachment_name || 'image.jpg')} className="text-[10px] text-white font-bold hover:underline flex items-center gap-1">
                                                            📥 Download Image
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleDownload(msg.attachment_url!, msg.attachment_name || 'file')}
                                                        className="text-xs text-white font-bold underline text-left"
                                                    >
                                                        📎 {msg.attachment_name || 'File'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-slate-400 mr-1 font-medium">{formatTime(msg.sent_at)}</span>
                                </>
                            )}
                        </div>
                    );
                })}
            </>
          )}
        </div>

        {selectedFile && (
            <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs text-blue-500 font-bold">📎</span>
                    <span className="text-xs text-slate-500 truncate font-medium">{selectedFile.name}</span>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
            </div>
        )}

        <div className="p-4 px-5 border-t border-slate-50 bg-white flex flex-col gap-4">
            <div className="relative">
                <button className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                </button>
                <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="w-full h-12 pl-12 pr-12 bg-[#F8FAFC] border-none rounded-[16px] text-[14px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                </button>
            </div>
            <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-4 text-slate-400">
                    <input 
                        type="file" 
                        id="messenger-file" 
                        className="hidden" 
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
                    />
                    <button onClick={() => document.getElementById('messenger-file')?.click()} className="hover:text-slate-600 transition-colors">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </button>
                    <button onClick={() => document.getElementById('messenger-file')?.click()} className="hover:text-slate-600 transition-colors">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                    </button>
                </div>
                <button 
                    onClick={handleSend}
                    className="bg-[#00D1FF] hover:bg-[#00B8E0] text-white px-7 py-2.5 rounded-2xl text-[14px] font-black transition-all shadow-lg shadow-cyan-400/20 flex items-center gap-2"
                    disabled={(!message.trim() && !selectedFile) || sending || uploading}
                >
                    {sending || uploading ? '...' : 'Send'} 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );

  return (
    <>
        <div ref={portalPlaceholderRef} className="hidden" />
        {createPortal(content, document.body)}
    </>
  );
}


