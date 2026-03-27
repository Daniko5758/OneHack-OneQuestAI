'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCurrentAccount } from '@onelabs/dapp-kit';
import { SuiClient } from '@onelabs/sui/client';
import GlassCard from '../components/ui/GlassCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import WalletGate from '../components/ui/WalletGate';
import { HiRocketLaunch, HiSparkles, HiTrophy } from 'react-icons/hi2';

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!;
const BADGE_TYPE = `${PACKAGE_ID}::core::QuestBadge`;

const suiClient = new SuiClient({ url: 'https://rpc-testnet.onelabs.cc:443' });

interface NFTBadge {
  objectId: string;
  name: string;
  description: string;
  campaignId: string;
}

export default function MyNFTsPage() {
  return (
    <WalletGate>
      <NFTsContent />
    </WalletGate>
  );
}

function NFTsContent() {
  const account = useCurrentAccount();
  const [nfts, setNfts] = useState<NFTBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account?.address) return;
    const fetchNFTs = async () => {
      try {
        const objects = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: { StructType: BADGE_TYPE },
          options: { showContent: true, showType: true },
        });

        const badges: NFTBadge[] = (objects.data || [])
          .filter((obj: any) => obj.data?.content?.fields)
          .map((obj: any) => {
            const fields = obj.data.content.fields;
            return {
              objectId: obj.data.objectId,
              name: fields.name || 'Quest Badge',
              description: fields.description || '',
              campaignId: fields.campaign_id || '',
            };
          });

        // Batch-fetch campaign titles to display as NFT names
        const uniqueIds = [...new Set(badges.map((b) => b.campaignId).filter(Boolean))];
        let titleMap: Record<string, string> = {};
        if (uniqueIds.length > 0) {
          try {
            const res = await fetch('/api/campaigns/batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids: uniqueIds }),
            });
            const data = await res.json();
            if (data.success && data.campaigns) {
              titleMap = Object.fromEntries(
                data.campaigns.map((c: { id: string; title: string }) => [c.id, c.title])
              );
            }
          } catch {
            // Fallback: use on-chain name if batch lookup fails
          }
        }

        // Replace generic badge names with campaign titles
        const enrichedBadges = badges.map((b) => ({
          ...b,
          name: (b.campaignId && titleMap[b.campaignId]) ? titleMap[b.campaignId] : b.name,
        }));

        setNfts(enrichedBadges);
      } catch (err) {
        console.error('Failed to fetch NFTs:', err);
      }
      setLoading(false);
    };
    fetchNFTs();
  }, [account?.address]);

  if (loading) return <LoadingSpinner text="Loading your NFTs..." />;

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
          background: 'linear-gradient(135deg, var(--magenta), var(--purple))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          My NFTs
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
          Your on-chain quest badges from completed campaigns
        </p>
      </motion.div>

      {nfts.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', padding: '60px 0' }}
        >
          <GlassCard glowColor="purple" hover={false}>
            <div style={{ padding: '32px 20px' }}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <HiTrophy size={56} style={{ color: 'var(--text-tertiary)', margin: '0 auto 20px', display: 'block' }} />
              </motion.div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                No NFTs Yet
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                Complete all quests in a campaign to earn your first on-chain NFT badge!
              </p>
              <Link href="/campaigns"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                  borderRadius: 'var(--radius-md)', color: '#fff',
                  fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                }}
              >
                <HiRocketLaunch size={16} /> Explore Campaigns
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      ) : (
        /* NFT Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {nfts.map((nft, i) => (
            <motion.div
              key={nft.objectId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <GlassCard glowColor="magenta">
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  {/* Badge Visual */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(255, 0, 229, 0.2)',
                        '0 0 40px rgba(255, 0, 229, 0.4)',
                        '0 0 20px rgba(255, 0, 229, 0.2)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                      width: '80px', height: '80px', borderRadius: '20px',
                      background: 'linear-gradient(135deg, var(--magenta), var(--purple))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <HiSparkles size={36} style={{ color: '#fff' }} />
                  </motion.div>

                  <h3 style={{
                    fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)',
                    marginBottom: '6px',
                  }}>
                    {nft.name}
                  </h3>

                  {nft.description && (
                    <p style={{
                      fontSize: '13px', color: 'var(--text-secondary)',
                      marginBottom: '12px', lineHeight: 1.5,
                    }}>
                      {nft.description}
                    </p>
                  )}

                  {nft.campaignId && (
                    <span style={{
                      display: 'inline-block', padding: '4px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: 'var(--purple)', fontSize: '11px', fontWeight: 600,
                      fontFamily: 'monospace',
                    }}>
                      {nft.campaignId.length > 20
                        ? `${nft.campaignId.slice(0, 10)}...${nft.campaignId.slice(-6)}`
                        : nft.campaignId}
                    </span>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
