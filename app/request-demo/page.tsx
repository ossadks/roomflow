import Link from 'next/link';

export default function RequestDemoPage() {
  return (
    <main style={pageStyle}>
      <section style={contentStyle}>
        <div style={eyebrowStyle}>Request Demo</div>

        <h1 style={titleStyle}>Request a RoomFlow Demo</h1>

        <p style={paragraphStyle}>
          See how RoomFlow helps hospitality teams increase housekeeping tips
          through branded QR experiences.
        </p>

        <h2 style={sectionTitleStyle}>During your demo, you'll see:</h2>

        <ul style={listStyle}>
          <li>Guest tipping experience</li>
          <li>Property setup workflow</li>
          <li>QR code generation</li>
          <li>Reporting dashboard</li>
          <li>Asset package creation</li>
          <li>Pilot program options</li>
        </ul>

        <div style={infoBoxStyle}>
          <h3 style={{ marginTop: 0, color: '#0f172a' }}>To request a demo, email:</h3>
          <p style={{ fontSize: 20, fontWeight: 900, color: '#0B102F' }}>
            info@roomflowhq.com
          </p>

          <p style={paragraphStyle}>Please include:</p>

          <ul style={listStyle}>
            <li>Property Name</li>
            <li>Number of Rooms</li>
            <li>Property Type</li>
            <li>City and State</li>
          </ul>
        </div>

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

const infoBoxStyle: React.CSSProperties = {
  marginTop: 24,
  border: '1px solid #e2e8f0',
  borderRadius: 18,
  padding: 20,
  background: '#f8fafc'
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