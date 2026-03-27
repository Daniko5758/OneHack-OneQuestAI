'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@onelabs/dapp-kit';
import { Transaction } from '@onelabs/sui/transactions';
import GlassCard from '../components/ui/GlassCard';
import FloatingInput from '../components/ui/FloatingInput';
import FloatingSelect from '../components/ui/FloatingSelect';
import AnimatedButton from '../components/ui/AnimatedButton';
import QuestCard from '../components/ui/QuestCard';
import Confetti from '../components/ui/Confetti';
import WalletGate from '../components/ui/WalletGate';
import { HiSparkles, HiRocketLaunch, HiLink, HiChatBubbleLeftRight, HiShieldCheck, HiPlusCircle } from 'react-icons/hi2';

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!;
const VAULT_ID = process.env.NEXT_PUBLIC_CAMPAIGN_VAULT_ID!;

interface Quest {
  step_number: number;
  title: string;
  description: string;
  steps?: string[];
  proof_type: string;
}

type PublishStage = 'idle' | 'paying' | 'verifying' | 'done' | 'error';

export default function CreateCampaignPage() {
  return (
    <WalletGate>
      <CreateContent />
    </WalletGate>
  );
}

function CreateContent() {
  const account = useCurrentAccount();
  const router = useRouter();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [formData, setFormData] = useState({
    goal: '',
    targetUser: '',
    difficulty: 'Easy',
    onechainProducts: '',
    description: '',
  });
  const [quests, setQuests] = useState<Quest[]>([]);
  const [generateState, setGenerateState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [publishStage, setPublishStage] = useState<PublishStage>('idle');
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const allFieldsFilled =
    formData.goal.trim() !== '' &&
    formData.targetUser.trim() !== '' &&
    formData.onechainProducts.trim() !== '' &&
    formData.description.trim() !== '';

  const handleGenerate = useCallback(async () => {
    setGenerateState('loading');
    setQuests([]);
    try {
      const res = await fetch('/api/quest/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setQuests(data.quests);
        setGenerateState('success');
        setTimeout(() => setGenerateState('idle'), 2000);
      } else {
        setErrorMsg(data.error);
        setGenerateState('error');
        setTimeout(() => setGenerateState('idle'), 2500);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setGenerateState('error');
      setTimeout(() => setGenerateState('idle'), 2500);
    }
  }, [formData]);

  const handlePublish = useCallback(async () => {
    if (!account) return;
    if (quests.length === 0) {
      setErrorMsg('Generate quests first!');
      setPublishStage('error');
      setTimeout(() => setPublishStage('idle'), 2500);
      return;
    }

    const campaignId = `camp-${Date.now()}`;

    setPublishStage('paying');
    try {
      const txb = new Transaction();
      txb.moveCall({
        target: `${PACKAGE_ID}::core::pay_and_create_campaign`,
        arguments: [
          txb.object(VAULT_ID),
          txb.splitCoins(txb.gas, [500_000_000]),
          txb.pure.string(campaignId),
        ],
      });

      const result = await signAndExecute({ transaction: txb as any });
      const digest = result.digest;

      if (!digest) {
        throw new Error('Transaction failed — no digest returned');
      }

      setPublishStage('verifying');

      const res = await fetch('/api/quest/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaignId,
          admin_address: account.address,
          title: formData.goal,
          description: formData.description,
          difficulty: formData.difficulty,
          quests,
          digest,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setPublishStage('done');
        setShowConfetti(true);
        setTimeout(() => {
          router.push('/campaigns');
        }, 2000);
      } else {
        setErrorMsg(data.error || 'Verification failed');
        setPublishStage('error');
        setTimeout(() => setPublishStage('idle'), 2500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction rejected');
      setPublishStage('error');
      setTimeout(() => setPublishStage('idle'), 2500);
    }
  }, [account, quests, formData, signAndExecute, router]);

  const onchainCount = quests.filter((q) => q.proof_type === 'TX_HASH').length;
  const socialCount = quests.filter((q) => q.proof_type !== 'TX_HASH').length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <Confetti fire={showConfetti} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '40px' }}
      >
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 800,
            marginBottom: '8px',
            background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Create Campaign
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
          Create AI-powered quests and publish them on-chain
        </p>
      </motion.div>

      {/* Campaign Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard glowColor="cyan" hover={false} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <HiSparkles size={22} style={{ color: 'var(--cyan)' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
              New Campaign
            </h2>
          </div>

          <FloatingInput
            id="goal"
            label="Campaign Name *"
            value={formData.goal}
            onChange={(v) => setFormData({ ...formData, goal: v })}
          />
          <FloatingInput
            id="targetUser"
            label="Target User (e.g. Beginner) *"
            value={formData.targetUser}
            onChange={(v) => setFormData({ ...formData, targetUser: v })}
          />
          <FloatingSelect
            id="difficulty"
            label="Difficulty"
            value={formData.difficulty}
            onChange={(v) => setFormData({ ...formData, difficulty: v })}
            options={[
              { value: 'Easy', label: 'Easy' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Hard', label: 'Hard' },
            ]}
          />
          <FloatingInput
            id="products"
            label="OneChain Products (e.g. OneSwap, OneDex) *"
            value={formData.onechainProducts}
            onChange={(v) => setFormData({ ...formData, onechainProducts: v })}
          />

          {/* Campaign Description */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="description"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Campaign Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the campaign in detail. This is the PRIMARY context for AI quest generation. Be specific about what users should learn and do..."
              rows={5}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: 1.6,
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--cyan)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
            />
          </div>

          <AnimatedButton
            id="generate-btn"
            onClick={handleGenerate}
            state={!allFieldsFilled ? 'idle' : generateState}
            fullWidth
            disabled={!allFieldsFilled}
          >
            <HiSparkles size={16} />
            {!allFieldsFilled ? 'Fill all fields to generate' : 'Generate Quests with AI'}
          </AnimatedButton>
        </GlassCard>
      </motion.div>

      {/* Generated Results */}
      <AnimatePresence>
        {quests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <GlassCard glowColor="purple" hover={false}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Review & Edit Quests
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--cyan-dim)', color: 'var(--cyan)', fontSize: '12px', fontWeight: 600,
                  }}>
                    <HiLink size={12} /> {onchainCount} On-Chain
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--magenta-dim)', color: 'var(--magenta)', fontSize: '12px', fontWeight: 600,
                  }}>
                    <HiChatBubbleLeftRight size={12} /> {socialCount} Social
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                Edit, delete, or add quests below before publishing. Step numbers update automatically.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {quests.map((quest, idx) => (
                  <QuestCard
                    key={`${idx}-${quest.step_number}`}
                    quest={quest}
                    index={idx}
                    editable
                    onUpdate={(updated) => {
                      const newQuests = [...quests];
                      newQuests[idx] = updated;
                      setQuests(newQuests);
                    }}
                    onDelete={() => {
                      const newQuests = quests
                        .filter((_, i) => i !== idx)
                        .map((q, i) => ({ ...q, step_number: i + 1 }));
                      setQuests(newQuests);
                    }}
                  />
                ))}
              </div>

              {/* Add Quest Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setQuests([
                    ...quests,
                    {
                      step_number: quests.length + 1,
                      title: '',
                      description: '',
                      steps: [],
                      proof_type: 'TX_HASH',
                    },
                  ]);
                }}
                style={{
                  width: '100%', padding: '12px',
                  background: 'var(--glass-bg)',
                  border: '1px dashed var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  marginBottom: '28px',
                }}
              >
                <HiPlusCircle size={18} /> Add Quest
              </motion.button>

              {/* Publish Section */}
              <div
                style={{
                  padding: '20px',
                  background: 'rgba(139, 92, 246, 0.05)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Publish Campaign
                </h3>

                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <StepIndicator
                    step={1}
                    label="Pay 0.5 OCT"
                    active={publishStage === 'paying'}
                    done={publishStage === 'verifying' || publishStage === 'done'}
                  />
                  <div style={{
                    flex: 1, height: '2px',
                    background: publishStage === 'verifying' || publishStage === 'done'
                      ? 'linear-gradient(90deg, var(--cyan), var(--purple))'
                      : 'var(--glass-border)',
                    transition: 'background 0.5s',
                  }} />
                  <StepIndicator
                    step={2}
                    label="Verify & Save"
                    active={publishStage === 'verifying'}
                    done={publishStage === 'done'}
                  />
                </div>

                <AnimatedButton
                  id="publish-btn"
                  onClick={handlePublish}
                  state={
                    publishStage === 'paying' || publishStage === 'verifying'
                      ? 'loading'
                      : publishStage === 'done'
                      ? 'success'
                      : publishStage === 'error'
                      ? 'error'
                      : 'idle'
                  }
                  variant="success"
                  fullWidth
                >
                  <HiRocketLaunch size={16} />
                  {publishStage === 'paying'
                    ? 'Sign in OneWallet...'
                    : publishStage === 'verifying'
                    ? 'Verifying on-chain...'
                    : publishStage === 'done'
                    ? 'Published! Redirecting...'
                    : 'Publish to OneChain (0.5 OCT)'}
                </AnimatedButton>

                {publishStage === 'error' && errorMsg && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginTop: '10px', fontSize: '13px', color: 'var(--red)', textAlign: 'center' }}
                  >
                    {errorMsg}
                  </motion.p>
                )}

                {publishStage === 'done' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '12px', padding: '10px 14px',
                      background: 'var(--green-dim)', borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(0, 255, 136, 0.2)',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      color: 'var(--green)', fontSize: '13px', fontWeight: 600,
                    }}
                  >
                    <HiShieldCheck size={16} />
                    Payment verified on-chain! Redirecting to campaigns...
                  </motion.div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepIndicator({ step, label, active, done }: { step: number; label: string; active: boolean; done: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <motion.div
        animate={active ? { scale: [1, 1.2, 1], boxShadow: ['0 0 0px var(--cyan)', '0 0 15px var(--cyan)', '0 0 0px var(--cyan)'] } : {}}
        transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
        style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: done ? 'linear-gradient(135deg, var(--green), var(--cyan))' : active ? 'linear-gradient(135deg, var(--cyan), var(--purple))' : 'var(--bg-tertiary)',
          border: done || active ? 'none' : '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: done || active ? '#fff' : 'var(--text-tertiary)',
        }}
      >
        {done ? '✓' : step}
      </motion.div>
      <span style={{ fontSize: '13px', fontWeight: 500, color: done ? 'var(--green)' : active ? 'var(--cyan)' : 'var(--text-tertiary)' }}>
        {label}
      </span>
    </div>
  );
}
