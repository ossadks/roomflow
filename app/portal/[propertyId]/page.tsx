import Link from 'next/link';
import {
  getProperty,
  getRooms,
  getQrTokens
} from '@/lib/properties';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PropertyPortal({
  params
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const property = await getProperty(propertyId);
  const rooms = await getRooms(propertyId);

  if (!property) {
    return (
      <main style={pageStyle}>
        <h1>Property not found</h1>
        <Link href="/setup">Back to setup</Link>
      </main>
    );
  }

  const qrTokens = await getQrTokens(propertyId);

  const roomCount = rooms.length;

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={eyebrowStyle}>RoomFlow Portal</div>

          <h1 style={titleStyle}>{property.name}</h1>

          <p style={mutedStyle}>
            {[property.city, property.state].filter(Boolean).join(', ')} ·{' '}
            {property.property_type}
          </p>
        </div>

        <div style={gridStyle}>
          <StatCard label="Rooms / Units" value={String(roomCount)} />
          <StatCard
            label="Monthly Plan"
            value={
              property.monthly_price
                ? `$${property.monthly_price}/month`
                : 'Pending'
            }
          />
          <StatCard label="QR Codes" value={String(qrTokens.length)} />
          <StatCard label="Assets" value="Not Generated" />
        </div>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Property Branding</h2>

          <div style={brandPreviewStyle}>
            <div
              style={{
                background: property.primary_color || '#0B102F',
                padding: 24,
                borderRadius: 20,
                color: '#ffffff'
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 800
                }}
              >
                Guest Appreciation
              </div>

              <h3 style={{ fontSize: 28, margin: '8px 0 4px' }}>
                {property.name}
              </h3>

              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>
                {[property.city, property.state].filter(Boolean).join(', ')}
              </p>
            </div>

            <div>
              <InfoLine label="Primary Color" value={property.primary_color || '—'} />
              <InfoLine label="Accent Color" value={property.accent_color || '—'} />
              <InfoLine label="Property Type" value={property.property_type || '—'} />
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Guest Rooms / Units</h2>

          {roomCount === 0 ? (
            <p style={mutedStyle}>No rooms created yet.</p>
          ) : (
            <div style={roomGridStyle}>
              {rooms.slice(0, 80).map((room: any) => (
                <div key={room.id} style={roomPillStyle}>
                  {room.room_number}
                </div>
              ))}
            </div>
          )}

          {roomCount > 80 && (
            <p style={{ ...mutedStyle, marginTop: 16 }}>
              Showing first 80 of {roomCount} rooms.
            </p>
          )}
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Asset Package</h2>

          <div style={assetGridStyle}>
            <AssetBox title="4x6 QR Card" status="Not generated yet" />
            <AssetBox title="8.5x11 Poster" status="Not generated yet" />
            <AssetBox title="QR PNG" status="Not generated yet" />
          </div>
        </section>

        <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>Guest Links</h2>

            {qrTokens.length === 0 ? (
                <p style={mutedStyle}>No guest links generated.</p>
            ) : (
                <div
                style={{
                    display: 'grid',
                    gap: 12
                }}
                >
                {qrTokens.map((token: any) => (
                    <div
                    key={token.id}
                    style={{
                        padding: 16,
                        borderRadius: 16,
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc'
                    }}
                    >
                    <div
                        style={{
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: 8
                        }}
                    >
                        {token.rooms?.room_number || 'Property'}
                    </div>

                    <div
                        style={{
                        color: '#64748b',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                        }}
                    >
                        {`https://roomflowhq.com/g/${token.token}`}
                    </div>
                    </div>
                ))}
                </div>
            )}
            </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Reports</h2>
          <p style={mutedStyle}>
            Tip activity, summary reports, and CSV exports will appear here after
            tips are processed.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Next Steps</h2>

          <ul style={{ color: '#475569', lineHeight: 1.8 }}>
            <li>Generate QR tokens for each room/unit</li>
            <li>Create guest links for each QR code</li>
            <li>Generate printable 4x6 and 8.5x11 assets</li>
            <li>Build tip activity dashboard and CSV export</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={statCardStyle}>
      <div style={mutedSmallStyle}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a' }}>
        {value}
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 0',
        gap: 16
      }}
    >
      <span style={{ color: '#64748b' }}>{label}</span>
      <strong style={{ color: '#0f172a' }}>{value}</strong>
    </div>
  );
}

function AssetBox({ title, status }: { title: string; status: string }) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 18,
        padding: 18,
        background: '#f8fafc'
      }}
    >
      <strong style={{ color: '#0f172a' }}>{title}</strong>
      <p style={{ color: '#64748b', marginBottom: 0 }}>{status}</p>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f8fafc',
  padding: '36px 18px',
  fontFamily: 'Inter, system-ui, sans-serif'
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 13,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#64748b',
  fontWeight: 800
};

const titleStyle: React.CSSProperties = {
  fontSize: 42,
  color: '#0f172a',
  margin: '8px 0 6px'
};

const mutedStyle: React.CSSProperties = {
  color: '#64748b',
  margin: 0
};

const mutedSmallStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 13,
  fontWeight: 700,
  marginBottom: 8
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 16,
  marginBottom: 22
};

const statCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 20,
  padding: 20,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.04)'
};

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 24,
  padding: 24,
  marginBottom: 22,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.04)'
};

const sectionTitleStyle: React.CSSProperties = {
  color: '#0f172a',
  marginTop: 0
};

const brandPreviewStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 22,
  alignItems: 'start'
};

const roomGridStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10
};

const roomPillStyle: React.CSSProperties = {
  padding: '9px 12px',
  borderRadius: 999,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  color: '#0f172a',
  fontWeight: 700
};

const assetGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 14
};