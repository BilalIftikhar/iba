'use client';

import React, { useState, useEffect } from 'react';

interface PipelineOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PipelineOverviewModal({ isOpen, onClose }: PipelineOverviewModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? '12px' : '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '760px',
        maxHeight: isMobile ? '90vh' : 'auto',
        overflowY: isMobile ? 'auto' : 'visible',
        padding: isMobile ? '24px 16px' : '32px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: isMobile ? '16px' : '24px', right: isMobile ? '16px' : '24px',
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: '#F8FAFC', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#64748B', zIndex: 10
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header Section */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '10px', 
            backgroundColor: '#E0F8FF', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', flexShrink: 0 
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D1FF" strokeWidth="2.5">
              <path d="M12 3l1.91 5.89L20 10.8l-4.5 4.39 1.06 6.19L12 18.45l-4.56 2.93 1.06-6.19L4 10.8l6.09-1.91L12 3z" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: isMobile ? '20px' : '22px', color: '#1E293B', margin: '0 0 8px 0', lineHeight: 1.2 }}>
              Social Media Scheduler
            </h2>
            <p style={{ fontWeight: 500, fontSize: isMobile ? '12px' : '13px', color: '#64748B', margin: 0, maxWidth: '580px', lineHeight: '1.6' }}>
              Automate your social presence across multiple platforms seamlessly with AI-driven content generation and smart scheduling.
            </p>
          </div>
        </div>

        {/* Metrics Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
          gap: '12px', 
          margin: isMobile ? '24px 0' : '32px 0' 
        }}>
          
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
            <p style={{ fontWeight: 800, fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              ROI EXPECTED
            </p>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B' }}>
              4.2x / <span style={{ color: '#00D1FF' }}>$2,400</span><span style={{ fontSize: '11px', color: '#94A3B8' }}>/yr</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
            <p style={{ fontWeight: 800, fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              DELIVERY TIME
            </p>
            <p style={{ fontWeight: 800, fontSize: '18px', color: '#1E293B', margin: 0 }}>2-3 Days</p>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
            <p style={{ fontWeight: 800, fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              TIME SAVED
            </p>
            <p style={{ fontWeight: 800, fontSize: '18px', color: '#1E293B', margin: 0 }}>5 hrs / week</p>
          </div>

        </div>

        {/* Detail Grid Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr 1.3fr', 
          gap: '12px', 
          marginBottom: isMobile ? '24px' : '32px' 
        }}>
          
          {/* Key Features */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '6px', padding: '4px', border: '1px solid #F1F5F9' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D1FF" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <p style={{ fontWeight: 800, fontSize: '10px', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KEY FEATURES</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Automated scheduling', 'Multi-platform syncing', 'Engagement analytics', 'AI-generated captions'].map(feature => (
                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D1FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '6px', padding: '4px', border: '1px solid #F1F5F9' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D1FF" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </div>
              <p style={{ fontWeight: 800, fontSize: '10px', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DATA SOURCES</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : '1fr', gap: '8px' }}>
              {['Airtable', 'Notion', 'Stripe', 'Hubspot'].map(tool => (
                <div key={tool} style={{
                  backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '10px',
                  padding: '8px 12px', fontSize: '12px', fontWeight: 700, color: '#475569',
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00D1FF' }} />
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Best For */}
          <div style={{ backgroundColor: '#E0F8FF', padding: '16px', borderRadius: '16px', border: '1px solid #B9E6FF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '6px', padding: '4px', border: '1px solid #B9E6FF' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D1FF" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>
              <p style={{ fontWeight: 800, fontSize: '10px', color: '#006E8F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BEST FOR</p>
            </div>
            <p style={{ fontSize: '12px', color: '#006E8F', fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
              Perfect for digital marketing agencies and solo creators looking to scale their social presence without increasing manual workload.
            </p>
          </div>

        </div>

        {/* Action Footer */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column-reverse' : 'row',
          justifyContent: 'flex-end', 
          gap: '12px', 
          borderTop: '1px solid #F1F5F9', 
          paddingTop: '20px' 
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: '12px 24px', backgroundColor: 'transparent', border: 'none',
              fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px',
              color: '#64748B', cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            style={{
              padding: '12px 28px', backgroundColor: '#00D1FF', border: 'none', borderRadius: '14px',
              fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '14px',
              color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0, 209, 255, 0.35)',
              transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseOver={(e) => { if (!isMobile) e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseOut={(e) => { if (!isMobile) e.currentTarget.style.transform = 'scale(1)' }}
          >
            Select This Template
          </button>
        </div>

      </div>
    </div>
  );
}

