'use client';

import { useState } from 'react';

interface FloatingSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  id: string;
}

export default function FloatingSelect({
  label,
  value,
  onChange,
  options,
  id,
}: FloatingSelectProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '20px 16px 8px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid',
          borderColor: focused ? 'var(--cyan)' : 'var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '15px',
          outline: 'none',
          transition: 'border-color var(--transition-base)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          appearance: 'none',
          WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center',
        }}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            style={{ background: '#0a0f1e', color: '#f1f5f9' }}
          >
            {opt.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: '16px',
          top: '8px',
          fontSize: '11px',
          fontWeight: 600,
          color: focused ? 'var(--cyan)' : 'var(--text-secondary)',
          transition: 'color var(--transition-fast)',
          pointerEvents: 'none',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
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
