import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateToken(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }

  return token;
}

async function createUniqueToken() {
  let token = generateToken();

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data } = await supabase
      .from('qr_tokens')
      .select('id')
      .eq('token', token)
      .maybeSingle();

    if (!data) return token;

    token = generateToken();
  }

  throw new Error('Unable to generate unique QR token.');
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const body = await req.json();

    const { rooms, launchMode, monthlyPrice } = body;

    const roomList: string[] = Array.isArray(rooms) ? rooms : [];

    if (launchMode !== 'active' && roomList.length > 5) {
      return NextResponse.json(
        {
          error:
            'Pilot limit reached. Contact RoomFlow to activate your full property.'
        },
        { status: 400 }
      );
    }

    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, stripe_account_id, stripe_onboarding_complete')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found.' },
        { status: 404 }
      );
    }

    if (!property.stripe_account_id || !property.stripe_onboarding_complete) {
      return NextResponse.json(
        {
          error:
            'Stripe onboarding must be completed before generating property assets.'
        },
        { status: 400 }
      );
    }

    const finalRoomCount = roomList.length;

    const { error: updatePropertyError } = await supabase
      .from('properties')
      .update({
        room_count: finalRoomCount,
        monthly_price: monthlyPrice || null,
        status: launchMode === 'active' ? 'active' : 'pilot',
        launch_mode: launchMode
      })
      .eq('id', propertyId);

    if (updatePropertyError) {
      return NextResponse.json(
        { error: updatePropertyError.message },
        { status: 500 }
      );
    }

    const roomRows = roomList.map((roomNumber: string) => ({
      property_id: propertyId,
      room_number: roomNumber
    }));

    let createdRooms: any[] = [];

    if (roomRows.length > 0) {
      const { data: insertedRooms, error: roomsError } = await supabase
        .from('rooms')
        .insert(roomRows)
        .select();

      if (roomsError) {
        return NextResponse.json(
          { error: roomsError.message },
          { status: 500 }
        );
      }

      createdRooms = insertedRooms || [];
    }

    const tokenRows = [];

    for (const room of createdRooms) {
      const token = await createUniqueToken();

      tokenRows.push({
        room_id: room.id,
        token,
        is_active: true
      });
    }

    if (tokenRows.length > 0) {
      const { error: tokenError } = await supabase
        .from('qr_tokens')
        .insert(tokenRows);

      if (tokenError) {
        return NextResponse.json(
          { error: tokenError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      propertyId,
      roomsCreated: createdRooms.length,
      qrTokensCreated: tokenRows.length
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}