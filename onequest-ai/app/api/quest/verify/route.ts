import { NextResponse } from 'next/server';
import { suiClient, relayerKeypair, supabase } from '@/lib/client';
import { Transaction } from '@onelabs/sui/transactions';
import { withRetry } from '@/lib/retry';

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID!;
const RELAYER_CAP_ID = process.env.RELAYER_CAP_ID!;

// EXP rewards based on campaign difficulty
const EXP_TABLE: Record<string, number> = {
  Easy: 100,
  Medium: 250,
  Hard: 500,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tx_hash, user_address, quest_id, campaign_id, is_final_quest, proof_type } = body;

    // ── 0. Prevent duplicate submissions ──
    const { data: existing } = await supabase
      .from('submissions')
      .select('id')
      .eq('quest_id', quest_id)
      .eq('user_address', user_address)
      .eq('status', 'completed')
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, error: 'Quest already completed' }, { status: 400 });
    }

    // ── 1. Validate quest proof_type from DB ──
    const { data: questRecord, error: questError } = await supabase
      .from('quests')
      .select('proof_type')
      .eq('id', quest_id)
      .single();

    if (questError || !questRecord) {
      return NextResponse.json({ success: false, error: 'Quest not found' }, { status: 404 });
    }

    const actualProofType = questRecord.proof_type;

    // ── 2. Handle SOCIAL quests (no on-chain verification needed) ──
    if (actualProofType !== 'TX_HASH') {
      // Social / URL / Description quest — just save and return
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('difficulty')
        .eq('id', campaign_id)
        .single();

      const difficulty = campaign?.difficulty || 'Easy';
      const expEarned = EXP_TABLE[difficulty] || 100;

      const { error: dbError } = await supabase
        .from('submissions')
        .insert([{
          user_address,
          quest_id,
          campaign_id,
          status: 'completed',
          exp_earned: expEarned,
        }]);

      if (dbError) throw new Error(dbError.message);

      // Mint NFT if this is the final quest
      let mintDigest = null;
      if (is_final_quest) {
        mintDigest = await mintNFT(quest_id, campaign_id, user_address);
      }

      return NextResponse.json({
        success: true,
        digest: mintDigest,
        exp_earned: expEarned,
        nft_minted: !!mintDigest,
      });
    }

    // ── 3. Handle TX_HASH quests — on-chain verification ──
    if (!tx_hash) {
      return NextResponse.json({ success: false, error: 'Transaction hash is required' }, { status: 400 });
    }

    // Verify Transaction via OneChain RPC (with retry for stability)
    const tx = await withRetry(() =>
      suiClient.getTransactionBlock({
        digest: tx_hash,
        options: {
          showEffects: true,
          showInput: true,
          showBalanceChanges: true,
          showEvents: true,
          showObjectChanges: true,
        },
      })
    );

    if (tx.effects?.status.status !== 'success') {
      return NextResponse.json({ success: false, error: 'Transaction failed on-chain' }, { status: 400 });
    }

    // ── Flexible address verification (Issue 4) ──
    // Check if user_address is involved in the transaction in ANY way:
    //   - as the sender
    //   - in balance changes (recipient of faucet, transfers, etc.)
    //   - in object changes (as owner/recipient)
    const isSender = tx.transaction?.data.sender === user_address;

    const inBalanceChanges = (tx.balanceChanges || []).some(
      (bc: any) => bc.owner?.AddressOwner === user_address
    );

    const inObjectChanges = (tx.objectChanges || []).some(
      (oc: any) =>
        (oc as any).owner?.AddressOwner === user_address ||
        (oc as any).recipient?.AddressOwner === user_address ||
        (oc as any).sender === user_address
    );

    if (!isSender && !inBalanceChanges && !inObjectChanges) {
      return NextResponse.json(
        { success: false, error: 'User address not found in this transaction' },
        { status: 400 }
      );
    }

    // ── 4. Look up campaign difficulty for EXP ──
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('difficulty')
      .eq('id', campaign_id)
      .single();

    const difficulty = campaign?.difficulty || 'Easy';
    const expEarned = EXP_TABLE[difficulty] || 100;

    // ── 5. Save submission ──
    const { error: dbError } = await supabase
      .from('submissions')
      .insert([{
        user_address,
        quest_id,
        campaign_id,
        status: 'completed',
        exp_earned: expEarned,
      }]);

    if (dbError) throw new Error(dbError.message);

    // ── 6. Mint NFT on FINAL quest ──
    let mintDigest = null;
    if (is_final_quest) {
      mintDigest = await mintNFT(quest_id, campaign_id, user_address);
    }

    return NextResponse.json({
      success: true,
      digest: mintDigest,
      exp_earned: expEarned,
      nft_minted: !!mintDigest,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Mint NFT badge via the relayer.
 * Does NOT manually set gas payment — lets the SDK resolve coins automatically
 * to avoid object version mismatch errors (Issue 5).
 * Wrapped in withRetry for RPC stability (Issue 6).
 */
async function mintNFT(
  quest_id: string,
  campaign_id: string,
  user_address: string
): Promise<string> {
  const txb = new Transaction();
  txb.setSender(relayerKeypair.toSuiAddress());

  txb.moveCall({
    target: `${PACKAGE_ID}::core::record_completion_and_mint_nft`,
    arguments: [
      txb.object(RELAYER_CAP_ID),
      txb.pure.string(quest_id),
      txb.pure.string(campaign_id),
      txb.pure.string('OneQuest Badge'),
      txb.pure.string('Quest completed successfully!'),
      txb.object('0x6'),
      txb.pure.address(user_address),
    ],
  });

  // No manual setGasPayment — SDK resolves gas coins automatically (fixes Issue 5)

  const mintResponse = await withRetry(() =>
    suiClient.signAndExecuteTransaction({
      signer: relayerKeypair,
      transaction: txb,
      options: { showEffects: true },
    })
  );

  return mintResponse.digest;
}