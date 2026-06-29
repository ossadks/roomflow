import { NextResponse } from 'next/server';
import { getPropertyReport } from '@/lib/reports';
import { getProperty } from '@/lib/properties';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;

  const property = await getProperty(propertyId);

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  const report = await getPropertyReport(propertyId);

  const rows = [
    ['Date', 'Room / Unit', 'Amount', 'Currency', 'Guest Note', 'Stripe Session ID']
  ];

  for (const tip of report.tips as any[]) {
    rows.push([
      new Date(tip.created_at).toISOString(),
      tip.rooms?.room_number || 'Property',
      String(tip.amount || 0),
      tip.currency || 'usd',
      tip.guest_note || '',
      tip.stripe_session_id || ''
    ]);
  }

  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  const safeName = String(property.name || 'roomflow-property')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${safeName}-tip-report.csv"`
    }
  });
}