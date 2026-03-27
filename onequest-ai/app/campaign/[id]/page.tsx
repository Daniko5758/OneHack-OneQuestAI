'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCurrentAccount } from '@onelabs/dapp-kit';
import GlassCard from '../../components/ui/GlassCard';
import AnimatedButton from '../../components/ui/AnimatedButton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import WalletGate from '../../components/ui/WalletGate';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toast';
import {
  HiLink, HiChatBubbleLeftRight, HiCheckCircle, HiArrowRight,
  HiShare, HiClipboard, HiTrash, HiLockClosed,
} from 'react-icons/hi2';

interface Quest {
  id?: string;
  step_number: number;
  title: string;
  description: string;
  steps?: string[];
  proof_type: string;
}

interface Campaign {
  id: string;
  title: string;
  description?: string;
  difficulty?: string;
  status: string;
  admin_address: string;
  quests: Quest[];
}

export default function CampaignDetailPage() {
  return (
    <WalletGate>
      <CampaignContent />
    </WalletGate>
  );
}

function CampaignContent() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const account = useCurrentAccount();
  const { toast } = useToast();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteState, setDeleteState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [completedQuestIds, setCompletedQuestIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`);
        const data = await res.json();
        if (data.success) {
          setCampaign(data.campaign);
        }
      } catch (err) {
        console.error('Failed to fetch campaign:', err);
      }
      setLoading(false);
    };
    fetchCampaign();
  }, [campaignId]);

  // Fetch user's completed submissions for this campaign
  useEffect(() => {
    if (!account?.address || !campaignId) return;
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(
          `/api/submissions?campaign_id=${campaignId}&user_address=${account.address}`
        );
        const data = await res.json();
        if (data.success && data.submissions) {
          setCompletedQuestIds(new Set(data.submissions.map((s: any) => s.quest_id)));
        }
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      }
    };
    fetchSubmissions();
  }, [account?.address, campaignId]);

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!account || !campaign) return;

    setDeleteState('loading');
    setShowDeleteModal(false);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_address: account.address }),
      });
      const data = await res.json();
      if (data.success) {
        toast('Campaign deleted successfully', 'success');
        router.push('/campaigns');
      } else {
        toast(data.error || 'Failed to delete campaign', 'error');
        setDeleteState('error');
        setTimeout(() => setDeleteState('idle'), 2000);
      }
    } catch {
      toast('Network error — please try again', 'error');
      setDeleteState('error');
      setTimeout(() => setDeleteState('idle'), 2000);
    }
  }, [account, campaign, campaignId, router, toast]);

  if (loading) return <LoadingSpinner text="Loading campaign..." />;

  if (!campaign) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Campaign not found
        </h2>
      </div>
    );
  }

  const totalQuests = campaign.quests.length;
  const isOwner = account?.address === campaign.admin_address;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🎮 Check out this quest campaign: ${campaign.title}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`🎮 I'm questing on OneChain! Check out: ${campaign.title}`)}`;

  const difficultyColor: Record<string, string> = {
    Easy: 'var(--green)',
    Medium: 'var(--cyan)',
    Hard: 'var(--magenta)',
  };

  // Determine the first incomplete quest step number for sequential locking
  const sortedQuests = [...campaign.quests].sort((a, b) => a.step_number - b.step_number);
  const firstIncompleteStep = sortedQuests.find((q) => {
    const qId = q.id || `${campaignId}-q${q.step_number}`;
    return !completedQuestIds.has(qId);
  })?.step_number ?? Infinity;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        description="Are you sure you want to delete this campaign? This action cannot be undone and all associated quests and submissions will be permanently removed."
        confirmLabel="Delete Campaign"
        variant="danger"
        loading={deleteState === 'loading'}
      />

      {/* Campaign Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{
            padding: '4px 12px', borderRadius: 'var(--radius-sm)',
            background: 'var(--green-dim)', color: 'var(--green)',
            fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            {campaign.status}
          </span>
          {campaign.difficulty && (
            <span style={{
              padding: '4px 12px', borderRadius: 'var(--radius-sm)',
              background: `${difficultyColor[campaign.difficulty] || 'var(--cyan)'}15`,
              color: difficultyColor[campaign.difficulty] || 'var(--cyan)',
              fontSize: '12px', fontWeight: 600,
            }}>
              {campaign.difficulty}
            </span>
          )}
          <span style={{
            padding: '4px 12px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(139, 92, 246, 0.1)', color: 'var(--purple)',
            fontSize: '12px', fontWeight: 600,
          }}>
            {totalQuests} Quests
          </span>
          <span style={{
            padding: '4px 12px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 255, 136, 0.1)', color: 'var(--green)',
            fontSize: '12px', fontWeight: 600,
          }}>
            {completedQuestIds.size}/{totalQuests} Done
          </span>
        </div>

        <h1 style={{
          fontSize: '32px', fontWeight: 800, marginBottom: '12px',
          background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {campaign.title}
        </h1>

        {campaign.description && (
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
            {campaign.description}
          </p>
        )}

        {/* Action Bar */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowShareMenu(!showShareMenu)}
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit',
              }}
            >
              <HiShare size={14} /> Share
            </motion.button>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: '6px',
                  background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)', padding: '8px', zIndex: 20,
                  display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <button
                  onClick={handleCopyUrl}
                  style={{
                    padding: '8px 12px', background: 'transparent', border: 'none',
                    color: copied ? 'var(--green)' : 'var(--text-primary)',
                    cursor: 'pointer', fontSize: '13px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit',
                  }}
                >
                  <HiClipboard size={14} /> {copied ? 'Copied!' : 'Copy URL'}
                </button>
                <a href={tgUrl} target="_blank" rel="noopener noreferrer"
                  style={{
                    padding: '8px 12px', color: 'var(--text-primary)', textDecoration: 'none',
                    fontSize: '13px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                  📨 Share on Telegram
                </a>
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
                  style={{
                    padding: '8px 12px', color: 'var(--text-primary)', textDecoration: 'none',
                    fontSize: '13px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                  🐦 Share on X
                </a>
              </motion.div>
            )}
          </div>

          {/* Delete — visible to creator */}
          {isOwner && (
            <AnimatedButton
              id="delete-btn"
              onClick={() => setShowDeleteModal(true)}
              state={deleteState}
              variant="primary"
            >
              <HiTrash size={14} /> Delete Campaign
            </AnimatedButton>
          )}
        </div>
      </motion.div>

      {/* Quest Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {campaign.quests.map((quest, index) => {
          const isOnChain = quest.proof_type === 'TX_HASH';
          const questId = quest.id || `${campaignId}-q${quest.step_number}`;
          const isFinalQuest = index === totalQuests - 1;
          const isCompleted = completedQuestIds.has(questId);
          const isLocked = quest.step_number > firstIncompleteStep;

          const accentColor = isCompleted
            ? 'var(--green)'
            : isLocked
              ? 'var(--text-tertiary)'
              : isOnChain
                ? 'var(--cyan)'
                : 'var(--magenta)';

          const cardContent = (
            <GlassCard glowColor="none">
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                opacity: isLocked ? 0.45 : 1,
                transition: 'opacity 0.2s',
              }}>
                <div style={{
                  width: '44px', height: '44px', minWidth: '44px',
                  borderRadius: '12px',
                  background: isCompleted ? 'rgba(0, 255, 136, 0.15)' : `${accentColor}15`,
                  border: `2px solid ${accentColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 800, color: accentColor,
                }}>
                  {isCompleted ? <HiCheckCircle size={22} /> : isLocked ? <HiLockClosed size={18} /> : quest.step_number}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '16px', fontWeight: 600,
                    color: isLocked ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    marginBottom: '4px',
                  }}>
                    {quest.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isCompleted ? (
                      <span style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600 }}>✅ Completed</span>
                    ) : isLocked ? (
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>🔒 Complete previous quests first</span>
                    ) : (
                      <>
                        {isOnChain ? (
                          <><HiLink size={12} style={{ color: 'var(--cyan)' }} /><span style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 500 }}>On-Chain</span></>
                        ) : (
                          <><HiChatBubbleLeftRight size={12} style={{ color: 'var(--magenta)' }} /><span style={{ fontSize: '12px', color: 'var(--magenta)', fontWeight: 500 }}>Social</span></>
                        )}
                      </>
                    )}
                    {isFinalQuest && !isCompleted && (
                      <span style={{
                        padding: '2px 8px', borderRadius: '4px',
                        background: 'rgba(255, 215, 0, 0.15)', color: '#FFD700',
                        fontSize: '10px', fontWeight: 700,
                      }}>
                        🏆 FINAL
                      </span>
                    )}
                  </div>
                </div>

                {isCompleted ? <HiCheckCircle size={18} style={{ color: 'var(--green)' }} />
                  : isLocked ? <HiLockClosed size={18} style={{ color: 'var(--text-tertiary)' }} />
                  : <HiArrowRight size={18} style={{ color: 'var(--text-tertiary)' }} />}
              </div>
            </GlassCard>
          );

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              {isCompleted || isLocked ? (
                <div style={{ cursor: isCompleted ? 'default' : 'not-allowed' }}>{cardContent}</div>
              ) : (
                <Link href={`/campaign/${campaignId}/quest/${questId}${isFinalQuest ? '?final=true' : ''}`} style={{ textDecoration: 'none' }}>
                  {cardContent}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
