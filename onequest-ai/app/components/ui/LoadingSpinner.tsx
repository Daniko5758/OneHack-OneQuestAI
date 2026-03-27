'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
}

export default function LoadingSpinner({ size = 48, text }: LoadingSpinnerProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px',
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: 0,
            border: '2px solid rgba(0, 240, 255, 0.1)',
            borderTopColor: 'var(--cyan)',
            borderRadius: '50%',
          }}
        />
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: '6px',
            border: '2px solid rgba(139, 92, 246, 0.1)',
            borderTopColor: 'var(--purple)',
            borderRadius: '50%',
          }}
        />
        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            background: 'var(--cyan)',
            borderRadius: '50%',
            boxShadow: '0 0 12px var(--cyan)',
          }}
        />
      </div>
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontWeight: 500,
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
