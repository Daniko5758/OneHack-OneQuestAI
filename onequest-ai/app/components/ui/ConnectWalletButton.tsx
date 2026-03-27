'use client';

import { motion } from 'framer-motion';
import {
  useCurrentAccount,
  useDisconnectWallet,
  ConnectModal,
} from '@onelabs/dapp-kit';
import { useState } from 'react';
import { HiWallet } from 'react-icons/hi2';
import { HiOutlineLogout } from 'react-icons/hi';

export default function ConnectWalletButton() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [showMenu, setShowMenu] = useState(false);
  const [open, setOpen] = useState(false);

  const truncate = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (account) {
    return (
      <div style={{ position: 'relative' }}>
        <motion.button
          onClick={() => setShowMenu(!showMenu)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--cyan)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--green)',
              boxShadow: '0 0 8px var(--green)',
            }}
          />
          {truncate(account.address)}
        </motion.button>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px',
              minWidth: '180px',
              zIndex: 100,
            }}
          >
            <button
              onClick={() => {
                disconnect();
                setShowMenu(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px 12px',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--red)',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'var(--red-dim)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'transparent';
              }}
            >
              <HiOutlineLogout size={16} />
              Disconnect
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <ConnectModal
      trigger={
        <motion.button
          whileHover={{
            scale: 1.03,
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.3)',
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(139, 92, 246, 0.12))',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Pulse glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(139, 92, 246, 0.08))',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />
          <HiWallet size={18} style={{ position: 'relative', zIndex: 1 }} />
          <span style={{ position: 'relative', zIndex: 1 }}>Connect Wallet</span>
        </motion.button>
      }
      open={open}
      onOpenChange={(isOpen) => setOpen(isOpen)}
    />
  );
}
