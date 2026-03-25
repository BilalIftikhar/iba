'use client';

import React, { useState, useEffect } from 'react';

interface OptimizePromptButtonProps {
  onOptimize: () => void;
  disabled?: boolean;
  className?: string;
}

const THINKING_STEPS = [
  'Thinking...',
  'Assessing feasibility...',
  'Quick safety check...',
  'Testing overlaps...',
  'Caching contradictions...',
  'Working the words...',
  'Wrapping up...',
  'All good. Nice work! ✨',
];

export function OptimizePromptButton({ onOptimize, disabled, className = '' }: OptimizePromptButtonProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isOptimizing) return;

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setStepIndex(current);
      if (current >= THINKING_STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setIsOptimizing(false);
          setDone(true);
          onOptimize();
          setTimeout(() => setDone(false), 2500);
        }, 700);
      }
    }, 420);

    return () => clearInterval(interval);
  }, [isOptimizing, onOptimize]);

  const handleClick = () => {
    if (isOptimizing || disabled) return;
    setStepIndex(0);
    setIsOptimizing(true);
    setDone(false);
  };

  const label = done
    ? THINKING_STEPS[THINKING_STEPS.length - 1]
    : isOptimizing
    ? THINKING_STEPS[stepIndex] ?? 'Working the words...'
    : 'Optimize Prompt';

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes textFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .optimize-btn-wrap {
          position: relative;
          display: inline-flex;
          border-radius: 14px;
          padding: 1.5px;
          background: ${isOptimizing || done ? 'linear-gradient(135deg, #f97316, #e11d48, #d946ef, #8b5cf6)' : 'linear-gradient(135deg, #f97316, #e11d48, #d946ef)'};
          background-size: ${isOptimizing ? '300% 300%' : '100% 100%'};
          animation: ${isOptimizing ? 'gradientShift 2s ease infinite' : 'none'};
          transition: all 0.3s ease;
        }
        .optimize-btn-inner {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #fff;
          border: none;
          border-radius: 12px;
          padding: 9px 16px;
          cursor: ${disabled || isOptimizing ? 'not-allowed' : 'pointer'};
          font-family: Inter, sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: #1F2937;
          white-space: nowrap;
          opacity: ${disabled && !isOptimizing ? 0.5 : 1};
          transition: background 0.2s;
          min-width: 160px;
          justify-content: center;
        }
        .optimize-btn-inner:hover {
          background: ${disabled || isOptimizing ? '#fff' : '#fafafa'};
        }
        .thinking-text {
          animation: textFadeIn 0.2s ease-out;
          background: linear-gradient(135deg, #f97316, #e11d48, #d946ef);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }
      `}</style>

      <div className={`optimize-btn-wrap ${className}`}>
        <button
          className="optimize-btn-inner"
          onClick={handleClick}
          disabled={disabled || isOptimizing}
          title="Optimize your prompt using AI"
        >
          {isOptimizing ? (
            <svg
              style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#spinGrad)"
              strokeWidth={2.5}
            >
              <defs>
                <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : done ? (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} style={{ flexShrink: 0 }}>
              <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" stroke="#e11d48" fill="none" />
              <path d="M19 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2L16 19l2.2-.8z" stroke="#f97316" fill="none" />
            </svg>
          )}
          <span key={label} className={isOptimizing || done ? 'thinking-text' : ''}>
            {label}
          </span>
        </button>
      </div>
    </>
  );
}
