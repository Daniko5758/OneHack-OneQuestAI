'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { type ReactNode, type CSSProperties } from 'react';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  state?: ButtonState;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success';
  fullWidth?: boolean;
  id?: string;
  style?: CSSProperties;
}

export default function AnimatedButton({
  children,
  onClick,
  state = 'idle',
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  id,
  style,
}: AnimatedButtonProps) {
  const isDisabled = disabled || state === 'loading';

  const bgMap = {
    primary: 'linear-gradient(135deg, #00c8ff, #8b5cf6)',
    secondary: 'linear-gradient(135deg, rgba(148, 163, 184, 0.1), rgba(148, 163, 184, 0.05))',
    success: 'linear-gradient(135deg, #00ff88, #00c8ff)',
  };

  const stateStyles: Record<ButtonState, CSSProperties> = {
    idle: {},
    loading: { cursor: 'wait', opacity: 0.9 },
    success: { background: 'linear-gradient(135deg, #00ff88, #00c8ff)' },
    error: { background: 'linear-gradient(135deg, #ff3366, #ff6b6b)' },
  };

  return (
    <motion.button
      id={id}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02, boxShadow: '0 0 30px rgba(0, 200, 255, 0.3)' } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      animate={
        state === 'error'
          ? { x: [0, -4, 4, -4, 4, 0] }
          : state === 'success'
          ? { scale: [1, 1.05, 1] }
          : {}
      }
      transition={{ duration: 0.4 }}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: '14px 28px',
        background: state === 'idle' || state === 'loading' ? bgMap[variant] : undefined,
        border: variant === 'secondary' ? '1px solid var(--glass-border)' : 'none',
        borderRadius: 'var(--radius-md)',
        color: '#fff',
        fontSize: '15px',
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        letterSpacing: '0.3px',
        ...stateStyles[state],
        ...style,
      }}
    >
      {/* Shimmer overlay */}
      {state === 'idle' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {state === 'loading' ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.2)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin-ring 0.8s linear infinite',
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>Processing...</span>
          </motion.div>
        ) : state === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M5 12l5 5L19 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
            </svg>
            <span>Success!</span>
          </motion.div>
        ) : state === 'error' ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Error</span>
          </motion.div>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
