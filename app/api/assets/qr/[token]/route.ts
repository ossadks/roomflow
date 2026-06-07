import QRCode from 'qrcode';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://roomflow-one.vercel.app';
  const guestUrl = `${domain}/q/${token}`;

  const pngBuffer = await QRCode.toBuffer(guestUrl, {
    type: 'png',
    width: 900,
    margin: 2
  });

  const body = new Uint8Array(pngBuffer);

  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="roomflow-qr-${token}.png"`
    }
  });
}