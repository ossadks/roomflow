import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing STRIPE_WEBHOOK_SECRET in .env.local' },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('❌ Webhook signature error:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature error' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    try {
      const supabase = createServerSupabaseClient();

      const { error } = await supabase.from('tips').insert({
        property_id: session.metadata.propertyId,
        room_id: session.metadata.roomId,
        amount: session.amount_total / 100,
        stripe_session_id: session.id
      });

      if (error) {
        console.error('❌ Supabase insert error:', error);
      } else {
        console.log('✅ Tip saved successfully:', session.id);
      }
    } catch (err) {
      console.error('❌ Unexpected webhook error:', err);
    }
  }

  return NextResponse.json({ received: true });
}
