import Link from 'next/link';
import type React from 'react';
import {
  getProperty,
  getRooms,
  getQrTokens
} from '@/lib/properties';
import { getPropertyReport, getRoomLeaderboard } from '@/lib/reports';

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
      <main style={fallbackPageStyle}>
        <h1>Property not found</h1>
        <Link href="/setup">Back to setup</Link>
      </main>
    );
  }

  const qrTokens = await getQrTokens(propertyId);
  const report = await getPropertyReport(propertyId);
  const leaderboard = await getRoomLeaderboard(propertyId);

  const roomCount = rooms.length;
  const firstToken = qrTokens[0]?.token;
  const isLive = property.status === 'active';
  const stripeConnected = property.stripe_onboarding_complete === true;

  const monthlyPlanLabel = property.monthly_price
    ? `$${property.monthly_price}/month`
    : property.status === 'pilot'
      ? 'Pilot'
      : 'Pending';

  const propertyTypeLabel =
    property.property_type === 'hotel'
      ? 'Hotel'
      : property.property_type === 'str'
        ? 'STR / Vacation Rental'
        : property.property_type || 'Property';

  const lastTip = report.tips?.[0];

  const setupProgressItems = [
    { label: 'Property Created', complete: Boolean(property.id) },
    { label: 'Stripe Connected', complete: stripeConnected },
    { label: 'Rooms Generated', complete: roomCount > 0 },
    { label: 'QR Codes Generated', complete: qrTokens.length > 0 },
    { label: 'Property Live', complete: isLive },
    { label: 'First Tip Received', complete: report.tips.length > 0 }
  ];

  return (
    <main style={portalShellStyle}>
      <aside style={sidebarStyle}>
        <img
          src="/roomflow-logo.png"
          alt="RoomFlow"
          style={sidebarLogoStyle}
        />

        <nav style={navStyle}>
          <NavItem label="Dashboard" href={`/portal/${property.id}`} active />
          <NavItem label="Operations" href={`/portal/${property.id}/operations`} />
          <NavItem label="Reports" href="#reports" />
          <NavItem label="Billing" href="#billing" />
          <NavItem label="Resources" href="#resources" />
        </nav>
      </aside>

      <section style={portalContentStyle}>
        <header style={topBarStyle}>
          <div>
            <div style={topBarEyebrowStyle}>RoomFlow Portal</div>
            <h1 style={topBarTitleStyle}>{property.name}</h1>
          </div>

          <div style={propertyIdentityStyle}>
            <div style={propertyAvatarStyle}>
              {property.name
                .split(' ')
                .map((word: string) => word[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <div style={propertyIdentityNameStyle}>{property.name}</div>
              <div style={propertyIdentityLocationStyle}>
                {property.city}, {property.state}
              </div>
            </div>
          </div>
        </header>
        <section id="dashboard" style={propertyHeroStyle}>
          <div>
            <div style={heroEyebrowStyle}>PROPERTY STATUS</div>

            <h1 style={heroTitleStyle}>
              {isLive ? 'Live Property' : 'Pilot Property'}
              <span style={isLive ? liveDotStyle : pilotDotStyle} />
            </h1>

            <div style={heroMetaGridStyle}>
              <HeroMeta label="Rooms" value={`${roomCount} Active Rooms`} />

              <HeroMeta
                label="QR Codes"
                value={`${qrTokens.length} Generated`}
              />

              <HeroMeta label="Monthly Plan" value={monthlyPlanLabel} />
            </div>
          </div>
        </section>

        <section style={v2GridStyle}>
          <section style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={sectionTitleStyle}>Property Overview</h2>
              <span style={isLive ? connectedBadgeStyle : pendingBadgeStyle}>
                {isLive ? 'Live' : 'Pilot'}
              </span>
            </div>

            <OverviewRow label="Property Name" value={property.name} />
            <OverviewRow
              label="Location"
              value={`${property.city}, ${property.state}`}
            />
            <OverviewRow label="Property Type" value={propertyTypeLabel} />
            <OverviewRow label="Launch Mode" value={isLive ? 'Active' : 'Pilot'} />
            <OverviewRow
              label="Stripe"
              value={stripeConnected ? 'Connected' : 'Pending'}
            />
            <a
                href={`/portal/${property.id}/details`}
                style={propertyDetailsButtonStyle}
              >
               <Link
                  href={`/portal/${property.id}/documents`}
                  style={propertyDetailsButtonStyle}
                >
                  Property Documents
                </Link>
              </a>
          </section>

          <section style={cardStyle}>
            <h2 style={sectionTitleStyle}>Setup Progress</h2>

            <div style={progressListStyle}>
              {setupProgressItems.map((item) => (
                <ProgressItem
                  key={item.label}
                  label={item.label}
                  complete={item.complete}
                />
              ))}
            </div>
          </section>

          <section id="billing" style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={sectionTitleStyle}>Billing & Payouts</h2>

              <span style={stripeConnected ? connectedBadgeStyle : pendingBadgeStyle}>
                {stripeConnected ? 'Stripe Connected' : 'Pending'}
              </span>
            </div>

            <OverviewRow label="Monthly Plan" value={monthlyPlanLabel} />
            <OverviewRow
              label="Payout Status"
              value={stripeConnected ? 'Enabled' : 'Pending'}
            />
            <OverviewRow label="Payout Schedule" value="Weekly" />
            <OverviewRow label="Last Payout" value="—" />

           {/* Hide until billing portal is wired */}
           {false && (
            <div style={billingActionRowStyle}>
              <a href="/billing" style={billingPrimaryButtonStyle}>
                Manage Subscription
              </a>

              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noreferrer"
                style={billingSecondaryButtonStyle}
              >
                View Payouts
              </a>
            </div>
           )}
          </section>
        </section>

        <section style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Operations</h2>
              <p style={mutedStyle}>
                Manage room QR links, guest tipping pages, and downloadable property assets.
              </p>
            </div>
          </div>

          <div style={operationsCardStyle}>
            <div>
              <h3 style={operationsTitleStyle}>Room & Asset Manager</h3>
              <p style={operationsDescriptionStyle}>
                Search rooms, copy guest links, download QR codes, and access property asset packages.
              </p>
            </div>

            <a
              href={`/portal/${property.id}/operations`}
              style={operationsButtonStyle}
            >
              Open Operations
            </a>
          </div>
        </section>

        <section id="reports" style={cardStyle}>
          <h2 style={sectionTitleStyle}>Reports</h2>

          {report.tips.length === 0 ? (
            <p style={mutedStyle}>
              No tip activity yet. Completed tips will appear here once guests begin tipping.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b' }}>
                    <th style={tableHeaderStyle}>Date</th>
                    <th style={tableHeaderStyle}>Room / Unit</th>
                    <th style={tableHeaderStyle}>Amount</th>
                    <th style={tableHeaderStyle}>Guest Note</th>
                  </tr>
                </thead>

                <tbody>
                  {report.tips.slice(0, 25).map((tip: any) => (
                    <tr key={tip.id}>
                      <td style={tableCellStyle}>
                        {new Date(tip.created_at).toLocaleDateString()}
                      </td>
                      <td style={tableCellStyle}>
                        {tip.rooms?.room_number || 'Property'}
                      </td>
                      <td style={tableCellStyle}>
                        {formatMoney(Number(tip.amount || 0))}
                      </td>
                      <td style={tableCellStyle}>{tip.guest_note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <a
                href={`/api/reports/export/${property.id}`}
                target="_blank"
                rel="noreferrer"
                style={primaryLinkButtonStyle}
              >
                Export CSV
              </a>
            </div>
          )}
        </section>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Top Performing Rooms</h2>

          {leaderboard.length === 0 ? (
            <p style={mutedStyle}>No tip activity available yet.</p>
          ) : (
            <div style={topRoomStyle}>
              <div style={topRoomIconStyle}>🏆</div>
              <div style={topRoomLabelStyle}>Top Performing Room</div>
              <div style={topRoomNameStyle}>Room {leaderboard[0].room}</div>
              <div style={topRoomAmountStyle}>
                {formatMoney(leaderboard[0].total)} Total Tips
              </div>
            </div>
          )}
        </section>

        <section id="resources" style={cardStyle}>
          <div style={resourceHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Resource Center</h2>
              <p style={mutedStyle}>
                Access setup materials, support, and property resources.
              </p>
            </div>
          </div>

          <div style={resourceGridStyle}>
            <ResourceCard
              title="Setup Guide"
              description="Step-by-step instructions for launching RoomFlow at your property."
              actionLabel="View Guide"
              href={`/setup-guide?back=/portal/${property.id}#resources`}
            />

            <ResourceCard
              title="FAQ"
              description="Answers to common billing, QR, payout, and setup questions."
              actionLabel="View FAQ"
              href={`/faq?back=/portal/${property.id}#resources`}
            />

            <ResourceCard
              title="Support"
              description="Need help? Contact RoomFlow support for setup or billing help."
              actionLabel="Contact"
              href="mailto:info@roomflowhq.com"
            />

            <ResourceCard
              title="Terms"
              description="View the RoomFlow Terms of Service."
              actionLabel="View Terms"
              href={`/terms?back=/portal/${property.id}#resources`}
            />

            <ResourceCard
              title="Privacy"
              description="View the RoomFlow Privacy Policy."
              actionLabel="View Privacy"
              href={`/privacy?back=/portal/${property.id}#resources`}
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

function HeroMeta({ label, value }: { label: string; value: string }) {
  return (
    <div style={heroMetaStyle}>
      <div style={heroMetaLabelStyle}>{label}</div>
      <div style={heroMetaValueStyle}>{value}</div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={statCardStyle}>
      <div style={mutedSmallStyle}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 900, color: '#0f172a' }}>
        {value}
      </div>
    </div>
  );
}

function OverviewRow({
  label,
  value
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div style={overviewRowStyle}>
      <span style={overviewLabelStyle}>{label}</span>
      <strong style={overviewValueStyle}>{value || '—'}</strong>
    </div>
  );
}

function ProgressItem({
  label,
  complete
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div style={progressItemStyle}>
      <span style={complete ? progressCompleteStyle : progressPendingStyle}>
        {complete ? '✓' : '○'}
      </span>
      <span>{label}</span>
    </div>
  );
}

function AssetCard({
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
        <div style={assetTitleStyle}>{title}</div>
        <div style={assetDescriptionStyle}>{description}</div>
      </div>

      <a href={href} target="_blank" rel="noreferrer" style={assetButtonStyle}>
        Download
      </a>
    </div>
  );
}

function ResourceCard({
  title,
  description,
  actionLabel,
  href
}: {
  title: string;
  description: string;
  actionLabel: string;
  href?: string;
}) {
  return (
    <div style={resourceCardStyle}>
      <div>
        <div style={resourceIconStyle}>↗</div>
        <h3 style={resourceTitleStyle}>{title}</h3>
        <p style={resourceDescriptionStyle}>{description}</p>
      </div>

      {href ? (
        <a
          href={href}
          style={resourceActionStyle}
          target={href.startsWith('mailto:') || href.startsWith('#') ? undefined : '_blank'}
          rel={href.startsWith('mailto:') || href.startsWith('#') ? undefined : 'noreferrer'}
        >
          {actionLabel}
        </a>
      ) : (
        <span style={resourceDisabledStyle}>{actionLabel}</span>
      )}
    </div>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

const fallbackPageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f8fafc',
  padding: '36px 18px',
  fontFamily: 'Inter, system-ui, sans-serif'
};

const portalShellStyle: React.CSSProperties = {
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
  height: '100vh',
  overflowY: 'auto'
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

const portalContentStyle: React.CSSProperties = {
  padding: 32,
  maxWidth: 1280,
  width: '100%',
  margin: '0 auto'
};

const propertyHeroStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #050816 0%, #0B102F 55%, #111827 100%)',
  color: '#ffffff',
  borderRadius: 28,
  padding: '38px 42px',
  marginBottom: 24,
  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)'
};

const heroEyebrowStyle: React.CSSProperties = {
  color: '#D4AF37',
  fontSize: 13,
  fontWeight: 900,
  letterSpacing: '.14em',
  marginBottom: 10
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: 48,
  lineHeight: 1,
  margin: 0,
  fontWeight: 900,
  display: 'flex',
  alignItems: 'center',
  gap: 12
};

const liveDotStyle: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: 999,
  background: '#22c55e',
  display: 'inline-block'
};

const pilotDotStyle: React.CSSProperties = {
  ...liveDotStyle,
  background: '#D4AF37'
};

const heroMetaGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: 18,
  marginTop: 28
};

const heroMetaStyle: React.CSSProperties = {
  borderLeft: '1px solid rgba(255,255,255,.22)',
  paddingLeft: 18
};

const heroMetaLabelStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,.65)',
  fontSize: 13,
  fontWeight: 800,
  marginBottom: 6
};

const heroMetaValueStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: 17,
  fontWeight: 900
};

const dashboardGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
  marginBottom: 18
};

const v2GridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: 18,
  marginBottom: 18
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
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  marginBottom: 12
};

const sectionTitleStyle: React.CSSProperties = {
  color: '#0f172a',
  marginTop: 0,
  marginBottom: 12
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

const statCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 20,
  padding: 22,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.04)'
};

const overviewRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 18,
  padding: '12px 0',
  borderBottom: '1px solid #e2e8f0'
};

const overviewLabelStyle: React.CSSProperties = {
  color: '#64748b',
  fontWeight: 800
};

const overviewValueStyle: React.CSSProperties = {
  color: '#0f172a',
  textAlign: 'right'
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

const connectedBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 12px',
  borderRadius: 999,
  background: '#dcfce7',
  color: '#166534',
  fontWeight: 900,
  fontSize: 13
};

const pendingBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 12px',
  borderRadius: 999,
  background: '#fef3c7',
  color: '#92400e',
  fontWeight: 900,
  fontSize: 13
};

const lightBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 12px',
  borderRadius: 999,
  background: '#f8fafc',
  color: '#0f172a',
  border: '1px solid #e2e8f0',
  fontWeight: 900,
  fontSize: 13
};

const progressListStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12
};

const progressItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: 12,
  borderRadius: 14,
  background: '#f8fafc',
  fontWeight: 800,
  color: '#0f172a'
};

const progressCompleteStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 999,
  background: '#dcfce7',
  color: '#166534',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 900
};

const progressPendingStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 999,
  background: '#fef3c7',
  color: '#92400e',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 900
};

const assetGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 16
};

const assetCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 18,
  padding: 20,
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: 150
};

const assetTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: '#0f172a'
};

const assetDescriptionStyle: React.CSSProperties = {
  marginTop: 8,
  color: '#64748b',
  fontSize: 14,
  lineHeight: 1.5
};

const assetButtonStyle: React.CSSProperties = {
  marginTop: 18,
  textAlign: 'center',
  textDecoration: 'none',
  background: '#0B102F',
  color: '#ffffff',
  padding: '10px 14px',
  borderRadius: 12,
  fontWeight: 800
};

const resourceHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 16,
  marginBottom: 18
};

const resourceGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 14
};

const resourceCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 18,
  padding: 18,
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: 180,
  boxShadow: '0 8px 22px rgba(15, 23, 42, 0.04)'
};

const resourceIconStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 12,
  background: '#f8fafc',
  color: '#0B102F',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 900,
  marginBottom: 12
};

const resourceTitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#0f172a',
  fontSize: 17,
  fontWeight: 900
};

const resourceDescriptionStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 14,
  lineHeight: 1.45,
  marginTop: 8,
  marginBottom: 18
};

const resourceActionStyle: React.CSSProperties = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 14px',
  borderRadius: 12,
  background: '#0B102F',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 900,
  fontSize: 13
};

const resourceDisabledStyle: React.CSSProperties = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 14px',
  borderRadius: 12,
  background: '#e2e8f0',
  color: '#64748b',
  fontWeight: 900,
  fontSize: 13
};

const guestLinkGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 14
};

const guestLinkCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 18,
  padding: 18,
  background: '#ffffff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 14
};

const guestLinkRoomStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  color: '#0f172a'
};

const guestLinkLabelStyle: React.CSSProperties = {
  marginTop: 4,
  color: '#64748b',
  fontSize: 13,
  fontWeight: 700
};

const guestLinkButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 12,
  background: '#0B102F',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 800,
  fontSize: 13
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14
};

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px 10px',
  borderBottom: '1px solid #e2e8f0',
  fontWeight: 800
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px 10px',
  borderBottom: '1px solid #e2e8f0',
  color: '#0f172a'
};

const primaryLinkButtonStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: 18,
  padding: '12px 15px',
  borderRadius: 12,
  background: '#0B102F',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 800
};

const topRoomStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 28,
  borderRadius: 20,
  background: '#f8fafc',
  border: '1px solid #e2e8f0'
};

const topRoomIconStyle: React.CSSProperties = {
  fontSize: 34,
  marginBottom: 8
};

const topRoomLabelStyle: React.CSSProperties = {
  color: '#64748b',
  fontWeight: 800,
  fontSize: 13,
  textTransform: 'uppercase',
  letterSpacing: '.08em'
};

const topRoomNameStyle: React.CSSProperties = {
  marginTop: 8,
  fontSize: 30,
  fontWeight: 900,
  color: '#0f172a'
};

const topRoomAmountStyle: React.CSSProperties = {
  marginTop: 6,
  color: '#0B102F',
  fontWeight: 900
};

const stripeAccountStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: 12,
  marginTop: 12,
  marginBottom: 0
};

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 20,
  marginBottom: 22
};

const topBarEyebrowStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 13,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '.14em'
};

const topBarTitleStyle: React.CSSProperties = {
  color: '#0f172a',
  fontSize: 32,
  margin: '6px 0 0',
  fontWeight: 900
};

const propertyIdentityStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 999,
  padding: '8px 14px 8px 8px',
  boxShadow: '0 8px 22px rgba(15, 23, 42, 0.04)'
};

const propertyAvatarStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 999,
  background: '#0B102F',
  color: '#D4AF37',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 900,
  fontSize: 15
};

const propertyIdentityNameStyle: React.CSSProperties = {
  color: '#0f172a',
  fontWeight: 900,
  fontSize: 14
};

const propertyIdentityLocationStyle: React.CSSProperties = {
  color: '#64748b',
  fontWeight: 700,
  fontSize: 13,
  marginTop: 2
};

const operationsCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 20,
  padding: 22,
  background: '#f8fafc',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 18
};

const operationsTitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#0f172a',
  fontSize: 20,
  fontWeight: 900
};

const operationsDescriptionStyle: React.CSSProperties = {
  margin: '8px 0 0',
  color: '#64748b',
  lineHeight: 1.5
};

const operationsButtonStyle: React.CSSProperties = {
  background: '#0B102F',
  color: '#ffffff',
  padding: '12px 18px',
  borderRadius: 12,
  textDecoration: 'none',
  fontWeight: 900,
  whiteSpace: 'nowrap'
};

const billingActionRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  marginTop: 18
};

const billingPrimaryButtonStyle: React.CSSProperties = {
  flex: 1,
  background: '#0B102F',
  color: '#ffffff',
  padding: '12px 14px',
  borderRadius: 12,
  textAlign: 'center',
  textDecoration: 'none',
  fontWeight: 900
};

const billingSecondaryButtonStyle: React.CSSProperties = {
  flex: 1,
  background: '#ffffff',
  color: '#0B102F',
  padding: '12px 14px',
  borderRadius: 12,
  textAlign: 'center',
  textDecoration: 'none',
  fontWeight: 900,
  border: '1px solid #cbd5e1'
};

const propertyDetailsButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 22,
  width: '90%',
  padding: '12px 14px',
  borderRadius: 12,
  background: '#ffffff',
  color: '#0B102F',
  border: '1px solid #cbd5e1',
  textDecoration: 'none',
  fontWeight: 900
};