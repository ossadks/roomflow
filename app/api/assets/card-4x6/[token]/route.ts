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
    width: 900,
    margin: 2
  });

  const pdfDoc = await PDFDocument.create();

  // 4x6 inches = 288 x 432 PDF points
  const page = pdfDoc.addPage([288, 432]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const qrImage = await pdfDoc.embedPng(qrPng);

  const primary = hexToRgb(property.primary_color || '#0B102F');
  const accent = hexToRgb(property.accent_color || '#B88A44');

  // Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 288,
    height: 432,
    color: rgb(1, 1, 1)
  });

  // Optional subtle border
  page.drawRectangle({
    x: 18,
    y: 18,
    width: 252,
    height: 396,
    borderColor: rgb(primary.r, primary.g, primary.b),
    borderWidth: 0.8
  });

  // Logo or placeholder
  if (property.logo_url) {
    try {
      const logoRes = await fetch(property.logo_url);
      const logoBytes = await logoRes.arrayBuffer();

      let logoImage;

      if (property.logo_url.toLowerCase().includes('.jpg') || property.logo_url.toLowerCase().includes('.jpeg')) {
        logoImage = await pdfDoc.embedJpg(logoBytes);
      } else {
        logoImage = await pdfDoc.embedPng(logoBytes);
      }

      const logoDims = logoImage.scale(1);
      const maxLogoWidth = 110;
      const maxLogoHeight = 100;

      const scale = Math.min(
        maxLogoWidth / logoDims.width,
        maxLogoHeight / logoDims.height
      );

      const logoWidth = logoDims.width * scale;
      const logoHeight = logoDims.height * scale;

      page.drawImage(logoImage, {
        x: (288 - logoWidth) / 2,
        y: 305,
        width: logoWidth,
        height: logoHeight
      });
    } catch {
      drawLogoPlaceholder(page, boldFont, primary);
    }
  } else {
    drawLogoPlaceholder(page, boldFont, primary);
  }

  // Main headline
  drawCenteredText(
    page,
    'Tipping Made Easy',
    282,
    22,
    boldFont,
    rgb(primary.r, primary.g, primary.b)
   );

  // Support line
  drawCenteredText(
    page,
    'Support your cleaning team with a',
    252,
    12,
    font,
    rgb(0.08, 0.09, 0.12)
  );

  drawCenteredText(
    page,
    'quick digital tip.',
    235,
    13,
    boldFont,
    rgb(0.08, 0.09, 0.12)
  );

  // QR container
  page.drawRectangle({
    x: 51,
    y: 94,
    width: 186,
    height: 118,
    borderColor: rgb(primary.r, primary.g, primary.b),
    borderWidth: 0.8
  });

  page.drawImage(qrImage, {
    x: 89,
    y: 100,
    width: 110,
    height: 110
  });

  // Scan bar
  page.drawRectangle({
    x: 51,
    y: 58,
    width: 186,
    height: 40,
    color: rgb(accent.r, accent.g, accent.b)
  });

  drawCenteredText(page, 'Scan to tip', 69, 19, boldFont, rgb(1, 1, 1));

  // Footer
  drawCenteredText(
    page,
    'Powered by RoomFlow',
    34,
    11,
    font,
    rgb(0.05, 0.06, 0.08)
  );

  const pdfBytes = await pdfDoc.save();

  return new Response(new Uint8Array(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="roomflow-4x6-${token}.pdf"`
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
    x: (288 - width) / 2,
    y,
    size,
    font,
    color
  });
}

function drawLogoPlaceholder(page: any, font: any, primary: any) {
  page.drawRectangle({
    x: 112,
    y: 336,
    width: 64,
    height: 64,
    color: rgb(primary.r, primary.g, primary.b)
  });

  drawCenteredText(page, 'Logo', 366, 10, font, rgb(1, 1, 1));
  drawCenteredText(page, 'Placeholder', 352, 10, font, rgb(1, 1, 1));
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