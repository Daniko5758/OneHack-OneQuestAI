import { NextResponse } from 'next/server';
import { supabase } from '@/lib/client';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (campaignError) throw new Error(campaignError.message);

    // Get quests for this campaign
    const { data: quests, error: questsError } = await supabase
      .from('quests')
      .select('*')
      .eq('campaign_id', id)
      .order('step_number', { ascending: true });

    if (questsError) throw new Error(questsError.message);

    // Parse steps JSON for each quest
    const parsedQuests = (quests || []).map((q: any) => ({
      ...q,
      steps: q.steps ? (typeof q.steps === 'string' ? JSON.parse(q.steps) : q.steps) : [],
    }));

    return NextResponse.json({
      success: true,
      campaign: { ...campaign, quests: parsedQuests },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { admin_address } = body;

    if (!admin_address) {
      return NextResponse.json(
        { success: false, error: 'admin_address is required' },
        { status: 400 }
      );
    }

    // Get campaign to verify ownership
    const { data: campaign, error: fetchError } = await supabase
      .from('campaigns')
      .select('admin_address')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    // Security: only the creator can delete
    if (campaign.admin_address !== admin_address) {
      return NextResponse.json(
        { success: false, error: 'Only the campaign creator can delete this campaign' },
        { status: 403 }
      );
    }

    // Delete quests first (foreign key), then campaign
    await supabase.from('quests').delete().eq('campaign_id', id);
    await supabase.from('submissions').delete().eq('campaign_id', id);
    const { error: deleteError } = await supabase.from('campaigns').delete().eq('id', id);

    if (deleteError) throw new Error(deleteError.message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
