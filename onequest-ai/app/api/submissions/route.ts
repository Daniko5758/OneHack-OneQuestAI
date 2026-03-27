import { NextResponse } from 'next/server';
import { supabase } from '@/lib/client';

/**
 * GET /api/submissions?campaign_id=X&user_address=Y
 * Returns all completed submissions for a user in a campaign.
 * Used by the frontend to determine quest completion / lock state.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const campaign_id = searchParams.get('campaign_id');
    const user_address = searchParams.get('user_address');

    if (!campaign_id || !user_address) {
      return NextResponse.json(
        { success: false, error: 'campaign_id and user_address are required' },
        { status: 400 }
      );
    }

    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('quest_id, status, exp_earned')
      .eq('campaign_id', campaign_id)
      .eq('user_address', user_address)
      .eq('status', 'completed');

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, submissions: submissions || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
