'use client';

import { useState } from 'react';
import type { RoomFlowContext } from '@/lib/types';

export default function TipOptions({ context }: { context: RoomFlowContext }) {
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);

  const presets = [
    context.property.tip_preset_1,
    context.property.tip_preset_2,
    context.property.tip_preset_3
  ];

  const isAirbnb = context.property.property_type === 'airbnb';

  async function handleCheckout(amount: number) {
    try {
      setLoadingAmount(amount);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          roomId: context.roomId,
          propertyId: context.property.id,
          token: context.token
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Checkout error:', data);
        alert(data.error || 'Something went wrong starting checkout.');
        setLoadingAmount(null);
        return;
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error('Checkout crash:', error);
      alert('Something went wrong starting checkout.');
      setLoadingAmount(null);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.eyebrow}>Guest Appreciation</div>

      <p style={styles.welcomeText}>
        {context.property.welcome_message}
      </p>

      <h1 style={styles.title}>
        {isAirbnb
          ? 'Support your cleaning team'
          : `Support housekeeping for Room ${context.roomNumber}`}
      </h1>

      {context.staffName && (
        <p style={styles.staffText}>
          Serviced by <span style={styles.staffName}>{context.staffName}</span>
        </p>
      )}

      <p style={styles.subtitle}>
        Choose a tip amount below. Your payment is processed securely.
      </p>

      <div style={styles.buttonGrid}>
        {presets.map((amount) => {
          const active = loadingAmount === amount;

          return (
            <button
              key={amount}
              type="button"
              onClick={() => handleCheckout(amount)}
              disabled={loadingAmount !== null}
              style={{
                ...styles.tipButton,
                border: `1.5px solid ${context.property.accent_color}`,
                background: active ? context.property.accent_color : '#ffffff',
                color: active ? '#ffffff' : '#0f172a',
                boxShadow: active
                  ? '0 12px 24px rgba(15, 23, 42, 0.14)'
                  : '0 8px 22px rgba(15, 23, 42, 0.06)',
                opacity: loadingAmount !== null && !active ? 0.7 : 1
              }}
            >
              <div style={styles.amountLabel}>${amount}</div>
              <div
                style={{
                  ...styles.amountSubtext,
                  color: active ? '#ffffff' : '#64748b'
                }}
              >
                Show appreciation
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#94a3b8',
    fontWeight: 700
  },
  welcomeText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.7,
    color: '#475569'
  },
  title: {
    margin: '4px 0 0',
    fontSize: 34,
    lineHeight: 1.08,
    color: '#0f172a',
    fontWeight: 700
  },
  staffText: {
    margin: 0,
    fontSize: 15,
    color: '#64748b'
  },
  staffName: {
    color: '#0f172a',
    fontWeight: 600
  },
  subtitle: {
    margin: '4px 0 18px',
    fontSize: 15,
    lineHeight: 1.7,
    color: '#64748b'
  },
  buttonGrid: {
    display: 'grid',
    gap: 14
  },
  tipButton: {
    borderRadius: 20,
    padding: '18px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left'
  },
  amountLabel: {
    fontSize: 24,
    fontWeight: 700
  },
  amountSubtext: {
    marginTop: 6,
    fontSize: 13
  }
};
