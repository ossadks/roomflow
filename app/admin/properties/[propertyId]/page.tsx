import { createServerSupabaseClient } from '@/lib/supabase-server';
import { currency } from '@/lib/format';

export default async function PropertyAdminPage({
  params
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const supabase = createServerSupabaseClient();

  const [{ data: property }, { data: tips }, { count: roomCount }] = await Promise.all([
    supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single(),
    supabase
      .from('tips')
      .select('id, amount, created_at, room_id')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId)
  ]);

  if (!property) {
    return (
      <main style={{ padding: 32, fontFamily: 'Arial, sans-serif' }}>
        <h1>Property not found</h1>
      </main>
    );
  }

  const totalTips = (tips ?? []).reduce((sum, tip) => sum + Number(tip.amount), 0);

  return (
    <main style={{ padding: 32, fontFamily: 'Arial, sans-serif' }}>
      <h1>{property.name}</h1>
      <p>{[property.city, property.state].filter(Boolean).join(', ')}</p>

      <section style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', margin: '24px 0' }}>
        <div style={{ padding: 16, border: '1px solid #cbd5e1', borderRadius: 16 }}>
          <div style={{ color: '#64748b' }}>Rooms</div>
          <strong>{roomCount ?? 0}</strong>
        </div>
        <div style={{ padding: 16, border: '1px solid #cbd5e1', borderRadius: 16 }}>
          <div style={{ color: '#64748b' }}>Recent tips</div>
          <strong>{tips?.length ?? 0}</strong>
        </div>
        <div style={{ padding: 16, border: '1px solid #cbd5e1', borderRadius: 16 }}>
          <div style={{ color: '#64748b' }}>Recent tip volume</div>
          <strong>{currency(totalTips)}</strong>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Branding</h2>
        <ul>
          <li>Primary color: {property.primary_color}</li>
          <li>Accent color: {property.accent_color}</li>
          <li>Welcome: {property.welcome_message}</li>
          <li>Thank-you: {property.thank_you_message}</li>
          <li>Tip presets: ${property.tip_preset_1}, ${property.tip_preset_2}, ${property.tip_preset_3}</li>
        </ul>
      </section>

      <section>
        <h2>Latest tips</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {tips?.map((tip) => (
            <div key={tip.id} style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 12 }}>
              <strong>{currency(Number(tip.amount))}</strong>
              <div style={{ color: '#64748b' }}>{new Date(tip.created_at).toLocaleString()}</div>
              <div style={{ color: '#475569' }}>Room ID: {tip.room_id}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
