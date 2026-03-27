import { NextResponse } from 'next/server';
import { suiClient, supabase } from '@/lib/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaign_id, admin_address, title, description, difficulty, quests, digest } = body;

    if (!digest) {
      return NextResponse.json(
        { success: false, error: 'On-chain payment digest is required' },
        { status: 400 }
      );
    }

    // 1. Verify the on-chain payment transaction via OneChain RPC
    const tx = await suiClient.getTransactionBlock({
      digest,
      options: { showEffects: true, showInput: true },
    });

    if (tx.effects?.status.status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'On-chain payment transaction failed' },
        { status: 400 }
      );
    }

    if (tx.transaction?.data.sender !== admin_address) {
      return NextResponse.json(
        { success: false, error: 'Transaction sender does not match admin address' },
        { status: 400 }
      );
    }

    // 2. Save campaign to Supabase (only after payment is verified)
    const { error: campaignError } = await supabase
      .from('campaigns')
      .insert([{
        id: campaign_id,
        admin_address,
        title,
        description: description || '',
        difficulty: difficulty || 'Easy',
        status: 'active',
        tx_digest: digest,
      }]);

    if (campaignError) throw new Error(campaignError.message);

    // 3. Save quests (with steps as JSON)
    const questsData = quests.map((q: any) => ({
      campaign_id,
      step_number: q.step_number,
      title: q.title,
      description: q.description,
      steps: JSON.stringify(q.steps || []),
      proof_type: q.proof_type,
    }));

    const { error: questError } = await supabase.from('quests').insert(questsData);

    if (questError) throw new Error(questError.message);

    return NextResponse.json({ success: true, verified: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}