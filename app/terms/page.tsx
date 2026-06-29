import Link from 'next/link';

export default function TermsPage({
  searchParams,
}: {
  searchParams?: { back?: string };
}) {
  const backHref = searchParams?.back || '/';
  
  return (
    <main style={pageStyle}>
      <section style={contentStyle}>
        <div style={eyebrowStyle}>RoomFlow</div>

        <h1 style={titleStyle}>Terms of Service</h1>

        <p style={paragraphStyle}>
          These Terms of Service govern your use of RoomFlow. By using RoomFlow,
          you agree to these terms.
        </p>

        <h2 style={sectionTitleStyle}>Use of Service</h2>
        <p style={paragraphStyle}>
          RoomFlow provides software tools for hospitality operators, including
          QR-based digital tipping pages, property asset generation, reporting,
          and related platform features.
        </p>

        <h2 style={sectionTitleStyle}>Customer Responsibilities</h2>
        <p style={paragraphStyle}>
          Customers are responsible for ensuring that their use of RoomFlow
          complies with applicable laws, employment practices, tax obligations,
          and internal policies related to gratuities, employee compensation, and
          payment distribution.
        </p>

        <h2 style={sectionTitleStyle}>Payments and Billing</h2>
        <p style={paragraphStyle}>
          RoomFlow may charge subscription fees, setup fees, or other service
          fees. Payment processing may be handled by Stripe or another payment
          provider.
        </p>

        <h2 style={sectionTitleStyle}>Pilot Programs</h2>
        <p style={paragraphStyle}>
          RoomFlow may offer pilot programs to selected properties. Pilot terms,
          duration, pricing, and activation timing may vary by property.
        </p>

        <h2 style={sectionTitleStyle}>No Guaranteed Results</h2>
        <p style={paragraphStyle}>
          RoomFlow does not guarantee any specific increase in guest tipping
          activity, employee compensation, revenue, or business results.
        </p>

        <h2 style={sectionTitleStyle}>Payroll and Distribution</h2>
        <p style={paragraphStyle}>
          RoomFlow is not a payroll provider. Customers are responsible for their
          own payroll, gratuity distribution, tax reporting, and employee payment
          practices.
        </p>

        <h2 style={sectionTitleStyle}>Limitation of Liability</h2>
        <p style={paragraphStyle}>
          To the fullest extent permitted by law, RoomFlow is not liable for
          indirect, incidental, consequential, or special damages arising from use
          of the service.
        </p>

        <h2 style={sectionTitleStyle}>Termination</h2>
        <p style={paragraphStyle}>
          RoomFlow may suspend or terminate access to the service if a customer
          violates these terms or misuses the platform.
        </p>

        <h2 style={sectionTitleStyle}>Changes to Terms</h2>
        <p style={paragraphStyle}>
          RoomFlow may update these Terms of Service from time to time. Continued
          use of the service after updates means you accept the revised terms.
        </p>

        <h2 style={sectionTitleStyle}>Contact</h2>
        <p style={paragraphStyle}>
          For questions about these terms, contact info@roomflowhq.com.
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