'use client';

import { useState } from 'react';
import type { RoomFlowContext } from '@/lib/types';

export default function TipOptions({ context }: { context: RoomFlowContext }) {
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const isAirbnb = context.property.property_type === 'airbnb';

  const presets = [
    {
      amount: context.property.tip_preset_1,
      label: 'Quick thank you',
    },
    {
      amount: context.property.tip_preset_2,
      label: 'Standard tip ⭐',
    },
    {
      amount: context.property.tip_preset_3,
      label: 'Exceptional service',
    },
  ];

  async function handleCheckout(amount: number) {
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      setLoadingAmount(amount);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          roomId: context.roomId,
          propertyId: context.property.id,
          token: context.token,
        }),
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

  function handleCustomContinue() {
    const parsed = Number(customAmount);

    if (!parsed || Number.isNaN(parsed) || parsed <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    handleCheckout(parsed);
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

      <p style={styles.trustText}>
        {context.property.property_type === 'hotel'
          ? '100% of your tip goes to the housekeeping team'
          : 'Your tip supports the cleaning team'}
      </p>

      <p style={styles.subtitle}>
        A small gesture goes a long way for our team
      </p>

      <div style={styles.buttonGrid}>
        {presets.map((item, index) => {
          const active = loadingAmount === item.amount;
          const isMiddle = index === 1;

          return (
            <button
              key={item.amount}
              type="button"
              onClick={() => handleCheckout(item.amount)}
              disabled={loadingAmount !== null}
              style={{
                ...styles.tipButton,
                border: active
                  ? `2px solid ${context.property.accent_color}`
                  : isMiddle
                  ? `2px solid ${context.property.accent_color}`
                  : '1px solid #e2e8f0',
                background: active ? context.property.accent_color : '#ffffff',
                color: active ? '#ffffff' : '#0f172a',
                boxShadow: isMiddle
                  ? '0 12px 30px rgba(0,0,0,0.08)'
                  : '0 6px 18px rgba(0,0,0,0.04)',
                transform: isMiddle ? 'scale(1.02)' : 'scale(1)',
                opacity: loadingAmount !== null && !active ? 0.7 : 1,
              }}
            >
              <div style={styles.amountLabel}>
                {active ? 'Opening checkout…' : `$${item.amount}`}
              </div>
              <div
                style={{
                  ...styles.amountSubtext,
                  color: active ? '#ffffff' : '#64748b',
                }}
              >
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      <div style={styles.customSection}>
        <button
          type="button"
          onClick={() => setShowCustom((prev) => !prev)}
          disabled={loadingAmount !== null}
          style={styles.customButton}
        >
          Custom amount
        </button>

        {showCustom && (
          <div style={styles.customCard}>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="0.01"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              style={styles.customInput}
            />

            <button
              type="button"
              onClick={handleCustomContinue}
              disabled={
                loadingAmount !== null ||
                !customAmount ||
                Number(customAmount) <= 0
              }
              style={{
                ...styles.customContinueButton,
                backgroundColor: context.property.accent_color,
                opacity:
                  loadingAmount !== null ||
                  !customAmount ||
                  Number(customAmount) <= 0
                    ? 0.65
                    : 1,
              }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#94a3b8',
    fontWeight: 700,
  },
  welcomeText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.7,
    color: '#475569',
  },
  title: {
    margin: '4px 0 0',
    fontSize: 34,
    lineHeight: 1.08,
    color: '#0f172a',
    fontWeight: 700,
  },
  trustText: {
    margin: 0,
    fontSize: 15,
    color: '#16a34a',
    fontWeight: 500,
  },
  subtitle: {
    margin: '4px 0 18px',
    fontSize: 15,
    lineHeight: 1.7,
    color: '#64748b',
  },
  buttonGrid: {
    display: 'grid',
    gap: 14,
  },
  tipButton: {
    borderRadius: 20,
    padding: '18px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    background: '#ffffff',
  },
  amountLabel: {
    fontSize: 24,
    fontWeight: 700,
  },
  amountSubtext: {
    marginTop: 6,
    fontSize: 13,
  },
  customSection: {
    marginTop: 8,
  },
  customButton: {
    width: '100%',
    borderRadius: 18,
    padding: '16px 18px',
    border: '1px dashed #94a3b8',
    background: '#ffffff',
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
  customCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 18,
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
  },
  customInput: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    fontSize: 16,
    marginBottom: 10,
    outline: 'none',
  },
  customContinueButton: {
    width: '100%',
    color: '#ffffff',
    border: 'none',
    borderRadius: 12,
    padding: '14px 16px',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
  },
};
