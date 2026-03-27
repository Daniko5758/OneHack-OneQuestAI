import { NextResponse } from 'next/server';
import { supabase } from '@/lib/client';

/**
 * POST /api/campaigns/batch
 * Body: { ids: string[] }
 * Returns campaign id + title for a batch of campaign IDs.
 */
export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ids array is required' },
        { status: 400 }
      );
    }

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('id, title')
      .in('id', ids);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, campaigns: campaigns || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
