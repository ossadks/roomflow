import Link from 'next/link';
import type React from 'react';
import { getProperty, getQrTokens } from '@/lib/properties';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AssetsPage({
  params
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const property = await getProperty(propertyId);
  const qrTokens = await getQrTokens(propertyId);
  const firstToken = qrTokens[0]?.token;

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
            <div style={eyebrowStyle}>Asset Library</div>
            <h1 style={titleStyle}>Property Assets</h1>
            <p style={mutedStyle}>
              Download QR codes, room cards, posters, and launch materials for {property.name}.
            </p>
          </div>

          <span style={badgeStyle}>{qrTokens.length} Assets Ready</span>
        </header>

        <section style={assetGridStyle}>
          <AssetDownloadCard
            title="QR PNG"
            description="Download the first room QR code as a PNG."
            href={firstToken ? `/api/assets/qr/${firstToken}` : '#'}
          />

          <AssetDownloadCard
            title="4x6 QR Card"
            description="Download a printable 4x6 room placement card."
            href={firstToken ? `/api/assets/card-4x6/${firstToken}` : '#'}
          />

          <AssetDownloadCard
            title="8.5x11 Poster"
            description="Download lobby or public area signage."
            href={firstToken ? `/api/assets/poster-8x11/${firstToken}` : '#'}
          />

          <AssetDownloadCard
            title="Full Asset Package"
            description="Download the full property asset ZIP package."
            href={`/api/assets/package/${property.id}`}
          />
        </section>
      </div>
    </main>
  );
}

function AssetDownloadCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div style={assetCardStyle}>
      <div>
        <div style={assetIconStyle}>⬇</div>
        <h2 style={assetTitleStyle}>{title}</h2>
        <p style={assetDescriptionStyle}>{description}</p>
      </div>

      <a href={href} target="_blank" rel="noreferrer" style={buttonStyle}>
        Download
      </a>
    </div>
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

const assetGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 18
};

const assetCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 24,
  padding: 24,
  minHeight: 230,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.04)'
};

const assetIconStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 14,
  background: '#f8fafc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 14
};

const assetTitleStyle: React.CSSProperties = {
  color: '#0f172a',
  margin: 0
};

const assetDescriptionStyle: React.CSSProperties = {
  color: '#64748b',
  lineHeight: 1.5
};

const buttonStyle: React.CSSProperties = {
  background: '#0B102F',
  color: '#ffffff',
  textAlign: 'center',
  padding: '12px 14px',
  borderRadius: 12,
  textDecoration: 'none',
  fontWeight: 900
};