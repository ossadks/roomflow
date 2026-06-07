import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getProperty(propertyId: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (error) {
    console.error('getProperty error:', error);
    return null;
  }

  return data;
}

export async function getRooms(propertyId: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', propertyId)
    .order('room_number', { ascending: true });

  if (error) {
    console.error('getRooms error:', error);
    return [];
  }

  return data || [];
}

export async function getQrTokens(propertyId: string) {
  const { data, error } = await supabase
    .from('qr_tokens')
    .select(`
      id,
      token,
      room_id,
      rooms (
        id,
        room_number,
        property_id
      )
    `);

  if (error) {
    console.error('getQrTokens error:', error);
    return [];
  }

  return (
    data?.filter(
      (row: any) => row.rooms?.property_id === propertyId
    ) || []
  );
}