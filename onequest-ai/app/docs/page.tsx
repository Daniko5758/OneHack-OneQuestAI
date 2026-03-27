'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import {
  HiBookOpen, HiRocketLaunch, HiQuestionMarkCircle,
  HiSparkles, HiShieldCheck, HiGift,
} from 'react-icons/hi2';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: HiBookOpen },
  { id: 'how-it-works', label: 'How It Works', icon: HiRocketLaunch },
  { id: 'faq', label: 'FAQ & Troubleshooting', icon: HiQuestionMarkCircle },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div style={{
      maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px',
      display: 'flex', gap: '32px', alignItems: 'flex-start',
    }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          width: '240px', minWidth: '240px', position: 'sticky', top: '96px',
        }}
      >
        <h2 style={{
          fontSize: '14px', fontWeight: 700, color: 'var(--text-tertiary)',
          textTransform: 'uppercase', letterSpacing: '1px',
          marginBottom: '16px', paddingLeft: '12px',
        }}>
          Documentation
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {SECTIONS.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <motion.button
                key={s.id}
                whileHover={{ x: 2 }}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '3px solid var(--cyan)' : '3px solid transparent',
                  color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500, fontSize: '14px',
                  cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left', transition: 'all 0.15s',
                }}
              >
                <s.icon size={16} />
                {s.label}
              </motion.button>
            );
          })}
        </nav>
      </motion.aside>

      {/* Content */}
      <motion.main
        key={activeSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ flex: 1, minWidth: 0 }}
      >
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'how-it-works' && <HowItWorksSection />}
        {activeSection === 'faq' && <FAQSection />}
      </motion.main>
    </div>
  );
}

/* =============== OVERVIEW =============== */
function OverviewSection() {
  return (
    <div>
      <h1 style={{
        fontSize: '32px', fontWeight: 800, marginBottom: '16px',
        background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        Welcome to OneQuest AI
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
        OneQuest AI is an AI-powered onboarding quest platform built exclusively for the OneChain ecosystem.
        We help Web3 communities and projects create interactive missions, seamlessly verify on-chain proofs,
        and reward users with on-chain NFTs via OneWallet.
      </p>

      <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
        Key Features
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          {
            icon: HiSparkles, color: 'var(--cyan)',
            title: 'AI-Assisted Campaigns',
            desc: 'Leverage AI to quickly generate and structure engaging onboarding missions for your community.',
          },
          {
            icon: HiShieldCheck, color: 'var(--green)',
            title: 'Automated On-Chain Verification',
            desc: 'We verify user participation directly through OneChain Transaction Hashes (Digests).',
          },
          {
            icon: HiGift, color: 'var(--magenta)',
            title: 'Gasless NFT Rewards',
            desc: 'Our Relayer system automatically pays the gas fees to mint and airdrop NFT badges to users who successfully complete your campaigns.',
          },
        ].map((feature, i) => (
          <GlassCard key={i} glowColor="none" hover={false}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px', height: '40px', minWidth: '40px', borderRadius: '10px',
                background: `${feature.color}15`, border: `1px solid ${feature.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <feature.icon size={20} style={{ color: feature.color }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* =============== HOW IT WORKS =============== */
function HowItWorksSection() {
  return (
    <div>
      <h1 style={{
        fontSize: '32px', fontWeight: 800, marginBottom: '32px',
        background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        How It Works
      </h1>

      {/* For Questers */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '20px', fontWeight: 700, color: 'var(--cyan)',
          marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <HiRocketLaunch size={22} /> For Questers (Users)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { step: '1', title: 'Connect & Explore', desc: 'Connect your OneWallet and browse available community campaigns.' },
            { step: '2', title: 'Sequential Missions', desc: 'Complete quests in order (Step 1, Step 2, etc.).' },
            {
              step: '3', title: 'Submit Proofs', desc: (
                <>
                  <span>For social tasks, simply complete the action and click &quot;Mark as Done&quot;.</span>
                  <br />
                  <span>For on-chain tasks, execute the required action and paste your Transaction Digest (Hash) for instant verification.</span>
                </>
              ),
            },
            { step: '4', title: 'Earn NFTs', desc: 'Complete the final quest in a campaign, and an exclusive NFT badge will be automatically minted directly to your wallet.' },
          ].map((item, i) => (
            <GlassCard key={i} glowColor="none" hover={false}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px', height: '36px', minWidth: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 800, color: '#fff',
                }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* For Creators */}
      <div>
        <h2 style={{
          fontSize: '20px', fontWeight: 700, color: 'var(--magenta)',
          marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <HiSparkles size={22} /> For Creators (Communities / Projects)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { step: '1', title: 'Create a Campaign', desc: 'Use the Dashboard to set up a new onboarding campaign. You can use our AI tools to help structure the missions.' },
            { step: '2', title: 'Define Quests', desc: 'Generate steps with AI, then review, edit, or add manual steps. Choose whether they require a simple Social proof or an On-Chain Transaction Hash.' },
            { step: '3', title: 'Publish Your Campaign', desc: 'Pay a minimal publishing fee in OCT to deploy your campaign, making it live for users to interact with. Also you can share your campaign with your community.' },
          ].map((item, i) => (
            <GlassCard key={i} glowColor="none" hover={false}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px', height: '36px', minWidth: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--magenta), var(--purple))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 800, color: '#fff',
                }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =============== FAQ =============== */
function FAQSection() {
  const faqs = [
    {
      q: 'Why did my "Transaction Digest" verification fail?',
      a: 'Ensure you are using the exact same OneWallet address that executed the transaction. Also, confirm the transaction was successfully finalized on the OneChain Testnet before pasting the hash.',
    },
    {
      q: 'I encountered a "fetch failed" when publishing or submitting.',
      a: 'This is due to temporary instability on the OneChain Testnet RPC. Our system automatically retries the connection, but if it fails, please wait a few seconds and try again.',
    },
    {
      q: 'How do I get OCT to publish a campaign or pay for quest gas fees?',
      a: 'You can request free Testnet OCT tokens through the OneWallet faucet.',
    },
  ];

  return (
    <div>
      <h1 style={{
        fontSize: '32px', fontWeight: 800, marginBottom: '32px',
        background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        FAQ & Troubleshooting
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((faq, i) => (
          <GlassCard key={i} glowColor="none" hover={false}>
            <h3 style={{
              fontSize: '15px', fontWeight: 700, color: 'var(--cyan)',
              marginBottom: '10px', lineHeight: 1.5,
            }}>
              Q: {faq.q}
            </h3>
            <p style={{
              fontSize: '14px', color: 'var(--text-secondary)',
              lineHeight: 1.7, margin: 0,
              paddingLeft: '16px', borderLeft: '3px solid var(--glass-border)',
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>A:</strong> {faq.a}
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
