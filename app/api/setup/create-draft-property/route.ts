import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      propertyType,
      propertyName,
      city,
      stateName,
      primaryColor,
      accentColor,
      monthlyPrice,
      launchMode
    } = body;

    if (!propertyName || !city || !stateName) {
      return NextResponse.json(
        { error: 'Property name, city, and state are required.' },
        { status: 400 }
      );
    }

    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        name: propertyName,
        property_type: propertyType,
        city,
        state: stateName,
        primary_color: primaryColor,
        accent_color: accentColor,
        monthly_price: monthlyPrice || null,
        status: launchMode === 'active' ? 'active' : 'pilot',
        launch_mode: launchMode || 'pilot',
        pilot_started_at:
          launchMode === 'active' ? null : new Date().toISOString(),
        terms_accepted: true,
        privacy_accepted: true,
        pilot_agreement_accepted: launchMode !== 'active',
        agreements_accepted_at: new Date().toISOString(),
        tip_preset_1: 5,
        tip_preset_2: 10,
        tip_preset_3: 20,
        welcome_message: 'Thank you for your stay.',
        thank_you_message: 'Thank you for your support.'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      propertyId: property.id
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}