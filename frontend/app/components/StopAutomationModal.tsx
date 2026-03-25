'use client';

import React, { useState, useEffect } from 'react';

interface StopAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function StopAutomationModal({ isOpen, onClose, onConfirm }: StopAutomationModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '440px',
        padding: isMobile ? '24px 20px' : '32px',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        {/* Icon Circle */}
        <div style={{
          width: isMobile ? '56px' : '64px', height: isMobile ? '56px' : '64px', borderRadius: '50%',
          backgroundColor: '#E0FCF9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: isMobile ? '20px' : '24px',
          color: '#1E293B', margin: '0 0 8px 0'
        }}>
          Stop Automation
        </h2>
        
        {/* Context */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: isMobile ? '12px' : '13px',
          color: '#1E293B', margin: '0 0 4px 0'
        }}>
          Lead Enrichment Pipeline
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '11px',
          color: '#64748B', margin: '0 0 12px 0'
        }}>
          (#BOOK-2045)
        </p>

        {/* Description */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: isMobile ? '13px' : '14px',
          color: '#64748B', margin: '0 0 24px 0', lineHeight: '1.5'
        }}>
          This will immediately stop the automation. You can restart it anytime from your deployed orders.
        </p>

        {/* OTP Label */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '9px',
          color: '#64748B', margin: '0 0 12px 0', letterSpacing: '0.05em', textTransform: 'uppercase'
        }}>
          ALTERNATIVELY, ENTER THE 6-DIGIT CODE SENT TO YOUR EMAIL
        </p>

        {/* OTP Inputs */}
        <div style={{ display: 'flex', gap: isMobile ? '6px' : '8px', marginBottom: '24px' }}>
          {code.map((val, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={val}
              onChange={(e) => handleInputChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: isMobile ? '38px' : '44px', height: isMobile ? '48px' : '54px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: isMobile ? '16px' : '18px',
                color: '#1E293B', outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00C2FF'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', marginBottom: '16px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, backgroundColor: '#F1F5F9', border: 'none',
              borderRadius: '12px', padding: isMobile ? '12px' : '14px',
              fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px',
              color: '#1E293B', cursor: 'pointer', transition: 'background-color 0.2s'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, backgroundColor: '#00C2FF', border: 'none',
              borderRadius: '12px', padding: isMobile ? '12px' : '14px',
              fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '14px',
              color: '#FFFFFF', cursor: 'pointer', transition: 'opacity 0.2s',
              boxShadow: '0 4px 14px rgba(0, 194, 255, 0.4)'
            }}
          >
            Stop
          </button>
        </div>

        {/* Resend */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px',
          color: '#64748B', margin: 0
        }}>
          Resend Code <span style={{ color: '#00C2FF' }}>in 0:{timer.toString().padStart(2, '0')}</span>
        </p>
      </div>
    </div>
  );
}
