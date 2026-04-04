import type { PropertyBranding } from '@/lib/types';

export default function BrandShell({
  property,
  children
}: {
  property: PropertyBranding;
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        padding: '32px 18px',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
          border: '1px solid rgba(148, 163, 184, 0.18)'
        }}
      >
        <div
          style={{
            background: property.primary_color,
            padding: '28px 28px 24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}
          >
            {property.logo_url ? (
              <img
                src={property.logo_url}
                alt={`${property.name} logo`}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 16,
                  objectFit: 'cover',
                  background: '#ffffff'
                }}
              />
            ) : (
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 20
                }}
              >
                RF
              </div>
            )}

            <div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 700
                }}
              >
                Guest Appreciation
              </div>

              <h2
                style={{
                  margin: '6px 0 4px',
                  color: '#ffffff',
                  fontSize: 24,
                  fontWeight: 700
                }}
              >
                {property.name}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 14
                }}
              >
                {[property.city, property.state].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        </div>

        <section
          style={{
            padding: '30px 26px 34px'
          }}
        >
          {children}
        </section>
      </div>
    </main>
  );
}
