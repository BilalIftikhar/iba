'use client';

import { useState, useEffect } from 'react';
import { HeaderBar } from './HeaderBar';
import { fetchAiExamples } from '../lib/api';

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface AiExample {
  id: string;
  title: string;
  description: string;
  icon_url?: string;
  icon_emoji?: string;
}

const FALLBACK_EXAMPLES: AiExample[] = [
  { id: 'f1', title: 'Sales Assistant', description: 'Real-time lead qualification and automated follow-up scheduling engine.', icon_emoji: '📈' },
  { id: 'f2', title: 'Onboarding Bot', description: 'Automated staff training and internal policy knowledge base assistant.', icon_emoji: '🤖' },
  { id: 'f3', title: 'Operations App', description: 'End-to-end process automation engine for supply chain visibility.', icon_emoji: '⚙️' },
  { id: 'f4', title: 'Reporting Tool', description: 'Predictive data analytics providing actionable insights for QBRs.', icon_emoji: '📊' },
  { id: 'f5', title: 'Inventory AI', description: 'Advanced supply chain optimizer using neural demand forecasting.', icon_emoji: '📦' },
  { id: 'f6', title: 'Customer Support', description: 'Multilingual 24/7 chat solution with emotional sentiment analysis.', icon_emoji: '🎧' }
];

// ─── Icons ────────────────────────────────────────────────────────────────────
function BarChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10M18 20V4M6 20v-4" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AiImplementationClient() {
  const [examples, setExamples] = useState<AiExample[]>(FALLBACK_EXAMPLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAiExamples<AiExample[]>()
      .then(data => {
        if (data && data.length > 0) setExamples(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100%', backgroundColor: '#F3F4F6', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        /* ─── Responsive Base ──────────────────────────────────────────────── */
        .aiimpl-grid-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 64px; }
        .aiimpl-grid-phases { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .aiimpl-grid-examples { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        
        .aiimpl-banner { display: flex; align-items: center; justify-content: space-between; background-color: #F0F9FF; border-radius: 16px; padding: 32px 40px; margin: 48px 0; border: 1px solid #E0F2FE; }
        .aiimpl-banner-left { display: flex; flex-direction: column; gap: 8px; }
        .aiimpl-banner-right { display: flex; align-items: center; gap: 16px; }

        .only-mobile { display: none; }

        @media (max-width: 1024px) {
          .aiimpl-grid-metrics { grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 48px; }
          .aiimpl-grid-phases { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .aiimpl-grid-examples { grid-template-columns: repeat(2, 1fr); }
          .aiimpl-banner { padding: 24px; flex-direction: column; align-items: flex-start; gap: 24px; }
          .aiimpl-banner-right { width: 100%; justify-content: space-between; }
        }
        
        @media (max-width: 767px) {
          .only-desktop { display: none !important; }
          .only-mobile { display: flex !important; }
          
          .aiimpl-content { padding: 24px 16px 80px !important; }
          .mobile-hero { background-color: #0F172A; border-radius: 16px; padding: 32px 24px; display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 24px; }
          .mobile-metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 40px; }
          
          .aiimpl-grid-phases { display: flex; flex-direction: column; gap: 16px; }
          .aiimpl-grid-examples { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px; }
        }
      `}</style>
      
      {/* ── Header (Desktop Only) ── */}
      <div className="only-desktop" style={{ padding: '32px 32px 0' }}>
        <HeaderBar title="Ai Implementation" />
      </div>

      {/* ── Content ── */}
      <div className="aiimpl-content" style={{ flex: 1, padding: '60px 32px 80px', maxWidth: '1440px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* =============== DESKTOP VIEW =============== */}
        <div className="only-desktop" style={{ width: '100%' }}>
          {/* Title Section */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 className="aiimpl-title" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '36px', color: '#1F2937', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              AI Implementation & <span style={{ color: '#00EAFF' }}>Transformation</span>
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '16px', color: '#64748B', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6em' }}>
              A structured 4-step process to modernize your enterprise with custom AI solutions. Scale efficiently and automate core business intelligence.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="aiimpl-grid-metrics">
            {/* Card 1 */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0px 2px 4px rgba(0,0,0,0.02), inset 0px 0px 0px 1px rgba(255,255,255,0.5)' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', margin: '0 0 12px' }}>
                EFFICIENCY GAIN
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '40px', color: '#00EAFF', margin: 0, lineHeight: 1 }}>
                45%
              </p>
            </div>
            {/* Card 2 */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0px 2px 4px rgba(0,0,0,0.02), inset 0px 0px 0px 1px rgba(255,255,255,0.5)' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', margin: '0 0 12px' }}>
                INTEGRATION SPEED
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '40px', color: '#00EAFF', margin: 0, lineHeight: 1 }}>
                2 Weeks
              </p>
            </div>
            {/* Card 3 */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0px 2px 4px rgba(0,0,0,0.02), inset 0px 0px 0px 1px rgba(255,255,255,0.5)' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', margin: '0 0 12px' }}>
                ROI PERIOD
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '40px', color: '#00EAFF', margin: 0, lineHeight: 1 }}>
                <span style={{ fontSize: '32px' }}>&lt;</span> 6 Months
              </p>
            </div>
          </div>

          {/* How It works */}
          <div style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
            </div>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: '#4B5563', margin: 0 }}>
              How It works?
            </h2>
          </div>

          {/* Phases Grid */}
          <div className="aiimpl-grid-phases" style={{ marginBottom: '64px' }}>
            {/* Phase 01 */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.05), 0px 2px 4px -1px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', position: 'relative', background: 'linear-gradient(135deg, #1E293B, #0F172A)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', borderRadius: '6px', padding: '4px 10px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', color: '#00EAFF' }}>PHASE 01</span>
                </div>
                <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none" style={{ display: 'block' }}>
                  <path d="M0,80 L0,40 Q30,60 60,30 T120,50 T180,20 T240,60 L300,10 L300,80 Z" fill="url(#grad1)" opacity="0.8" />
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#00EAFF', stopOpacity: 0.6 }} />
                      <stop offset="100%" style={{ stopColor: '#00EAFF', stopOpacity: 0.0 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChartIcon />
                  </div>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1F2937', margin: 0 }}>Discovery</h3>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.6em', color: '#64748B', margin: 0 }}>
                  Analysis of business needs and AI assessment to identify high-impact rules.
                </p>
              </div>
            </div>

            {/* Phase 02 */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.05), 0px 2px 4px -1px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', position: 'relative', backgroundColor: '#E0F2FE', backgroundImage: 'radial-gradient(#BAE6FD 1px, transparent 1px)', backgroundSize: '16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', borderRadius: '6px', padding: '4px 10px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', color: '#00EAFF' }}>PHASE 02</span>
                </div>
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#7DD3FC" strokeWidth="2" strokeDasharray="4 4">
                  <rect x="20" y="20" width="60" height="60" rx="4" />
                  <line x1="20" y1="50" x2="80" y2="50" />
                  <line x1="50" y1="20" x2="50" y2="80" />
                </svg>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CompassIcon />
                  </div>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1F2937', margin: 0 }}>Custom Design</h3>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.6em', color: '#64748B', margin: 0 }}>
                  Architecting tailored AI models and infrastructure specifications aligned with your security standards.
                </p>
              </div>
            </div>

            {/* Phase 03 */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.05), 0px 2px 4px -1px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', position: 'relative', backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', borderRadius: '6px', padding: '4px 10px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', color: '#00EAFF' }}>PHASE 03</span>
                </div>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  </div>
                  <div style={{ width: '60%', height: '4px', backgroundColor: '#00EAFF', borderRadius: '2px', opacity: 0.8 }} />
                  <div style={{ width: '85%', height: '4px', backgroundColor: '#64748B', borderRadius: '2px', opacity: 0.5 }} />
                  <div style={{ width: '40%', height: '4px', backgroundColor: '#64748B', borderRadius: '2px', opacity: 0.5 }} />
                  <div style={{ width: '70%', height: '4px', backgroundColor: '#38BDF8', borderRadius: '2px', opacity: 0.8 }} />
                </div>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CodeIcon />
                  </div>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1F2937', margin: 0 }}>Build & Integration</h3>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.6em', color: '#64748B', margin: 0 }}>
                  Developing robust AI solutions and seamless API integration into your existing enterprise software stack.
                </p>
              </div>
            </div>

            {/* Phase 04 */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.05), 0px 2px 4px -1px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', position: 'relative', backgroundColor: '#115E59', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', borderRadius: '6px', padding: '4px 10px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', color: '#00EAFF' }}>PHASE 04</span>
                </div>
                <div style={{ width: '80%', height: '70%', backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: '100%', height: '12px', backgroundColor: '#E2E8F0', borderRadius: '2px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1, height: '8px', backgroundColor: '#F1F5F9', borderRadius: '2px' }} />
                    <div style={{ flex: 1, height: '8px', backgroundColor: '#F1F5F9', borderRadius: '2px' }} />
                  </div>
                  <div style={{ width: '100%', height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00EAFF' }} />
                    <div style={{ width: '40%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RocketIcon />
                  </div>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1F2937', margin: 0 }}>Deployment</h3>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.6em', color: '#64748B', margin: 0 }}>
                  Full-scale rollout with monitoring and continuous optimization to ensure maximum ROI and reliability.
                </p>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div className="aiimpl-banner">
            <div className="aiimpl-banner-left">
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: '#1F2937', margin: 0 }}>
                Ready to transform your workflow?
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: '#64748B', margin: 0 }}>
                Join 200+ enterprises leveraging IBA&apos;s AI Platform.
              </p>
            </div>
            <div className="aiimpl-banner-right">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#CBD5E1', border: '2px solid #F0F9FF', zIndex: 3 }} />
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#94A3B8', border: '2px solid #F0F9FF', marginLeft: '-12px', zIndex: 2 }} />
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#64748B', border: '2px solid #F0F9FF', marginLeft: '-12px', zIndex: 1 }} />
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1F2937', border: '2px solid #F0F9FF', marginLeft: '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
                  <span style={{ color: '#F8FAFC', fontSize: '10px', fontWeight: 600 }}>+12</span>
                </div>
              </div>
              <button style={{ backgroundColor: '#00EAFF', color: '#1F2937', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '14px', fontFamily: 'Inter, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Book a Demo
              </button>
            </div>
          </div>

          {/* Examples Section */}
          <div style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
            </div>
            <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: '#4B5563', margin: 0 }}>
              Examples of What We Build
            </h2>
          </div>

          <div className="aiimpl-grid-examples">
            {examples.map((ex, idx) => (
              <div key={ex.id || idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                  {ex.icon_url ? (
                    <img src={ex.icon_url} alt="" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', border: '1px solid #334155', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                      <div style={{ display: 'flex', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#334155'}}/><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#334155'}}/></div>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '48px' }}>
                        {ex.icon_emoji || '🤖'}
                      </div>
                      <div style={{ height: '2px', width: '40%', backgroundColor: '#00EAFF', marginTop: 'auto' }}/>
                      <div style={{ height: '2px', width: '30%', backgroundColor: '#00EAFF', opacity: 0.5 }}/>
                    </div>
                  )}
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px', color: '#1F2937', margin: '0 0 8px' }}>{ex.title}</h4>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: '#64748B', lineHeight: '1.5', margin: '0 0 24px', flex: 1 }}>{ex.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#00EAFF', textTransform: 'uppercase' }}>CASE STUDY</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =============== MOBILE VIEW =============== */}
        <div className="only-mobile" style={{ width: '100%', flexDirection: 'column' }}>
          
          {/* Mobile Hero Dark Container */}
          <div className="mobile-hero">
            <div style={{ backgroundColor: '#1E293B', borderRadius: '100px', padding: '4px 12px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', color: '#00EAFF', textTransform: 'uppercase' }}>TRANSFORMATION</span>
            </div>
            
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '32px', color: '#FFFFFF', margin: '0 0 16px', lineHeight: '1.2em' }}>
              AI Implementation & Transformation
            </h1>
            
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '15px', color: '#94A3B8', margin: '0 0 32px', lineHeight: '1.5em' }}>
              Scale your business with custom AI solutions designed for maximum impact.
            </p>
            
            <button style={{ width: '100%', backgroundColor: '#00EAFF', color: '#0F172A', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 600, fontSize: '16px', fontFamily: 'Inter, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Get Started <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          {/* Mobile Metrics Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
               <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: '#64748B', margin: '0 0 4px' }}>Efficiency Gain</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '32px', color: '#0F172A', margin: 0 }}>45%</p>
               </div>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00EAFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
               </div>
            </div>
            
            <div className="mobile-metrics-grid" style={{ marginBottom: 0 }}>
               <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', color: '#64748B', margin: '0 0 4px' }}>Integration Speed</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: '#0F172A', margin: 0 }}>2 Weeks</p>
               </div>
               <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', color: '#64748B', margin: '0 0 4px' }}>ROI Period</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: '#0F172A', margin: 0 }}>&lt; 6 Months</p>
               </div>
            </div>
          </div>

          {/* How It Works Mobile */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
             <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: '#0F172A', margin: 0 }}>How It Works</h2>
             <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: '#00EAFF' }}>4 Phases</span>
          </div>

          <div className="aiimpl-grid-phases" style={{ marginBottom: '40px' }}>
             {[
               { num: '01', title: 'Discovery', desc: 'Deep dive into your current workflows to identify AI opportunities.' },
               { num: '02', title: 'Custom Design', desc: 'Architecting bespoke models tailored to your business needs.' },
               { num: '03', title: 'Build & Integration', desc: 'Rapid development and seamless connection to your stack.' },
               { num: '04', title: 'Deployment', desc: 'Full-scale rollout with monitoring and optimization.' }
             ].map((phase, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', display: 'flex', gap: '16px', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
                   <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '28px', color: '#A5F3FC', lineHeight: 1 }}>{phase.num}</div>
                   <div>
                      <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: '#0F172A', margin: '0 0 8px' }}>{phase.title}</h3>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: '#64748B', margin: 0, lineHeight: '1.5em' }}>{phase.desc}</p>
                   </div>
                </div>
             ))}
          </div>

          {/* What We Build Mobile */}
          <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', color: '#0F172A', margin: '0 0 20px' }}>What We Build</h2>
          <div className="aiimpl-grid-examples">
             {examples.map((app, i) => (
                <div key={app.id || i} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
                   <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {app.icon_url ? (
                        <img src={app.icon_url} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: '24px' }}>{app.icon_emoji || '🤖'}</span>
                      )}
                   </div>
                   <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', color: '#0F172A', margin: 0 }}>{app.title}</h3>
                </div>
             ))}
          </div>

          {/* Banner Mobile */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0px 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '24px', color: '#0F172A', margin: '0 0 16px', lineHeight: '1.3em' }}>
              Ready to transform your workflow?
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '15px', color: '#64748B', margin: '0 0 32px' }}>
              Join 200+ companies scaling with IBA.
            </p>
            
            <button style={{ width: '100%', backgroundColor: '#0F172A', color: '#FFFFFF', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 600, fontSize: '16px', fontFamily: 'Inter, sans-serif', cursor: 'pointer', marginBottom: '32px' }}>
              Book a Demo
            </button>
            
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '24px' }}>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#CBD5E1', border: '2px solid #FFFFFF', zIndex: 3 }} />
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#94A3B8', border: '2px solid #FFFFFF', marginLeft: '-10px', zIndex: 2 }} />
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#64748B', border: '2px solid #FFFFFF', marginLeft: '-10px', zIndex: 1 }} />
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0F172A', border: '2px solid #FFFFFF', marginLeft: '-10px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
                    <span style={{ color: '#F8FAFC', fontSize: '10px', fontWeight: 600 }}>+12</span>
                  </div>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>4.9/5 Rating</span>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
