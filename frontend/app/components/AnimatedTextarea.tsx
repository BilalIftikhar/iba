'use client';

import React, { useState, useEffect, useRef, CSSProperties } from 'react';

interface AnimatedTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  style?: CSSProperties;
  className?: string;
}

export function AnimatedTextarea({
  value,
  onChange,
  placeholder,
  rows = 6,
  style = {},
  className = '',
}: AnimatedTextareaProps) {
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Start typewriter animation after a brief delay on mount
    const startDelay = setTimeout(() => {
      const type = () => {
        if (indexRef.current < placeholder.length) {
          setDisplayedPlaceholder(placeholder.slice(0, indexRef.current + 1));
          indexRef.current += 1;
          timerRef.current = setTimeout(type, 28);
        } else {
          setAnimDone(true);
        }
      };
      type();
    }, 400);

    return () => {
      clearTimeout(startDelay);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // We only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAnimatedPlaceholder = !value && !isFocused;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="" // Hide native placeholder — we render a custom one
        rows={rows}
        className={className}
        style={{
          ...style,
          // Keep a transparent caret area when placeholder is showing
          caretColor: isFocused || value ? undefined : 'transparent',
        }}
      />

      {/* Animated placeholder overlay */}
      {showAnimatedPlaceholder && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            pointerEvents: 'none',
            // Match typical textarea padding — override if needed via style prop
            padding: (style.padding as string) ?? '16px',
            paddingBottom: (style.paddingBottom as string) ?? (style.padding as string) ?? '16px',
            fontFamily: (style.fontFamily as string) ?? 'Inter, sans-serif',
            fontWeight: (style.fontWeight as number) ?? 400,
            fontSize: (style.fontSize as string) ?? '15px',
            lineHeight: (style.lineHeight as string) ?? '1.6',
            color: '#9CA3AF',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            overflowY: 'hidden',
            userSelect: 'none',
          }}
        >
          {displayedPlaceholder}
          {/* Blinking cursor while typing */}
          {!animDone && (
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '1em',
                backgroundColor: '#00C2FF',
                marginLeft: '1px',
                verticalAlign: 'text-bottom',
                animation: 'blink 0.8s step-end infinite',
              }}
            />
          )}
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
