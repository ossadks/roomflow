import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
            RoomFlow
          </div>

          <h1 style={{ fontSize: 56, lineHeight: 1.05, margin: '18px 0 18px', color: '#0f172a' }}>
            Increase housekeeping tips with one simple QR code.
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.7, color: '#475569', maxWidth: 680, margin: '0 auto 30px' }}>
            Guests scan, select a tip amount, and pay in seconds. No app download. No login. No complicated setup.
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
            Start Setup
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
    </main>
  );
}
