import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, roomId, propertyId, token } = body ?? {};

    if (!amount || !roomId || !propertyId) {
      return NextResponse.json(
        {
          error: 'Missing required fields.',
          received: body
        },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Missing STRIPE_SECRET_KEY in .env.local' },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_DOMAIN || process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json(
        { error: 'Missing NEXT_PUBLIC_DOMAIN or NEXT_PUBLIC_APP_URL in .env.local' },
        { status: 500 }
      );
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount supplied.' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, name')
      .eq('id', propertyId)
      .single();

    if (propertyError) {
      console.error('Property lookup error:', propertyError);
      return NextResponse.json(
        { error: 'Error loading property.' },
        { status: 500 }
      );
    }

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found.' },
        { status: 404 }
      );
    }

    const successUrl = `${appUrl}/success?propertyId=${property.id}`;
    const cancelUrl = token
      ? `${appUrl}/tip?token=${encodeURIComponent(token)}`
      : `${appUrl}/tip`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${property.name} housekeeping tip`
            },
            unit_amount: Math.round(numericAmount * 100)
          },
          quantity: 1
        }
      ],
      metadata: {
        roomId: String(roomId),
        propertyId: String(propertyId),
        amount: String(numericAmount)
      },
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Failed to create checkout session:', error);

    return NextResponse.json(
      {
        error: error?.message || 'Failed to create checkout session.',
        type: error?.type || null,
        code: error?.code || null
      },
      { status: 500 }
    );
  }
}