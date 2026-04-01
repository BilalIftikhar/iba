'use client';

import { useState } from 'react';
import { OptimizePromptButton } from './OptimizePromptButton';
import { AnimatedTextarea } from './AnimatedTextarea';
import { mockAiOptimize } from '../lib/mockAiOptimize';

/* ─── Global mobile styles ──────────────────────────────────────────────────── */
const css = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  textarea::placeholder, input::placeholder { color: #9CA3AF; }

  /* Mobile progress tracker card */
  .cw-progress-card {
    display: none;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0px 1px 2px rgba(0,0,0,0.05);
    padding: 16px;
    margin-bottom: 12px;
  }
  .cw-progress-row { display: flex; justify-content: space-between; align-items: center; gap: 0; }
  .cw-progress-track { height: 4px; background: #E5E7EB; border-radius: 9999px; margin-top: 12px; overflow: hidden; }
  .cw-progress-fill { height: 100%; background: #00E5FF; border-radius: 9999px; transition: width .4s ease; }

  /* Desktop progress bar */
  .cw-desktop-progress { display: block; }

  /* Mobile step 1 layout */
  .cw-step1-layout { display: flex; gap: 24px; padding: 0 32px; align-items: flex-start; }
  .cw-step1-main { flex: 1; min-width: 0; }
  .cw-step1-sidebar { width: 340px; flex-shrink: 0; }
  .cw-step1-nav { padding: 24px 32px 40px; display: flex; justify-content: space-between; align-items: center; }

  .cw-tool-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
  .cw-ai-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .cw-review-grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }

  .cw-section-pad { padding: 0 32px; }
  .cw-footer-nav { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; padding-bottom: 40px; }

  @media (max-width: 767px) {
    .cw-progress-card { display: block; }
    .cw-desktop-progress { display: none; }

    .cw-step1-layout { flex-direction: column; padding: 0 16px; gap: 12px; }
    .cw-step1-main { width: 100%; }
    .cw-step1-sidebar { width: 100%; }
    .cw-step1-nav { padding: 12px 16px 32px; flex-direction: column-reverse; gap: 12px; }
    .cw-step1-nav-back-btn { width: 100% !important; justify-content: center !important; }
    .cw-step1-next-btn { width: 100% !important; justify-content: center !important; }
    .cw-step1-automate-btn { display: none !important; }

    .cw-tool-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .cw-ai-grid { grid-template-columns: 1fr; gap: 12px; }
    .cw-review-grid { grid-template-columns: 1fr; }

    .cw-section-pad { padding: 0 16px; }

    .cw-footer-nav {
      flex-direction: column-reverse;
      gap: 10px;
      padding-top: 12px;
      padding-bottom: 28px;
    }
    .cw-footer-nav > * { width: 100% !important; justify-content: center !important; }

    .cw-content-header { padding: 32px 16px 16px !important; }
    .cw-card-pad { padding: 20px !important; }
  }
`;

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type CoWorkForm = { useCase: string; chatClient: string; tools: string[] };

/* ─── Mobile Progress Tracker (Figma 1129-996) ──────────────────────────────── */
function MobileProgress({ step }: { step: 1 | 2 | 3 }) {
  const fillPct = step === 1 ? '33%' : step === 2 ? '66%' : '100%';
  const steps = ['Use Case', 'Tools & Apps', 'Review & Book'];
  return (
    <div className="cw-progress-card">
      <div className="cw-progress-row">
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
      <div className="cw-progress-track">
        <div className="cw-progress-fill" style={{ width: fillPct }} />
      </div>
    </div>
  );
}

/* ─── Desktop Progress Bar ──────────────────────────────────────────────────── */
function DesktopProgress({ step }: { step: 1 | 2 | 3 }) {
  const fill = step === 1 ? '42%' : step === 2 ? '90%' : '100%';
  return (
    <div className="cw-desktop-progress" style={{ position: 'relative', width: '100%', maxWidth: '1318px', height: '56px', margin: '0 auto' }}>
      <div style={{ position: 'absolute', left: 0, top: '48px', width: '100%', height: '8px', backgroundColor: '#F0F4F5', borderRadius: '9999px' }} />
      <div style={{ position: 'absolute', left: 0, top: '48px', width: fill, height: '8px', background: 'linear-gradient(90deg, #00EAFF 0%, #00D4FF 100%)', borderRadius: '9999px', boxShadow: '0px 0px 8px rgba(0,234,255,0.6)', transition: 'width .4s ease', zIndex: 1 }} />
      {/* Step 1 */}
      <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: '#00EAFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {step > 1 && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563' }}>Use Case</span>
      </div>
      {/* Step 2 */}
      <div style={{ position: 'absolute', left: 'calc(40% - 16px)', top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2, opacity: step >= 2 ? 1 : 0.4 }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: step >= 2 ? '#00EAFF' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: step === 2 ? '0 0 0 4px rgba(0,234,255,0.15)' : 'none' }}>
          {step > 2 ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: step >= 2 ? '#4B5563' : '#94A3B8' }}>2</span>
          )}
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563' }}>Tools &amp; Apps</span>
      </div>
      {/* Step 3 */}
      <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2, opacity: step >= 3 ? 1 : 0.4 }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: step >= 3 ? '#00EAFF' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: step >= 3 ? '#4B5563' : '#475569' }}>3</span>
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#475569' }}>Review &amp; Book</span>
      </div>
    </div>
  );
}

/* ─── Step 1: Use Case ──────────────────────────────────────────────────────── */
function StepUseCase({ form, setForm, onNext }: { form: CoWorkForm; setForm: (f: CoWorkForm) => void; onNext: () => void }) {
  const canProceed = form.useCase.length > 0;
  const handleAI = () => {
    setForm({ ...form, useCase: mockAiOptimize(form.useCase, 'useCase') });
  };

  return (
    <>
      {/* ── Desktop layout ── */}
      <div className="cw-step1-layout">
        {/* Main card */}
        <div className="cw-step1-main">
          <div className="cw-card-pad" style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)', padding: '40px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '24px', lineHeight: '1.25em', color: '#1F2937', margin: 0 }}>Describe Your Use Case</h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.43em', color: '#6B7280', margin: '8px 0 0' }}>Tell us what you want to build and how AI can help you.</p>
              </div>
              <div style={{ backgroundColor: '#F3F4F6', borderRadius: '6px', padding: '4px 8px', flexShrink: 0, marginTop: '4px' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>Required</span>
              </div>
            </div>

            <label style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.025em', textTransform: 'uppercase', color: '#374151', marginBottom: '8px', display: 'block' }}>Your Requirements</label>

            <AnimatedTextarea
              value={form.useCase}
              onChange={(e) => setForm({ ...form, useCase: e.target.value })}
              placeholder="I want an AI Co-Work for my Google Sheets so I can ask it to read data, update rows, calculate totals, create charts, and get insights..."
              rows={7}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.43em', color: '#4B5563', resize: 'none', outline: 'none', marginBottom: '16px' }}
            />

            {/* Hint box — #F0FDFF fill, #E0F2F7 border */}
            <div style={{ backgroundColor: '#F0FDFF', border: '1px solid #E0F2F7', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', lineHeight: '1.625em', color: '#4B5563', margin: 0 }}>
                Hint: Describe what tool you want it connected to and what kind of actions you&apos;ll ask it to do (view, update, delete, summarize, etc.)
              </p>
            </div>

            {/* AI button */}
            <div style={{ marginBottom: '12px' }}>
              <OptimizePromptButton
                onOptimize={handleAI}
                disabled={!canProceed}
              />
            </div>
            <p style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '10px', color: '#9CA3AF', margin: 0 }}>Press ⌘ + Enter to submit</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="cw-step1-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Quick Examples */}
          <div className="cw-card-pad" style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', lineHeight: '1.56em', color: '#1F2937', margin: '0 0 16px' }}>Quick Examples</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Marketing Assistant', text: '"Connect to my Slack and Notion to draft daily standups and update task status automatically."' },
                { label: 'DevOps Monitor', text: '"Watch my GitHub PRs and summarize changes every hour into my project Discord channel."' },
              ].map((ex, i) => (
                <div key={i} onClick={() => setForm({ ...form, useCase: ex.text.replace(/^"|"$/g, '') })}
                  style={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', margin: 0 }}>{ex.label}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: '1.5em', color: '#4B5563', margin: 0 }}>{ex.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help — #EBFDFF background */}
          <div className="cw-card-pad" style={{ backgroundColor: '#EBFDFF', borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1, pointerEvents: 'none' }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="40" fill="#00E5FF" /></svg>
            </div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', lineHeight: '1.5em', color: '#1F2937', margin: '0 0 8px', position: 'relative' }}>Need help?</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: '1.33em', color: '#4B5563', margin: '0 0 16px', paddingRight: '40px', position: 'relative' }}>
              Our AI architects are available 24/7 to help you refine your automation logic.
            </p>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', color: '#00E5FF', background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }}>
              Chat with an expert
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <div className="cw-step1-nav">
        {/* Desktop: AI Automation button */}
        <button className="cw-step1-automate-btn" style={{ backgroundColor: '#4B5563', border: 'none', borderRadius: '8px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#fff' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Ai Automation &amp; Agents
        </button>

        {/* Next button — #1F2937 dark (mobile Figma) */}
        <button onClick={onNext} disabled={!canProceed} className="cw-step1-next-btn"
          style={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '10px', cursor: canProceed ? 'pointer' : 'not-allowed', opacity: canProceed ? 1 : 0.5, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: '#fff' }}>
          Next: Select Tools &amp; Apps
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </>
  );
}

/* ─── Step 2: Tools & Apps ──────────────────────────────────────────────────── */
function StepTools({ form, setForm, onNext, onBack }: { form: CoWorkForm; setForm: (f: CoWorkForm) => void; onNext: () => void; onBack: () => void }) {
  const toggleTool = (t: string) => setForm({ ...form, tools: form.tools.includes(t) ? form.tools.filter(x => x !== t) : [...form.tools, t] });
  const totalSelected = form.tools.length + (form.chatClient ? 1 : 0);

  const aiClients = [
    { id: 'claude', name: 'Claude 3.5 Sonnet', by: 'By Anthropic', desc: 'Excels at coding, creative writing, and nuanced reasoning with a large context window.', bg: '#F5F0FF', icon: 'C', iconColor: '#7C3AED', iconBg: '#D4BBFF' },
    { id: 'chatgpt', name: 'ChatGPT-4o', by: 'By OpenAI', desc: 'Versatile multimodal capabilities with high speed and broad knowledge base.', bg: '#F0FFF4', icon: 'G', iconColor: '#059669', iconBg: '#ABF7DA' },
    { id: 'manus', name: 'Manus AI', by: 'By Manus Tech', desc: 'Specialized for enterprise data analysis and deep technical documentation.', bg: '#EFF6FF', icon: 'M', iconColor: '#2563EB', iconBg: '#BFDBFE' },
  ];

  const sections: { icon: string; title: string; items: string[] }[] = [
    { icon: '@', title: 'Communication & Email', items: ['Gmail', 'Outlook', 'Slack', 'MS Teams', 'Discord', 'Twilio'] },
    { icon: '📢', title: 'Marketing & Social', items: ['Mailchimp', 'X/Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'Buffer'] },
    { icon: '📁', title: 'Documents & Files', items: ['Google Drive', 'Google Docs', 'Google Sheets', 'Dropbox', 'OneDrive', 'Box'] },
  ];

  const emoji: Record<string, string> = { Gmail: '✉️', Outlook: '📩', Slack: '💬', 'MS Teams': '👥', Discord: '🎮', Twilio: '📱', Mailchimp: '🐒', 'X/Twitter': '𝕏', LinkedIn: '💼', Instagram: '📸', Facebook: '📘', Buffer: '📚', 'Google Drive': '☁️', 'Google Docs': '📄', 'Google Sheets': '📊', Dropbox: '📦', OneDrive: '🔷', Box: '📦' };

  return (
    <>
      <div className="cw-section-pad">
        <div className="cw-content-header" style={{ paddingBottom: '24px', paddingTop: '0' }}>
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '28px', lineHeight: '1.2em', color: '#1F2937', margin: '0 0 8px' }}>Select Tools</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.43em', color: '#6B7280', margin: 0 }}>Configure the AI clients and applications for your workflow ecosystem.</p>
        </div>

        {/* AI Chat Clients */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: 'rgba(0,229,255,0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px', color: '#1F2937', margin: 0 }}>Select your AI Chat Client</h3>
          </div>
          <div className="cw-ai-grid">
            {aiClients.map(c => {
              const sel = form.chatClient === c.name;
              return (
                <div key={c.id} onClick={() => setForm({ ...form, chatClient: c.name })}
                  style={{ backgroundColor: '#fff', border: `${sel ? '3px solid #00E5FF' : '1px solid #E5E7EB'}`, borderRadius: '16px', padding: '20px', cursor: 'pointer', position: 'relative', boxShadow: sel ? '0px 8px 30px rgba(0,229,255,0.12)' : '0px 1px 2px rgba(0,0,0,0.05)', transition: 'all .15s ease' }}>
                  {sel && <div style={{ position: 'absolute', top: '12px', right: '12px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="9" height="9" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
                  <div style={{ width: '44px', height: '44px', backgroundColor: c.iconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: c.iconColor }}>{c.icon}</span>
                  </div>
                  <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px', color: '#1F2937', margin: '0 0 3px' }}>{c.name}</h4>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '11px', color: '#9CA3AF', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.by}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', lineHeight: '1.6em', color: '#475569', margin: 0 }}>{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tool sections */}
        {sections.map((s, si) => (
          <div key={si} style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '24px', height: '24px', backgroundColor: 'rgba(0,229,255,0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>{s.icon}</div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px', color: '#1F2937', margin: 0 }}>{s.title}</h3>
            </div>
            <div className="cw-tool-grid">
              {s.items.map((tool, ti) => {
                const sel = form.tools.includes(tool);
                return (
                  <div key={ti} onClick={() => toggleTool(tool)}
                    style={{ backgroundColor: '#fff', border: `1px solid ${sel ? '#00E5FF' : '#E5E7EB'}`, borderRadius: '12px', padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', cursor: 'pointer', position: 'relative', boxShadow: sel ? '0 4px 12px rgba(0,229,255,0.12)' : '0px 1px 2px rgba(0,0,0,0.05)', transition: 'all .15s ease' }}>
                    {sel && <div style={{ position: 'absolute', top: '5px', right: '5px', width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="7" height="7" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
                    <span style={{ fontSize: '20px', lineHeight: 1 }}>{emoji[tool] ?? '🔧'}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '10px', lineHeight: '1.4em', color: '#374151', textAlign: 'center' }}>{tool}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="cw-footer-nav">
          <button onClick={onBack} style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#4B5563' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m7 7-7-7 7-7" /></svg>Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: '#6B7280' }}>Total tools selected: <strong style={{ color: '#1F2937' }}>{totalSelected}</strong></span>
            <button onClick={onNext} style={{ backgroundColor: '#00E5FF', border: 'none', borderRadius: '12px', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1F2937', boxShadow: '0px 4px 6px -4px rgba(0,229,255,0.2), 0px 10px 15px -3px rgba(0,229,255,0.2)' }}>
              Next: Review &amp; Book
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Step 3: Review & Book ─────────────────────────────────────────────────── */
function StepConfirm({ form, onBack, onDeploy }: { form: CoWorkForm; onBack: () => void; onDeploy: (bookingId: string) => void }) {
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState('');

  const handleDeploy = async () => {
    setDeploying(true);
    setError('');
    try {
      const { createBooking } = await import('../lib/api');
      const result: any = await createBooking({
        type: 'cowork',
        status: 'booked',
        title: form.useCase ? `Co-Work: ${form.useCase.substring(0, 40)}` : 'AI Co-Work Request',
        use_case: form.useCase,
        tools_list: [...form.tools, ...(form.chatClient ? [form.chatClient] : [])],
      });
      onDeploy(result?.id ?? 'submitted');
    } catch (e: unknown) {
      setError((e as Error).message || 'Failed to submit. Please try again.');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="cw-section-pad">
      <div className="cw-content-header" style={{ paddingBottom: '24px', paddingTop: '0' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '28px', lineHeight: '1.2em', color: '#1F2937', margin: '0 0 8px' }}>Review &amp; Confirm</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.43em', color: '#6B7280', margin: 0 }}>Please verify your project details before we begin the deployment phase.</p>
      </div>

      <div className="cw-review-grid">
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', margin: '0 0 8px' }}>Your Use Case</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.6em', color: '#4B5563', margin: '0 0 20px' }}>{form.useCase || 'High manual effort in lead triaging causing delays in sales response time.'}</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', margin: '0 0 8px' }}>AI Client</p>
            <div style={{ display: 'inline-flex', backgroundColor: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '6px', padding: '5px 12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: '#1F2937' }}>{form.chatClient || 'Claude 3.5 Sonnet'}</span>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', margin: '0 0 8px' }}>Selected Tools</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {form.tools.length > 0 ? form.tools.map(t => (
                <span key={t} style={{ backgroundColor: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '6px', padding: '4px 10px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', color: '#1F2937' }}>{t}</span>
              )) : <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#9CA3AF' }}>No tools selected</span>}
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(0,229,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
            </div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1F2937', margin: '0 0 8px' }}>We&apos;ve Got You Covered</h4>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.6em', color: '#475569', margin: '0 0 16px' }}>
              Once confirmed, our deployment engineers will review the flow for edge cases. You&apos;ll receive a notification within 4 hours confirming the production build.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#00E5FF', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16h16V8z" /><polyline points="14 2 14 8 20 8" /></svg>Create Ticket
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#00E5FF', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>Schedule Meeting
              </button>
            </div>
          </div>
        </div>

        {/* Right: Dark timeline */}
        <div style={{ backgroundColor: '#1B2533', borderRadius: '24px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#00EAFF,#3B82F6,#10B981)' }} />
          <div style={{ position: 'relative', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '24px' }}>
            {[{ done: true, status: 'Completed', label: 'AI Calculation Complete', sub: '' }, { done: false, status: 'Next Phase', label: 'Setup Time: 2–3 Days', sub: 'Engineer assigned' }, { done: false, status: 'Target Date', label: 'Deployment: Est. 2 Weeks', sub: '' }].map((item, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-31px', top: '2px', width: item.done ? '12px' : '8px', height: item.done ? '12px' : '8px', borderRadius: '50%', backgroundColor: item.done ? '#00E5FF' : 'transparent', border: item.done ? 'none' : '2px solid #475569', boxShadow: item.done ? '0 0 10px rgba(0,234,255,0.6)' : 'none' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', margin: '0 0 3px' }}>{item.status}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#fff', margin: 0 }}>{item.label}</p>
                {item.sub && <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>{item.sub}</p>}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', margin: '0 0 4px' }}>Booking Reference</p>
            <p style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '16px', color: '#00E5FF', margin: 0 }}>Assigned after confirmation</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '24px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <button onClick={onBack} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1F2937' }}>
          Save Draft
        </button>
        <div className="hidden md:block text-[13px] text-[#64748B] font-medium">
          <strong className="text-[#1F2937]">TIP:</strong> If you decided to get support, save as draft then you an start where you left
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#EF4444', margin: 0 }}>⚠️ {error}</p>}
          <button onClick={handleDeploy} disabled={deploying} style={{ backgroundColor: '#00c2ff', borderRadius: '12px', border: 'none', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: deploying ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#FFFFFF', opacity: deploying ? 0.7 : 1 }}>
            {deploying ? <><svg style={{ width: 16, height: 16, animation: 'spin .8s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Confirming...</> : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Success Screen ─────────────────────────────────────────────────────────── */
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #00E5FF, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 16px 32px rgba(0,229,255,0.3)' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '26px', color: '#1F2937', margin: '0 0 10px' }}>Co-Work Setup Complete! 🚀</h2>
      <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '15px', lineHeight: '1.6em', color: '#6B7280', maxWidth: '420px', margin: '0 0 28px' }}>
        Your AI Co-Work configuration has been confirmed. Our engineers will verify and activate within 2–3 business days.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onReset} style={{ backgroundColor: '#00E5FF', borderRadius: '12px', border: 'none', padding: '12px 24px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1F2937', cursor: 'pointer', boxShadow: '0px 4px 14px rgba(0,229,255,0.3)' }}>Start Another</button>
        <button onClick={onReset} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '12px 24px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#6B7280', cursor: 'pointer' }}>View Dashboard</button>
      </div>
    </div>
  );
}

/* ─── Root Component ─────────────────────────────────────────────────────────── */
import { HeaderBar } from './HeaderBar';

const DEFAULT_FORM: CoWorkForm = { useCase: '', chatClient: 'Claude 3.5 Sonnet', tools: [] };

export function CoWorkClient() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deploySuccess, setDeploySuccess] = useState<string | null>(null);
  const [form, setForm] = useState<CoWorkForm>(DEFAULT_FORM);
  const reset = () => { setStep(1); setDeploySuccess(null); setForm(DEFAULT_FORM); };

  return (
    <div style={{ minHeight: '100%', backgroundColor: '#F3F4F6', display: 'flex', flexDirection: 'column' }}>
      <style>{css}</style>

      {/* ── Progress ── */}
      {!deploySuccess && (
        <section style={{ padding: '0 16px 0' }}>
          {/* Mobile card-style progress */}
          <MobileProgress step={step} />
          {/* Desktop header & bar */}
          <div style={{ padding: '32px 32px 0' }}>
            <HeaderBar title="Ai Co-Work" />
            <DesktopProgress step={step} />
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
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#065F46', margin: 0 }}>AI Co-Work Request Submitted!</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#047857', margin: '2px 0 0' }}>Booking ID: <strong>{deploySuccess}</strong> — Our team will review and set up your co-work environment.</p>
            </div>
          </div>
          <button onClick={() => setDeploySuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6EE7B7', fontSize: '20px', lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ flex: 1, paddingTop: '24px' }}>
        <>
          {step === 1 && <StepUseCase form={form} setForm={setForm} onNext={() => setStep(2)} />}
          {step === 2 && <StepTools form={form} setForm={setForm} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepConfirm form={form} onBack={() => setStep(2)} onDeploy={(id) => { setDeploySuccess(id); setStep(1); setForm(DEFAULT_FORM); }} />}
        </>
      </div>
    </div>
  );
}
