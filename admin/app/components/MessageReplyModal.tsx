'use client';

import { useState, useEffect, useRef } from 'react';
import { adminFetch } from '../lib/api';
import { useScrollLock } from '../lib/useScrollLock';

interface Props {
    threadId: string;
    onClose: () => void;
    onReplied?: () => void;
}

function formatTimeOnly(dateString: string) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateDisplay(dateString: string) {
    if (!dateString) return '';
    const d = new Date(dateString);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${formatTimeOnly(dateString)}`;
}

export function MessageReplyModal({ threadId, onClose, onReplied }: Props) {
    useScrollLock();
    const [thread, setThread] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyBody, setReplyBody] = useState('');
    const [sending, setSending] = useState(false);
    const scrollEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        adminFetch<{success: boolean, data: any}>(`/messages/${threadId}`)
            .then(res => {
                setThread(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [threadId]);

    useEffect(() => {
        if (thread?.messages) {
            scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [thread]);

    const handleSend = async () => {
        if (!replyBody.trim() || sending) return;
        setSending(true);
        try {
            const res = await adminFetch<{success: boolean, data: any}>(`/messages/${threadId}/reply`, {
                method: 'POST',
                body: JSON.stringify({ body: replyBody.trim() })
            });

            if (res.success && res.data) {
                const newMsg = {
                    id: 'temp-' + Date.now(),
                    sender_type: 'admin',
                    body: replyBody.trim(),
                    sent_at: new Date().toISOString()
                };
                setThread((prev: any) => ({
                    ...prev,
                    messages: [...(prev?.messages || []), newMsg]
                }));
                setReplyBody('');
                onReplied?.();
                setTimeout(() => {
                    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } catch (e) {
            console.error('Failed to send', e);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSend();
        }
    };

    if (loading || !thread) {
        return (
            <div
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[600px] h-[500px] flex items-center justify-center panel-fade-in">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-[#4a8df8] rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const { client, related_entity_id, messages } = thread;
    const clientName = client ? `${client.first_name} ${client.last_name}` : 'Unknown Client';

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
        >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

            <div className="relative bg-white w-full max-w-[640px] rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] min-h-[600px] panel-fade-in">
                {/* Header */}
                <div className="px-6 py-4.5 border-b border-slate-100 flex items-start justify-between shrink-0 bg-white">
                    <div>
                        <h2 className="text-[20px] font-bold text-slate-800 tracking-tight leading-tight">
                            {clientName}
                        </h2>
                        {related_entity_id && (
                            <p className="text-[13px] text-slate-500 font-medium mt-0.5 tracking-wide">
                                Re: {related_entity_id}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-md flex items-center justify-center transition-colors mt-0.5 shrink-0"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* Body (Messages) */}
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-white flex flex-col gap-6">
                    {messages?.length === 0 && (
                        <div className="text-center text-slate-400 font-medium text-sm my-auto">
                            No messages in this thread yet.
                        </div>
                    )}
                    {messages?.map((msg: any) => {
                        const isAdmin = msg.sender_type === 'admin';
                        return (
                            <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                <div className="text-[11px] font-medium text-slate-400 mb-1.5 px-1">
                                    {isAdmin ? 'You (IBA)' : clientName} · {formatDateDisplay(msg.sent_at)}
                                </div>
                                <div
                                    className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-[14px] leading-relaxed relative ${
                                        isAdmin
                                            ? 'bg-[#4a8df8] text-white rounded-tr-sm'
                                            : 'bg-[#f4f6f9] text-slate-800 rounded-tl-sm'
                                    }`}
                                >
                                    {msg.body}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollEndRef} />
                </div>

                {/* Footer (Reply Area) */}
                <div className="px-6 py-5 border-t border-slate-100 bg-white shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                    <textarea
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your reply..."
                        className="w-full border border-slate-200 rounded-xl py-3.5 px-4 text-[14px] text-slate-800 outline-none focus:border-[#4a8df8] transition-colors min-h-[90px] resize-none shadow-sm placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                    />
                    
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSend}
                                disabled={sending || !replyBody.trim()}
                                className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white font-bold py-2.5 px-6 rounded-lg text-[13px] transition-colors shadow-sm disabled:opacity-50"
                            >
                                {sending ? 'Sending...' : 'Send Reply'}
                            </button>
                            <button
                                onClick={() => alert('Attachments coming soon!')}
                                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold py-2.5 px-4 rounded-lg text-[13px] transition-colors shadow-sm"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                Attach
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-semibold py-2.5 px-5 rounded-lg text-[13px] transition-colors shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="mt-3 text-[11px] font-medium text-slate-400">
                        Ctrl+Enter to send · Max 10MB per file
                    </div>
                </div>
            </div>
        </div>
    );
}
