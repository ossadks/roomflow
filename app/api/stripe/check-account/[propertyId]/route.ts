import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;

  const { data: property, error } = await supabase
    .from('properties')
    .select('stripe_account_id')
    .eq('id', propertyId)
    .single();

  if (error || !property?.stripe_account_id) {
    return NextResponse.json(
      { error: 'Stripe account not found.' },
      { status: 404 }
    );
  }

  const account = await stripe.accounts.retrieve(property.stripe_account_id);

  const complete = Boolean(account.details_submitted);

  await supabase
    .from('properties')
    .update({
      stripe_onboarding_complete: complete
    })
    .eq('id', propertyId);

  return NextResponse.json({
    success: true,
    complete
  });
}