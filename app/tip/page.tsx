import BrandShell from '@/components/BrandShell';
import TipOptions from '@/components/TipOptions';
import { getRoomFlowContextByToken } from '@/lib/get-roomflow-context';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TipPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main style={{ padding: 32, fontFamily: 'Arial, sans-serif' }}>
        <h1>Missing RoomFlow token</h1>
      </main>
    );
  }

  const context = await getRoomFlowContextByToken(token);

  if (!context) {
    return (
      <main style={{ padding: 32, fontFamily: 'Arial, sans-serif' }}>
        <h1>RoomFlow link unavailable</h1>
      </main>
    );
  }

  return (
    <BrandShell property={context.property}>
      <TipOptions context={context} />
    </BrandShell>
  );
}
