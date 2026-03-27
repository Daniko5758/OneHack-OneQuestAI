'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCurrentAccount } from '@onelabs/dapp-kit';
import GlassCard from '../../../../components/ui/GlassCard';
import FloatingInput from '../../../../components/ui/FloatingInput';
import AnimatedButton from '../../../../components/ui/AnimatedButton';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import NFTReveal from '../../../../components/ui/NFTReveal';
import WalletGate from '../../../../components/ui/WalletGate';
import Confetti from '../../../../components/ui/Confetti';
import {
  HiLink, HiChatBubbleLeftRight, HiCheckCircle, HiArrowLeft,
  HiRocketLaunch, HiShieldCheck, HiBolt,
} from 'react-icons/hi2';

interface Quest {
  id: string;
  campaign_id: string;
  step_number: number;
  title: string;
  description: string;
  steps: string[];
  proof_type: string;
}

interface Campaign {
  id: string;
  title: string;
  difficulty: string;
}

export default function QuestDetailPage() {
  return (
    <WalletGate>
      <QuestContent />
    </WalletGate>
  );
}

function QuestContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const questId = params.questId as string;
  const campaignId = params.id as string;
  const isFinalQuest = searchParams.get('final') === 'true';
  const account = useCurrentAccount();

  const [quest, setQuest] = useState<Quest | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [totalQuests, setTotalQuests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [proof, setProof] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'minting' | 'success' | 'error'>('idle');
  const [showNFT, setShowNFT] = useState(false);
  const [nftDigest, setNftDigest] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [expEarned, setExpEarned] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const res = await fetch(`/api/quests/${questId}`);
        const data = await res.json();
        if (data.success) {
          setQuest(data.quest);
          setCampaign(data.campaign);
          setTotalQuests(data.total_quests);
        }
      } catch (err) {
        console.error('Failed to fetch quest:', err);
      }
      setLoading(false);
    };
    fetchQuest();
  }, [questId]);

  // Check if quest is already completed by this user
  useEffect(() => {
    if (!account?.address || !campaignId) return;
    const checkCompletion = async () => {
      try {
        const res = await fetch(
          `/api/submissions?campaign_id=${campaignId}&user_address=${account.address}`
        );
        const data = await res.json();
        if (data.success && data.submissions) {
          const completed = data.submissions.some((s: any) => s.quest_id === questId);
          if (completed) {
            setAlreadyCompleted(true);
            setSubmitState('success');
          }
        }
      } catch (err) {
        console.error('Failed to check completion:', err);
      }
    };
    checkCompletion();
  }, [account?.address, campaignId, questId]);

  const handleSubmit = useCallback(async () => {
    if (!account || !quest) return;

    const isOnChain = quest.proof_type === 'TX_HASH';

    // Only require proof text for on-chain quests
    if (isOnChain && !proof.trim()) {
      setErrorMsg('Please provide the transaction hash!');
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 2000);
      return;
    }

    setSubmitState('loading');
    try {
      const res = await fetch('/api/quest/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx_hash: isOnChain ? proof : undefined,
          user_address: account.address,
          quest_id: quest.id,
          campaign_id: campaignId,
          is_final_quest: isFinalQuest,
          proof_type: quest.proof_type,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExpEarned(data.exp_earned || 0);
        if (data.nft_minted) {
          setSubmitState('minting');
          setNftDigest(data.digest);
          setTimeout(() => {
            setSubmitState('success');
            setShowConfetti(true);
            setShowNFT(true);
          }, 1500);
        } else {
          setSubmitState('success');
          setShowConfetti(true);
        }
      } else {
        setErrorMsg(data.error || 'Verification failed');
        setSubmitState('error');
        setTimeout(() => setSubmitState('idle'), 2500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed');
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 2500);
    }
  }, [account, quest, proof, campaignId, isFinalQuest]);

  if (loading) return <LoadingSpinner text="Loading quest..." />;

  if (!quest || !campaign) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-secondary)' }}>Quest not found</h2>
      </div>
    );
  }

  const isOnChain = quest.proof_type === 'TX_HASH';
  const accentColor = isOnChain ? 'var(--cyan)' : 'var(--magenta)';
  const isCompleted = submitState === 'success';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <Confetti fire={showConfetti} />
      <NFTReveal
        show={showNFT}
        onClose={() => setShowNFT(false)}
        campaignName={campaign.title}
        digest={nftDigest}
      />

      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '24px' }}>
        <Link
          href={`/campaign/${campaignId}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <HiArrowLeft size={14} /> Back to {campaign.title}
        </Link>
      </motion.div>

      {/* Quest Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        {/* Quest Number Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
          style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: `linear-gradient(135deg, ${accentColor}, var(--purple))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 900, color: '#fff',
            boxShadow: `0 0 30px ${accentColor}33`,
            marginBottom: '20px',
          }}
        >
          {quest.step_number}
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            background: isOnChain ? 'var(--cyan-dim)' : 'var(--magenta-dim)',
            color: accentColor,
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            {isOnChain ? <><HiLink size={12} /> On-Chain Quest</> : <><HiChatBubbleLeftRight size={12} /> Social Quest</>}
          </span>
          <span style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            background: 'rgba(139, 92, 246, 0.1)', color: 'var(--purple)',
          }}>
            Quest {quest.step_number} of {totalQuests}
          </span>
          {isFinalQuest && (
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
              background: 'rgba(255, 215, 0, 0.15)', color: '#FFD700',
            }}>
              🏆 Final Quest — NFT Reward
            </span>
          )}
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, lineHeight: 1.2,
          color: 'var(--text-primary)', marginBottom: '8px',
        }}>
          {quest.title}
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {quest.description}
        </p>
      </motion.div>

      {/* Steps Timeline */}
      {quest.steps && quest.steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '32px' }}
        >
          <GlassCard glowColor="cyan" hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <HiRocketLaunch size={20} style={{ color: 'var(--cyan)' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Quest Steps
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {/* Timeline Line */}
              <div style={{
                position: 'absolute', left: '19px', top: '24px',
                bottom: '24px', width: '2px',
                background: 'linear-gradient(to bottom, var(--cyan), var(--purple))',
                opacity: 0.3,
              }} />

              {quest.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  style={{
                    display: 'flex', gap: '16px', padding: '12px 0',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Step Circle */}
                  <motion.div
                    whileHover={{ scale: 1.15, boxShadow: `0 0 15px ${accentColor}` }}
                    style={{
                      width: '40px', height: '40px', minWidth: '40px',
                      borderRadius: '50%',
                      background: `${accentColor}15`,
                      border: `2px solid ${accentColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 800, color: accentColor,
                      zIndex: 2,
                    }}
                  >
                    {idx + 1}
                  </motion.div>

                  {/* Step Content */}
                  <div style={{
                    flex: 1, padding: '10px 16px',
                    background: 'rgba(15, 23, 42, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--glass-border)',
                  }}>
                    <p style={{
                      fontSize: '15px', color: 'var(--text-primary)',
                      lineHeight: 1.7, margin: 0,
                    }}>
                      {step}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Submission Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard glowColor={isCompleted ? 'purple' : 'none'} hover={false}>
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div key="submit" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <HiShieldCheck size={20} style={{ color: accentColor }} />
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {isOnChain ? 'Submit Proof' : 'Complete Quest'}
                  </h2>
                </div>

                {/* Dynamic UI: text input only for TX_HASH quests */}
                {isOnChain ? (
                  <FloatingInput
                    id="quest-proof"
                    label="Transaction Digest (Hash) — e.g. 67Y9ckBH..."
                    value={proof}
                    onChange={setProof}
                  />
                ) : (
                  <p style={{
                    fontSize: '14px', color: 'var(--text-secondary)',
                    marginBottom: '16px', lineHeight: 1.6,
                  }}>
                    Once you&apos;ve completed the steps above, click the button below to mark this quest as done.
                  </p>
                )}

                <AnimatedButton
                  id="submit-quest"
                  onClick={handleSubmit}
                  state={
                    submitState === 'minting' ? 'loading' :
                    submitState === 'loading' ? 'loading' :
                    submitState === 'error' ? 'error' : 'idle'
                  }
                  fullWidth
                  variant={isOnChain ? 'primary' : 'success'}
                >
                  {submitState === 'loading' ? (
                    isOnChain ? <>Verifying on-chain...</> : <>Submitting...</>
                  ) : submitState === 'minting' ? (
                    <>🎨 Minting your NFT...</>
                  ) : isOnChain ? (
                    <><HiLink size={14} /> Verify Transaction</>
                  ) : (
                    <><HiCheckCircle size={14} /> Mark as Done</>
                  )}
                </AnimatedButton>

                {submitState === 'error' && errorMsg && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginTop: '10px', fontSize: '13px', color: 'var(--red)', textAlign: 'center' }}
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={{ textAlign: 'center', padding: '20px 0' }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0, 255, 136, 0.2)',
                      '0 0 40px rgba(0, 255, 136, 0.4)',
                      '0 0 20px rgba(0, 255, 136, 0.2)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--green), var(--cyan))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <HiCheckCircle size={40} style={{ color: '#fff' }} />
                </motion.div>

                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--green)', marginBottom: '8px' }}>
                  Quest Complete! 🎉
                </h2>

                {expEarned > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 20px', borderRadius: '20px',
                      background: 'rgba(0, 245, 255, 0.1)',
                      border: '1px solid var(--cyan)',
                      color: 'var(--cyan)', fontSize: '16px', fontWeight: 700,
                      marginBottom: '16px',
                    }}
                  >
                    <HiBolt size={18} /> +{expEarned} EXP
                  </motion.div>
                )}

                <div style={{ marginTop: '16px' }}>
                  <Link
                    href={`/campaign/${campaignId}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '10px 24px', borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                      color: '#fff', fontWeight: 600, fontSize: '14px',
                      textDecoration: 'none',
                    }}
                  >
                    <HiArrowLeft size={14} /> Back to Campaign
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </div>
  );
}
