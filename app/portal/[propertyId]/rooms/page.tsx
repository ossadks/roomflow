import Link from 'next/link';
import type React from 'react';
import { getProperty, getQrTokens } from '@/lib/properties';
import RoomQRLookup from '@/components/RoomQRLookup';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RoomManagerPage({
  params
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const property = await getProperty(propertyId);
  const qrTokens = await getQrTokens(propertyId);

  if (!property) {
    return (
      <main style={pageStyle}>
        <h1>Property not found</h1>
        <Link href="/setup">Back to setup</Link>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <Link href={`/portal/${property.id}`} style={backLinkStyle}>
          ← Back to Dashboard
        </Link>

        <header style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>Rooms & QR Codes</div>
            <h1 style={titleStyle}>Room Manager</h1>
            <p style={mutedStyle}>
              Manage guest links, QR codes, and room-specific assets for {property.name}.
            </p>
          </div>

          <span style={badgeStyle}>{qrTokens.length} QR Codes</span>
        </header>

        <section style={cardStyle}>
          <RoomQRLookup qrTokens={qrTokens} />
        </section>
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f8fafc',
  padding: 32,
  fontFamily: 'Inter, system-ui, sans-serif'
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: '0 auto'
};

const backLinkStyle: React.CSSProperties = {
  color: '#0B102F',
  fontWeight: 900,
  textDecoration: 'none'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 20,
  marginTop: 24,
  marginBottom: 24
};

const eyebrowStyle: React.CSSProperties = {
  color: '#D4AF37',
  fontSize: 13,
  fontWeight: 900,
  letterSpacing: '.14em',
  textTransform: 'uppercase'
};

const titleStyle: React.CSSProperties = {
  color: '#0f172a',
  fontSize: 44,
  margin: '8px 0'
};

const mutedStyle: React.CSSProperties = {
  color: '#64748b',
  margin: 0
};

const badgeStyle: React.CSSProperties = {
  background: '#dcfce7',
  color: '#166534',
  padding: '8px 12px',
  borderRadius: 999,
  fontWeight: 900
};

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.04)'
};