export default function SuccessPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          background: '#ffffff',
          borderRadius: 28,
          padding: '42px 30px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
          textAlign: 'center',
          border: '1px solid rgba(148, 163, 184, 0.18)'
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ecfdf5',
            color: '#047857',
            fontSize: 30,
            fontWeight: 700
          }}
        >
          ✓
        </div>

        <div
          style={{
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#94a3b8',
            fontWeight: 700
          }}
        >
          Payment Complete
        </div>

        <h1
          style={{
            margin: '10px 0 12px',
            fontSize: 34,
            lineHeight: 1.1,
            color: '#0f172a'
          }}
        >
          Thank you for your support
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.7,
            color: '#64748b'
          }}
        >
          Your appreciation has been received and recorded successfully.
        </p>
      </div>
    </main>
  );
}
