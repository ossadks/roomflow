import Link from 'next/link';

export default function PrivacyPage({
  searchParams,
}: {
  searchParams?: { back?: string };
}) {
  const backHref = searchParams?.back || '/';
  
  return (
    <main style={pageStyle}>
      <section style={contentStyle}>
        <div style={eyebrowStyle}>RoomFlow</div>

        <h1 style={titleStyle}>Privacy Policy</h1>

        <p style={paragraphStyle}>
          RoomFlow respects your privacy. This Privacy Policy explains how we
          collect, use, and protect information when you use RoomFlow.
        </p>

        <h2 style={sectionTitleStyle}>Information We Collect</h2>
        <ul style={listStyle}>
          <li>Contact information, such as name and email address</li>
          <li>Property information, such as property name, location, logo, and room details</li>
          <li>Usage information related to QR codes, tips, reporting, and portal activity</li>
          <li>Payment-related information processed through Stripe</li>
        </ul>

        <h2 style={sectionTitleStyle}>How We Use Information</h2>
        <ul style={listStyle}>
          <li>To provide and improve RoomFlow services</li>
          <li>To generate QR codes, assets, reports, and property dashboards</li>
          <li>To communicate with customers about setup, support, and service updates</li>
          <li>To support billing, payments, and payout workflows</li>
        </ul>

        <h2 style={sectionTitleStyle}>Payment Information</h2>
        <p style={paragraphStyle}>
          Payments are processed by Stripe. RoomFlow does not store full payment
          card information on its servers.
        </p>

        <h2 style={sectionTitleStyle}>Third-Party Services</h2>
        <p style={paragraphStyle}>
          RoomFlow may use third-party services including Stripe, Supabase, and
          Vercel to provide payments, hosting, storage, analytics, and platform
          functionality.
        </p>

        <h2 style={sectionTitleStyle}>Data Security</h2>
        <p style={paragraphStyle}>
          RoomFlow uses reasonable safeguards to protect customer and property
          information. However, no system can be guaranteed to be completely
          secure.
        </p>

        <h2 style={sectionTitleStyle}>Contact</h2>
        <p style={paragraphStyle}>
          For privacy questions, contact us at info@roomflowhq.com.
        </p>

        <Link href={backHref} style={buttonStyle}>
      {backHref === '/' ? 'Back to Home' : 'Back to Dashboard'}
    </Link>
      </section>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f8fafc',
  padding: '48px 20px',
  fontFamily: 'Inter, system-ui, sans-serif'
};

const contentStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: '0 auto',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 24,
  padding: 36
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
  margin: '10px 0 20px'
};

const sectionTitleStyle: React.CSSProperties = {
  color: '#0f172a',
  marginTop: 28
};

const paragraphStyle: React.CSSProperties = {
  color: '#475569',
  fontSize: 16,
  lineHeight: 1.7
};

const listStyle: React.CSSProperties = {
  color: '#475569',
  fontSize: 16,
  lineHeight: 1.8
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