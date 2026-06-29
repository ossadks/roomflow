import Link from 'next/link';

export default function FAQPage({
  searchParams,
}: {
  searchParams?: { back?: string };
}) {
  const backHref = searchParams?.back || '/';

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        <h1>RoomFlow FAQ</h1>
        <p style={mutedStyle}>
          Common questions about RoomFlow setup, QR codes, payouts, and reporting.
        </p>

        <section style={cardStyle}>
          <h2>How does RoomFlow work?</h2>
          <p>Guests scan a room QR code, open the tipping page, select an amount, and submit a tip.</p>

          <h2>Does the guest need to download an app?</h2>
          <p>No. RoomFlow works through a simple web page.</p>

          <h2>How are payouts handled?</h2>
          <p>RoomFlow uses Stripe Connect to securely support property payout setup.</p>

          <h2>Can each room have its own QR code?</h2>
          <p>Yes. RoomFlow generates room-specific QR codes and guest links.</p>

          <h2>Can we download printable materials?</h2>
          <p>Yes. The portal includes QR PNGs, 4x6 room cards, posters, and full asset packages.</p>

          <h2>Is RoomFlow a payroll provider?</h2>
          <p>No. RoomFlow supports digital tipping and reporting, but it does not replace a property’s payroll process.</p>

          <h2>Can we export reports?</h2>
          <p>Yes. Tip activity can be exported from the Reports section.</p>

          <h2>Who do we contact for support?</h2>
          <p>Email RoomFlow support at info@roomflowhq.com.</p>

          <Link href={backHref} style={buttonStyle}>
            ← {backHref === '/' ? 'Back to Home' : 'Back to Dashboard'}
          </Link>
        </section>
      </div>
    </main>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: '#f8fafc',
  padding: 32,
  fontFamily: 'Inter, system-ui, sans-serif'
};

const containerStyle = {
  maxWidth: 850,
  margin: '0 auto'
};

const backLinkStyle = {
  color: '#0B102F',
  fontWeight: 900,
  textDecoration: 'none'
};

const mutedStyle = {
  color: '#64748b'
};

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 24,
  padding: 28,
  marginTop: 24
};

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: 24,
  padding: '13px 16px',
  borderRadius: 14,
  background: '#0B102F',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 800
};