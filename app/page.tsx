import Link from 'next/link';

function TrustCard({ title }: { title: string }) {
  return (
    <div style={trustCardStyle}>
      <span style={{ color: '#D4AF37', fontWeight: 900 }}>✓</span>
      <span>{title}</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={homeLogoWrapStyle}>
            <img src="/roomflow-logo.png" alt="RoomFlow" style={homeLogoStyle} />
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#B88A44', maxWidth: 680, margin: '0 auto 30px' }}>
            BUILT FOR HOTELS AND SHORT-TERM RENTAL OPERATORS
          </p>

          <h1 style={heroTitleStyle}>
            Increase housekeeping tips with one simple QR code.
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.7, color: '#475569', maxWidth: 680, margin: '0 auto 30px' }}>
            Guests scan, leave a tip, and pay in seconds. No app. No login. No complicated setup.
          </p>

          <Link
            href="/setup"
            style={{
              display: 'inline-block',
              padding: '16px 22px',
              borderRadius: 14,
              background: '#0B102F',
              color: '#ffffff',
              textDecoration: 'none',
              fontWeight: 700
            }}
          >
            Get Started
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 64 }}>
          {[
            ['1', 'Create Property', 'Add your property name, location, logo, and brand colors.'],
            ['2', 'Generate QR Codes', 'Create QR codes for Airbnb units or hotel rooms.'],
            ['3', 'Track Tips', 'View tips by room, date, and export reports for distribution.']
          ].map(([num, title, text]) => (
            <div key={title} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 22, padding: 24 }}>
              <div style={{ width: 34, height: 34, borderRadius: 999, background: '#B88A44', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {num}
              </div>
              <h3 style={{ color: '#0f172a', marginBottom: 8 }}>{title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section style={trustSectionStyle}>
        <h2 style={trustTitleStyle}>Built for hospitality teams.</h2>

        <div style={trustGridStyle}>
          <TrustCard title="Hotels" />
          <TrustCard title="Boutique Hotels" />
          <TrustCard title="Vacation Rentals" />
          <TrustCard title="Property Managers" />
        </div>

        <h2 style={{ ...trustTitleStyle, marginTop: 48 }}>What You Get</h2>

        <div style={trustGridStyle}>
          <TrustCard title="QR Tipping Pages" />
          <TrustCard title="Asset Package Generation" />
          <TrustCard title="Reporting Dashboard" />
          <TrustCard title="CSV Export" />
        </div>
      </section>
      <footer
        style={{
          borderTop: '1px solid #e2e8f0',
          padding: '28px 24px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: 14
        }}
      >
        <div style={{ marginBottom: 10 }}>© 2026 RoomFlow</div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 18,
            flexWrap: 'wrap'
          }}
        >
          <Link href="/about" style={footerLinkStyle}>About</Link>
          <Link href="/request-demo" style={footerLinkStyle}>Request Demo</Link>
          <Link href="/contact" style={footerLinkStyle}>Contact</Link>
          <Link href="/privacy" style={footerLinkStyle}>Privacy Policy</Link>
          <Link href="/terms" style={footerLinkStyle}>Terms of Service</Link>
        </div>
      </footer>
    </main>
  );
}

const footerLinkStyle: React.CSSProperties = {
  color: '#0B102F',
  textDecoration: 'none',
  fontWeight: 700
};

const trustSectionStyle: React.CSSProperties = {
  maxWidth: 980,
  margin: '40px auto 80px',
  padding: '0 24px',
  textAlign: 'center'
};

const trustTitleStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
  color: '#0f172a',
  marginBottom: 20
};

const trustGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16
};

const trustCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 18,
  padding: 20,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 10,
  fontWeight: 900,
  color: '#0f172a'
};

const homeLogoWrapStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0B102F',
  border: '1px solid rgba(212, 175, 55, 0.35)',
  borderRadius: 36,
  padding: '15px 45px',
  margin: '0 auto 62px',
  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.16)'
};

const homeLogoStyle: React.CSSProperties = {
  width: 240,
  height: 'auto',
  display: 'block',
  marginBottom: 30
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: 'clamp(34px, 4.4vw, 56px)',
  lineHeight: 1.04,
  maxWidth: 700,
  margin: '0 auto',
  color: '#0f172a',
  fontWeight: 900,
  textAlign: 'center',
  letterSpacing: '-0.045em',
  marginBottom: 22
};