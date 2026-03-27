'use client';

import { useState } from 'react';

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  id: string;
}

export default function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
  id,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '20px 16px 8px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid',
          borderColor: focused
            ? 'var(--cyan)'
            : 'var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '15px',
          outline: 'none',
          transition: 'border-color var(--transition-base)',
          fontFamily: 'inherit',
        }}
        autoComplete="off"
      />
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: '16px',
          top: isActive ? '8px' : '50%',
          transform: isActive ? 'none' : 'translateY(-50%)',
          fontSize: isActive ? '11px' : '15px',
          fontWeight: isActive ? 600 : 400,
          color: focused
            ? 'var(--cyan)'
            : isActive
            ? 'var(--text-secondary)'
            : 'var(--text-tertiary)',
          transition: 'all var(--transition-fast)',
          pointerEvents: 'none',
          letterSpacing: isActive ? '0.5px' : '0',
          textTransform: isActive ? 'uppercase' : 'none',
        }}
      >
        {label}
      </label>
      {/* Animated bottom border */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%) scaleX(${focused ? 1 : 0})`,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, var(--cyan), var(--purple))',
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          transition: 'transform var(--transition-base)',
        }}
      />
    </div>
  );
}
