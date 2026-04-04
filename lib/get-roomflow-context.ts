import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { RoomFlowContext } from '@/lib/types';

export async function getRoomFlowContextByToken(token: string): Promise<RoomFlowContext | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('qr_tokens')
    .select(`
      token,
      is_active,
      rooms!inner (
        id,
        room_number,
        staff_name,
        properties!inner (
          id,
          name,
          city,
          state,
          logo_url,
          primary_color,
          accent_color,
          welcome_message,
          thank_you_message,
          tip_preset_1,
          tip_preset_2,
          tip_preset_3
        )
      )
    `)
    .eq('token', token)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  const room = Array.isArray(data.rooms) ? data.rooms[0] : data.rooms;
  const property = Array.isArray(room.properties) ? room.properties[0] : room.properties;

  return {
    token,
    roomId: room.id,
    roomNumber: room.room_number,
    staffName: room.staff_name,
    property
  };
}
