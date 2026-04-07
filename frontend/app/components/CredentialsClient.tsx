'use client';

import React, { useState, useEffect } from 'react';
import { fetchCredentials, createCredential, deleteCredential, updateCredential } from '../lib/api';
import { MessengerPopup } from './MessengerPopup';

type TabType = 'api_keys' | 'webhooks' | 'software';

import { HeaderBar } from './HeaderBar';

export default function CredentialsClient() {
    const [activeTab, setActiveTab] = useState<TabType>('api_keys');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [credentials, setCredentials] = useState<any[]>([]);

    const loadCreds = () => {
        fetchCredentials().then((res: any) => {
            if (Array.isArray(res)) setCredentials(res);
            else if (res && res.data) setCredentials(res.data);
        }).catch(console.error);
    };

    useEffect(() => {
        loadCreds();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteCredential(id);
            loadCreds();
        } catch (err: any) {
            alert(err.message || 'Failed to delete');
        }
    };

    const handleUpdate = async (id: string, newName: string) => {
        try {
            await updateCredential(id, { name: newName });
            loadCreds();
        } catch (err: any) {
            alert(err.message || 'Failed to update');
        }
    };

    const filteredCredentials = credentials.filter(cred => {
        if (activeTab === 'api_keys') return cred.type === 'api_key';
        if (activeTab === 'webhooks') return cred.type === 'webhook';
        if (activeTab === 'software') return cred.type === 'software';
        return false;
    });

    const getBgColor = (type: string, env: string) => {
        if (env === 'production') return 'bg-[#10A37F]';
        if (env === 'staging') return 'bg-[#EAB308]';
        if (type === 'webhook') return 'bg-[#00C2FF]';
        return 'bg-slate-500';
    };

    const getStatusColor = (env: string) => {
        if (env === 'production') return 'green';
        if (env === 'staging') return 'yellow';
        return 'blue';
    };

    const getAddButtonText = () => {
        switch (activeTab) {
            case 'api_keys': return 'API Key';
            case 'webhooks': return 'Webhook';
            case 'software': return 'Tool Credential';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] md:bg-[#F8FAFC] bg-white">
            <div className="hidden lg:block px-8 pt-8 max-w-[1240px] mx-auto w-full">
                <HeaderBar title="Security & Credentials" />
            </div>

            <div className="max-w-[1200px] mx-auto md:p-8 p-4 pt-0 lg:pt-0">
                {/* Desktop Security Banner */}
                <div className="hidden md:flex bg-white rounded-[16px] p-6 mb-12 items-start gap-4 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="w-12 h-12 bg-[#E6F8F9] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[16px] font-bold text-[#1E293B] mb-1">Secure & Encrypted</h3>
                        <p className="text-[14px] text-slate-500 leading-relaxed pr-32">
                            All credentials are encrypted using industry-standard AES-256 and stored in a hardware security module (HSM) to ensure maximum safety. Your data never leaves our encrypted perimeter.
                        </p>
                    </div>
                    <button className="text-[#00C2FF] font-medium text-[14px] flex items-center gap-1 hover:text-[#00A3D9] transition-colors whitespace-nowrap pt-1">
                        Learn more about security <span>→</span>
                    </button>
                </div>

                {/* Mobile Security Banner */}
                <div className="md:hidden flex bg-[#E6F8F9]/50 rounded-[16px] p-4 mb-6 items-center justify-between border border-blue-50 relative overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-[13px] font-bold text-[#1E293B]">Secure & Encrypted</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">AES-256 protected storage</p>
                        </div>
                    </div>
                    {/* Toggle Switch */}
                    <div className="w-[36px] h-[20px] bg-[#00C2FF] rounded-full relative cursor-pointer">
                        <div className="w-[16px] h-[16px] bg-white rounded-full absolute top-[2px] right-[2px] shadow-sm"></div>
                    </div>
                </div>

                {/* Header */}
                <div className="flex items-start md:items-end justify-between md:mb-10 mb-6">
                    <div className="max-w-[600px]">
                        <h1 className="text-[20px] md:text-[32px] font-bold text-[#1E293B] tracking-tight md:mb-2 mb-1">Your Credentials</h1>
                        <p className="hidden md:block text-[15px] text-slate-500">
                            Manage and monitor your API keys, webhooks, and third-party tool credentials securely from a centralized vault.
                        </p>
                    </div>
                    {/* Desktop Button */}
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="hidden md:flex bg-[#00C2FF] hover:bg-[#00A3D9] text-white px-6 py-2.5 rounded-xl font-semibold text-[15px] items-center gap-2 transition-colors shadow-[0_4px_12px_rgba(0,194,255,0.25)]"
                    >
                        <span>+</span> Add New {getAddButtonText()}
                    </button>
                    {/* Mobile Button */}
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="md:hidden flex bg-[#00C2FF] text-white px-3 py-1.5 rounded-lg font-semibold text-[13px] items-center gap-1 shadow-sm shrink-0 whitespace-nowrap"
                    >
                        <span>+</span> New {getAddButtonText()}
                    </button>
                </div>

                {/* Desktop Tabs */}
                <div className="hidden md:flex items-center gap-8 border-b border-slate-200 mb-8 mx-[10%] justify-center">
                    <button 
                        onClick={() => setActiveTab('api_keys')}
                        className={`pb-3 text-[14px] font-medium transition-colors relative ${activeTab === 'api_keys' ? 'text-[#1E293B]' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        API Keys
                        {activeTab === 'api_keys' && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#1E293B] rounded-t-full" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('webhooks')}
                        className={`pb-3 text-[14px] font-medium transition-colors relative ${activeTab === 'webhooks' ? 'text-[#1E293B]' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Webhooks
                        {activeTab === 'webhooks' && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#1E293B] rounded-t-full" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('software')}
                        className={`pb-3 text-[14px] font-medium transition-colors relative ${activeTab === 'software' ? 'text-[#1E293B]' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Software/Tools Credentials
                        {activeTab === 'software' && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#1E293B] rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Mobile Tabs */}
                <div className="md:hidden flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
                    <button 
                        onClick={() => setActiveTab('api_keys')}
                        className={`px-4 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors ${activeTab === 'api_keys' ? 'bg-[#00C2FF] text-white font-semibold shadow-sm' : 'text-slate-500 font-medium'}`}
                    >
                        API Keys
                    </button>
                    <button 
                        onClick={() => setActiveTab('webhooks')}
                        className={`px-4 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors ${activeTab === 'webhooks' ? 'bg-[#00C2FF] text-white font-semibold shadow-sm' : 'text-slate-500 font-medium'}`}
                    >
                        Webhooks
                    </button>
                    <button 
                        onClick={() => setActiveTab('software')}
                        className={`px-4 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors ${activeTab === 'software' ? 'bg-[#00C2FF] text-white font-semibold shadow-sm' : 'text-slate-500 font-medium'}`}
                    >
                        Software/Tools
                    </button>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-16 md:mx-[5%]">
                    {filteredCredentials.length === 0 ? (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-[16px] border border-slate-100 shadow-sm">
                            <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4 text-slate-300">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                            <h3 className="text-[18px] font-bold text-[#1E293B] mb-2">No {getAddButtonText()}s Found</h3>
                            <p className="text-[14px] text-slate-500 mb-6 max-w-[300px]">You haven't added any {activeTab.replace('_', ' ')} yet. Securely store and manage them here.</p>
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-[#00C2FF] hover:bg-[#00A3D9] text-white px-5 py-2 rounded-xl font-semibold text-[14px] transition-colors"
                            >
                                Add {getAddButtonText()}
                            </button>
                        </div>
                    ) : (
                        filteredCredentials.map(cred => (
                            <CredentialCard 
                                key={cred.id}
                                cred={cred}
                                icon={getBgColor(cred.type, cred.environment)} 
                                title={cred.name || 'Untitled Credential'} 
                                subtitle={cred.service ? `${cred.service} • ${cred.environment}` : cred.environment.charAt(0).toUpperCase() + cred.environment.slice(1)} 
                                value="••••••••••••••••" 
                                status={cred.environment === 'production' ? 'Active' : cred.environment.charAt(0).toUpperCase() + cred.environment.slice(1)}
                                statusColor={getStatusColor(cred.environment)}
                                onDelete={() => handleDelete(cred.id)}
                                onEdit={(newName) => handleUpdate(cred.id, newName)}
                            />
                        ))
                    )}
                </div>

                {/* Desktop Footer Stats */}
                <div className="hidden md:flex bg-[#EAEFF4] rounded-2xl py-6 px-12 items-center justify-between shadow-sm mx-[10%]">
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-slate-500 tracking-wider mb-1 uppercase">TOTAL CREDENTIALS</div>
                        <div className="text-[28px] font-bold text-[#1E293B]">{credentials.length}</div>
                    </div>
                    <div className="w-[1px] h-12 bg-slate-200"></div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-slate-500 tracking-wider mb-1 uppercase">SECURITY SCORE</div>
                        <div className="text-[28px] font-bold text-[#10A37F] flex items-center justify-center gap-1">
                            A+ 
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-1">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div className="w-[1px] h-12 bg-slate-200"></div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-slate-500 tracking-wider mb-1 uppercase">LAST AUDIT</div>
                        <div className="text-[28px] font-bold text-[#1E293B]">2h ago</div>
                    </div>
                </div>

                {/* Mobile Footer Stats */}
                <div className="md:hidden pb-10">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[13px] font-bold text-slate-500">Security Score</span>
                        <span className="text-[15px] font-bold text-[#00C2FF]">A+</span>
                    </div>
                    <div className="w-full h-[2px] bg-slate-100 rounded-full mb-6 relative">
                        <div className="absolute top-0 left-0 bg-[#00C2FF] w-full h-[2px] rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#F8FAFC] rounded-xl p-4 flex flex-col justify-center">
                            <span className="text-[11px] font-bold text-slate-500 mb-1">Total Credentials</span>
                            <span className="text-[18px] font-black text-[#1E293B]">{credentials.length}</span>
                        </div>
                        <div className="bg-[#F8FAFC] rounded-xl p-4 flex flex-col justify-center">
                            <span className="text-[11px] font-bold text-slate-500 mb-1">Last Audit</span>
                            <span className="text-[18px] font-black text-[#1E293B]">2h ago</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-[#475569]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
                    <div className="bg-white rounded-[20px] w-full max-w-[560px] p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#E6F8F9] flex items-center justify-center shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                                    </svg>
                                </div>
                                <h3 className="text-[18px] md:text-[20px] font-bold text-[#1E293B]">Add New {getAddButtonText()}</h3>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Modal Forms */}
                        {activeTab === 'software' && <SoftwareForm onCancel={() => setIsAddModalOpen(false)} onSuccess={() => { setIsAddModalOpen(false); loadCreds(); }} />}
                        {activeTab === 'webhooks' && <WebhookForm onCancel={() => setIsAddModalOpen(false)} onSuccess={() => { setIsAddModalOpen(false); loadCreds(); }} />}
                        {activeTab === 'api_keys' && <ApiKeyForm onCancel={() => setIsAddModalOpen(false)} onSuccess={() => { setIsAddModalOpen(false); loadCreds(); }} />}
                    </div>
                </div>
            )}
        </div>
    );
}

function CredentialCard({ cred, icon, title, subtitle, value, status, statusColor = 'green', onDelete, onEdit }: { cred: any, icon: React.ReactNode, title: string, subtitle: string, value: string, status: string, statusColor?: string, onDelete: () => void, onEdit: (newName: string) => void }) {
    const [isMessengerOpen, setIsMessengerOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [editName, setEditName] = useState(title);

    const handleCopy = () => {
        navigator.clipboard.writeText("••••••••••••••••");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleViewDetails = () => {
        setIsViewModalOpen(true);
    };

    const statusBg = {
        green: 'bg-[#ECFDF5] text-[#10B981]',
        blue: 'bg-[#EFF6FF] text-[#3B82F6]',
        yellow: 'bg-[#FEFCE8] text-[#EAB308]',
    }[statusColor as string] || 'bg-[#ECFDF5] text-[#10B981]';

    return (
        <div className="bg-white p-4 md:p-6 rounded-[20px] md:rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] md:shadow-sm">
            {/* Desktop Header */}
            <div className="hidden md:flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white text-[12px] font-bold ${icon}`}>
                        {title.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-[15px] font-bold text-[#1E293B] leading-tight">{title}</h4>
                        <div className="text-[12px] text-slate-500">{subtitle}</div>
                    </div>
                </div>
                <div className={`text-[10px] font-bold px-2.5 py-1 rounded tracking-wider ${statusBg}`}>
                    {status.toUpperCase()}
                </div>
            </div>

            {/* Mobile Header */}
            <div className="flex md:hidden items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-[16px] font-bold ${icon}`}>
                        {title.charAt(0)}
                    </div>
                    <div className="flex flex-col gap-1.5 mt-0.5">
                        <h4 className="text-[14px] font-bold text-[#1E293B] leading-none">{title}</h4>
                        <div className={`text-[9px] font-bold px-1.5 py-0.5 w-fit rounded tracking-wider ${statusBg}`}>
                            {status}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => { setEditName(title); setIsEditModalOpen(true); }} className="w-[28px] h-[28px] rounded flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="w-[28px] h-[28px] rounded flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
            
            {/* Desktop Value Block */}
            <div className="hidden md:flex bg-[#F8FAFC] rounded-lg p-3 flex items-center justify-between mb-5 border border-slate-100">
                <span className="text-[14px] text-slate-600 font-mono tracking-wide">{value}</span>
                <button onClick={handleCopy} className="text-slate-400 hover:text-slate-600 transition-colors">
                    {isCopied ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Value Block */}
            <div className="flex md:hidden items-center justify-between mb-4 border-b border-slate-100 pb-4">
                <span className="text-[14px] text-slate-500 font-mono tracking-widest leading-none mt-1">{value}</span>
                <button onClick={handleCopy} className="text-[#00C2FF] hover:text-[#00A3D9] transition-colors p-1">
                    {isCopied ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    )}
                </button>
            </div>

            {/* Desktop Footer Actions */}
            <div className="hidden md:flex items-center gap-3">
                <button onClick={handleViewDetails} className="flex-1 bg-[#1E293B] hover:bg-slate-800 text-white text-[13px] font-semibold py-2.5 rounded-lg transition-colors">
                    View Details
                </button>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button onClick={() => setIsMessengerOpen(!isMessengerOpen)} className="w-[36px] h-[36px] rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                        <MessengerPopup isOpen={isMessengerOpen} onClose={() => setIsMessengerOpen(false)} />
                    </div>
                    <button onClick={() => { setEditName(title); setIsEditModalOpen(true); }} className="w-[36px] h-[36px] rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    </button>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="w-[36px] h-[36px] rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-red-500 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Footer Actions */}
            <button onClick={handleViewDetails} className="w-full md:hidden text-[13px] font-bold text-slate-600 flex items-center justify-center py-1">
                View Details
            </button>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-[#475569]/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 font-sans">
                    <div className="bg-white rounded-[20px] w-full max-w-[480px] p-6 md:p-8 shadow-2xl relative">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-[18px] font-bold text-[#1E293B]">Edit Credential</h3>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Credential Name</label>
                                <input 
                                    type="text" 
                                    value={editName} 
                                    onChange={e => setEditName(e.target.value)} 
                                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[10px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-8">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-[10px] text-[14px] font-semibold text-[#1E293B] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors">
                                Cancel
                            </button>
                            <button 
                                onClick={() => { onEdit(editName); setIsEditModalOpen(false); }} 
                                disabled={!editName.trim() || editName === title}
                                className="px-6 py-2.5 rounded-[10px] text-[14px] font-semibold text-white bg-[#00C2FF] hover:bg-[#00A3D9] transition-colors disabled:opacity-50"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isViewModalOpen && (
                <div className="fixed inset-0 bg-[#475569]/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 font-sans">
                    <div className="bg-white rounded-[20px] w-full max-w-[500px] p-6 md:p-8 shadow-2xl relative">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#E6F8F9] flex items-center justify-center shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </div>
                                <h3 className="text-[18px] font-bold text-[#1E293B]">Credential Details</h3>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="text-[13px] font-medium text-slate-500">Name</span>
                                <span className="text-[14px] font-bold text-[#1E293B]">{title}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="text-[13px] font-medium text-slate-500">Service</span>
                                <span className="text-[14px] font-semibold text-[#1E293B]">{cred.service || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="text-[13px] font-medium text-slate-500">Type</span>
                                <span className="text-[14px] font-semibold text-[#1E293B] uppercase text-[12px]">{cred.type?.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="text-[13px] font-medium text-slate-500">Environment</span>
                                <span className={`text-[12px] font-bold px-2 py-0.5 rounded ${statusBg}`}>{status}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="text-[13px] font-medium text-slate-500">Added At</span>
                                <span className="text-[13px] text-[#1E293B]">{new Date(cred.added_at).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] font-medium text-slate-500">Last Used</span>
                                <span className="text-[13px] text-[#1E293B]">{cred.last_used_at ? new Date(cred.last_used_at).toLocaleString() : 'Never'}</span>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-2.5 rounded-[10px] text-[14px] font-semibold text-white bg-[#1E293B] hover:bg-slate-800 transition-colors w-full">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-[#475569]/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 font-sans">
                    <div className="bg-white rounded-[20px] w-full max-w-[400px] p-6 md:p-8 shadow-2xl relative">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-[18px] font-bold text-[#1E293B]">Delete Credential</h3>
                                <p className="text-[13px] text-slate-500 mt-1">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 rounded-[10px] text-[14px] font-semibold text-[#1E293B] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors">
                                Cancel
                            </button>
                            <button 
                                onClick={() => { onDelete(); setIsDeleteModalOpen(false); }} 
                                className="px-6 py-2.5 rounded-[10px] text-[14px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ModalActions({ onCancel, isSubmitting }: { onCancel: () => void, isSubmitting?: boolean }) {
    return (
        <div className="flex items-center justify-end gap-3 mt-8">
            <button 
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-[10px] text-[14px] font-semibold text-[#1E293B] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors disabled:opacity-50"
            >
                Cancel
            </button>
            <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-[10px] text-[14px] font-semibold text-white bg-[#00C2FF] hover:bg-[#00A3D9] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                {isSubmitting ? 'Saving...' : (
                    <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Save
                    </>
                )}
            </button>
        </div>
    );
}

function SoftwareForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
    const [service, setService] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [requires2fa, setRequires2fa] = useState('no');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !password) return alert('Username and password are required');
        
        setIsLoading(true);
        try {
            await createCredential({
                type: 'software',
                name,
                service,
                fields: { password, requires2fa, notes }
            });
            onSuccess();
        } catch (err: any) {
            alert(err.message || 'Failed to save');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Select an app or service to connect to</label>
                <input 
                    type="text" value={service} onChange={e => setService(e.target.value)}
                    placeholder="Search for app..." 
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[10px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]"
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Username/Email <span className="text-red-500">*</span></label>
                <input 
                    type="text" value={name} onChange={e => setName(e.target.value)} required
                    placeholder="e.g. john@example.com" 
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[10px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]"
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Password <span className="text-red-500">*</span></label>
                <input 
                    type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Enter your password..." 
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[10px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]"
                />
            </div>
            <div className="flex items-center justify-between py-1">
                <label className="text-[13px] font-semibold text-[#1E293B] max-w-[60%] leading-tight">Does this account require OTP/2FA?</label>
                <div className="bg-[#F1F5F9] p-1 rounded-lg flex items-center shrink-0">
                    <button type="button" onClick={() => setRequires2fa('yes')} className={`px-4 py-1.5 text-[13px] font-semibold rounded-md ${requires2fa === 'yes' ? 'bg-white shadow-sm text-[#1E293B]' : 'text-slate-500'}`}>Yes</button>
                    <button type="button" onClick={() => setRequires2fa('no')} className={`px-4 py-1.5 text-[13px] font-semibold rounded-md ${requires2fa === 'no' ? 'bg-white shadow-sm text-[#1E293B]' : 'text-slate-500'}`}>No</button>
                </div>
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Any other details</label>
                <textarea 
                    value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Additional notes..." rows={4}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[12px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] resize-none"
                />
            </div>
            <ModalActions onCancel={onCancel} isSubmitting={isLoading} />
        </form>
    );
}

function WebhookForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
    const [name, setName] = useState('');
    const [endpointUrl, setEndpointUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !endpointUrl) return alert('Name and Endpoint URL are required');
        
        setIsLoading(true);
        try {
            await createCredential({
                type: 'webhook',
                name,
                fields: { endpoint_url: endpointUrl, notes }
            });
            onSuccess();
        } catch (err: any) {
            alert(err.message || 'Failed to save');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Webhook Name <span className="text-red-500">*</span></label>
                <input 
                    type="text" value={name} onChange={e => setName(e.target.value)} required
                    placeholder="e.g. Payment Notifications" 
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[10px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]"
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Endpoint URL <span className="text-red-500">*</span></label>
                <input 
                    type="text" value={endpointUrl} onChange={e => setEndpointUrl(e.target.value)} required
                    placeholder="https://api.yourdomain.com/webhooks/..." 
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[10px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]"
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Any other details</label>
                <textarea 
                    value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Events to listen for..." rows={4}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[12px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] resize-none"
                />
            </div>
            <ModalActions onCancel={onCancel} isSubmitting={isLoading} />
        </form>
    );
}

function ApiKeyForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
    const [service, setService] = useState('');
    const [name, setName] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [custom1, setCustom1] = useState('');
    const [custom2, setCustom2] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey) return alert('API Key is required');
        if (!name) return alert('Label is required');
        
        setIsLoading(true);
        try {
            await createCredential({
                type: 'api_key',
                name,
                service,
                fields: { api_key: apiKey, custom_field_1: custom1, custom_field_2: custom2, notes }
            });
            onSuccess();
        } catch (err: any) {
            alert(err.message || 'Failed to save');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Select an app or service</label>
                <input 
                    type="text" value={service} onChange={e => setService(e.target.value)}
                    placeholder="Select an app" 
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[10px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]"
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Your Name / Label <span className="text-red-500">*</span></label>
                <input 
                    type="text" value={name} onChange={e => setName(e.target.value)} required
                    placeholder="e.g. Production API Key" 
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[10px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]"
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">API Key (required) <span className="text-red-500">*</span></label>
                <textarea 
                    value={apiKey} onChange={e => setApiKey(e.target.value)} required
                    placeholder="Paste your API key here" rows={3}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[12px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] resize-none"
                />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Custom Field 1</label>
                    <input 
                        type="text" value={custom1} onChange={e => setCustom1(e.target.value)}
                        placeholder="Field value" 
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[10px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Custom Field 2</label>
                    <input 
                        type="text" value={custom2} onChange={e => setCustom2(e.target.value)}
                        placeholder="Field value" 
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-[10px] px-4 py-3 text-[14px] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]"
                    />
                </div>
            </div>
            <ModalActions onCancel={onCancel} isSubmitting={isLoading} />
        </form>
    );
}
