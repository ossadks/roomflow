import Link from 'next/link';
import { FileText, Shield, CreditCard, BookOpen } from 'lucide-react';

const documents = [
  {
    title: 'RoomFlow Service Agreement',
    description: 'Agreement between RoomFlow and your property.',
    href: '/documents/roomflow-service-agreement.pdf',
    icon: FileText,
  },
  {
    title: 'Pilot Agreement',
    description: 'Terms for pilot properties.',
    href: '/documents/pilot-agreement.pdf',
    icon: FileText,
  },
  {
    title: 'Privacy Policy',
    description: 'How RoomFlow protects guest data.',
    href: '/documents/privacy-policy.pdf',
    icon: Shield,
  },
  {
    title: 'Terms of Service',
    description: 'Platform terms and conditions.',
    href: '/documents/terms-of-service.pdf',
    icon: BookOpen,
  },
  {
    title: 'Stripe Payments Guide',
    description: 'How payouts and connected accounts work.',
    href: '/documents/stripe-payments-guide.pdf',
    icon: CreditCard,
  },
  {
    title: 'Quick Start Guide',
    description: 'Get your property live in minutes.',
    href: '/documents/quick-start-guide.pdf',
    icon: BookOpen,
  },
];

export default function DocumentsPage() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Property Documents</h1>

      <p style={styles.subtitle}>
        Everything you need to operate RoomFlow at your property.
      </p>

      <div style={styles.grid}>
        {documents.map((doc) => {
          const Icon = doc.icon;

          return (
            <Link
              key={doc.title}
              href={doc.href}
              target="_blank"
              style={styles.card}
            >
              <Icon size={28} color="#D4AF37" />

              <div>
                <h3 style={styles.cardTitle}>
                  {doc.title}
                </h3>

                <p style={styles.cardDescription}>
                  {doc.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: 1100,
    margin: '40px auto',
    padding: 24,
  },

  title: {
    fontSize: 38,
    fontWeight: 800,
    marginBottom: 10,
  },

  subtitle: {
    color: '#64748b',
    marginBottom: 36,
  },

  grid: {
    display: 'grid',
    gap: 18,
  },

  card: {
    display: 'flex',
    gap: 18,
    alignItems: 'center',
    padding: 22,
    borderRadius: 18,
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    background: '#fff',
    color: '#0f172a',
  },

  cardTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
  },

  cardDescription: {
    marginTop: 6,
    color: '#64748b',
  },
};