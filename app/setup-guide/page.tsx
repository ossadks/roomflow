import Link from 'next/link';

export default function SetupGuidePage({
  searchParams,
}: {
  searchParams?: { back?: string };
}) {
  const backHref = searchParams?.back || '/';

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        <h1>RoomFlow Setup Guide</h1>

        <p style={mutedStyle}>
          Use this guide to launch RoomFlow at your property.
        </p>

        <section style={cardStyle}>
          <h2>1. Confirm Property Details</h2>
          <p>Verify the property name, location, room count, and billing plan are correct.</p>

          <h2>2. Connect Stripe</h2>
          <p>Stripe securely collects business and payout information so tips can be routed correctly.</p>

          <h2>3. Download Room Assets</h2>
          <p>Download QR codes, 4x6 room cards, posters, or the full asset package from the Asset Library.</p>

          <h2>4. Place QR Cards</h2>
          <p>Place cards in guest rooms, front desk areas, elevators, or other approved guest-facing spaces.</p>

          <h2>5. Train Staff</h2>
          <p>Let staff know guests can scan the QR code to send tips or appreciation digitally.</p>

          <h2>6. Monitor Reports</h2>
          <p>Use the portal to view tips, top rooms, and exported reporting.</p>

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
  fontFamily: 'Inter, system-ui, sans-serif',
};

const containerStyle = {
  maxWidth: 850,
  margin: '0 auto',
};

const backLinkStyle = {
  color: '#0B102F',
  fontWeight: 900,
  textDecoration: 'none',
};

const mutedStyle = {
  color: '#64748b',
};

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 24,
  padding: 28,
  marginTop: 24,
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