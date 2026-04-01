'use client';

import React, { useState } from 'react';
import { OptimizePromptButton } from './OptimizePromptButton';
import { AnimatedTextarea } from './AnimatedTextarea';
import { mockAiOptimize } from '../lib/mockAiOptimize';

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
  timeSaved: string;
  roi: string;
  users: number;
  iconBg: string;
  iconColor: string;
  iconSvg: React.ReactNode;
}

const CATEGORIES = ['All', 'Marketing', 'Sales', 'Finance', 'Content', 'Reporting', 'Security', 'HR & Recruitment'];

const TEMPLATES: Template[] = [
  {
    id: '1', title: 'Social Media Scheduler', category: 'Marketing',
    description: 'Automatically generates, formats and schedules posts across LinkedIn, X, and Instagram based on your URL input.',
    timeSaved: '12h/week', roi: '4.2x ROI', users: 12,
    iconBg: '#E0FCF9', iconColor: '#00C2FF',
    iconSvg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
  },
  {
    id: '2', title: 'Email Campaign Manager', category: 'Sales',
    description: 'Personalized outreach at scale. Analyzes lead profiles to craft custom opening lines and follows up intelligently.',
    timeSaved: '20h/week', roi: '8.5x ROI', users: 45,
    iconBg: '#E0FCF9', iconColor: '#00C2FF',
    iconSvg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
  },
  {
    id: '3', title: 'Weekly KPI Digest', category: 'Reporting',
    description: 'Aggregates data from Stripe, GA4, and Shopify to create an executive summary with trend analysis.',
    timeSaved: '5h/week', roi: '3.0x ROI', users: 8,
    iconBg: '#E0FCF9', iconColor: '#00C2FF',
    iconSvg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
  },
  {
    id: '4', title: 'Social Media Scheduler', category: 'Marketing',
    description: 'Automatically generates, formats and schedules posts across LinkedIn, X, and Instagram based on your URL input.',
    timeSaved: '12h/week', roi: '4.2x ROI', users: 12,
    iconBg: '#E0FCF9', iconColor: '#00C2FF',
    iconSvg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
  },
  {
    id: '5', title: 'Email Campaign Manager', category: 'Sales',
    description: 'Personalized outreach at scale. Analyzes lead profiles to craft custom opening lines and follows up intelligently.',
    timeSaved: '20h/week', roi: '8.5x ROI', users: 45,
    iconBg: '#E0FCF9', iconColor: '#00C2FF',
    iconSvg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
  },
  {
    id: '6', title: 'Weekly KPI Digest', category: 'Reporting',
    description: 'Aggregates data from Stripe, GA4, and Shopify to create an executive summary with trend analysis.',
    timeSaved: '5h/week', roi: '3.0x ROI', users: 8,
    iconBg: '#E0FCF9', iconColor: '#00C2FF',
    iconSvg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
  },
];

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
  }
  
  .aauto-main-container {
    width: 100%;
    max-width: 1318px;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 767px) {
    .aauto-progress-mobile { display: block; }
    .aauto-desktop-progress { display: none; }
    .aauto-layout-wrapper { padding: 0 16px; }
  }

  .aauto-grid-2 {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  .aauto-grid-65-35 {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  .aauto-grid-review {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .aauto-header-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }
  .aauto-templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  .aauto-btn-right {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-shrink: 0;
    flex-wrap: wrap;
    overflow: visible;
  }

  @media (min-width: 768px) {
    .aauto-grid-2 {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
    .aauto-grid-65-35 {
      display: grid;
      grid-template-columns: minmax(0, 6.5fr) minmax(0, 3.5fr);
    }
    .aauto-grid-review {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 340px;
    }
    .aauto-btn-right {
        flex-wrap: nowrap;
    }
  }

  @media (max-width: 480px) {
    .aauto-header-flex {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    .aauto-templates-grid {
      grid-template-columns: 1fr;
    }
    .aauto-action-bar {
      justify-content: center !important;
    }
    .aauto-btn-right {
      width: 100%;
      flex-wrap: nowrap !important;
      gap: 4px !important;
      justify-content: center !important;
    }
    .aauto-btn-right button {
      height: 36px !important;
      padding: 0 6px !important;
      font-size: 11px !important;
      border-radius: 8px !important;
    }
    .aauto-btn-right button:first-child {
      flex: 0 0 36px !important;
      width: 36px !important;
      padding: 0 !important;
    }
    .aauto-categories-scroll {
      flex-wrap: nowrap !important;
      overflow-x: auto;
      padding-bottom: 4px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none; /* Firefox */
    }
    .aauto-categories-scroll::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }
    .aauto-categories-scroll button {
      white-space: nowrap !important;
      font-size: 11px !important;
      padding: 4px 12px !important;
    }
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
  onShowDetail
}: {
  useCase: string;
  setUseCase: (v: string) => void;
  onSave: () => void;
  activeCategory: string;
  setActiveCategory: (v: string) => void;
  onStop: () => void;
  onShowDetail: () => void;
}) {
  const [isOptimized, setIsOptimized] = useState(false);

  const filtered = activeCategory === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.category === activeCategory);

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
            <button
              onClick={onStop}
              style={{ width: '40px', height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer', color: '#94A3B8' }}
            >
              <TrashIcon />
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0 16px', height: '40px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#1F2937', whiteSpace: 'nowrap' }}>
              <PlayIcon /> Enable
            </button>
            <button style={{ flexShrink: 0, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0 16px', height: '40px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>
              Cancel
            </button>
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

        <div className="aauto-templates-grid">
          {filtered.map(t => (
            <div key={t.id} onClick={() => setUseCase(t.title + ': ' + t.description)} style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: t.iconBg, color: t.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    onShowDetail();
                  }}
                  style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '32px', color: '#1F2937', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Define your Automation
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '15px', color: '#64748B', margin: 0 }}>
          Define your automation details before deployment.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>

        {/* Main 2-column row for Problem and Outcome */}
        {/* Main 2-column row for Problem and Outcome */}
        <div className="aauto-grid-2">
          {/* The Problem */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div className="aauto-header-flex">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#E0FCF9', color: '#00C2FF', display: 'flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px', color: '#1E293B', margin: 0 }}>The Problem</h3>
              </div>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>
              What challenges are you facing?
            </p>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. Manually exporting leads from LinkedIn is taking 5 hours every week and leading to data entry errors."
              style={{ width: '100%', minHeight: '100px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#334155', resize: 'vertical', outline: 'none', flex: 1 }}
            />
            <div className="aauto-action-bar" style={{ marginTop: '16px', display: 'flex' }}>
              <OptimizePromptButton
                onOptimize={() => setProblem(mockAiOptimize(problem, 'problem'))}
                disabled={!problem.trim()}
              />
            </div>
          </div>

          {/* The Outcome */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div className="aauto-header-flex">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#E0FCF9', color: '#00C2FF', display: 'flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                </div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px', color: '#1E293B', margin: 0 }}>The Outcome</h3>
              </div>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>
              What results do you expect?
            </p>
            <textarea
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="e.g. Automatically sync new LinkedIn leads to my CRM every morning and send a Slack notification to the sales team."
              style={{ width: '100%', minHeight: '100px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#334155', resize: 'vertical', outline: 'none', flex: 1 }}
            />
            <div className="aauto-action-bar" style={{ marginTop: '16px', display: 'flex' }}>
              <OptimizePromptButton
                onOptimize={() => setOutcome(mockAiOptimize(outcome, 'outcome'))}
                disabled={!outcome.trim()}
              />
            </div>
          </div>
        </div>

        {/* Bottom row: Tools & Customization side-by-side */}
        <div className="aauto-grid-65-35">

          {/* Tools & Software */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div className="aauto-header-flex">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#E0FCF9', color: '#00C2FF', display: 'flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                </div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px', color: '#1E293B', margin: 0 }}>
                  Tools & Software (Optional)
                </h3>
              </div>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>
              List the apps you want the AI to interact with.
            </p>

            <textarea
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              placeholder="e.g. LinkedIn Sales Navigator, Salesforce CRM, Slack, and Gmail."
              style={{ width: '100%', minHeight: '160px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#334155', resize: 'vertical', outline: 'none', flex: 1 }}
            />
            <div className="aauto-action-bar" style={{ marginTop: '16px', display: 'flex' }}>
              <OptimizePromptButton
                onOptimize={() => setTools(mockAiOptimize(tools, 'tools'))}
                disabled={!tools.trim()}
              />
            </div>
          </div>

          {/* Customization Options */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#E0FCF9', color: '#00C2FF', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px', color: '#1E293B', margin: 0 }}>Customization</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Frequency */}
              <div>
                <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '8px' }}>EXECUTION FREQUENCY</label>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#1E293B', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span style={{ fontWeight: 600 }}>{frequency}</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>

                  {isDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', marginTop: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', zIndex: 10 }}>
                      {['Once', 'Hourly', 'Daily', 'Weekly', 'Monthly'].map((opt) => (
                        <div
                          key={opt}
                          onClick={() => { setFrequency(opt); setIsDropdownOpen(false); }}
                          style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: opt === frequency ? '#00C2FF' : '#334155', fontWeight: opt === frequency ? 600 : 400, backgroundColor: opt === frequency ? '#F0F9FF' : 'transparent' }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications Checkboxes */}
              <div>
                <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '12px' }}>NOTIFICATIONS & REPORTS</label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: dailyReport ? 'none' : '2px solid #CBD5E1', backgroundColor: dailyReport ? '#00C2FF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.1s', marginTop: '2px' }}>
                      {dailyReport && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <input type="checkbox" checked={dailyReport} onChange={(e) => setDailyReport(e.target.checked)} style={{ display: 'none' }} />
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1E293B', marginBottom: '2px' }}>Daily performance summary</div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: '#64748B' }}>Receive a digest of successful runs.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: whatsappAlerts ? 'none' : '2px solid #CBD5E1', backgroundColor: whatsappAlerts ? '#00C2FF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.1s', marginTop: '2px' }}>
                      {whatsappAlerts && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <input type="checkbox" checked={whatsappAlerts} onChange={(e) => setWhatsappAlerts(e.target.checked)} style={{ display: 'none' }} />
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1E293B', marginBottom: '2px' }}>WhatsApp critical alerts</div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: '#64748B' }}>Instant alerts for failures.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: weeklyReport ? 'none' : '2px solid #CBD5E1', backgroundColor: weeklyReport ? '#00C2FF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.1s', marginTop: '2px' }}>
                      {weeklyReport && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <input type="checkbox" checked={weeklyReport} onChange={(e) => setWeeklyReport(e.target.checked)} style={{ display: 'none' }} />
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1E293B', marginBottom: '2px' }}>Weekly executive report</div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: '#64748B' }}>High-level stats delivered every Monday.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer actions Box */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
          <div style={{ minWidth: '200px', flex: '1 1 auto' }}>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px', color: '#1E293B', margin: '0 0 4px 0' }}>Ready to review?</h4>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: '#64748B', margin: 0 }}>Step 2 complete. Next, we will generate your workflow structure.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: '1 1 auto' }}>
            <button
              onClick={onBack}
              style={{ flex: '1 1 auto', minWidth: '120px', backgroundColor: '#FFFFFF', border: '1px solid #64748B', borderRadius: '8px', padding: '12px 24px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#1E293B', cursor: 'pointer', textAlign: 'center' }}
            >
              Save as Draft
            </button>
            <button
              onClick={onNext}
              style={{ flex: '1 1 auto', minWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#00D1FF', border: 'none', borderRadius: '8px', padding: '12px 24px', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '13px', color: '#1E293B', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 194, 255, 0.2)' }}
            >
              Next: Review
              <ArrowRightIcon />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Step 3: Confirm Review ──────────────────────────────────────────────────
function StepConfirm({
  onBack,
  onComplete,
  deploying,
  useCase,
  problem,
  outcome
}: {
  onBack: () => void;
  onComplete: () => void;
  deploying: boolean;
  useCase: string;
  problem: string;
  outcome: string;
  tools: string;
  frequency: string;
  dailyReport: boolean;
  whatsappAlerts: boolean;
  weeklyReport: boolean;
}) {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '32px', color: '#1F2937', margin: '0 0 8px' }}>
          Review & Confirm
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '16px', color: '#64748B', margin: 0 }}>
          Verify your automation details before deployment.
        </p>
      </div>

      <div className="aauto-grid-review">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Summary Card */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: '4px', height: '20px', borderRadius: '2px', backgroundColor: '#00C2FF' }} />
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1E293B', margin: 0 }}>
                Automation Summary
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', margin: '0 0 8px' }}>AUTOMATION TITLE</p>
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1E293B', margin: 0 }}>Smart Automation</p>
                </div>
              </div>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', margin: '0 0 8px' }}>USE CASE</p>
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: '#334155', margin: 0 }}>{useCase || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', margin: '0 0 8px' }}>PROBLEM BEING SOLVED</p>
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.6em', color: '#334155', margin: 0 }}>
                  {problem || 'Not provided'}
                </p>
              </div>
            </div>

            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', margin: '0 0 8px' }}>DESIRED OUTCOME</p>
              <div style={{ backgroundColor: '#E0FCF9', borderRadius: '8px', border: '1px solid #CCFBF3', padding: '16px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.6em', color: '#0F766E', margin: 0 }}>
                  {outcome || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '16px' }}>
            {/* We've Got You Covered */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#E0FCF9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
              </div>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px', color: '#1E293B', margin: '0 0 8px' }}>We&apos;ve Got You Covered</h4>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', lineHeight: '1.5em', color: '#64748B', margin: '0 0 24px' }}>
                Once confirmed, our deployment engineers will review the flow for edge cases. You&apos;ll receive a notification within 4 hours confirming the start of the production build.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: '#00C2FF', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16h16V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  Create Ticket
                </button>
                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: '#00C2FF', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  Schedule Meeting
                </button>
              </div>
            </div>

            {/* Already know what you need? */}
            <div style={{ background: 'linear-gradient(135deg, #E0FCF9, #F0FDFA)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', zIndex: 2 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </div>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '16px', color: '#1E293B', margin: '0 0 8px', zIndex: 2 }}>Already know what you need?</h4>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', lineHeight: '1.5em', color: '#64748B', margin: 0, zIndex: 2 }}>
                Jump ahead and set up your tool credentials.
              </p>
              <div style={{ position: 'absolute', bottom: '24px', right: '24px', color: '#00C2FF', zIndex: 2 }}>
                <ArrowRightIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Timeline) */}
        <div>
          <div style={{ backgroundColor: '#1B2533', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #00C2FF, #10B981)' }} />

            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#FFFFFF', margin: '0 0 32px' }}>Timeline</h3>

            <div style={{ position: 'relative', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
              {/* Step 1 */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-31px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00C2FF', boxShadow: '0 0 10px rgba(0,194,255,0.6)' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00C2FF', margin: '0 0 4px' }}>COMPLETED</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>AI Calculation Complete</p>
              </div>

              {/* Step 2 */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-29px', top: '2px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1B2533', border: '2px solid #64748B' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', margin: '0 0 4px' }}>NEXT PHASE</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', margin: '0 0 2px' }}>Setup Time: 2-3 Days</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: '#94A3B8', margin: 0 }}>Engineer assigned</p>
              </div>

              {/* Step 3 */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-29px', top: '2px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1B2533', border: '2px solid #64748B' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', margin: '0 0 4px' }}>TARGET DATE</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>Deployment: Nov 24, 2024</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', marginTop: '32px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', margin: '0 0 4px' }}>BOOKING REFERENCE</p>
              <p style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '18px', color: '#00C2FF', margin: 0 }}>#AI-8834-QX</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <button onClick={onBack} style={{ flex: '1 1 auto', minWidth: '120px', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1F2937' }}>
          Save Draft
        </button>
        <div className="hidden md:block text-[13px] text-[#64748B] font-medium text-center flex-1">
          <strong className="text-[#1F2937]">TIP:</strong> If you decided to get support, save as draft then you an start where you left
        </div>
        <button onClick={onComplete} disabled={deploying} style={{ flex: '1 1 auto', minWidth: '120px', justifyContent: 'center', backgroundColor: '#00C2FF', borderRadius: '12px', border: 'none', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: deploying ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', opacity: deploying ? 0.7 : 1 }}>
          {deploying ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Confirming...</> : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}

import { HeaderBar } from './HeaderBar';
import { StopAutomationModal } from './StopAutomationModal';
import { PipelineOverviewModal } from './PipelineOverviewModal';

export function AutomationsClient() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [useCase, setUseCase] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [problem, setProblem] = useState('');
  const [outcome, setOutcome] = useState('');
  const [tools, setTools] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [dailyReport, setDailyReport] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const [deploySuccess, setDeploySuccess] = useState<string | null>(null);

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
         tools_list: tools ? tools.split(',').map(s=>s.trim()) : [],
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', backgroundColor: '#EDF2F7', paddingBottom: '40px' }}>
        {/* Desktop Header area */}
        <div style={{ padding: '32px 32px 0' }}>
          <HeaderBar title="Ai Automations" />
        </div>

        {/* ── Success Banner ── */}
        {deploySuccess && (
          <div style={{ margin: '16px 32px 0', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '16px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#065F46', margin: 0 }}>Automation Submitted Successfully!</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#047857', margin: '2px 0 0' }}>Booking ID: <strong>{deploySuccess}</strong> — Our team will review and deploy your automation.</p>
              </div>
            </div>
            <button onClick={() => setDeploySuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6EE7B7', fontSize: '20px', lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Desktop Stepper (Full Width) */}
        <div style={{ padding: '24px 32px 0' }}>
          <div className="aauto-desktop-progress" style={{ position: 'relative', width: '100%', maxWidth: '1318px', height: '56px', margin: '0 auto 32px' }}>
            <div style={{ position: 'absolute', left: 0, top: '48px', width: '100%', height: '8px', backgroundColor: '#F0F4F5', borderRadius: '9999px' }} />
            <div style={{ position: 'absolute', left: 0, top: '48px', width: step === 1 ? '42%' : step === 2 ? '90%' : '100%', height: '8px', background: 'linear-gradient(90deg, #00EAFF 0%, #00D4FF 100%)', borderRadius: '9999px', boxShadow: '0px 0px 8px 0px rgba(0, 234, 255, 0.6)', zIndex: 1, transition: 'width 0.4s ease' }} />

            {/* Step 1 */}
            <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#00EAFF', borderRadius: '9999px', flexShrink: 0, boxShadow: step === 1 ? '0 0 0 4px rgba(0,234,255,0.15)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {step > 1 && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563' }}>Use Case</span>
            </div>

            {/* Step 2 */}
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

            {/* Step 3 */}
            <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2, opacity: step >= 3 ? 1 : 0.4 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9999px', flexShrink: 0, backgroundColor: step >= 3 ? '#00EAFF' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: step >= 3 ? '#fff' : '#4B5563' }}>3</span>
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563' }}>Confirm</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="aauto-layout-wrapper">
          <div className="aauto-main-container">
            {/* Desktop Stepper removed from here */}

            {/* Mobile Progress */}
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

            {/* Main Content Areas */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              {step === 1 && (
                                <StepUseCase
                  useCase={useCase}
                  setUseCase={setUseCase}
                  onSave={() => setStep(2)}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  onStop={() => setIsStopModalOpen(true)}
                  onShowDetail={() => setIsDetailModalOpen(true)}
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
                  deploying={deploying}
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
          onClose={() => setIsDetailModalOpen(false)}
        />
      </div>
    </>
  );
}
