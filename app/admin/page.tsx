import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export default async function AdminPage() {
  const supabase = createServerSupabaseClient();
  const { data: properties } = await supabase
    .from('properties')
    .select('id, name, city, state, is_active')
    .order('created_at', { ascending: false });

  return (
    <main style={{ padding: 32, fontFamily: 'Arial, sans-serif' }}>
      <h1>RoomFlow Admin</h1>
      <p>Select a property to review branding and tip activity.</p>
      <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
        {properties?.map((property) => (
          <Link
            key={property.id}
            href={`/admin/properties/${property.id}`}
            style={{
              display: 'block',
              padding: 16,
              borderRadius: 16,
              border: '1px solid #cbd5e1',
              textDecoration: 'none',
              color: '#0f172a'
            }}
          >
            <strong>{property.name}</strong>
            <div>{[property.city, property.state].filter(Boolean).join(', ')}</div>
            <div>{property.is_active ? 'Active' : 'Inactive'}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
