'use client';

export default function ConnectStripeButton({
  propertyId
}: {
  propertyId: string;
}) {
  async function handleConnect() {
    const response = await fetch(`/api/stripe/connect/${propertyId}`, {
      method: 'POST'
    });

    const text = await response.text();

    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      alert(text || 'Stripe onboarding failed.');
      return;
    }

    if (!response.ok) {
      alert(data.error || 'Unable to start Stripe onboarding.');
      return;
    }

    window.location.href = data.url;
  }

  return (
    <button
      type="button"
      onClick={handleConnect}
      style={{
        padding: '12px 15px',
        borderRadius: 12,
        border: 'none',
        background: '#0B102F',
        color: '#ffffff',
        fontWeight: 800,
        cursor: 'pointer'
      }}
    >
      Connect Stripe
    </button>
  );
}