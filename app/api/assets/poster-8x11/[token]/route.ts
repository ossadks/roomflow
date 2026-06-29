import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('qr_tokens')
    .select(`
      token,
      rooms (
        room_number,
        properties (
          name,
          city,
          state,
          logo_url,
          primary_color,
          accent_color
        )
      )
    `)
    .eq('token', token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'QR token not found' }, { status: 404 });
  }

  const room: any = data.rooms;
  const property = room.properties;

  const domain =
    process.env.NEXT_PUBLIC_DOMAIN || 'https://roomflow-one.vercel.app';

  const guestUrl = `${domain}/q/${token}`;

  const qrPng = await QRCode.toBuffer(guestUrl, {
    type: 'png',
    width: 1200,
    margin: 2
  });

  const pdfDoc = await PDFDocument.create();

  // Letter size 8.5 x 11 inches = 612 x 792 points
  const page = pdfDoc.addPage([612, 792]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const qrImage = await pdfDoc.embedPng(qrPng);

  const primary = hexToRgb(property.primary_color || '#0B102F');
  const accent = hexToRgb(property.accent_color || '#B88A44');

  page.drawRectangle({
    x: 0,
    y: 0,
    width: 612,
    height: 792,
    color: rgb(1, 1, 1)
  });

  page.drawRectangle({
    x: 54,
    y: 54,
    width: 504,
    height: 684,
    borderColor: rgb(primary.r, primary.g, primary.b),
    borderWidth: 1.2
  });

  if (property.logo_url) {
    try {
      const logoRes = await fetch(property.logo_url);
      const logoBytes = await logoRes.arrayBuffer();

      let logoImage;

      if (
        property.logo_url.toLowerCase().includes('.jpg') ||
        property.logo_url.toLowerCase().includes('.jpeg')
      ) {
        logoImage = await pdfDoc.embedJpg(logoBytes);
      } else {
        logoImage = await pdfDoc.embedPng(logoBytes);
      }

      const dims = logoImage.scale(1);
      const maxLogoWidth = 170;
      const maxLogoHeight = 170;

      const scale = Math.min(
        maxLogoWidth / dims.width,
        maxLogoHeight / dims.height
      );

      const logoWidth = dims.width * scale;
      const logoHeight = dims.height * scale;

      page.drawImage(logoImage, {
        x: (612 - logoWidth) / 2,
        y: 560,
        width: logoWidth,
        height: logoHeight
      });
    } catch {
      drawLogoPlaceholder(page, boldFont, primary);
    }
  } else {
    drawLogoPlaceholder(page, boldFont, primary);
  }

  drawCenteredText(
    page,
    'Tipping Made Easy',
    515,
    46,
    boldFont,
    rgb(primary.r, primary.g, primary.b)
  );

  drawCenteredText(
    page,
    'Support your cleaning team with a',
    470,
    24,
    font,
    rgb(0.08, 0.09, 0.12)
  );

  drawCenteredText(
    page,
    'quick digital tip.',
    438,
    26,
    boldFont,
    rgb(0.08, 0.09, 0.12)
  );

  page.drawRectangle({
    x: 126,
    y: 192,
    width: 360,
    height: 230,
    borderColor: rgb(primary.r, primary.g, primary.b),
    borderWidth: 1
  });

  page.drawImage(qrImage, {
    x: 207,
    y: 211,
    width: 198,
    height: 198
  });

  page.drawRectangle({
    x: 126,
    y: 132,
    width: 360,
    height: 60,
    color: rgb(accent.r, accent.g, accent.b)
  });

  drawCenteredText(page, 'Scan to tip', 151, 36, boldFont, rgb(1, 1, 1));

  drawCenteredText(
    page,
    'Powered by RoomFlow',
    92,
    18,
    font,
    rgb(0.05, 0.06, 0.08)
  );

  const pdfBytes = await pdfDoc.save();

  return new Response(new Uint8Array(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="roomflow-8x11-${token}.pdf"`
    }
  });
}

function drawCenteredText(
  page: any,
  text: string,
  y: number,
  size: number,
  font: any,
  color: any
) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: (612 - width) / 2,
    y,
    size,
    font,
    color
  });
}

function drawLogoPlaceholder(page: any, font: any, primary: any) {
  page.drawRectangle({
    x: 256,
    y: 624,
    width: 100,
    height: 100,
    color: rgb(primary.r, primary.g, primary.b)
  });

  drawCenteredText(page, 'Logo', 674, 16, font, rgb(1, 1, 1));
  drawCenteredText(page, 'Placeholder', 650, 16, font, rgb(1, 1, 1));
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);

  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255
  };
}