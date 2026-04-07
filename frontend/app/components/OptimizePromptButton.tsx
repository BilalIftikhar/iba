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

// Exact Figma icon (sparkle/stars)
const SparkleIcon = ({ color = '#4B5563' }: { color?: string }) => (
  <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M10.8984 6.33331L10.204 4.80553L8.67622 4.11108L10.204 3.41664L10.8984 1.88886L11.5929 3.41664L13.1207 4.11108L11.5929 4.80553L10.8984 6.33331ZM10.8984 14.1111L10.204 12.5833L8.67622 11.8889L10.204 11.1944L10.8984 9.66664L11.5929 11.1944L13.1207 11.8889L11.5929 12.5833L10.8984 14.1111ZM5.34288 12.4444L3.95399 9.38886L0.898438 7.99997L3.95399 6.61108L5.34288 3.55553L6.73177 6.61108L9.78733 7.99997L6.73177 9.38886L5.34288 12.4444ZM5.34288 9.74997L5.89844 8.55553L7.09288 7.99997L5.89844 7.44442L5.34288 6.24997L4.78733 7.44442L3.59288 7.99997L4.78733 8.55553L5.34288 9.74997Z" fill={color}/>
  </svg>
);

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

  // Figma gradient: 90deg, #900B09 → #EC931F → #EC2D1F → #99007A
  const borderGradient = isOptimizing
    ? 'linear-gradient(90deg, #900B09 0%, #EC931F 39%, #EC2D1F 71%, #99007A 100%)'
    : done
    ? 'linear-gradient(90deg, #10b981, #10b981)'
    : 'linear-gradient(90deg, #900B09 0%, #EC931F 39%, #EC2D1F 71%, #99007A 100%)';

  const textColor = done ? '#10b981' : '#4B5563';

  const wrapStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    borderRadius: '25px',
    padding: '2px',
    background: borderGradient,
    backgroundSize: isOptimizing ? '300% 300%' : '100% 100%',
    animation: isOptimizing ? 'gradientShift 2s ease infinite' : 'none',
    transition: 'all 0.3s ease',
    cursor: disabled || isOptimizing ? 'not-allowed' : 'pointer',
  };

  const innerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '23px',
    padding: '0 18px',
    height: '42px',
    cursor: disabled || isOptimizing ? 'not-allowed' : 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '14px',
    color: textColor,
    whiteSpace: 'nowrap',
    opacity: 1,
    minWidth: '154px',
    justifyContent: 'center',
  };

  const spinStyle: React.CSSProperties = {
    flexShrink: 0,
    animation: 'spin 0.8s linear infinite',
  };

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes textFadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={wrapStyle} className={className}>
        <button
          style={innerStyle}
          onClick={handleClick}
          disabled={disabled || isOptimizing}
          title="Optimize your prompt using AI"
        >
          {isOptimizing ? (
            <svg style={spinStyle} width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#EC931F" strokeWidth={2.5}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : done ? (
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <SparkleIcon color="#4B5563" />
          )}
          <span
            key={label}
            style={{
              animation: 'textFadeIn 0.2s ease-out',
              color: isOptimizing ? '#900B09' : textColor,
              fontWeight: isOptimizing ? 600 : 500,
            }}
          >
            {label}
          </span>
        </button>
      </div>
    </>
  );
}


