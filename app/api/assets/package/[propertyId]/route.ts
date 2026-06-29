import JSZip from 'jszip';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;

const requestUrl = new URL(req.url);
const domain = `${requestUrl.protocol}//${requestUrl.host}`;

  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('id, name')
    .eq('id', propertyId)
    .single();

  if (propertyError || !property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  const { data: tokens, error: tokenError } = await supabase
    .from('qr_tokens')
    .select(`
      id,
      token,
      rooms (
        room_number,
        property_id
      )
    `);

  if (tokenError) {
    return NextResponse.json({ error: tokenError.message }, { status: 500 });
  }

  const propertyTokens =
    tokens?.filter((row: any) => row.rooms?.property_id === propertyId) || [];

  if (propertyTokens.length === 0) {
    return NextResponse.json(
      { error: 'No QR tokens found for this property' },
      { status: 404 }
    );
  }

  const zip = new JSZip();

  const safePropertyName = safeName(property.name || 'roomflow-property');

  for (const item of propertyTokens as any[]) {
    const roomNumber = item.rooms?.room_number || 'property';
    const folder = zip.folder(safeName(String(roomNumber)));

    const qrUrl = `${domain}/api/assets/qr/${item.token}`;
    const cardUrl = `${domain}/api/assets/card-4x6/${item.token}`;
    const posterUrl = `${domain}/api/assets/poster-8x11/${item.token}`;

    const [qrRes, cardRes, posterRes] = await Promise.all([
      fetch(qrUrl),
      fetch(cardUrl),
      fetch(posterUrl)
    ]);

    if (!qrRes.ok || !cardRes.ok || !posterRes.ok) {
      throw new Error(`Failed generating assets for ${roomNumber}`);
    }

    const qrBuffer = await qrRes.arrayBuffer();
    const cardBuffer = await cardRes.arrayBuffer();
    const posterBuffer = await posterRes.arrayBuffer();

    folder?.file(`roomflow-qr-${roomNumber}.png`, qrBuffer);
    folder?.file(`roomflow-4x6-${roomNumber}.pdf`, cardBuffer);
    folder?.file(`roomflow-8x11-${roomNumber}.pdf`, posterBuffer);
  }

  const zipArrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });

  return new Response(zipArrayBuffer, {
    headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${safePropertyName}-roomflow-assets.zip"`
    }
  });
}

function safeName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}