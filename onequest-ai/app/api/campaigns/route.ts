import { NextResponse } from 'next/server';
import { supabase } from '@/lib/client';

export async function GET() {
  try {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // Get quest counts for each campaign
    const campaignsWithCounts = await Promise.all(
      (campaigns || []).map(async (campaign) => {
        const { count } = await supabase
          .from('quests')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id);

        return { ...campaign, quest_count: count || 0 };
      })
    );

    return NextResponse.json({ success: true, campaigns: campaignsWithCounts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
