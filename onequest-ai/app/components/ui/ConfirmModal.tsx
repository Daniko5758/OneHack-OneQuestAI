'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamationTriangle } from 'react-icons/hi2';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  if (!open) return null;

  const isDanger = variant === 'danger';
  const confirmBg = isDanger
    ? 'linear-gradient(135deg, var(--red), #cc0044)'
    : 'linear-gradient(135deg, var(--cyan), var(--purple))';
  const confirmHoverShadow = isDanger
    ? '0 0 25px rgba(255, 51, 102, 0.4)'
    : '0 0 25px rgba(0, 240, 255, 0.4)';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            padding: '20px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Icon */}
            {isDanger && (
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'var(--red-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <HiExclamationTriangle size={24} style={{ color: 'var(--red)' }} />
              </div>
            )}

            <h3 style={{
              fontSize: '18px', fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: '8px',
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: '14px', color: 'var(--text-secondary)',
              lineHeight: 1.6, marginBottom: '24px',
            }}>
              {description}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {cancelLabel}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: confirmHoverShadow }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: confirmBg,
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '14px', fontWeight: 600,
                  cursor: loading ? 'wait' : 'pointer',
                  fontFamily: 'inherit',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Processing...' : confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
