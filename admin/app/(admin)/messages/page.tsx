'use client';

import { useEffect, useState, useRef } from 'react';
import { CreateBookingModal } from '../../components/CreateBookingModal';
import { adminFetch, adminUploadFile } from '../../lib/api';
import { getSocket } from '../../lib/socket';

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

function formatTime(dateString: string) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessagesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [threads, setThreads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [activeThread, setActiveThread] = useState<any>(null);
    const [replyBody, setReplyBody] = useState('');
    const [sending, setSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadThreads = () => {
        adminFetch<any[]>('/messages')
            .then(res => setThreads(res || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadThreads();
    }, []);

    useEffect(() => {
        if (!selectedThreadId) {
            setActiveThread(null);
            return;
        }
        adminFetch<any>(`/messages/${selectedThreadId}`)
            .then(res => {
                setActiveThread(res);
                // clear unread locally
                setThreads(prev => prev.map(t => t.id === selectedThreadId ? { ...t, unreadCount: 0 } : t));
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            })
            .catch(console.error);
    }, [selectedThreadId]);

    useEffect(() => {
        const socket = getSocket();
        
        const handleNewMessage = (data: any) => {
            console.log('[AdminMessages] New live message received:', data);
            
            // If the message is for the currently open thread, add it directly
            if (data.thread_id === selectedThreadId) {
                setActiveThread((prev: any) => ({
                    ...prev,
                    messages: [...(prev?.messages || []), data.message]
                }));
                // scroll to bottom
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            
            // Refresh thread list to show latest body and unread status
            loadThreads();
        };

        socket.on('admin:new_message', handleNewMessage);
        
        return () => {
            socket.off('admin:new_message', handleNewMessage);
        };
    }, [selectedThreadId]);

    const handleSend = async () => {
        if ((!replyBody.trim() && !selectedFile) || !selectedThreadId || sending || uploading) return;

        if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit. Please select a smaller file.');
            return;
        }

        setSending(true);
        const body = replyBody.trim();
        const file = selectedFile;
        setReplyBody('');
        setSelectedFile(null);

        try {
            let attachment_url = undefined;
            let attachment_name = undefined;

            if (file) {
                setUploading(true);
                const up = await adminUploadFile(file);
                attachment_url = up.url;
                attachment_name = up.name;
                setUploading(false);
            }

            const res = await adminFetch<any>(`/messages/${selectedThreadId}/reply`, {
                method: 'POST',
                body: JSON.stringify({ body: body || '', attachment_url, attachment_name })
            });

            if (res) {
                // Optimistically append message
                const newMsg = {
                    id: 'temp-' + Date.now(),
                    sender_type: 'admin',
                    body: body || '',
                    attachment_url,
                    attachment_name,
                    sent_at: new Date().toISOString()
                };
                setActiveThread((prev: any) => ({
                    ...prev,
                    messages: [...(prev?.messages || []), newMsg]
                }));
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                loadThreads();
            }
        } catch (e) {
            console.error('Failed to send', e);
            setReplyBody(body);
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

    return (
        <>
            <div className="pb-6 fade-in flex flex-col" style={{ minHeight: 'calc(100dvh - 6rem)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Messages</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">All customer message threads</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary font-bold text-slate-600 shadow-sm bg-white">
                        + New Message
                    </button>
                    <button onClick={() => setShowCreateModal(true)} className="btn btn-primary font-bold shadow-sm">
                        + Create Booking
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Left Pane - Threads List */}
                <div className="w-full lg:w-[35%] flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-100 shrink-0">
                        <h2 className="text-[15px] font-bold text-slate-800">All Threads</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {loading && threads.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">Loading threads...</div>
                        ) : threads.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No message threads found.</div>
                        ) : (
                            threads.map((t) => (
                                <button 
                                    key={t.id} 
                                    onClick={() => setSelectedThreadId(t.id)}
                                    className={`w-full text-left p-5 flex items-start gap-4 transition-colors ${selectedThreadId === t.id ? 'bg-slate-50/50 border-l-2 border-l-[#00c2ff]' : 'hover:bg-slate-50 border-l-2 border-l-transparent'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[13px] font-bold shrink-0">
                                        {t.client?.first_name?.[0]}{t.client?.last_name?.[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className={`text-[14px] truncate ${t.unreadCount > 0 ? 'font-bold text-slate-800' : 'font-semibold text-slate-700'}`}>
                                                {t.client?.first_name} {t.client?.last_name}
                                            </h3>
                                            <span className="text-[12px] font-medium text-slate-400 shrink-0 ml-2">{timeAgo(t.last_message_at)}</span>
                                        </div>
                                        <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed tracking-wide pr-6 relative">
                                            {t.messages?.[0]?.body || 'No messages yet.'}
                                            {t.unreadCount > 0 && (
                                                <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#3b82f6] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white animate-in zoom-in duration-300">
                                                    {t.unreadCount > 9 ? '9+' : t.unreadCount}
                                                </span>
                                            )}
                                        </p>
                                        {t.related_entity_id && (
                                            <div className="text-[11px] font-bold text-[#3b82f6] mt-2 tracking-wide font-mono">
                                                {t.related_entity_id}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Pane - Chat Window */}
                <div className="w-full lg:w-[65%] flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {activeThread ? (
                        <>
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[13px] font-bold shrink-0">
                                        {activeThread.client?.first_name?.[0]}{activeThread.client?.last_name?.[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] font-bold text-slate-800">
                                            {activeThread.client?.first_name} {activeThread.client?.last_name}
                                        </h2>
                                        <span className="text-[12px] text-slate-500 font-medium">{activeThread.client?.email}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {activeThread.related_entity_id ? (
                                        <button className="text-[12px] font-bold border border-blue-200 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg">
                                            View {activeThread.related_entity_id}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                            
                            <div className="flex-1 bg-[#f8fafc] overflow-y-auto p-6 space-y-4">
                                {activeThread.messages?.map((m: any) => {
                                    const isClient = m.sender_type === 'client';
                                    return (
                                        <div key={m.id} className={`flex ${isClient ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                                                isClient 
                                                    ? 'bg-white border border-slate-200 text-slate-800' 
                                                    : 'bg-[#3b82f6] text-white'
                                            }`}>
                                                <p className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap">{m.body}</p>
                                                    {m.attachment_url && (
                                                        <div className={`mt-2 pt-2 border-t ${isClient ? 'border-slate-100' : 'border-white/10'}`}>
                                                            {m.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                                <div className="flex flex-col gap-2">
                                                                    <a href={m.attachment_url} target="_blank" rel="noopener noreferrer">
                                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                        <img src={m.attachment_url} alt="Attachment" className="max-w-full rounded-lg shadow-sm" />
                                                                    </a>
                                                                    <button onClick={() => handleDownload(m.attachment_url!, m.attachment_name || 'image.jpg')} className={`text-[11px] font-bold hover:underline flex items-center gap-1 ${isClient ? 'text-blue-500' : 'text-blue-100'}`}>
                                                                        📥 Download Image
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleDownload(m.attachment_url!, m.attachment_name || 'file')}
                                                                    className={`text-xs font-bold underline flex items-center gap-1 text-left ${isClient ? 'text-blue-500' : 'text-blue-100'}`}
                                                                >
                                                                    📎 {m.attachment_name || 'File'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                <div className={`text-[10px] mt-1 font-semibold ${isClient ? 'text-slate-400' : 'text-blue-200'}`}>
                                                    {formatTime(m.sent_at)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                            
                            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                                {selectedFile && (
                                    <div className="mb-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="text-blue-500 text-xs font-bold">📎</span>
                                            <span className="text-slate-600 text-[11px] font-medium truncate">{selectedFile.name}</span>
                                        </div>
                                        <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
                                    </div>
                                )}
                                <div className="relative border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#3b82f6] focus-within:ring-1 focus-within:ring-[#3b82f6] transition-all bg-slate-50/50">
                                    <textarea 
                                        placeholder="Type a message.. (Ctrl+Enter to send)"
                                        className="w-full text-[14px] bg-transparent outline-none resize-none p-4 min-h-[90px] font-medium placeholder-slate-500 text-slate-800"
                                        value={replyBody}
                                        onChange={(e) => setReplyBody(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.ctrlKey && e.key === 'Enter') handleSend();
                                            if (e.metaKey && e.key === 'Enter') handleSend();
                                        }}
                                    ></textarea>
                                    <div className="flex items-center justify-between p-2 pt-0">
                                        <span className="text-[11px] font-medium tracking-wide text-slate-400 px-2">Ctrl+Enter to send</span>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="file" 
                                                id="admin-file-picker" 
                                                className="hidden" 
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            />
                                            <button 
                                                onClick={() => document.getElementById('admin-file-picker')?.click()}
                                                className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                            </button>
                                            <button 
                                                onClick={handleSend}
                                                disabled={sending || uploading || (!replyBody.trim() && !selectedFile)}
                                                className="bg-[#3b82f6] text-white px-5 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
                                            >
                                                {sending || uploading ? '...' : (activeThread.messages?.length === 0 ? 'Create Message' : 'Send Reply')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            </div>
                            <p className="text-[14px] font-medium">Select a thread to view or reply to messages</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        {showCreateModal && <CreateBookingModal onClose={() => setShowCreateModal(false)} />}
        </>
    );
}
