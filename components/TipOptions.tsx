'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import type { RoomFlowContext } from '@/lib/types';

function calculateGrossWithStripeFee(tipCents: number) {
  const stripePercent = 0.029;
  const stripeFixedCents = 30;

  return Math.ceil((tipCents + stripeFixedCents) / (1 - stripePercent));
}

function calculateEstimatedFee(tipCents: number) {
  return calculateGrossWithStripeFee(tipCents) - tipCents;
}

function formatMoneyFromCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function TipOptions({ context }: { context: RoomFlowContext }) {
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [showFeeInfo, setShowFeeInfo] = useState(false);

  const isAirbnb =
    context.property.property_type?.toLowerCase() === 'airbnb' ||
    context.property.property_type?.toLowerCase() === 'str';

  const teamLabel = isAirbnb ? 'cleaning team' : 'housekeeping team';

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

  const displayAmount =
    showCustom && Number(customAmount) > 0
      ? Number(customAmount)
      : context.property.tip_preset_2;

  const displayTipCents = Math.round(displayAmount * 100);
  const displayEstimatedFeeCents = calculateEstimatedFee(displayTipCents);

  async function handleCheckout(amount: number) {
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const tipCents = Math.round(amount * 100);
    const grossCents = calculateGrossWithStripeFee(tipCents);
    const estimatedFeeCents = grossCents - tipCents;

    try {
      setLoadingAmount(amount);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          tipCents,
          grossCents,
          estimatedFeeCents,
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
      <p style={styles.welcomeText}>
        {context.property.welcome_message || 'Thank you for your stay.'}
      </p>

      <h1 style={styles.title}>
        {isAirbnb
          ? 'Show your appreciation by leaving a tip for the cleaning team.'
          : `Support housekeeping for Room ${context.roomNumber}`}
      </h1>

      <p style={styles.subtitle}>
        {isAirbnb
        ? 'A small gesture goes a long way.'
        : '100% of your tip goes to the housekeeping team.'}
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
      
      <div
        style={{
          ...styles.feeNotice,
          border: `1px solid ${context.property.accent_color}33`,
          background: `${context.property.accent_color}08`,
        }}
      >
        <button
          type="button"
          onClick={() => setShowFeeInfo(!showFeeInfo)}
          style={{
            ...styles.infoButton,
            border: `1px solid ${context.property.accent_color}`,
            color: context.property.accent_color,
          }}
        >
          <Info
            size={18}
            strokeWidth={2.2}
            color={context.property.accent_color}
          />
        </button>

        <span>
          A {formatMoneyFromCents(displayEstimatedFeeCents)} processing fee is
          included so the {teamLabel} receives{' '}
          <strong>100% of your selected tip.</strong>
        </span>
      </div>

      {showFeeInfo && (
        <div style={styles.feePopover}>
          <strong>Why is there a processing fee?</strong>

          <p style={{ marginTop: 10 }}>
            RoomFlow includes a small processing fee so your selected tip goes
            entirely to the housekeeping team.
          </p>

          <p>
            Payments are securely processed through <strong>Stripe</strong>, and the
            fee covers payment processing costs.
          </p>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
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
    lineHeight: 1.15,
    color: '#0f172a',
    fontWeight: 700,
  },
  subtitle: {
    margin: '2px 0 18px',
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
  feeIcon: {
    width: 22,
    height: 22,
    minWidth: 22,
    borderRadius: 999,
    border: '2px solid #0f172a',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 900,
    lineHeight: 1,
  },
  feeNoticeText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.45,
    fontWeight: 600,
    color: '#0f172a',
  },
  feeNotice: {
  marginTop: 18,
  padding: '14px 18px',
  borderRadius: 14,
  border: '1px solid #dbe3ef',
  background: '#f8fafc',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontSize: 15,
  color: '#0f172a',
},

infoButton: {
  width: 28,
  height: 28,
  borderRadius: 999,
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 15,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#0f172a',
  flexShrink: 0,
},

feePopover: {
  marginTop: 12,
  padding: 18,
  borderRadius: 14,
  background: '#ffffff',
  border: '1px solid #dbe3ef',
  boxShadow: '0 12px 32px rgba(15,23,42,.08)',
  color: '#475569',
  lineHeight: 1.7,
  fontSize: 14,
},
};

