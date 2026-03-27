'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCurrentAccount } from '@onelabs/dapp-kit';
import { SuiClient } from '@onelabs/sui/client';
import GlassCard from '../components/ui/GlassCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { HiRocketLaunch, HiArrowRight, HiSparkles, HiMagnifyingGlass, HiCheckBadge } from 'react-icons/hi2';

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!;
const BADGE_TYPE = `${PACKAGE_ID}::core::QuestBadge`;
const suiClient = new SuiClient({ url: 'https://rpc-testnet.onelabs.cc:443' });

interface Campaign {
  id: string;
  title: string;
  description?: string;
  difficulty?: string;
  status: string;
  admin_address: string;
  created_at?: string;
  quest_count?: number;
}

const difficultyColor: Record<string, string> = {
  Easy: 'var(--green)',
  Medium: 'var(--cyan)',
  Hard: 'var(--magenta)',
};

export default function CampaignsPage() {
  const account = useCurrentAccount();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [completedCampaignIds, setCompletedCampaignIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        if (data.success) {
          setCampaigns(data.campaigns);
        }
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
      }
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  // Fetch user's on-chain QuestBadge NFTs to determine completed campaigns
  useEffect(() => {
    if (!account?.address) {
      setCompletedCampaignIds(new Set());
      return;
    }
    const fetchBadges = async () => {
      try {
        const objects = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: { StructType: BADGE_TYPE },
          options: { showContent: true },
        });
        const ids = new Set<string>(
          (objects.data || [])
            .filter((obj: any) => obj.data?.content?.fields?.campaign_id)
            .map((obj: any) => obj.data.content.fields.campaign_id)
        );
        setCompletedCampaignIds(ids);
      } catch (err) {
        console.error('Failed to fetch badges:', err);
      }
    };
    fetchBadges();
  }, [account?.address]);

  const filtered = campaigns.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <h1 style={{
          fontSize: '36px', fontWeight: 800, marginBottom: '8px',
          background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Campaigns
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
          Browse and join community quests on OneChain
        </p>
      </motion.div>

      {/* Search & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '28px', flexWrap: 'wrap',
        }}
      >
        <div style={{
          flex: 1, minWidth: '200px', position: 'relative',
          display: 'flex', alignItems: 'center',
        }}>
          <HiMagnifyingGlass size={16} style={{
            position: 'absolute', left: '14px', color: 'var(--text-tertiary)',
          }} />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px 12px 40px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)', fontSize: '14px',
              fontFamily: 'inherit', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--cyan)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
          />
        </div>
        <Link href="/create" style={{ textDecoration: 'none' }}>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '12px 20px', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
              color: '#fff', fontWeight: 600, fontSize: '14px',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            <HiSparkles size={16} /> Create Campaign
          </motion.button>
        </Link>
      </motion.div>

      {/* Campaign Grid */}
      {loading ? (
        <LoadingSpinner text="Loading campaigns..." />
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', padding: '60px 0' }}
        >
          <GlassCard glowColor="purple" hover={false}>
            <div style={{ padding: '20px' }}>
              <HiRocketLaunch
                size={48}
                style={{ color: 'var(--text-tertiary)', margin: '0 auto 16px', display: 'block' }}
              />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {search ? 'No matching campaigns' : 'No Campaigns Yet'}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '20px' }}>
                {search ? 'Try a different search term.' : 'Be the first to create an AI-powered quest campaign!'}
              </p>
              {!search && (
                <Link href="/create"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                    borderRadius: 'var(--radius-md)', color: '#fff',
                    fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                  }}
                >
                  <HiSparkles size={16} /> Create Campaign
                </Link>
              )}
            </div>
          </GlassCard>
        </motion.div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map((campaign, i) => {
            const isCompleted = completedCampaignIds.has(campaign.id);
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, type: 'spring', stiffness: 200, damping: 20 }}
              >
                <Link href={`/campaign/${campaign.id}`} style={{ textDecoration: 'none' }}>
                  <GlassCard glowColor={isCompleted ? 'none' : 'cyan'}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                        background: isCompleted
                          ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05))'
                          : 'linear-gradient(135deg, var(--cyan-dim), var(--purple-dim))',
                        border: `1px solid ${isCompleted ? 'var(--green)' : 'var(--cyan)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isCompleted
                          ? <HiCheckBadge size={20} style={{ color: 'var(--green)' }} />
                          : <HiRocketLaunch size={20} style={{ color: 'var(--cyan)' }} />
                        }
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {isCompleted && (
                          <span style={{
                            padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                            background: 'var(--green-dim)',
                            color: 'var(--green)',
                            fontSize: '11px', fontWeight: 600,
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                          }}>
                            <HiCheckBadge size={12} /> Completed
                          </span>
                        )}
                        {campaign.difficulty && (
                          <span style={{
                            padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                            background: `${difficultyColor[campaign.difficulty] || 'var(--cyan)'}15`,
                            color: difficultyColor[campaign.difficulty] || 'var(--cyan)',
                            fontSize: '11px', fontWeight: 600,
                          }}>
                            {campaign.difficulty}
                          </span>
                        )}
                        <span style={{
                          padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                          background: campaign.status === 'active' ? 'var(--green-dim)' : 'var(--red-dim)',
                          color: campaign.status === 'active' ? 'var(--green)' : 'var(--red)',
                          fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          {campaign.status}
                        </span>
                      </div>
                    </div>

                    <h3 style={{
                      fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)',
                      marginBottom: '8px', lineHeight: 1.4,
                    }}>
                      {campaign.title}
                    </h3>

                    {campaign.description && (
                      <p style={{
                        fontSize: '13px', color: 'var(--text-tertiary)',
                        lineHeight: 1.5, marginBottom: '12px',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {campaign.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        {campaign.quest_count || 0} quests
                      </span>
                      <HiArrowRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

