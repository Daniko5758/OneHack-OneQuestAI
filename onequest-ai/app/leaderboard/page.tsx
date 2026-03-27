'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCurrentAccount } from '@onelabs/dapp-kit';
import GlassCard from '../components/ui/GlassCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import WalletGate from '../components/ui/WalletGate';
import { HiTrophy, HiBolt, HiStar } from 'react-icons/hi2';

interface LeaderboardEntry {
  address: string;
  total_exp: number;
  quest_count: number;
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze
const rankEmoji = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  return (
    <WalletGate>
      <LeaderboardContent />
    </WalletGate>
  );
}

function LeaderboardContent() {
  const account = useCurrentAccount();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.leaderboard);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading leaderboard..." />;
  }

  const userRank = account
    ? leaderboard.findIndex((e) => e.address === account.address)
    : -1;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '40px', textAlign: 'center' }}
      >
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</div>
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 800,
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #FFD700, var(--cyan), var(--purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Leaderboard
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
          Top questers ranked by total EXP earned
        </p>
      </motion.div>

      {/* User's own rank */}
      {account && userRank >= 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '24px' }}
        >
          <GlassCard glowColor="cyan" hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HiStar size={20} style={{ color: 'var(--cyan)' }} />
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Your Rank</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{
                  fontSize: '24px', fontWeight: 800,
                  background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  #{userRank + 1}
                </span>
                <span style={{
                  fontSize: '14px', color: 'var(--cyan)', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <HiBolt size={14} />
                  {leaderboard[userRank].total_exp.toLocaleString()} EXP
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Podium — Top 3 */}
      {leaderboard.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '32px',
            alignItems: 'end',
          }}
        >
          {[1, 0, 2].map((podiumIndex) => {
            const entry = leaderboard[podiumIndex];
            const isFirst = podiumIndex === 0;
            return (
              <motion.div
                key={podiumIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + podiumIndex * 0.1 }}
              >
                <GlassCard
                  glowColor={isFirst ? 'cyan' : 'none'}
                  hover={false}
                  style={{
                    textAlign: 'center',
                    padding: isFirst ? '28px 16px' : '20px 16px',
                    border: `1px solid ${rankColors[podiumIndex]}33`,
                  }}
                >
                  <div style={{ fontSize: isFirst ? '36px' : '28px', marginBottom: '8px' }}>
                    {rankEmoji[podiumIndex]}
                  </div>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    fontFamily: 'monospace',
                  }}>
                    {truncateAddress(entry.address)}
                  </p>
                  <p style={{
                    fontSize: isFirst ? '22px' : '18px',
                    fontWeight: 800,
                    color: rankColors[podiumIndex],
                    marginBottom: '2px',
                  }}>
                    {entry.total_exp.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    EXP • {entry.quest_count} quests
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Rest of leaderboard */}
      {leaderboard.length > 3 && (
        <GlassCard glowColor="none" hover={false}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '50px 1fr 120px 100px',
                padding: '12px 16px',
                borderBottom: '1px solid var(--glass-border)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <span>Rank</span>
              <span>Address</span>
              <span style={{ textAlign: 'right' }}>EXP</span>
              <span style={{ textAlign: 'right' }}>Quests</span>
            </div>

            {/* Table Rows */}
            {leaderboard.slice(3).map((entry, idx) => {
              const rank = idx + 4;
              const isCurrentUser = account?.address === entry.address;
              return (
                <motion.div
                  key={entry.address}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.03 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 120px 100px',
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--glass-border)',
                    alignItems: 'center',
                    background: isCurrentUser ? 'rgba(0, 245, 255, 0.05)' : 'transparent',
                  }}
                >
                  <span style={{
                    fontSize: '14px', fontWeight: 700,
                    color: isCurrentUser ? 'var(--cyan)' : 'var(--text-secondary)',
                  }}>
                    {rank}
                  </span>
                  <span style={{
                    fontSize: '13px', fontFamily: 'monospace',
                    color: isCurrentUser ? 'var(--cyan)' : 'var(--text-primary)',
                    fontWeight: isCurrentUser ? 700 : 400,
                  }}>
                    {truncateAddress(entry.address)}
                    {isCurrentUser && (
                      <span style={{
                        marginLeft: '8px', fontSize: '10px',
                        padding: '2px 6px', borderRadius: '4px',
                        background: 'var(--cyan-dim)', color: 'var(--cyan)',
                        fontWeight: 600, fontFamily: 'inherit',
                      }}>
                        YOU
                      </span>
                    )}
                  </span>
                  <span style={{
                    textAlign: 'right', fontSize: '14px', fontWeight: 600,
                    color: 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px',
                  }}>
                    <HiBolt size={12} style={{ color: 'var(--cyan)' }} />
                    {entry.total_exp.toLocaleString()}
                  </span>
                  <span style={{
                    textAlign: 'right', fontSize: '13px', color: 'var(--text-secondary)',
                  }}>
                    {entry.quest_count}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Empty state */}
      {leaderboard.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '60px 20px' }}
        >
          <HiTrophy size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            No questers yet
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
            Complete quests to earn EXP and appear on the leaderboard!
          </p>
        </motion.div>
      )}
    </div>
  );
}
