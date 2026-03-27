import { NextResponse } from 'next/server';
import { supabase } from '@/lib/client';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: quest, error } = await supabase
      .from('quests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    // Parse steps JSON
    const parsedQuest = {
      ...quest,
      steps: quest.steps ? (typeof quest.steps === 'string' ? JSON.parse(quest.steps) : quest.steps) : [],
    };

    // Get campaign info
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', quest.campaign_id)
      .single();

    // Get total quest count for this campaign
    const { count } = await supabase
      .from('quests')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', quest.campaign_id);

    return NextResponse.json({
      success: true,
      quest: parsedQuest,
      campaign,
      total_quests: count || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
