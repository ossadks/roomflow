import Link from 'next/link';

export default function AboutPage() {
  return (
    <main style={pageStyle}>
      <section style={contentStyle}>
        <div style={eyebrowStyle}>RoomFlow</div>

        <h1 style={titleStyle}>Modernizing hospitality appreciation.</h1>

        <p style={paragraphStyle}>
          RoomFlow helps hotels, vacation rentals, and property managers increase
          housekeeping tips through branded digital tipping experiences.
        </p>

        <p style={paragraphStyle}>
          Using custom QR codes, guests can quickly show appreciation to
          housekeeping teams without downloading an app or creating an account.
        </p>

        <h2 style={sectionTitleStyle}>What RoomFlow Provides</h2>

        <ul style={listStyle}>
          <li>Branded guest tipping pages</li>
          <li>Property-specific QR assets</li>
          <li>Tip reporting and analytics</li>
          <li>Multi-room and multi-property support</li>
          <li>Hospitality-focused onboarding and support</li>
        </ul>

        <p style={paragraphStyle}>
          Our mission is simple: make it easier for guests to recognize great
          service while giving hospitality operators modern tools to manage and
          grow their tipping programs.
        </p>

        <Link href="/" style={buttonStyle}>Back to Home</Link>
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
  maxWidth: 860,
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
  fontSize: 17,
  lineHeight: 1.7
};

const listStyle: React.CSSProperties = {
  color: '#475569',
  fontSize: 16,
  lineHeight: 1.9
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