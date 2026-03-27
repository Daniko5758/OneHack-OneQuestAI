import { NextResponse } from 'next/server';
import { supabase } from '@/lib/client';

export async function GET() {
  try {
    // Query submissions grouped by user, sum EXP, order by total desc
    const { data, error } = await supabase
      .from('submissions')
      .select('user_address, exp_earned')
      .eq('status', 'completed');

    if (error) throw new Error(error.message);

    // Aggregate EXP per user
    const userMap: Record<string, { total_exp: number; quest_count: number }> = {};
    for (const row of data || []) {
      if (!userMap[row.user_address]) {
        userMap[row.user_address] = { total_exp: 0, quest_count: 0 };
      }
      userMap[row.user_address].total_exp += row.exp_earned || 0;
      userMap[row.user_address].quest_count += 1;
    }

    // Convert to sorted array
    const leaderboard = Object.entries(userMap)
      .map(([address, stats]) => ({
        address,
        total_exp: stats.total_exp,
        quest_count: stats.quest_count,
      }))
      .sort((a, b) => b.total_exp - a.total_exp)
      .slice(0, 50); // Top 50

    return NextResponse.json({ success: true, leaderboard });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
