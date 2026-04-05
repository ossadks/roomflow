import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { RoomFlowContext } from '@/lib/types';

export async function getRoomFlowContextByToken(
  token: string
): Promise<RoomFlowContext | null> {
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
        cleaner_name,
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
          tip_preset_3,
          property_type
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
  const property = Array.isArray(room.properties)
    ? room.properties[0]
    : room.properties;

  return {
    token,
    roomId: room.id,
    roomNumber: room.room_number,
    staffName: room.cleaner_name || room.staff_name || null,
    property: {
      id: property.id,
      name: property.name,
      city: property.city,
      state: property.state,
      logo_url: property.logo_url,
      primary_color: property.primary_color,
      accent_color: property.accent_color,
      welcome_message: property.welcome_message,
      thank_you_message: property.thank_you_message,
      tip_preset_1: property.tip_preset_1,
      tip_preset_2: property.tip_preset_2,
      tip_preset_3: property.tip_preset_3,
      property_type: property.property_type
    }
  };
}
