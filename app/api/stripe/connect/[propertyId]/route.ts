import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;

    const { data: property, error } = await supabase
      .from('properties')
      .select('id, name, stripe_account_id')
      .eq('id', propertyId)
      .single();

    if (error || !property) {
      return NextResponse.json(
        { error: 'Property not found.' },
        { status: 404 }
      );
    }

    let accountId = property.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        metadata: {
          property_id: propertyId,
          property_name: property.name || ''
        }
      });

      accountId = account.id;

      const { error: updateError } = await supabase
        .from('properties')
        .update({
          stripe_account_id: accountId
        })
        .eq('id', propertyId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }

    const requestUrl = new URL(req.url);
    const domain = `${requestUrl.protocol}//${requestUrl.host}`;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${domain}/setup?propertyId=${propertyId}&stripe=refresh`,
      return_url: `${domain}/setup?propertyId=${propertyId}&stripe=return`,
      type: 'account_onboarding'
    });

    return NextResponse.json({
      success: true,
      url: accountLink.url
    });
  } catch (error) {
    console.error('Stripe Connect error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unable to complete Stripe onboarding.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}