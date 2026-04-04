import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export default async function Page({ params }: any) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { token } = params;

  const { data, error } = await supabase
    .from('qr_tokens')
    .select(`
      room_id,
      rooms (
        id,
        property_id,
        properties (
          id,
          name
        )
      )
    `)
    .eq('token', token)
    .single();

  if (error || !data) {
    return <div>Invalid QR Code</div>;
  }

  redirect(`/tip?room_id=${data.room_id}&token=${token}`);
}