'use client';

import { useCurrentAccount, ConnectModal } from '@onelabs/dapp-kit';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiWallet } from 'react-icons/hi2';

interface WalletGateProps {
  children: React.ReactNode;
}

export default function WalletGate({ children }: WalletGateProps) {
  const account = useCurrentAccount();
  const [open, setOpen] = useState(false);

  if (account) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '120px 24px',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '48px 32px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 245, 255, 0.15)',
              '0 0 40px rgba(0, 245, 255, 0.3)',
              '0 0 20px rgba(0, 245, 255, 0.15)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <HiWallet size={32} style={{ color: '#fff' }} />
        </motion.div>

        <h2
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          Connect Your Wallet
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: '28px',
            lineHeight: 1.6,
          }}
        >
          Connect your OneWallet to access this page and interact with OneChain.
        </p>

        <ConnectModal
          trigger={
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0, 245, 255, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '14px 32px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'inherit',
              }}
            >
              <HiWallet size={18} />
              Connect OneWallet
            </motion.button>
          }
          open={open}
          onOpenChange={setOpen}
        />
      </motion.div>
    </div>
  );
}
