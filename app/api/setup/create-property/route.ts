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

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const propertyType = String(formData.get('propertyType') || '');
    const propertyName = String(formData.get('propertyName') || '');
    const city = String(formData.get('city') || '');
    const stateName = String(formData.get('stateName') || '');
    const primaryColor = String(formData.get('primaryColor') || '#0B102F');
    const accentColor = String(formData.get('accentColor') || '#B88A44');
    const roomCount = Number(formData.get('roomCount') || 0);
    const monthlyPriceRaw = String(formData.get('monthlyPrice') || '');
    const monthlyPrice = monthlyPriceRaw ? Number(monthlyPriceRaw) : null;
    const roomsRaw = String(formData.get('rooms') || '[]');
    const launchMode = String(formData.get('launchMode') || 'pilot');

    let rooms: string[] = [];

    try {
      rooms = JSON.parse(roomsRaw);
    } catch {
      rooms = [];
    }

    if (!propertyName) {
      return NextResponse.json(
        { error: 'Property name is required.' },
        { status: 400 }
      );
    }

    if (launchMode !== 'active' && rooms.length > 5) {
      return NextResponse.json(
        {
          error:
            'Pilot limit reached. Contact RoomFlow to activate your full property.'
        },
        { status: 400 }
      );
    }

    let logoUrl: string | null = null;
    const logoFile = formData.get('logo');

    if (logoFile instanceof File && logoFile.size > 0) {
      const fileExt = logoFile.name.split('.').pop() || 'png';
      const fileName = `${Date.now()}-${safeFileName(propertyName)}.${fileExt}`;
      const filePath = `${safeFileName(propertyName)}/${fileName}`;

      const arrayBuffer = await logoFile.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('Logos')
        .upload(filePath, arrayBuffer, {
          contentType: logoFile.type || 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error('Logo upload error:', uploadError);
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from('Logos')
        .getPublicUrl(filePath);

      logoUrl = publicUrlData.publicUrl;
    }

    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        name: propertyName,
        property_type: propertyType,
        city,
        state: stateName,
        primary_color: primaryColor,
        accent_color: accentColor,
        logo_url: logoUrl,
        tip_preset_1: 5,
        tip_preset_2: 10,
        tip_preset_3: 20,
        welcome_message: 'Thank you for your stay.',
        thank_you_message: 'Thank you for your support.',
        monthly_price: monthlyPrice,
        room_count: roomCount,
        status: 'pilot',
        pilot_started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (propertyError) {
      console.error('Property insert error:', propertyError);
      return NextResponse.json(
        { error: propertyError.message },
        { status: 500 }
      );
    }

    const roomRows = (rooms || []).map((roomNumber: string) => ({
      property_id: property.id,
      room_number: roomNumber
    }));

    let createdRooms: any[] = [];

    if (roomRows.length > 0) {
      const { data: insertedRooms, error: roomsError } = await supabase
        .from('rooms')
        .insert(roomRows)
        .select();

      if (roomsError) {
        console.error('Rooms insert error:', roomsError);
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
        console.error('QR token insert error:', tokenError);
        return NextResponse.json(
          { error: tokenError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      propertyId: property.id,
      roomsCreated: createdRooms.length,
      qrTokensCreated: tokenRows.length,
      logoUrl
    });
  } catch (error: any) {
    console.error('Create property error:', error);

    return NextResponse.json(
      { error: error.message || 'Something went wrong.' },
      { status: 500 }
    );
  }
}