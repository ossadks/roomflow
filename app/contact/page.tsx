import Link from 'next/link';

export default function ContactPage() {
  return (
    <main style={pageStyle}>
      <section style={contentStyle}>
        <div style={eyebrowStyle}>Contact</div>

        <h1 style={titleStyle}>Contact RoomFlow</h1>

        <p style={paragraphStyle}>
          Questions about RoomFlow? Interested in launching a pilot program for
          your hotel or vacation rental? We'd love to hear from you.
        </p>

        <div style={infoBoxStyle}>
          <InfoLine label="Email" value="info@roomflowhq.com" />
          <InfoLine label="Partnerships" value="info@roomflowhq.com" />
          <InfoLine label="Support" value="info@roomflowhq.com" />
          <InfoLine label="Business Hours" value="Monday–Friday, 9:00 AM – 5:00 PM CST" />
          <InfoLine label="Response Time" value="Typically within one business day" />
        </div>

        <Link href="/" style={buttonStyle}>Back to Home</Link>
      </section>
    </main>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoLineStyle}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <strong style={{ color: '#0f172a' }}>{value}</strong>
    </div>
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

const paragraphStyle: React.CSSProperties = {
  color: '#475569',
  fontSize: 17,
  lineHeight: 1.7
};

const infoBoxStyle: React.CSSProperties = {
  marginTop: 24,
  border: '1px solid #e2e8f0',
  borderRadius: 18,
  padding: 18,
  background: '#f8fafc'
};

const infoLineStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 18,
  padding: '12px 0',
  borderBottom: '1px solid #e2e8f0'
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