'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  glowColor?: 'cyan' | 'magenta' | 'purple' | 'none';
  hover?: boolean;
  className?: string;
}

export default function GlassCard({
  children,
  glowColor = 'none',
  hover = true,
  className = '',
  ...motionProps
}: GlassCardProps) {
  const glowMap = {
    cyan: '0 0 30px rgba(0, 240, 255, 0.15)',
    magenta: '0 0 30px rgba(255, 0, 229, 0.15)',
    purple: '0 0 30px rgba(139, 92, 246, 0.15)',
    none: 'none',
  };

  const borderMap = {
    cyan: 'rgba(0, 240, 255, 0.25)',
    magenta: 'rgba(255, 0, 229, 0.25)',
    purple: 'rgba(139, 92, 246, 0.25)',
    none: 'var(--glass-border)',
  };

  return (
    <motion.div
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
        border: `1px solid ${borderMap[glowColor]}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: glowMap[glowColor],
        padding: '24px',
        transition: 'var(--transition-base)',
      }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow:
                glowColor !== 'none'
                  ? `0 0 40px ${glowColor === 'cyan' ? 'rgba(0, 240, 255, 0.25)' : glowColor === 'magenta' ? 'rgba(255, 0, 229, 0.25)' : 'rgba(139, 92, 246, 0.25)'}, 0 20px 40px rgba(0, 0, 0, 0.3)`
                  : '0 20px 40px rgba(0, 0, 0, 0.3)',
            }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
