'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiLink, HiChatBubbleLeftRight, HiPencil, HiTrash, HiCheck, HiXMark } from 'react-icons/hi2';

interface Quest {
  step_number: number;
  title: string;
  description: string;
  proof_type: string;
  steps?: string[];
  points?: number;
}

interface QuestCardProps {
  quest: Quest;
  index: number;
  editable?: boolean;
  onUpdate?: (updated: Quest) => void;
  onDelete?: () => void;
}

export default function QuestCard({ quest, index, editable, onUpdate, onDelete }: QuestCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Quest>({ ...quest });

  const isOnChain = quest.proof_type === 'TX_HASH';
  const accentColor = isOnChain ? 'var(--cyan)' : 'var(--magenta)';
  const accentDim = isOnChain ? 'var(--cyan-dim)' : 'var(--magenta-dim)';
  const Icon = isOnChain ? HiLink : HiChatBubbleLeftRight;

  const handleSave = () => {
    if (onUpdate) onUpdate(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...quest });
    setEditing(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.15,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      whileHover={{ y: -2 }}
      style={{
        background: 'var(--glass-bg)',
        border: `1px solid ${accentColor}33`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        cursor: 'default',
        transition: 'border-color var(--transition-base)',
      }}
      onHoverStart={(e: any) => {
        if (e?.target?.style) e.target.style.borderColor = `${accentColor}66`;
      }}
      onHoverEnd={(e: any) => {
        if (e?.target?.style) e.target.style.borderColor = `${accentColor}33`;
      }}
    >
      {/* Step number circle */}
      <div
        style={{
          width: '40px',
          height: '40px',
          minWidth: '40px',
          borderRadius: '50%',
          background: accentDim,
          border: `2px solid ${accentColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accentColor,
          fontWeight: 700,
          fontSize: '14px',
          boxShadow: `0 0 12px ${accentColor}33`,
        }}
      >
        {quest.step_number}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {/* Title */}
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                style={inputStyle}
                placeholder="Quest title"
                onFocus={(e) => (e.target.style.borderColor = 'var(--cyan)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
              />
              {/* Description */}
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                rows={2}
                placeholder="Quest description"
                onFocus={(e) => (e.target.style.borderColor = 'var(--cyan)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
              />
              {/* Steps */}
              {(draft.steps || []).map((step, si) => (
                <div key={si} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    value={step}
                    onChange={(e) => {
                      const newSteps = [...(draft.steps || [])];
                      newSteps[si] = e.target.value;
                      setDraft({ ...draft, steps: newSteps });
                    }}
                    style={{ ...inputStyle, fontSize: '13px' }}
                    placeholder={`Step ${si + 1}`}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--cyan)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                  />
                  <button
                    onClick={() => {
                      const newSteps = (draft.steps || []).filter((_, i) => i !== si);
                      setDraft({ ...draft, steps: newSteps });
                    }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--red)', padding: '4px', flexShrink: 0,
                    }}
                  >
                    <HiXMark size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setDraft({ ...draft, steps: [...(draft.steps || []), ''] })}
                style={{
                  background: 'none', border: '1px dashed var(--glass-border)',
                  borderRadius: 'var(--radius-sm)', padding: '6px 12px',
                  color: 'var(--text-tertiary)', fontSize: '12px', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                + Add Step
              </button>
              {/* Proof Type */}
              <select
                value={draft.proof_type}
                onChange={(e) => setDraft({ ...draft, proof_type: e.target.value })}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  appearance: 'auto',
                }}
              >
                <option value="TX_HASH">On-Chain (TX_HASH)</option>
                <option value="AUTO">Social (AUTO)</option>
              </select>
              {/* Save / Cancel */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  onClick={handleSave}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--green-dim)', border: '1px solid rgba(0,255,136,0.3)',
                    color: 'var(--green)', fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <HiCheck size={14} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                    color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <HiXMark size={14} /> Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '6px',
                }}
              >
                {quest.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '12px',
                }}
              >
                {quest.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: accentDim,
                    color: accentColor,
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                  }}
                >
                  <Icon size={13} />
                  {isOnChain ? 'On-Chain' : 'Social'}
                </span>
                {quest.points && (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--purple-dim)',
                      color: 'var(--purple)',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    +{quest.points} pts
                  </span>
                )}
                {/* Edit / Delete controls */}
                {editable && (
                  <>
                    <button
                      onClick={() => {
                        setDraft({ ...quest });
                        setEditing(true);
                      }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                        background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)',
                        color: 'var(--purple)', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto',
                      }}
                    >
                      <HiPencil size={12} /> Edit
                    </button>
                    <button
                      onClick={onDelete}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--red-dim)', border: '1px solid rgba(255, 71, 87, 0.25)',
                        color: 'var(--red)', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      <HiTrash size={12} /> Delete
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
