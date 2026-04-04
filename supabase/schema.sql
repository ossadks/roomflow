create extension if not exists pgcrypto;

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  state text,
  logo_url text,
  primary_color text default '#111827',
  accent_color text default '#0f766e',
  welcome_message text default 'Thank you for staying with us.',
  thank_you_message text default 'Thank you for supporting our housekeeping team.',
  tip_preset_1 integer not null default 5,
  tip_preset_2 integer not null default 10,
  tip_preset_3 integer not null default 15,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  room_number text not null,
  floor_label text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(property_id, room_number)
);

create table if not exists qr_tokens (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null unique references rooms(id) on delete cascade,
  token text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists tips (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  room_id uuid not null references rooms(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  currency text not null default 'usd',
  guest_note text,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'properties_set_updated_at') then
    create trigger properties_set_updated_at
    before update on properties
    for each row execute function set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'rooms_set_updated_at') then
    create trigger rooms_set_updated_at
    before update on rooms
    for each row execute function set_updated_at();
  end if;
end $$;

alter table properties enable row level security;
alter table rooms enable row level security;
alter table qr_tokens enable row level security;
alter table tips enable row level security;
