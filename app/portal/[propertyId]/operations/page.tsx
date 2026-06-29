import Link from 'next/link';
import type React from 'react';
import { getProperty, getQrTokens } from '@/lib/properties';
import RoomQRLookup from '@/components/RoomQRLookup';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OperationsPage({
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

  const firstToken = qrTokens[0]?.token;

  return (
    <main style={pageStyle}>
      <aside style={sidebarStyle}>
        <img src="/roomflow-logo.png" alt="RoomFlow" style={sidebarLogoStyle} />

        <nav style={navStyle}>
          <NavItem label="Dashboard" href={`/portal/${property.id}`} />
          <NavItem label="Operations" href={`/portal/${property.id}/operations`} active />
          <NavItem label="Reports" href={`/portal/${property.id}#reports`} />
          <NavItem label="Billing" href={`/portal/${property.id}#billing`} />
          <NavItem label="Resources" href={`/portal/${property.id}#resources`} />
        </nav>
      </aside>

      <section style={contentStyle}>
        <header style={topBarStyle}>
          <div>
            <div style={eyebrowStyle}>Operations</div>
            <h1 style={titleStyle}>{property.name}</h1>
            <p style={mutedStyle}>
              Manage room QR links, guest tipping pages, and downloadable property assets.
            </p>
          </div>

          <span style={badgeStyle}>{qrTokens.length} QR Codes</span>
        </header>

        <section style={gridStyle}>
          <div style={summaryCardStyle}>
            <div style={summaryLabelStyle}>Active QR Codes</div>
            <div style={summaryValueStyle}>{qrTokens.length}</div>
          </div>

          <div style={summaryCardStyle}>
            <div style={summaryLabelStyle}>Property Status</div>
            <div style={summaryValueStyle}>
              {property.status === 'active' ? 'Live' : 'Pilot'}
            </div>
          </div>

          <div style={summaryCardStyle}>
            <div style={summaryLabelStyle}>Assets</div>
            <div style={summaryValueStyle}>Ready</div>
          </div>
        </section>

        <section style={cardStyle}>
          <RoomQRLookup qrTokens={qrTokens} />
        </section>

        <section style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Property Assets</h2>
              <p style={mutedStyle}>
                Download property-wide QR materials, signage, and launch assets.
              </p>
            </div>
          </div>

          <div style={assetGridStyle}>
            <AssetDownloadCard
              title="QR PNG"
              description="Download the first available room QR code."
              href={firstToken ? `/api/assets/qr/${firstToken}` : '#'}
            />

            <AssetDownloadCard
              title="4x6 Room Card"
              description="Printable room placement card."
              href={firstToken ? `/api/assets/card-4x6/${firstToken}` : '#'}
            />

            <AssetDownloadCard
              title="8.5x11 Poster"
              description="Lobby, elevator, or public-area signage."
              href={firstToken ? `/api/assets/poster-8x11/${firstToken}` : '#'}
            />

            <AssetDownloadCard
              title="Full Asset Package"
              description="Download the full ZIP package for this property."
              href={`/api/assets/package/${property.id}`}
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function NavItem({
  label,
  href,
  active = false
}: {
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <a href={href} style={active ? navItemActiveStyle : navItemStyle}>
      <span>{active ? '▸' : '•'}</span>
      <span>{label}</span>
    </a>
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
        <h3 style={assetTitleStyle}>{title}</h3>
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
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  fontFamily: 'Inter, system-ui, sans-serif'
};

const sidebarStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, #020617 0%, #0B102F 100%)',
  color: '#ffffff',
  padding: 28,
  position: 'sticky',
  top: 0,
  height: '100vh'
};

const sidebarLogoStyle: React.CSSProperties = {
  width: 220,
  height: 'auto',
  display: 'block',
  margin: '0 auto 54px'
};

const navStyle: React.CSSProperties = {
  display: 'grid',
  gap: 10
};

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  alignItems: 'center',
  padding: '13px 14px',
  borderRadius: 14,
  color: '#cbd5e1',
  fontWeight: 800,
  textDecoration: 'none'
};

const navItemActiveStyle: React.CSSProperties = {
  ...navItemStyle,
  background: 'rgba(212, 175, 55, 0.14)',
  color: '#D4AF37',
  border: '1px solid rgba(212, 175, 55, 0.28)'
};

const contentStyle: React.CSSProperties = {
  padding: 32,
  maxWidth: 1280,
  width: '100%',
  margin: '0 auto'
};

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 20,
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
  fontSize: 42,
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

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
  marginBottom: 22
};

const summaryCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 20,
  padding: 22,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.04)'
};

const summaryLabelStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 13,
  fontWeight: 800,
  marginBottom: 8
};

const summaryValueStyle: React.CSSProperties = {
  color: '#0f172a',
  fontSize: 30,
  fontWeight: 900
};

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 24,
  padding: 24,
  marginBottom: 22,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.04)'
};

const cardHeaderStyle: React.CSSProperties = {
  marginBottom: 18
};

const sectionTitleStyle: React.CSSProperties = {
  color: '#0f172a',
  marginTop: 0,
  marginBottom: 8
};

const assetGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 16
};

const assetCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 20,
  padding: 20,
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: 210
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