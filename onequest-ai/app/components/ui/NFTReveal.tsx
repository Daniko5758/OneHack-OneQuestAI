'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface NFTRevealProps {
  show: boolean;
  onClose: () => void;
  campaignName?: string;
  badgeDescription?: string;
  digest?: string;
}

export default function NFTReveal({
  show,
  onClose,
  campaignName = 'OneQuest Badge',
  badgeDescription = 'Quest completed successfully!',
  digest,
}: NFTRevealProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer',
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0, rotateY: 180, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0, rotateY: -180, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 15,
              duration: 0.8,
            }}
            style={{
              width: '320px',
              padding: '40px',
              background: 'linear-gradient(145deg, #0a0f1e 0%, #111827 100%)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              boxShadow: '0 0 60px rgba(0, 240, 255, 0.2), 0 0 120px rgba(139, 92, 246, 0.1)',
            }}
          >
            {/* Shine sweep */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                delay: 0.5,
                duration: 1.2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 3,
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '60%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                transform: 'skewX(-15deg)',
              }}
            />

            {/* Badge icon */}
            <motion.div
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 4,
                ease: 'linear',
                repeat: Infinity,
              }}
              style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(0, 240, 255, 0.4)',
                perspective: '600px',
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
            </motion.div>

            {/* Particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                }}
                transition={{
                  delay: 0.3 + i * 0.1,
                  duration: 1.5,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: i % 2 === 0 ? 'var(--cyan)' : 'var(--purple)',
                }}
              />
            ))}

            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '8px',
                background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              🎉 NFT Minted!
            </h2>

            <h3
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}
            >
              {campaignName}
            </h3>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
              }}
            >
              {badgeDescription}
            </p>

            {digest && (
              <div
                style={{
                  padding: '10px',
                  background: 'rgba(0, 240, 255, 0.05)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '20px',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-tertiary)',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Transaction Digest
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--cyan)',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                  }}
                >
                  {digest}
                </p>
              </div>
            )}

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
