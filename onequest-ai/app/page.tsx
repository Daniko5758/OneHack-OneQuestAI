'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from './components/ui/GlassCard';
import {
  HiRocketLaunch, HiAcademicCap, HiTrophy, HiArrowRight,
  HiSparkles, HiShieldCheck, HiUserGroup, HiCpuChip,
} from 'react-icons/hi2';

export default function HomePage() {
  return (
    <div>
      {/* ===================== HERO ===================== */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            padding: '80px 0 60px',
            position: 'relative',
          }}
        >
          {/* Decorative elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            style={{
              position: 'absolute', top: '20px', right: '10%',
              width: '100px', height: '100px',
              border: '1px solid rgba(0, 240, 255, 0.1)',
              borderRadius: '20px', transform: 'rotate(45deg)',
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
            style={{
              position: 'absolute', bottom: '30px', left: '8%',
              width: '70px', height: '70px',
              border: '1px solid rgba(139, 92, 246, 0.1)',
              borderRadius: '16px', transform: 'rotate(30deg)',
            }}
          />

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <h1 style={{
              fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800,
              lineHeight: 1.1, marginBottom: '16px',
              background: 'linear-gradient(135deg, var(--cyan) 0%, var(--purple) 50%, var(--magenta) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              OneQuest AI
            </h1>
            <p style={{
              fontSize: 'clamp(18px, 2.5vw, 22px)',
              color: 'var(--text-secondary)',
              maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.6,
            }}>
              Learn, Quest, Earn on OneChain
            </p>
          </motion.div>

          {/* Quick CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/campaigns" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 28px', borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                  color: '#fff', fontWeight: 700, fontSize: '15px',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <HiRocketLaunch size={18} /> Explore Campaigns
              </motion.button>
            </Link>
            <Link href="/create" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 28px', borderRadius: 'var(--radius-md)',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <HiSparkles size={18} /> Create Campaign
              </motion.button>
            </Link>
          </motion.div>
        </motion.section>

        {/* ===================== STATS ===================== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ paddingBottom: '60px' }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {[
              { value: '150+', label: 'Total Campaigns', icon: HiRocketLaunch, color: 'var(--cyan)' },
              { value: '2K+', label: 'Active Questers', icon: HiUserGroup, color: 'var(--purple)' },
              { value: '500+', label: 'NFTs Minted', icon: HiTrophy, color: 'var(--magenta)' },
              { value: '10K+', label: 'On-Chain Verifications', icon: HiShieldCheck, color: 'var(--green)' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <GlassCard glowColor="none" hover={false}>
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <stat.icon size={28} style={{ color: stat.color, marginBottom: '12px' }} />
                    <div style={{
                      fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)',
                      marginBottom: '4px',
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                      {stat.label}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ===================== BENTO FEATURE CARDS ===================== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ paddingBottom: '60px' }}
        >
          <h2 style={{
            fontSize: '28px', fontWeight: 800, textAlign: 'center',
            marginBottom: '32px', color: 'var(--text-primary)',
          }}>
            Why OneQuest AI?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}>
            {[
              {
                icon: HiTrophy, color: 'var(--magenta)',
                title: 'Earn NFT Badges',
                desc: 'Complete quests and earn exclusive on-chain NFT rewards minted directly to your wallet.',
              },
              {
                icon: HiCpuChip, color: 'var(--purple)',
                title: 'AI-Powered',
                desc: 'Campaigns structured with AI for the best onboarding experience — smart, targeted, and efficient.',
              },
              {
                icon: HiAcademicCap, color: 'var(--cyan)',
                title: 'Learn & Grow',
                desc: 'Onboard into Web3 ecosystems through guided missions designed to teach by doing.',
              },
              {
                icon: HiUserGroup, color: '#FFD700',
                title: 'Leaderboard',
                desc: 'Compete with other questers, earn EXP, and rise to the top of the community rankings.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <GlassCard glowColor="none">
                  <div style={{ padding: '8px 0' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: `${card.color}15`, border: `1px solid ${card.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '16px',
                    }}>
                      <card.icon size={24} style={{ color: card.color }} />
                    </div>
                    <h3 style={{
                      fontSize: '18px', fontWeight: 700,
                      color: 'var(--text-primary)', marginBottom: '8px',
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      fontSize: '14px', color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}>
                      {card.desc}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ===================== CTA BANNER ===================== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ paddingBottom: '80px' }}
        >
          <div style={{
            padding: '48px 32px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(139, 92, 246, 0.08))',
            border: '1px solid rgba(0, 240, 255, 0.15)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Glow effect */}
            <div style={{
              position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
              width: '400px', height: '400px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 240, 255, 0.1), transparent)',
              pointerEvents: 'none',
            }} />

            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800,
              marginBottom: '12px', color: 'var(--text-primary)',
              position: 'relative',
            }}>
              Ready to start your Web3 journey?
            </h2>
            <p style={{
              fontSize: '16px', color: 'var(--text-secondary)',
              marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px',
              position: 'relative',
            }}>
              Join thousands of questers and earn exclusive NFT badges.
            </p>
            <Link href="/campaigns" style={{ textDecoration: 'none', position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(0, 240, 255, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '16px 36px', borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                  color: '#fff', fontWeight: 700, fontSize: '16px',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}
              >
                Explore Campaigns <HiArrowRight size={18} />
              </motion.button>
            </Link>
          </div>
        </motion.section>
      </div>

      {/* ===================== FOOTER ===================== */}
      <footer style={{
        borderTop: '1px solid var(--glass-border)',
        background: 'rgba(5, 5, 16, 0.8)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: '32px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 800, color: '#fff',
            }}>OQ</div>
            <span style={{
              fontSize: '16px', fontWeight: 700,
              background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>OneQuest AI</span>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { href: '/campaigns', label: 'Campaigns' },
              { href: '/docs', label: 'Docs' },
              { href: '/leaderboard', label: 'Leaderboard' },
              { href: '/create', label: 'Create Campaign' },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                style={{
                  fontSize: '13px', color: 'var(--text-tertiary)',
                  textDecoration: 'none', fontWeight: 500,
                }}
              >{link.label}</Link>
            ))}
          </div>

          {/* Built on OneChain */}
          <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
            Built on OneChain (Sui Fork)
          </span>
        </div>
      </footer>
    </div>
  );
}
