'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConnectWalletButton from './ConnectWalletButton';

const NAV_ITEMS = [
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/create', label: 'Create Campaign' },
  { href: '/my-nfts', label: 'My NFTs' },
  { href: '/docs', label: 'Docs' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.15]);
  const pathname = usePathname();

  return (
    <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Dynamic background on scroll */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--bg-primary)',
          opacity: bgOpacity,
          borderBottom: '1px solid',
          borderBottomColor: useTransform(
            borderOpacity,
            (v) => `rgba(148, 163, 184, ${v})`
          ),
          zIndex: -1,
        }}
      />

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 800,
              color: '#fff',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
            }}
          >
            OQ
          </div>
          <span
            style={{
              fontSize: '19px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            OneQuest AI
          </span>
        </motion.div>
      </Link>

      {/* Nav Links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} active={pathname === item.href} />
        ))}
        <div style={{ marginLeft: '14px' }}>
          <ConnectWalletButton />
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <motion.span
        whileHover={{
          color: 'var(--cyan)',
          textShadow: '0 0 12px rgba(0, 240, 255, 0.3)',
        }}
        style={{
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: active ? 700 : 500,
          color: active ? 'var(--cyan)' : 'var(--text-secondary)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          transition: 'var(--transition-fast)',
          position: 'relative',
          display: 'inline-block',
        }}
      >
        {label}
        {/* Active indicator */}
        {active && (
          <motion.div
            layoutId="nav-indicator"
            style={{
              position: 'absolute',
              bottom: '0px',
              left: '14px',
              right: '14px',
              height: '2px',
              background: 'linear-gradient(90deg, var(--cyan), var(--purple))',
              borderRadius: '1px',
              boxShadow: '0 0 8px rgba(0, 240, 255, 0.5)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        )}
      </motion.span>
    </Link>
  );
}
