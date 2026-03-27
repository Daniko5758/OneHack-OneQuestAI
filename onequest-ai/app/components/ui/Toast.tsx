'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle, HiExclamationTriangle, HiInformationCircle, HiXMark } from 'react-icons/hi2';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const iconMap = {
    success: <HiCheckCircle size={18} />,
    error: <HiExclamationTriangle size={18} />,
    info: <HiInformationCircle size={18} />,
  };

  const colorMap = {
    success: { bg: 'rgba(0, 255, 136, 0.12)', border: 'rgba(0, 255, 136, 0.3)', color: 'var(--green)' },
    error: { bg: 'rgba(255, 51, 102, 0.12)', border: 'rgba(255, 51, 102, 0.3)', color: 'var(--red)' },
    info: { bg: 'rgba(0, 240, 255, 0.12)', border: 'rgba(0, 240, 255, 0.3)', color: 'var(--cyan)' },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div
        style={{
          position: 'fixed',
          top: '84px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const colors = colorMap[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 'var(--radius-md)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  color: colors.color,
                  fontSize: '13px',
                  fontWeight: 600,
                  maxWidth: '380px',
                  pointerEvents: 'auto',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                {iconMap[t.type]}
                <span style={{ flex: 1, color: 'var(--text-primary)' }}>{t.message}</span>
                <button
                  onClick={() => dismiss(t.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                  }}
                >
                  <HiXMark size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
