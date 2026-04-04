# RoomFlow Multi-Property Branding MVP

This build upgrades RoomFlow from a single-property tipping skeleton into a multi-property, branding-aware MVP.

## Included
- Multi-property data model
- Property branding (logo URL, colors, messages, tip presets)
- QR token routing by room
- Property-aware guest tipping flow
- Stripe Checkout session creation
- Stripe webhook persistence to Supabase
- Basic property-aware admin pages

## Environment Variables
Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Run
```bash
npm install
npm run dev
```

## Database
Run `supabase/schema.sql` in the Supabase SQL editor.

## Notes
- This MVP assumes pooled housekeeping tips per property.
- Admin auth and row-level access controls are intentionally minimal in this version.
- Property branding is driven by the `properties` table.
