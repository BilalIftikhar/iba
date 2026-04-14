'use client';

import { useState, useEffect } from 'react';
import { OptimizePromptButton } from './OptimizePromptButton';
import { AnimatedTextarea } from './AnimatedTextarea';
import { mockAiOptimize } from '../lib/mockAiOptimize';

// ─── Types ───────────────────────────────────────────────────────────────────
interface AiAppsForm {
  description: string;
  dataSources: string[];
  otherSources: string[];   // custom user-entered data sources
}

interface CmsAppTemplate {
  id: string;
  title: string;
  category: string;
  icon: string;
  short_description: string;
  full_description: string;
  use_case: string;
  roi_yearly: string;
  delivery_time: string;
  difficulty: string;
  key_features: string;
  data_sources: string;
  is_published: boolean;
}

// ─── Data Source Options ──────────────────────────────────────────────────────
const DATA_SOURCES = [
  { id: 'supabase',    label: 'Supabase',      icon: '🟢', selected: true  },
  { id: 'sql',         label: 'SQL Databases', icon: '🗄️', selected: false },
  { id: 'notion',      label: 'Notion',        icon: '📝', selected: false },
  { id: 'bigquery',    label: 'BigQuery',      icon: '📊', selected: false },
  { id: 'xano',        label: 'Xano',          icon: '⚡', selected: false },
  { id: 'hubspot',     label: 'HubSpot',       icon: '🧡', selected: false },
  { id: 'monday',      label: 'Monday.com',    icon: '📋', selected: false },
  { id: 'airtable',    label: 'Airtable',      icon: '🔷', selected: false },
  { id: 'firebase',    label: 'Firebase',      icon: '🔥', selected: false },
  { id: 'rest',        label: 'REST API',      icon: '🔌', selected: false },
  { id: 'sheets',      label: 'Google Sheets', icon: '📗', selected: false },
  { id: 'other',       label: 'Other',         icon: '➕', selected: false },
];

// Fallback templates if API returns nothing
const FALLBACK_TEMPLATES = [
  {
    title: 'Client Portal',
    description: 'Secure dashboard for your clients to view documents and track progress.',
    icon: '🤝',
  },
  {
    title: 'Inventory Management',
    description: 'Track stock levels, orders, sales and deliveries in real-time.',
    icon: '📦',
  },
  {
    title: 'Employee Onboarding',
    description: 'Streamline new hire paperwork and training modules effortlessly.',
    icon: '👋',
  },
];

// ─── Global Responsive CSS ───────────────────────────────────────────────────
const css = `
  @keyframes aiPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0, 234, 255, 0.4); }
    50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(0, 234, 255, 0); }
  }
  @keyframes bounceIn {
    0% { transform: scale(0.5); opacity: 0; }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  textarea::placeholder, input::placeholder { color: #94A3B8; }

  /* ── Mobile Progress Card ── */
  .aiapps-progress-mobile {
    display: none;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0px 1px 2px rgba(0,0,0,0.05);
    padding: 16px;
    margin-bottom: 12px;
  }
  .aiapps-progress-row { display: flex; justify-content: space-between; align-items: center; }
  .aiapps-progress-track { height: 4px; background: #E5E7EB; border-radius: 9999px; margin-top: 12px; overflow: hidden; }
  .aiapps-progress-fill { height: 100%; background: #00E5FF; border-radius: 9999px; transition: width .4s ease; }
  .aiapps-desktop-progress { display: block; }

  /* ── Step 1 layout ── */
  .aiapps-step1-layout { padding: 0 32px; display: flex; align-items: flex-start; gap: 24px; }
  .aiapps-step1-main { flex: 1; min-width: 0; max-width: 896px; display: flex; flex-direction: column; }
  .aiapps-step1-aside { width: 260px; flex-shrink: 0; }
  .aiapps-template-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

  /* ── Step 2 layout ── */
  .aiapps-step2-layout { padding: 0 32px; display: flex; align-items: flex-start; gap: 24px; }
  .aiapps-step2-main { flex: 1; min-width: 0; max-width: 896px; display: flex; flex-direction: column; gap: 0; }
  .aiapps-step2-aside { width: 260px; flex-shrink: 0; }
  .aiapps-datasrc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }

  /* ── Step 3 layout ── */
  .aiapps-step3-layout { padding: 0 32px; display: flex; justify-content: center; align-items: flex-start; gap: 24px; min-width: 0; }
  .aiapps-step3-main { flex: 0 1 1280px; min-width: 0; }
  .aiapps-review-row { display: flex; gap: 16px; margin-bottom: 24px; }
  .aiapps-review-preview { width: 304px; flex-shrink: 0; }
  .aiapps-bottom-row { display: flex; gap: 16px; }
  .aiapps-timeline-card { width: 304px; flex-shrink: 0; }

  /* ── Footer nav ── */
  .aiapps-footer { padding: 32px 32px 40px; display: flex; justify-content: space-between; align-items: center; }
  .aiapps-footer-right { display: flex; justify-content: flex-end; padding: 32px 32px 40px; }

  /* ── Template divider ── */
  .aiapps-divider { display: flex; align-items: center; gap: 12px; padding: 24px 0 16px; }
  .aiapps-divider-line { flex: 1; height: 1px; background: #E2E8F0; min-width: 0; }
  .aiapps-divider-text { font-family: Inter, sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #94A3B8; white-space: nowrap; flex-shrink: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }

  @media (max-width: 424px) {
    .aiapps-divider-line { display: none; }
    .aiapps-divider { justify-content: center; }
    .aiapps-divider-text { font-size: 10px; letter-spacing: 0.08em; white-space: normal; text-align: center; }
  }

  @media (max-width: 767px) {
    .aiapps-progress-mobile { display: block; }
    .aiapps-desktop-progress { display: none; }

    /* Step 1 */
    .aiapps-step1-layout { flex-direction: column; padding: 0 16px; gap: 12px; }
    .aiapps-step1-main { width: 100%; max-width: 100%; }
    .aiapps-step1-aside { width: 100%; }
    .aiapps-template-grid { grid-template-columns: 1fr; }

    /* Step 2 */
    .aiapps-step2-layout { flex-direction: column; padding: 0 16px; gap: 12px; }
    .aiapps-step2-main { width: 100%; max-width: 100%; }
    .aiapps-step2-aside { width: 100%; }
    .aiapps-datasrc-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }

    /* Step 3 */
    .aiapps-step3-layout { flex-direction: column; padding: 0 16px; gap: 12px; }
    .aiapps-step3-main { width: 100%; max-width: 100%; }
    .aiapps-review-row { flex-direction: column; }
    .aiapps-review-preview { width: 100%; min-height: 150px; }
    .aiapps-bottom-row { flex-direction: column; }
    .aiapps-timeline-card { width: 100%; }
    .aiapps-review-main-grid { grid-template-columns: 1fr !important; }
    .aiapps-support-grid { grid-template-columns: 1fr !important; }

    /* Footer */
    .aiapps-footer {
      flex-direction: column-reverse;
      gap: 10px;
      padding: 16px 16px 28px;
    }
    .aiapps-footer > * { width: 100% !important; justify-content: center !important; }
    .aiapps-footer-right {
      padding: 16px 16px 28px;
    }
    .aiapps-footer-right > button { width: 100% !important; justify-content: center !important; }

    .aiapps-header-search { display: none !important; }
    .aiapps-progress-section { padding: 12px 16px 0 !important; }
    .aiapps-content-top { padding-top: 16px !important; }
    .aiapps-card-pad { padding: 20px !important; }
  }
`;

// ─── Shared Icons ─────────────────────────────────────────────────────────────
function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5m7 7-7-7 7-7" />
    </svg>
  );
}

// ─── Mobile Progress Card ─────────────────────────────────────────────────────
function MobileProgress({ step }: { step: 1 | 2 | 3 }) {
  const fillPct = step === 1 ? '33%' : step === 2 ? '66%' : '100%';
  const steps = ['Use Case', 'Data Source', 'Review & Book'];
  return (
    <div className="aiapps-progress-mobile">
      <div className="aiapps-progress-row">
        {steps.map((label, i) => {
          const n = i + 1;
          const isActive = step === n;
          const isDone = step > n;
          return (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '9999px', flexShrink: 0,
                backgroundColor: isActive || isDone ? '#00E5FF' : 'transparent',
                border: isActive || isDone ? 'none' : '1.5px solid #9CA3AF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '11px', color: isActive ? '#fff' : '#9CA3AF' }}>{n}</span>
                )}
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: isActive ? 600 : 400, fontSize: '12px', color: isActive ? '#1F2937' : '#9CA3AF', lineHeight: '1.33em' }}>{label}</span>
            </div>
          );
        })}
      </div>
      <div className="aiapps-progress-track">
        <div className="aiapps-progress-fill" style={{ width: fillPct }} />
      </div>
    </div>
  );
}

// ─── Desktop Progress Bar ─────────────────────────────────────────────────────
function DesktopProgress({ activeStep }: { activeStep: 1 | 2 | 3 }) {
  const progressPercent = activeStep === 1 ? '42%' : activeStep === 2 ? '90%' : '100%';
  return (
    <div className="aiapps-desktop-progress" style={{ position: 'relative', width: '100%', maxWidth: '1318px', height: '56px', margin: '0 auto' }}>
      <div style={{ position: 'absolute', left: 0, top: '48px', width: '100%', height: '8px', backgroundColor: '#F0F4F5', borderRadius: '9999px' }} />
      <div style={{ position: 'absolute', left: 0, top: '48px', width: progressPercent, height: '8px', background: 'linear-gradient(90deg, #00EAFF 0%, #00D4FF 100%)', borderRadius: '9999px', boxShadow: '0px 0px 8px 0px rgba(0, 234, 255, 0.6)', zIndex: 1, transition: 'width 0.4s ease' }} />
      {/* Step 1 */}
      <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#00EAFF', borderRadius: '9999px', flexShrink: 0, boxShadow: activeStep === 1 ? '0 0 0 4px rgba(0,234,255,0.15)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {activeStep > 1 && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563' }}>Use Case</span>
      </div>
      {/* Step 2 */}
      <div style={{ position: 'absolute', left: 'calc(40% - 16px)', top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2, opacity: activeStep >= 2 ? 1 : 0.4 }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9999px', flexShrink: 0, backgroundColor: activeStep >= 2 ? '#00EAFF' : 'rgba(255,255,255,0.2)', border: activeStep >= 2 ? 'none' : '1px solid rgba(71,85,105,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: activeStep === 2 ? '0 0 0 4px rgba(0,234,255,0.15)' : 'none' }}>
          {activeStep > 2 ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: activeStep >= 2 ? '#4B5563' : '#94A3B8' }}>2</span>
          )}
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563' }}>Data Source</span>
      </div>
      {/* Step 3 */}
      <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2, opacity: activeStep >= 3 ? 1 : 0.4 }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9999px', flexShrink: 0, backgroundColor: activeStep >= 3 ? '#00EAFF' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: activeStep === 3 ? '0 0 0 4px rgba(0,234,255,0.15)' : 'none' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#475569' }}>3</span>
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#475569' }}>Review &amp; Book</span>
      </div>
    </div>
  );
}

// ─── Step 1: Use Case ─────────────────────────────────────────────────────────
function StepUseCase({ form, setForm, onNext, templates }: { form: AiAppsForm; setForm: (f: AiAppsForm) => void; onNext: () => void; templates: { title: string; description: string; icon: string; use_case?: string }[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <div className="aiapps-step1-layout">
        {/* Main column */}
        <div className="aiapps-step1-main">
          {/* Input Card */}
          <div className="aiapps-card-pad" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '24px', lineHeight: '32px', color: '#1F2937', margin: 0 }}>
              What kind of app do you need?
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: '#6B7280', margin: 0 }}>
              Describe your vision in plain English, and our AI will draft the architecture.
            </p>
            <div style={{ paddingTop: '16px' }}>
              <div style={{ position: 'relative', backgroundColor: '#F3F4F6', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <AnimatedTextarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g., A CRM for a real estate agency with automated follow-ups and property listings..."
                  rows={8}
                  style={{ width: '100%', backgroundColor: 'transparent', border: 'none', outline: 'none', padding: '24px', paddingBottom: '70px', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '24px', color: '#4B5563', resize: 'none', display: 'block', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px 16px' }}>
                  <OptimizePromptButton
                    onOptimize={() => setForm({ ...form, description: mockAiOptimize(form.description, 'architecture') })}
                    disabled={!form.description.trim()}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="aiapps-divider">
            <div className="aiapps-divider-line" />
            <span className="aiapps-divider-text">
              Or choose from popular app templates
            </span>
            <div className="aiapps-divider-line" />
          </div>

          {/* Template cards */}
          <div className="aiapps-template-grid">
            {templates.map((tpl) => (
              <div
                key={tpl.title}
                onMouseEnter={() => setHovered(tpl.title)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { setForm({ ...form, description: tpl.use_case || `I need a ${tpl.title} app. ${tpl.description}` }); onNext(); }}
                style={{ backgroundColor: '#FFFFFF', border: `1px solid ${hovered === tpl.title ? '#00EAFF' : '#E2E8F0'}`, borderRadius: '12px', boxShadow: hovered === tpl.title ? '0 0 0 1px rgba(0,234,255,0.2), 0px 1px 2px rgba(0,0,0,0.05)' : '0px 1px 2px rgba(0,0,0,0.05)', padding: '25px', cursor: 'pointer', transition: 'border-color 0.15s ease, box-shadow 0.15s ease', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ width: '48px', height: '48px', backgroundColor: '#F3F4F6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                  {tpl.icon || '📱'}
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', lineHeight: '24px', color: '#1F2937', margin: '0 0 4px' }}>{tpl.title}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: '16px', color: '#6B7280', margin: '0 0 12px', flex: 1 }}>{tpl.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: hovered === tpl.title ? 1 : 0, transition: 'opacity 0.15s ease' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: '#00EAFF' }}>Use Template</span>
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#00EAFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5h6M5 2l3 3-3 3" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aside: AI Tips */}
        <aside className="aiapps-step1-aside" style={{ backgroundColor: 'rgba(0,234,255,0.05)', border: '1px solid rgba(0,234,255,0.2)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '37px', minHeight: '370px' }}>
          <div>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(0,234,255,0.2)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z" fill="rgba(0,234,255,0.3)" />
                <path d="M8 4v8M4 8h8" stroke="#00EAFF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', lineHeight: '24px', color: '#1F2937', margin: '0 0 16px' }}>Pro Tip</h4>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '22.75px', color: '#4B5563', margin: 0 }}>
              Include details about who will use the app and what main problem it solves. The more specific you are, the better the AI can tailor the components.
            </p>
          </div>
          <div style={{ borderTop: '1px solid rgba(0,234,255,0.1)', paddingTop: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#00EAFF', flexShrink: 0, animation: 'aiPulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4B5563' }}>AI Agent Online</span>
          </div>
        </aside>
      </div>

      {/* Bottom: Next button */}
      <div className="aiapps-footer-right">
        <button
          onClick={onNext}
          style={{ backgroundColor: '#1F2937', borderRadius: '12px', border: 'none', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: '#fff' }}
        >
          Next: Select Data Source
          <ArrowRightIcon />
        </button>
      </div>
    </>
  );
}

// ─── Step 2: Data Source ──────────────────────────────────────────────────────
function StepDataSource({ form, setForm, onNext, onBack }: { form: AiAppsForm; setForm: (f: AiAppsForm) => void; onNext: () => void; onBack: () => void }) {
  const [sources, setSources] = useState(() =>
    DATA_SOURCES.map(s => ({ ...s, selected: form.dataSources.includes(s.id) || s.id === 'supabase' }))
  );
  // Input field value for the "other" text box
  const [otherInput, setOtherInput] = useState('');
  // List of custom sources the user has confirmed by clicking Add
  const [customSources, setCustomSources] = useState<string[]>(form.otherSources || []);
  const [hovered, setHovered] = useState<string | null>(null);
  const [inputError, setInputError] = useState('');

  const toggle = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const addCustomSource = () => {
    const trimmed = otherInput.trim();
    if (!trimmed) return;
    if (customSources.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setInputError('Already added');
      return;
    }
    setCustomSources(prev => [...prev, trimmed]);
    setOtherInput('');
    setInputError('');
  };

  const removeCustomSource = (index: number) => {
    setCustomSources(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setForm({
      ...form,
      dataSources: sources.filter(s => s.selected).map(s => s.id),
      otherSources: customSources,
    });
    onNext();
  };

  const selectedCount = sources.filter(s => s.selected).length + customSources.length;

  return (
    <>
      <div className="aiapps-step2-layout">
        {/* Main */}
        <div className="aiapps-step2-main">
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '24px', lineHeight: '1.25em', color: '#1F2937', margin: '0 0 8px' }}>
              Step 2: Data Source
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.5em', color: '#6B7280', margin: 0 }}>
              Select all the data sources that apply to your application.
            </p>
          </div>

          <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', lineHeight: '28px', color: '#1F2937', margin: '0 0 20px' }}>
            Select all that apply
          </h3>

          {/* Data source grid */}
          <div className="aiapps-datasrc-grid">
            {sources.filter(s => s.id !== 'other').map((src) => {
              const isSelected = src.selected;
              const isHovered = hovered === src.id;
              return (
                <button
                  key={src.id}
                  onMouseEnter={() => setHovered(src.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => toggle(src.id)}
                  style={{ backgroundColor: isSelected ? 'rgba(0,234,255,0.05)' : '#FFFFFF', border: isSelected ? '2px solid #00EAFF' : `2px solid ${isHovered ? 'rgba(0,234,255,0.3)' : 'transparent'}`, borderRadius: '12px', padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)', transition: 'all 0.15s ease', position: 'relative' }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#00EAFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  )}
                  <span style={{ fontSize: '24px', lineHeight: 1 }}>{src.icon}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', lineHeight: '1.43em', color: '#374151', textAlign: 'center' }}>{src.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Other Data Source ── */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '12px', padding: '20px', marginTop: '8px' }}>
            <label style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#374151', display: 'block', marginBottom: '4px' }}>Other Data Source</label>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#94A3B8', margin: '0 0 12px' }}>Add any data source not listed above — press Enter or click Add.</p>

            {/* Input row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={otherInput}
                  onChange={(e) => { setOtherInput(e.target.value); setInputError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSource(); } }}
                  placeholder="e.g. Salesforce, Stripe, custom API..."
                  style={{ width: '100%', border: `1px solid ${inputError ? '#EF4444' : '#E2E8F0'}`, borderRadius: '8px', padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#4B5563', outline: 'none', backgroundColor: '#FFFFFF', boxSizing: 'border-box', transition: 'border-color 0.15s ease' }}
                />
                {inputError && (
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#EF4444', margin: '4px 0 0', position: 'absolute' }}>{inputError}</p>
                )}
              </div>
              <button
                onClick={addCustomSource}
                disabled={!otherInput.trim()}
                style={{ backgroundColor: otherInput.trim() ? '#00EAFF' : '#E2E8F0', borderRadius: '8px', border: 'none', padding: '10px 20px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: otherInput.trim() ? '#1F2937' : '#94A3B8', cursor: otherInput.trim() ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', flexShrink: 0, height: '42px', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                Add
              </button>
            </div>

            {/* Added custom source chips */}
            {customSources.length > 0 && (
              <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {customSources.map((src, idx) => (
                  <div
                    key={idx}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0,234,255,0.1)', border: '1px solid rgba(0,234,255,0.35)', borderRadius: '8px', padding: '5px 10px 5px 12px' }}
                  >
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: '#1F2937' }}>➕ {src}</span>
                    <button
                      onClick={() => removeCustomSource(idx)}
                      title="Remove"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', display: 'flex', alignItems: 'center', color: '#6B7280', lineHeight: 1 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Aside */}
        <aside className="aiapps-step2-aside" style={{ backgroundColor: 'rgba(0,234,255,0.05)', border: '1px solid rgba(0,234,255,0.2)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(0,234,255,0.2)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1F2937', margin: 0 }}>Need Help?</h4>
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '22px', color: '#4B5563', margin: 0 }}>
            Not sure which data source to pick? Choose the platforms where your business data currently lives — we can connect to multiple sources simultaneously.
          </p>
          {selectedCount > 0 && (
            <div style={{ backgroundColor: 'rgba(0,234,255,0.1)', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00EAFF', animation: 'aiPulse 1.8s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: '#4B5563' }}>
                {selectedCount} source{selectedCount !== 1 ? 's' : ''} selected
                {customSources.length > 0 && <span style={{ color: '#00EAFF' }}> (+{customSources.length} custom)</span>}
              </span>
            </div>
          )}
          <div style={{ borderTop: '1px solid rgba(0,234,255,0.1)', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#00EAFF', flexShrink: 0, animation: 'aiPulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4B5563' }}>AI Agent Online</span>
          </div>
        </aside>
      </div>

      <div className="aiapps-footer">
        <button onClick={onBack} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#475569' }}>
          <ArrowLeftIcon />Back
        </button>
        <button onClick={handleNext} style={{ backgroundColor: '#00EAFF', borderRadius: '12px', border: 'none', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1F2937', boxShadow: '0px 4px 6px -4px rgba(0,234,255,0.3), 0px 10px 15px -3px rgba(0,234,255,0.3)' }}>
          Next: Review &amp; Book<ArrowRightIcon />
        </button>
      </div>
    </>
  );
}

// ─── Step 3: Review & Book ────────────────────────────────────────────────────
function StepReviewBook({ form, onBack, onConfirm }: { form: AiAppsForm; onBack: () => void; onConfirm: (bookingId: string) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState('');
  const [draftSaved, setDraftSaved] = useState<string | null>(null);
  const selectedSources = DATA_SOURCES.filter(s => form.dataSources.includes(s.id));

  const handleConfirm = async () => {
    setConfirming(true);
    setError('');
    try {
      const { createBooking } = await import('../lib/api');
      const result: any = await createBooking({
        type: 'custom_app',
        status: 'booked',
        title: form.description ? `AI App: ${form.description.substring(0, 40)}` : 'AI Custom App Request',
        use_case: form.description,
        tools_list: [
          ...form.dataSources,
          ...(form.otherSources?.length ? form.otherSources : []),
        ],
      });
      onConfirm(result?.id ?? 'submitted');
    } catch (e: unknown) {
      setError((e as Error).message || 'Failed to submit. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    setError('');
    try {
      const { saveDraft } = await import('../lib/api');
      const result: any = await saveDraft({
        type: 'custom_app',
        title: form.description ? `AI App: ${form.description.substring(0, 40)}` : 'AI Custom App (Draft)',
        use_case: form.description,
        tools_list: [...form.dataSources, ...(form.otherSources ?? [])],
        draft_state: {
          step: 3,
          description: form.description,
          dataSources: form.dataSources,
          otherSources: form.otherSources,
        },
      });
      setDraftSaved(result?.id ?? 'saved');
      setTimeout(() => setDraftSaved(null), 5000);
    } catch (e: unknown) {
      setError((e as Error).message || 'Failed to save draft. Please try again.');
    } finally {
      setSavingDraft(false);
    }
  };

  const integrationText = selectedSources.length > 0
    ? selectedSources.slice(0, 3).map(s => s.label).join(' + ')
    : 'SaaS Suite & CRM';

  const targetDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const outcomePoints = ['Real-time Dashboard', 'AI-driven insights', 'Custom client views'];

  return (
    <>
      <div className="aiapps-step3-layout">
        <div className="aiapps-step3-main">

          {/* ── Title ── */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00EAFF', margin: '0 0 8px' }}>✦ Final Step</p>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '32px', lineHeight: '1.2em', color: '#1F2937', margin: '0 0 8px' }}>Review &amp; Confirm</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.5em', color: '#6B7280', margin: 0 }}>Please verify your project details before we begin the deployment phase.</p>
          </div>

          {/* ── Two-column main grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', marginBottom: '16px' }} className="aiapps-review-main-grid">

            {/* Left: Project Summary Card */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', boxShadow: '0px 1px 3px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'inline-flex', backgroundColor: '#F3F4F6', borderRadius: '6px', padding: '4px 10px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>Project Summary</span>
                </div>
              </div>

              <div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1F2937', margin: '0 0 8px' }}>
                  App Use Case: {form.description ? form.description.split(' ').slice(0, 3).join(' ') + '...' : 'Client Portal'}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: '1.6em', color: '#4B5563', margin: 0 }}>
                  {form.description || 'A centralized hub designed for real-time reporting and interactive data management. Features custom views tailored to individual client needs with integrated AI-driven insights.'}
                </p>
              </div>

              {/* Two-column inner: problem + outcome */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', margin: '0 0 8px' }}>The Problem</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: '1.6em', color: '#374151', margin: 0 }}>
                    Manual effort in data management causing delays and inconsistent client reporting.
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', margin: '0 0 8px' }}>Expected Outcome</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {outcomePoints.map((pt, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(0,234,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="8" height="8" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#00EAFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#374151' }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Goal + Integrations pills */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ backgroundColor: 'rgba(0,234,255,0.08)', border: '1px solid rgba(0,234,255,0.2)', borderRadius: '8px', padding: '8px 14px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0E7490' }}>Core Goal: </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', color: '#0E7490' }}>Real-time Dashboard</span>
                </div>
                <div style={{ backgroundColor: '#F3F4F6', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 14px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B7280' }}>Integrations: </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', color: '#374151' }}>{integrationText}</span>
                </div>
              </div>

              {/* Data sources (if any selected) */}
              {selectedSources.length > 0 && (
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', margin: '0 0 8px' }}>Data Sources</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedSources.map(s => (
                      <span key={s.id} style={{ backgroundColor: 'rgba(0,234,255,0.08)', border: '1px solid rgba(0,234,255,0.25)', borderRadius: '6px', padding: '3px 10px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {s.icon} {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Implementation Timeline */}
            <div style={{ backgroundColor: '#1B2533', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#00EAFF,#3B82F6,#10B981)' }} />

              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: '#FFFFFF', margin: '0 0 24px' }}>Implementation</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                {/* Completed */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 12px rgba(0,229,255,0.4)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', margin: '0 0 2px' }}>Completed</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', margin: 0 }}>AI Calculation Complete</p>
                  </div>
                </div>

                {/* Next Phase */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', margin: '0 0 2px' }}>Next Phase</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', margin: '0 0 2px' }}>Setup Time: 2-3 Days</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#64748B', margin: 0 }}>Engineer assigned</p>
                  </div>
                </div>

                {/* Target Date */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', margin: '0 0 2px' }}>Target Date</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#00E5FF', margin: 0 }}>Deployment: {targetDate}</p>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '24px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', margin: '0 0 4px' }}>Booking Reference</p>
                <p style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '15px', color: '#00E5FF', margin: 0 }}>Assigned after confirmation</p>
              </div>
            </div>
          </div>

          {/* ── Two support cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="aiapps-support-grid">

            {/* Left: We've Got You Covered */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', display: 'flex', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(0,234,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1F2937', margin: '0 0 6px' }}>We&apos;ve Got You Covered</h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: '1.55em', color: '#6B7280', margin: '0 0 14px' }}>
                  Once confirmed, our deployment engineers will review the flow for edge cases. You&apos;ll receive a notification within 4 hours confirming the start of the production build.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: '#00EAFF', cursor: 'pointer', padding: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16h16V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Create Ticket
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: '#00EAFF', cursor: 'pointer', padding: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Already know what you need? */}
            <div style={{ backgroundColor: 'rgba(0,234,255,0.06)', border: '1px solid rgba(0,234,255,0.12)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#FFFFFF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1F2937', margin: '0 0 4px' }}>Already know what you need?</h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: '1.5em', color: '#6B7280', margin: 0 }}>Jump ahead and set up your tool credentials.</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          {/* ── Draft saved toast ── */}
          {draftSaved && (
            <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '12px', padding: '12px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#065F46', margin: 0 }}>Draft saved!</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#047857', margin: 0 }}>Reference: <strong>{draftSaved}</strong> — resume from your Bookings dashboard.</p>
              </div>
            </div>
          )}

          {/* ── Bottom action bar ── */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', flexWrap: 'wrap', marginBottom: '40px' }}>
            {/* Save Draft */}
            <button onClick={handleSaveDraft} disabled={savingDraft} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '11px 20px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1F2937', cursor: savingDraft ? 'not-allowed' : 'pointer', flexShrink: 0, opacity: savingDraft ? 0.7 : 1 }}>
              {savingDraft ? (
                <><svg style={{ width: 14, height: 14, animation: 'spin .8s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Saving...</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Save Draft</>
              )}
            </button>

            {/* TIP text */}
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280', margin: 0, flex: 1, textAlign: 'center' }}>
              <strong style={{ color: '#1F2937', fontWeight: 700 }}>TIP:</strong> If you decided to get support, save as draft then you can start where you left
            </p>

            {/* Confirm Booking */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
              {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#EF4444', margin: 0 }}>⚠️ {error}</p>}
              <button onClick={handleConfirm} disabled={confirming} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#00EAFF', border: 'none', borderRadius: '10px', padding: '11px 24px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1F2937', cursor: confirming ? 'not-allowed' : 'pointer', opacity: confirming ? 0.7 : 1, whiteSpace: 'nowrap' }}>
                {confirming ? (
                  <><svg style={{ width: 16, height: 16, animation: 'spin .8s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Confirming...</>
                ) : (
                  <>Confirm Booking<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}


// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #00E5FF, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 16px 32px rgba(0,234,255,0.3)', animation: 'bounceIn 0.6s ease' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '26px', color: '#1F2937', margin: '0 0 10px' }}>App Build Confirmed! 🚀</h2>
      <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '1.6em', color: '#6B7280', maxWidth: '420px', margin: '0 0 28px' }}>
        Your AI Custom App request has been submitted. Our engineers will begin the build process and send you a timeline within 4 business hours.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onReset} style={{ backgroundColor: '#00EAFF', borderRadius: '12px', border: 'none', padding: '12px 24px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1F2937', cursor: 'pointer', boxShadow: '0px 4px 14px rgba(0,234,255,0.3)' }}>Build Another App</button>
        <button onClick={onReset} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '12px 24px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#475569', cursor: 'pointer' }}>View Dashboard</button>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
import { HeaderBar } from './HeaderBar';

const DEFAULT_FORM: AiAppsForm = { description: '', dataSources: ['supabase'], otherSources: [] };

export function AiAppsClient() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deploySuccess, setDeploySuccess] = useState<string | null>(null);
  const [form, setForm] = useState<AiAppsForm>(DEFAULT_FORM);
  const [appTemplates, setAppTemplates] = useState<{ title: string; description: string; icon: string; use_case?: string }[]>(FALLBACK_TEMPLATES);
  const reset = () => { setStep(1); setDeploySuccess(null); setForm(DEFAULT_FORM); };

  useEffect(() => {
    import('../lib/api').then(({ fetchAppTemplates }) => {
      fetchAppTemplates<CmsAppTemplate[]>()
        .then((data) => {
          if (data && data.length > 0) {
            setAppTemplates(data.map(t => ({
              title: t.title,
              description: t.short_description || t.use_case?.substring(0, 80) || '',
              icon: t.icon || '📱',
              use_case: t.use_case,
            })));
          }
        })
        .catch(console.error);
    });
  }, []);

  return (
    <div style={{ minHeight: '100%', backgroundColor: '#F3F4F6', display: 'flex', flexDirection: 'column' }}>
      <style>{css}</style>

      {/* ── Progress ── */}
      {!deploySuccess && (
        <section className="aiapps-progress-section" style={{ padding: '0 16px 0' }}>
          {/* Mobile card progress */}
          <MobileProgress step={step} />
          {/* Desktop header & progress bar */}
          <div style={{ padding: '32px 32px 0' }}>
            <HeaderBar title="Ai Custom Apps" />
            <DesktopProgress activeStep={step} />
          </div>
        </section>
      )}

      {/* ── Success Banner ── */}
      {deploySuccess && (
        <div style={{ margin: '16px 32px 0', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '16px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#065F46', margin: 0 }}>AI Custom App Request Submitted!</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#047857', margin: '2px 0 0' }}>Booking ID: <strong>{deploySuccess}</strong> — Our engineers will begin the build and notify you within 4 hours.</p>
            </div>
          </div>
          <button onClick={() => setDeploySuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6EE7B7', fontSize: '20px', lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* ── Content ── */}
      <div className="aiapps-content-top" style={{ flex: 1, paddingTop: '24px' }}>
        <>
          {step === 1 && <StepUseCase form={form} setForm={setForm} onNext={() => setStep(2)} templates={appTemplates} />}
          {step === 2 && <StepDataSource form={form} setForm={setForm} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepReviewBook form={form} onBack={() => setStep(2)} onConfirm={(id) => { setDeploySuccess(id); setStep(1); setForm(DEFAULT_FORM); }} />}
        </>
      </div>
    </div>
  );
}
