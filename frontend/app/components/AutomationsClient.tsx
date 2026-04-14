'use client';

import React, { useState, useEffect } from 'react';
import { OptimizePromptButton } from './OptimizePromptButton';
import { AnimatedTextarea } from './AnimatedTextarea';
import { mockAiOptimize } from '../lib/mockAiOptimize';
import { HeaderBar } from './HeaderBar';
import { StopAutomationModal } from './StopAutomationModal';
import { PipelineOverviewModal } from './PipelineOverviewModal';
import { fetchTemplates } from '../lib/api';

// Figma color tokens
const F = {
  aqua: '#00EAFF',
  aqua10: 'rgba(0,234,255,0.1)',
  aqua20: 'rgba(0,234,255,0.2)',
  aqua5: 'rgba(0,234,255,0.05)',
  riverBed: '#4B5563',
  fiord: '#475569',
  white: '#FFFFFF',
  athensGray: '#E5E7EB',
  porcelain: '#F0F4F5',
  ebonyClay: '#1E293B',
  white40: 'rgba(255,255,255,0.4)',
  white60: 'rgba(255,255,255,0.6)',
  white20: 'rgba(255,255,255,0.2)',
  white10: 'rgba(255,255,255,0.1)',
};

// ─── Icons ───────────────────────────────────────────────────────────────────
function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

// ─── Data Types & Mocks ───────────────────────────────────────────────────────
interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription?: string;
  timeSaved: string;
  roi: string;
  users: number;
  tools?: string;
  runSchedule?: string;
  setupTime?: string;
  difficulty?: string;
  useCase?: string;
  iconBg: string;
  iconColor: string;
  iconSvg: React.ReactNode;
}

const CATEGORIES = ['All', 'Marketing', 'Sales', 'Finance', 'Content', 'Reporting', 'Security', 'HR & Recruitment'];

// Helper to map category to icon
const getTemplateIcon = (category: string) => {
  switch (category) {
    case 'Marketing':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
    case 'Sales':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
    case 'Reporting':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>;
    case 'Content':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16h16V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    case 'Finance':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
    case 'Security':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'HR & Recruitment':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    default:
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  }
};

// ─── Global Responsive CSS ───────────────────────────────────────────────────
const css = `
  @keyframes aiPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0, 194, 255, 0.4); }
    50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(0, 194, 255, 0); }
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  textarea::placeholder, input::placeholder { color: #94A3B8; }

  /* ── Mobile Progress Card ── */
  .aauto-progress-mobile {
    display: none;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0px 1px 2px rgba(0,0,0,0.05);
    padding: 16px;
    margin-bottom: 12px;
  }
  .aauto-progress-row { display: flex; justify-content: space-between; align-items: center; }
  .aauto-progress-track { height: 4px; background: #E5E7EB; border-radius: 9999px; margin-top: 12px; overflow: hidden; }
  .aauto-progress-fill { height: 100%; background: #00C2FF; border-radius: 9999px; transition: width .4s ease; }
  .aauto-desktop-progress { display: block; }

  .aauto-layout-wrapper {
    padding: 0 32px;
    display: flex;
    justify-content: center;
    width: 100%;
    overflow-x: hidden;
  }

  .aauto-main-container {
    width: 100%;
    max-width: 1318px;
    display: flex;
    flex-direction: column;
  }

  /* ── Templates grid (Step 1) ── */
  .aauto-templates-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  /* ── Step 2 grids ── */
  .aauto-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .aauto-grid-65-35 {
    display: grid;
    grid-template-columns: 1fr minmax(0, 340px);
    gap: 16px;
  }

  /* ── Step 3 review grid ── */
  .aauto-grid-review {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 24px;
    align-items: stretch;
  }

  /* ── Confirm card & summary ── */
  .aauto-confirm-card {
    background-color: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 32px;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .aauto-summary-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 24px;
    margin-bottom: 24px;
  }

  /* ═══ TABLET ≤ 1024px ═══ */
  @media (max-width: 1024px) {
    .aauto-templates-grid { grid-template-columns: repeat(2, 1fr); }
    .aauto-grid-65-35 { grid-template-columns: 1fr 1fr; }
    .aauto-grid-review { grid-template-columns: minmax(0, 1fr) 280px; }
  }

  /* ═══ TABLET ≤ 768px ═══ */
  @media (max-width: 768px) {
    .aauto-layout-wrapper { padding: 0 20px; }
    .aauto-progress-mobile { display: block; }
    .aauto-desktop-progress { display: none; }
    .aauto-grid-2 { grid-template-columns: 1fr; }
    .aauto-grid-65-35 { grid-template-columns: 1fr; }
    .aauto-grid-review { display: flex; flex-direction: column; gap: 16px; }
    .aauto-confirm-card { padding: 24px; }
    .aauto-confirm-title { font-size: 28px !important; }
  }

  /* ═══ MOBILE ≤ 600px ═══ */
  @media (max-width: 600px) {
    .aauto-layout-wrapper { padding: 0 16px; }
    .aauto-templates-grid { grid-template-columns: 1fr; }
    .aauto-confirm-card { padding: 20px; }
    .aauto-summary-grid { grid-template-columns: 1fr; gap: 16px; }
    .aauto-confirm-title { font-size: 26px !important; }
    .aauto-confirm-subtitle { font-size: 13px !important; }
    .aauto-header-flex { flex-direction: column; align-items: flex-start; gap: 16px; }
    .aauto-action-bar { flex-direction: column !important; align-items: stretch !important; }
    .aauto-btn-right { width: 100%; }
    .aauto-btn-right button { width: 100%; justify-content: center; }
    .aauto-categories-scroll {
      flex-wrap: nowrap !important;
      overflow-x: auto;
      padding-bottom: 4px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .aauto-categories-scroll::-webkit-scrollbar { display: none; }
    .aauto-categories-scroll button {
      white-space: nowrap !important;
      font-size: 11px !important;
      padding: 4px 12px !important;
    }
    /* Action bar confirm: stack on mobile */
    .aauto-action-bar-confirm {
      flex-direction: column !important;
      padding: 16px !important;
    }
    .aauto-action-bar-confirm button {
      width: 100% !important;
      justify-content: center !important;
    }
    .aauto-action-bar-confirm p {
      display: none !important;
    }
  }

  /* ═══ MOBILE-XS ≤ 375px ═══ */
  @media (max-width: 375px) {
    .aauto-layout-wrapper { padding: 0 12px; }
    .aauto-confirm-card { padding: 16px; }
    .aauto-confirm-title { font-size: 22px !important; }
    .aauto-booking-ref { font-size: 18px !important; }
  }

  /* ═══ Outer section pads ═══ */
  .aauto-section-header { padding: 32px 32px 0; }
  .aauto-section-stepper { padding: 24px 32px 0; }
  .aauto-section-banner { margin: 16px 32px 0; }

  @media (max-width: 768px) {
    .aauto-section-header { padding: 20px 20px 0; }
    .aauto-section-stepper { padding: 16px 20px 0; }
    .aauto-section-banner { margin: 12px 20px 0; }
  }
  @media (max-width: 600px) {
    .aauto-section-header { padding: 16px 16px 0; }
    .aauto-section-stepper { display: none; }
    .aauto-section-banner { margin: 10px 16px 0; }
  }
`;

// ─── Step 1: Use Case ────────────────────────────────────────────────────────
function StepUseCase({
  useCase,
  setUseCase,
  onSave,
  activeCategory,
  setActiveCategory,
  onStop,
  onShowDetail,
  templates,
  loadingTemplates
}: {
  useCase: string;
  setUseCase: (v: string) => void;
  onSave: () => void;
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  onStop: () => void;
  onShowDetail: (template: Template) => void;
  templates: Template[];
  loadingTemplates: boolean;
}) {
  const [isOptimized, setIsOptimized] = useState(false);

  const filtered = activeCategory === 'All' ? templates : templates.filter(t => t.category === activeCategory);

  const handleOptimize = () => {
    if (!useCase.trim()) return;
    setUseCase(mockAiOptimize(useCase, 'useCase'));
    setIsOptimized(true);
  };

  const handleUndo = () => {
    setIsOptimized(false);
    setUseCase(''); // Since it was an empty form field or a template, reset appropriately
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Title block */}
      <div>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '24px', color: '#1F2937', margin: '0 0 6px' }}>
          Create New Automation
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '15px', color: '#64748B', margin: 0 }}>
          Build, deploy, and manage intelligent agents to automate your complex workflows.
        </p>
      </div>

      {/* Main text area card */}
      <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flex: 1 }}>

          <AnimatedTextarea
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="Describe Your Use Case... e.g., 'Automatically generate and schedule weekly social media posts based on our blog content'"
            rows={5}
            style={{ width: '100%', minHeight: '100px', backgroundColor: 'transparent', border: 'none', resize: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '15px', color: '#334155', padding: '0' }}
          />
        </div>

        {/* Action bar inside text area */}
        <div className="aauto-action-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
          {/* Left Actions */}
          <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
            {isOptimized ? (
              <button onClick={handleUndo} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: '#475569' }}>
                <UndoIcon /> View Original
              </button>
            ) : (
              <OptimizePromptButton
                onOptimize={handleOptimize}
                disabled={!useCase.trim()}
              />
            )}
          </div>

          {/* Right Actions */}
          <div className="aauto-btn-right">
            <button onClick={onSave} disabled={!useCase.trim()} style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, backgroundColor: '#00C2FF', border: 'none', borderRadius: '12px', padding: '0 20px', height: '40px', cursor: !useCase.trim() ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', opacity: !useCase.trim() ? 0.5 : 1, whiteSpace: 'nowrap' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Save
            </button>
          </div>
        </div>
      </div>

        {/* Templates Section */}
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '18px', color: '#1F2937', margin: '0 0 4px' }}>
                Or Browse Pre-Built Automation Templates
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: '#64748B', margin: 0 }}>
                Select a starting point and customize it to your needs
              </p>
            </div>
            <div className="aauto-categories-scroll" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{ backgroundColor: activeCategory === cat ? '#00C2FF' : '#FFFFFF', border: activeCategory === cat ? 'none' : '1px solid #E2E8F0', borderRadius: '20px', padding: '6px 16px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: activeCategory === cat ? '#FFFFFF' : '#64748B', transition: 'all 0.2s', boxShadow: activeCategory === cat ? '0 2px 4px rgba(0, 194, 255, 0.2)' : 'none' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loadingTemplates ? (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#64748B' }}>Loading Template Cloud...</p>
            </div>
          ) : (
            <div className="aauto-templates-grid">
              {filtered.map(t => (
                <div key={t.id} onClick={() => setUseCase(t.title + ': ' + t.description)} style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: t.iconBg, color: t.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                      {t.iconSvg}
                    </div>
                    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '4px 10px', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>
                      {t.category}
                    </div>
                  </div>
                  <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '15px', color: '#1E293B', margin: '0 0 8px' }}>
                    {t.title}
                  </h4>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', lineHeight: '1.5em', color: '#64748B', margin: '0 0 16px', flex: 1 }}>
                    {t.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '4px 8px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '10px', color: '#00C2FF' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="12 6 12 12 16 14" /><circle cx="12" cy="12" r="10" /></svg>
                      Save {t.timeSaved}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '4px 8px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '10px', color: '#00C2FF' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                      {t.roi}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#CBD5E1', border: '2px solid #F8FAFC', zIndex: 3 }} />
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#94A3B8', border: '2px solid #F8FAFC', marginLeft: '-10px', zIndex: 2 }} />
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#64748B', border: '2px solid #F8FAFC', marginLeft: '-10px', zIndex: 1 }} />
                      </div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: '#64748B' }}>{t.users}+</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowDetail(t);
                      }}
                      style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
}

// ─── Step 2: Define Details ────────────────────────────────────────────────────
function StepDefineDetails({
  onBack,
  onNext,
  problem, setProblem,
  outcome, setOutcome,
  tools, setTools,
  frequency, setFrequency,
  dailyReport, setDailyReport,
  whatsappAlerts, setWhatsappAlerts,
  weeklyReport, setWeeklyReport
}: {
  onBack: () => void;
  onNext: () => void;
  problem: string; setProblem: (v: string) => void;
  outcome: string; setOutcome: (v: string) => void;
  tools: string; setTools: (v: string) => void;
  frequency: string; setFrequency: (v: string) => void;
  dailyReport: boolean; setDailyReport: (v: boolean) => void;
  whatsappAlerts: boolean; setWhatsappAlerts: (v: boolean) => void;
  weeklyReport: boolean; setWeeklyReport: (v: boolean) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Figma: Cyan/Aqua 10% bg button
  const OptimizeAIBtn = ({ onOptimize }: { onOptimize: () => void }) => (
    <button
      onClick={onOptimize}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        backgroundColor: 'rgba(0,234,255,0.1)', border: 'none',
        borderRadius: '8px', padding: '8px 12px',
        fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px',
        color: '#4B5563', cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >
      <svg width="16" height="20" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.8984 6.33331L10.204 4.80553L8.67622 4.11108L10.204 3.41664L10.8984 1.88886L11.5929 3.41664L13.1207 4.11108L11.5929 4.80553L10.8984 6.33331ZM10.8984 14.1111L10.204 12.5833L8.67622 11.8889L10.204 11.1944L10.8984 9.66664L11.5929 11.1944L13.1207 11.8889L11.5929 12.5833L10.8984 14.1111ZM5.34288 12.4444L3.95399 9.38886L0.898438 7.99997L3.95399 6.61108L5.34288 3.55553L6.73177 6.61108L9.78733 7.99997L6.73177 9.38886L5.34288 12.4444ZM5.34288 9.74997L5.89844 8.55553L7.09288 7.99997L5.89844 7.44442L5.34288 6.24997L4.78733 7.44442L3.59288 7.99997L4.78733 8.55553L5.34288 9.74997Z" fill="#4B5563" />
      </svg>
      Optimize with AI
    </button>
  );

  const sectionStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF', border: '1px solid #F0F4F5',
    borderRadius: '12px', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
    padding: '25px',
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px',
    color: '#4B5563', margin: 0,
  };

  const subTextStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px',
    color: '#475569', margin: '0 0 4px',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%', backgroundColor: 'rgba(240,244,245,0.5)',
    border: 'none', borderRadius: '8px',
    padding: '16px', fontFamily: 'Inter, sans-serif',
    fontSize: '14px', color: '#334155', resize: 'vertical',
    outline: 'none', boxSizing: 'border-box', lineHeight: '1.5',
  };

  const labelUpperStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'Inter, sans-serif', fontWeight: 700,
    fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em',
    color: '#475569', marginBottom: '8px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '36px', color: '#4B5563', margin: '0 0 8px', letterSpacing: '-0.025em' }}>
          Define your Automation
        </h2>
        <p style={{ ...subTextStyle, margin: 0 }}>
          Define your automation details before deployment.
        </p>
      </div>

      {/* Row 1: Problem | Outcome — equal 50/50 */}
      <div className="aauto-grid-2">
        {/* The Problem */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="14" r="10" stroke="#00C2FF" strokeWidth="2" />
                <line x1="12" y1="10" x2="12" y2="14" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="18" r="1" fill="#00C2FF" />
              </svg>
              <h3 style={headingStyle}>The Problem</h3>
            </div>
            <OptimizeAIBtn onOptimize={() => setProblem(mockAiOptimize(problem, 'problem'))} />
          </div>
          <p style={{ ...subTextStyle, marginBottom: '8px' }}>What challenges are you facing?</p>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g. Manually exporting leads from LinkedIn is taking 5 hours every week and leading to data entry errors."
            rows={5}
            style={textareaStyle}
          />
        </div>

        {/* The Outcome */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="14" r="10" stroke="#00C2FF" strokeWidth="2" />
                <circle cx="12" cy="14" r="6" stroke="#00C2FF" strokeWidth="2" />
                <circle cx="12" cy="14" r="2" fill="#00C2FF" />
              </svg>
              <h3 style={headingStyle}>The Outcome</h3>
            </div>
            <OptimizeAIBtn onOptimize={() => setOutcome(mockAiOptimize(outcome, 'outcome'))} />
          </div>
          <p style={{ ...subTextStyle, marginBottom: '8px' }}>What results do you expect?</p>
          <textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="e.g. Automatically sync new LinkedIn leads to my CRM every morning and send a Slack notification to the sales team."
            rows={5}
            style={textareaStyle}
          />
        </div>
      </div>

      {/* Row 2: Tools (67%) | Customization (33%) */}
      <div className="aauto-grid-65-35">
        {/* Tools & Software */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="16 18 22 12 16 6" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="8 6 2 12 8 18" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 style={headingStyle}>Tools &amp; Software (Optional)</h3>
            </div>
            <OptimizeAIBtn onOptimize={() => setTools(mockAiOptimize(tools, 'tools'))} />
          </div>
          <p style={{ ...subTextStyle, marginBottom: '8px' }}>List the apps you want the AI to interact with.</p>
          <textarea
            value={tools}
            onChange={(e) => setTools(e.target.value)}
            placeholder="e.g. LinkedIn Sales Navigator, Salesforce CRM, Slack, and Gmail."
            rows={4}
            style={textareaStyle}
          />
        </div>

        {/* Customization */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="14" r="10" stroke="#00C2FF" strokeWidth="2" />
              <polyline points="12 10 12 14 15 16" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3 style={headingStyle}>Customization</h3>
          </div>

          {/* Execution Frequency */}
          <label style={labelUpperStyle}>EXECUTION FREQUENCY</label>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ width: '100%', backgroundColor: '#F0F4F5', border: 'none', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#4B5563', cursor: 'pointer', outline: 'none' }}
            >
              <span style={{ fontWeight: 400 }}>{frequency === 'Daily' ? 'Daily at 9:00 AM' : frequency}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {isDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', marginTop: '4px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '4px', boxShadow: '0 8px 16px rgba(0,0,0,0.08)', zIndex: 10 }}>
                {['Once', 'Hourly', 'Daily', 'Weekly', 'Monthly'].map((opt) => (
                  <div key={opt} onClick={() => { setFrequency(opt); setIsDropdownOpen(false); }}
                    style={{ padding: '9px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: opt === frequency ? '#00C2FF' : '#334155', fontWeight: opt === frequency ? 600 : 400, backgroundColor: opt === frequency ? 'rgba(0,234,255,0.05)' : 'transparent' }}
                  >{opt}</div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <label style={labelUpperStyle}>NOTIFICATIONS &amp; REPORTS</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { key: 'daily', label: 'Daily performance summary', checked: dailyReport, set: setDailyReport },
              { key: 'whatsapp', label: 'WhatsApp critical alerts', checked: whatsappAlerts, set: setWhatsappAlerts },
              { key: 'weekly', label: 'Weekly executive report', checked: weeklyReport, set: setWeeklyReport },
            ].map(({ key, label, checked, set }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <div
                  onClick={() => set(!checked)}
                  style={{ width: '20px', height: '20px', borderRadius: '4px', border: checked ? 'none' : '1px solid #CBD5E1', backgroundColor: checked ? '#00EAFF' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                >
                  {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: '#4B5563' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '25px', boxShadow: '0px 8px 10px -6px rgba(0,0,0,0.1), 0px 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#4B5563', margin: '0 0 4px' }}>Ready to review?</h4>
          <p style={{ ...subTextStyle, margin: 0 }}>Step 2 complete. Next, we will generate your workflow structure.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'transparent', border: '1px solid #4B5563', borderRadius: '8px', padding: '12px 25px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563', cursor: 'pointer'
            }}
          >
            Back
          </button>
          <button
            onClick={onNext}
            style={{
              backgroundColor: '#00C2FF', border: 'none', borderRadius: '8px', padding: '12px 25px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', cursor: 'pointer'
            }}
          >
            Review Automation
          </button>
        </div>
      </div>
    </div>
  );
}

function StepConfirm({
  onBack,
  onComplete,
  onSaveDraft,
  deploying,
  savingDraft,
  draftSaved,
  useCase,
  problem,
  outcome,
  tools,
  frequency,
  dailyReport,
  whatsappAlerts,
  weeklyReport,
}: {
  onBack: () => void;
  onComplete: () => void;
  onSaveDraft: () => void;
  deploying: boolean;
  savingDraft: boolean;
  draftSaved: string | null;
  useCase: string;
  problem: string;
  outcome: string;
  tools: string;
  frequency: string;
  dailyReport: boolean;
  whatsappAlerts: boolean;
  weeklyReport: boolean;
}) {
  const labelStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    color: '#94A3B8', margin: '0 0 8px', display: 'block',
  };
  const fieldBoxStyle: React.CSSProperties = {
    backgroundColor: '#F1F5F9', border: 'none',
    borderRadius: '10px', padding: '16px',
    wordBreak: 'break-word', overflowWrap: 'break-word',
  };

  const targetDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Section */}
      <div style={{ textAlign: 'center', padding: '0 8px' }}>
        <h2 className="aauto-confirm-title" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '32px', color: '#1E293B', margin: '0 0 8px', letterSpacing: '-0.025em', lineHeight: '1.2' }}>
          Review & Confirm
        </h2>
        <p className="aauto-confirm-subtitle" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: '#64748B', margin: 0 }}>
          Verify your automation details before deployment.
        </p>
      </div>

      {/* Main Grid: Summary & Timeline */}
      <div className="aauto-grid-review">
        {/* Automation Summary Card */}
        <div className="aauto-confirm-card">
          <div style={{ position: 'absolute', left: '16px', top: '16px', width: '4px', height: '24px', backgroundColor: '#00EAFF', borderRadius: '99px' }} />
          <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '17px', color: '#1E293B', margin: '0 0 20px', paddingLeft: '16px' }}>
            Automation Summary
          </h3>

          <div className="aauto-summary-grid">
            <div>
              <label style={labelStyle}>AUTOMATION TITLE</label>
              <div style={fieldBoxStyle}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', fontStyle: 'italic', color: '#334155', margin: 0 }}>
                  {useCase ? `Automation: ${useCase.substring(0, 30)}${useCase.length > 30 ? '...' : ''}` : 'Smart-Automation-L2-Automator'}
                </p>
              </div>
            </div>
            <div>
              <label style={labelStyle}>USE CASE</label>
              <div style={fieldBoxStyle}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#334155', margin: 0, lineHeight: '1.4' }}>
                  {useCase || 'L2 Technical Support'}
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>PROBLEM BEING SOLVED</label>
            <div style={fieldBoxStyle}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', lineHeight: '1.5', color: '#475569', margin: 0 }}>
                {problem || 'High volume of repetitive L2 technical tickets.'}
              </p>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>DESIRED OUTCOME</label>
            <div style={{ backgroundColor: 'rgba(0, 234, 255, 0.02)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(0, 234, 255, 0.1)', height: '100%' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', lineHeight: '1.5', color: '#475569', margin: 0 }}>
                {outcome || 'Reduce response time and automate triage.'}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(0, 234, 255, 0.1) 0%, transparent 70%)', filter: 'blur(30px)' }} />
          
          <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '18px', color: '#FFFFFF', margin: '0 0 20px' }}>Timeline</h3>

          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ position: 'absolute', left: '6px', top: '24px', bottom: '60px', width: '2px', background: 'rgba(255,255,255,0.05)' }} />
            
            <div style={{ position: 'relative', paddingLeft: '28px', marginBottom: '24px' }}>
              <div style={{ position: 'absolute', left: 0, top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00EAFF', boxShadow: '0 0 6px rgba(0, 234, 255, 0.3)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '9px', color: '#00EAFF', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>COMPLETED</span>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#FFFFFF', margin: 0 }}>AI Calculation Complete</p>
            </div>

            <div style={{ position: 'relative', paddingLeft: '28px', marginBottom: '24px' }}>
              <div style={{ position: 'absolute', left: 0, top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>NEXT PHASE</span>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#FFFFFF', margin: '0 0 2px' }}>Setup Time: 2-3 Days</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Engineer assigned</p>
            </div>

            <div style={{ position: 'relative', paddingLeft: '28px' }}>
              <div style={{ position: 'absolute', left: 0, top: '4px', width: '12px', height: '12px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>TARGET DATE</span>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#FFFFFF', margin: 0 }}>Deployment: {targetDate}</p>
            </div>
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
             <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>BOOKING REFERENCE</span>
             <p className="aauto-booking-ref" style={{ fontFamily: 'Menlo, monospace', fontWeight: 400, fontSize: '16px', color: '#00EAFF', margin: 0 }}>Assigned after confirmation</p>
          </div>
        </div>
      </div>

      {/* Support Boxes */}
      <div className="aauto-grid-review-boxes" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {/* We've Got You Covered */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(0, 234, 255, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '14px', color: '#1E293B', margin: '0 0 4px' }}>We&apos;ve Got You Covered</h4>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.5', color: '#64748B', margin: '0 0 10px' }}>Once confirmed, our deployment engineers will review the flow for edge cases. You&apos;ll receive a notification within 4 hours confirming the start of the production build.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ background: 'none', border: 'none', color: '#00EAFF', fontSize: '10px', fontWeight: 700, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Create Ticket
              </button>
              <button style={{ background: 'none', border: 'none', color: '#00EAFF', fontSize: '10px', fontWeight: 700, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>

        {/* Already know what you need? */}
        <div style={{ backgroundColor: 'rgba(0, 234, 255, 0.05)', border: '1px solid rgba(0, 234, 255, 0.1)', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#FFFFFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '14px', color: '#1E293B', margin: '0 0 4px' }}>Already know what you need?</h4>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.4', color: '#64748B', margin: 0 }}>Jump ahead and set up your tool credentials.</p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      {/* Draft saved toast */}
      {draftSaved && (
        <div style={{ marginTop: '8px', backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#065F46', margin: 0 }}>Draft saved!</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#047857', margin: 0 }}>Reference: <strong>{draftSaved}</strong> — resume from your Bookings dashboard.</p>
          </div>
        </div>
      )}
      <div className="aauto-action-bar-confirm" style={{ marginTop: '8px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', flexWrap: 'wrap' }}>
        {/* Save Draft */}
        <button
          onClick={onSaveDraft}
          disabled={savingDraft}
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 20px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E293B', cursor: savingDraft ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '7px', opacity: savingDraft ? 0.7 : 1 }}
        >
          {savingDraft ? (
            <><svg style={{ width: 14, height: 14, animation: 'spin .8s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Saving...</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Save Draft</>
          )}
        </button>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#94A3B8', margin: 0, textAlign: 'center', flex: 1 }}>
          Ready to ship? You can change these details later.
        </p>
      </div>
    </div>
  );
}

export function AutomationsClient() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [useCase, setUseCase] = useState('');
  const [problem, setProblem] = useState('');
  const [outcome, setOutcome] = useState('');
  const [tools, setTools] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [dailyReport, setDailyReport] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const [activeCategory, setActiveCategory] = useState('All');
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const [deploying, setDeploying] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState<string | null>(null);
  const [deploySuccess, setDeploySuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const data: any[] = await fetchTemplates();
        const mapped = data.map(t => ({
          id: t.id,
          title: t.title,
          category: t.type,
          description: t.short_description,
          fullDescription: t.full_description || '',
          timeSaved: t.time_saved_weekly,
          roi: t.roi_yearly,
          users: t.bookings_count || 0,
          tools: t.tools || '',
          runSchedule: t.run_schedule || '',
          setupTime: t.setup_time || '2-3 days',
          difficulty: t.difficulty || 'Medium',
          useCase: t.use_case || '',
          iconBg: '#E0FCF9',
          iconColor: '#00C2FF',
          iconSvg: getTemplateIcon(t.type)
        }));
        setTemplates(mapped);
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        setLoadingTemplates(false);
      }
    }
    loadTemplates();
  }, []);

  const resetForm = () => {
    setUseCase('');
    setProblem('');
    setOutcome('');
    setTools('');
    setStep(1);
    setIsStopModalOpen(false);
    setDeploySuccess(null);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const { createBooking } = await import('../lib/api');
      const result: any = await createBooking({
        type: 'automation',
        status: 'booked',
        title: useCase ? `Automation: ${useCase.substring(0, 30)}...` : 'New Automation',
        use_case: useCase,
        problem,
        outcome,
        tools_list: tools ? tools.split(',').map(s => s.trim()) : [],
        schedule_frequency: frequency,
        notifications: { dailyReport, whatsappAlerts, weeklyReport }
      });
      setDeploySuccess(result?.id ?? 'submitted');
      setStep(1);
    } catch (e: unknown) {
      console.error(e);
      alert('Failed to submit automation. Please check your connection and try again.');
    } finally {
      setDeploying(false);
    }
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      const { saveDraft } = await import('../lib/api');
      const result: any = await saveDraft({
        type: 'automation',
        title: useCase ? `Automation: ${useCase.substring(0, 30)}` : 'New Automation (Draft)',
        use_case: useCase,
        tools_list: tools ? tools.split(',').map(s => s.trim()) : [],
        draft_state: {
          step,
          useCase,
          problem,
          outcome,
          tools,
          frequency,
          dailyReport,
          whatsappAlerts,
          weeklyReport,
        },
      });
      setDraftSaved(result?.id ?? 'saved');
      setTimeout(() => setDraftSaved(null), 5000);
    } catch (e: unknown) {
      console.error(e);
      alert('Failed to save draft. Please try again.');
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', backgroundColor: '#EDF2F7', paddingBottom: '40px' }}>
        <div className="aauto-section-header">
          <HeaderBar title="Ai Automations" />
        </div>

        {deploySuccess && (
          <div className="aauto-section-banner" style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '16px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#065F46', margin: 0 }}>Automation Submitted Successfully!</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#047857', margin: '2px 0 0' }}>Booking ID: <strong>{deploySuccess}</strong> — Our team will review and deploy your automation.</p>
              </div>
            </div>
            <button onClick={() => setDeploySuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6EE7B7', fontSize: '20px', lineHeight: 1 }}>×</button>
          </div>
        )}

        <div className="aauto-section-stepper">
          <div className="aauto-desktop-progress" style={{ position: 'relative', width: '100%', maxWidth: '1318px', height: '56px', margin: '0 auto 32px' }}>
            <div style={{ position: 'absolute', left: 0, top: '48px', width: '100%', height: '8px', backgroundColor: '#F0F4F5', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%', height: '100%', background: 'linear-gradient(90deg, #00EAFF 0%, #00D4FF 100%)', borderRadius: '9999px', boxShadow: '0px 0px 8px 0px rgba(0, 234, 255, 0.6)', transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#00EAFF', borderRadius: '9999px', flexShrink: 0, boxShadow: step === 1 ? '0 0 0 4px rgba(0,234,255,0.15)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {step > 1 && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563' }}>Use Case</span>
            </div>
            <div style={{ position: 'absolute', left: 'calc(40% - 16px)', top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2, opacity: step >= 2 ? 1 : 0.4 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9999px', flexShrink: 0, backgroundColor: step >= 2 ? '#00EAFF' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: step === 2 ? '0 0 0 4px rgba(0,234,255,0.15)' : 'none' }}>
                {step > 2 ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: step >= 2 ? '#fff' : '#4B5563' }}>2</span>
                )}
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563' }}>Define Details</span>
            </div>
            <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2, opacity: step >= 3 ? 1 : 0.4 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9999px', flexShrink: 0, backgroundColor: step >= 3 ? '#00EAFF' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: step >= 3 ? '#fff' : '#4B5563' }}>3</span>
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563' }}>Confirm</span>
            </div>
          </div>
        </div>

        <div className="aauto-layout-wrapper">
          <div className="aauto-main-container">
            <div className="aauto-progress-mobile">
              <div className="aauto-progress-row">
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', margin: '0 0 4px' }}>Step {step} of 3</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px', color: '#1F2937', margin: 0 }}>
                    {step === 1 ? 'Use Case' : step === 2 ? 'Define Details' : 'Confirm'}
                  </p>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', color: '#00C2FF' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '14px' }}>{Math.round((step / 3) * 100)}%</span>
                </div>
              </div>
              <div className="aauto-progress-track">
                <div className="aauto-progress-fill" style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }} />
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              {step === 1 && (
                <StepUseCase
                  useCase={useCase}
                  setUseCase={setUseCase}
                  onSave={() => setStep(2)}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  onStop={() => setIsStopModalOpen(true)}
                  onShowDetail={(tmpl: Template) => {
                    setSelectedTemplate(tmpl);
                    setIsDetailModalOpen(true);
                  }}
                  templates={templates}
                  loadingTemplates={loadingTemplates}
                />
              )}
              {step === 2 && (
                <StepDefineDetails
                  onBack={() => setStep(1)}
                  onNext={() => setStep(3)}
                  problem={problem} setProblem={setProblem}
                  outcome={outcome} setOutcome={setOutcome}
                  tools={tools} setTools={setTools}
                  frequency={frequency} setFrequency={setFrequency}
                  dailyReport={dailyReport} setDailyReport={setDailyReport}
                  whatsappAlerts={whatsappAlerts} setWhatsappAlerts={setWhatsappAlerts}
                  weeklyReport={weeklyReport} setWeeklyReport={setWeeklyReport}
                />
              )}
              {step === 3 && (
                <StepConfirm
                  onBack={() => setStep(2)}
                  onComplete={handleDeploy}
                  onSaveDraft={handleSaveDraft}
                  deploying={deploying}
                  savingDraft={savingDraft}
                  draftSaved={draftSaved}
                  useCase={useCase}
                  problem={problem}
                  outcome={outcome}
                  tools={tools}
                  frequency={frequency}
                  dailyReport={dailyReport}
                  whatsappAlerts={whatsappAlerts}
                  weeklyReport={weeklyReport}
                />
              )}
            </div>
          </div>
        </div>

        <StopAutomationModal
          isOpen={isStopModalOpen}
          onClose={() => setIsStopModalOpen(false)}
          onConfirm={resetForm}
        />
        <PipelineOverviewModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate ? {
            id: selectedTemplate.id,
            title: selectedTemplate.title,
            category: selectedTemplate.category,
            description: selectedTemplate.description,
            fullDescription: selectedTemplate.fullDescription,
            timeSaved: selectedTemplate.timeSaved,
            roi: selectedTemplate.roi,
            users: selectedTemplate.users,
            tools: selectedTemplate.tools,
            runSchedule: selectedTemplate.runSchedule,
            setupTime: selectedTemplate.setupTime,
            difficulty: selectedTemplate.difficulty,
            useCase: selectedTemplate.useCase,
          } : null}
          onSelectTemplate={(tmpl) => {
            setUseCase(tmpl.title + ': ' + (tmpl.description || ''));
          }}
        />
      </div>
    </>
  );
}
