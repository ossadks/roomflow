import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getPropertyReport(propertyId: string) {
  const { data, error } = await supabase
    .from('tips')
    .select(`
      id,
      property_id,
      room_id,
      amount,
      currency,
      guest_note,
      stripe_session_id,
      stripe_payment_intent_id,
      created_at,
      rooms (
        id,
        room_number
      )
    `)
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getPropertyReport error:', error);
    return {
      tips: [],
      totalTips: 0,
      totalTransactions: 0,
      averageTip: 0,
      largestTip: 0
    };
  }

  const tips = data || [];

  const totalTransactions = tips.length;

  const totalTips = tips.reduce((sum: number, tip: any) => {
    return sum + Number(tip.amount || 0);
  }, 0);

  const averageTip =
    totalTransactions > 0 ? totalTips / totalTransactions : 0;

  const largestTip =
    tips.length > 0
      ? Math.max(...tips.map((tip: any) => Number(tip.amount || 0)))
      : 0;

  return {
    tips,
    totalTips,
    totalTransactions,
    averageTip,
    largestTip
  };
}

export async function getRoomLeaderboard(propertyId: string) {
    const { data, error } = await supabase
        .from('tips')
        .select(`
        amount,
        room_id,
        rooms (
            id,
            room_number
        )
        `)
        .eq('property_id', propertyId);

    if (error) {
        console.error('getRoomLeaderboard error:', error);
        return [];
    }

    const totals = new Map<string, number>();

    for (const tip of data || []) {
        const roomNumber =
        (tip as any).rooms?.room_number || 'Property';

        const current = totals.get(roomNumber) || 0;

        totals.set(
        roomNumber,
        current + Number((tip as any).amount || 0)
        );
    }

    return Array.from(totals.entries())
        .map(([room, total]) => ({
        room,
        total
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
}