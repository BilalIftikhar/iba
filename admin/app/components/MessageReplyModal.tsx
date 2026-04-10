'use client';

import { useState, useEffect, useRef } from 'react';
import { adminFetch, adminUploadFile } from '../lib/api';
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
    const [visible, setVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    
    const scrollEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    useEffect(() => {
        adminFetch<any>(`/messages/${threadId}`)
            .then(res => {
                setThread(res);
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

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 280);
    };

    const handleSend = async () => {
        if ((!replyBody.trim() && !selectedFile) || sending || uploading) return;
        
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

            const res = await adminFetch<any>(`/messages/${threadId}/reply`, {
                method: 'POST',
                body: JSON.stringify({ body: body || '', attachment_url, attachment_name })
            });

            if (res) {
                const newMsg = {
                    id: 'temp-' + Date.now(),
                    sender_type: 'admin',
                    body: body || '',
                    attachment_url,
                    attachment_name,
                    sent_at: new Date().toISOString()
                };
                setThread((prev: any) => ({
                    ...prev,
                    messages: [...(prev?.messages || []), newMsg]
                }));
                onReplied?.();
                setTimeout(() => {
                    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSend();
        }
    };

    const panelClass = `relative bg-white w-full max-w-[550px] h-dvh shadow-2xl flex flex-col overflow-hidden panel-slide-in ${visible ? 'panel-slide-in--visible' : ''}`;

    if (loading || !thread) {
        return (
            <div className="fixed inset-0 z-[99999] flex justify-end" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
                <div className={panelClass}>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#4a8df8] rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    const { client, related_entity_id, messages } = thread;
    const clientName = client ? `${client.first_name} ${client.last_name}` : 'Unknown Client';

    return (
        <div className="fixed inset-0 z-[99999] flex justify-end" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
            <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />

            <div className={panelClass}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div>
                        <h2 className="text-[18px] font-bold text-slate-800 tracking-tight leading-tight">{clientName}</h2>
                        {related_entity_id && (
                            <p className="text-[12px] text-slate-500 font-medium mt-1 tracking-wide">
                                Re: #BOOK-{related_entity_id.substring(related_entity_id.length - 4).toUpperCase()}
                            </p>
                        )}
                    </div>
                    <button onClick={handleClose} className="w-8 h-8 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* Body (Messages) */}
                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 bg-slate-50/20 flex flex-col">
                    {messages?.length === 0 && (
                        <div className="text-center text-slate-400 font-medium text-sm my-auto">
                            No messages in this thread yet.
                        </div>
                    )}
                    {messages?.map((msg: any) => {
                        const isAdmin = msg.sender_type === 'admin';
                        return (
                            <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                <div className="text-[10px] text-slate-400 font-bold mb-1.5 px-1 uppercase tracking-widest opacity-70">
                                    {isAdmin ? 'You (IBA)' : clientName} · {formatTimeOnly(msg.sent_at)}
                                </div>
                                <div
                                    className={`px-5 py-3 rounded-2xl max-w-[85%] text-[13px] font-medium leading-relaxed shadow-sm relative ${
                                        isAdmin
                                            ? 'bg-[#4a8df8] text-white rounded-tr-sm'
                                            : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                                    }`}
                                >
                                    {msg.body}
                                    {msg.attachment_url && (
                                        <div className={`mt-2 pt-2 border-t ${isAdmin ? 'border-white/10' : 'border-slate-100'}`}>
                                             {msg.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={msg.attachment_url} alt="Attachment" className="max-w-full rounded-lg" />
                                                </a>
                                            ) : (
                                                <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className={`text-[12px] font-bold underline ${isAdmin ? 'text-white' : 'text-blue-600'}`}>
                                                    📎 {msg.attachment_name || 'Attachment'}
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollEndRef} />
                </div>

                {/* Footer (Reply Area) */}
                <div className="px-8 py-6 border-t-2 border-slate-100 bg-white shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                    <div className="mb-4">
                        <textarea
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your reply..."
                            className="w-full border border-slate-200 rounded-xl py-4 px-5 text-[14px] font-medium text-slate-800 outline-none focus:border-[#4a8df8] transition-all min-h-[100px] resize-none bg-slate-50 focus:bg-white shadow-inner placeholder:text-slate-400"
                        />
                        {selectedFile && (
                            <div className="mt-2 flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg">
                                <span className="text-[12px] font-bold text-[#4a8df8] truncate">📎 {selectedFile.name}</span>
                                <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-rose-500">✕</button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSend}
                            disabled={sending || uploading || (!replyBody.trim() && !selectedFile)}
                            className="bg-[#4a8df8] hover:bg-[#3b82f6] text-white font-bold py-2.5 px-7 rounded-xl text-[13px] transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            {sending ? 'Sending...' : 'Send Reply'}
                        </button>
                        
                        <input type="file" id="panel-file-picker" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                        <button
                            onClick={() => document.getElementById('panel-file-picker')?.click()}
                            className="flex items-center gap-2 bg-[#f8fafc] hover:bg-slate-100 border border-slate-200 text-slate-500 font-bold py-2.5 px-5 rounded-xl text-[13px] transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            Attach
                        </button>
                        
                        <button
                            onClick={handleClose}
                            className="bg-[#f8fafc] hover:bg-slate-100 border border-slate-200 text-slate-500 font-bold py-2.5 px-6 rounded-xl text-[13px] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                    
                    <div className="mt-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Ctrl+Enter to send · Max 10MB
                    </div>
                </div>
            </div>
        </div>
    );
}
