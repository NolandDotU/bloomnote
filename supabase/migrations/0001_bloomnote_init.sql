create extension if not exists "pgcrypto";

create type public.opening_kind as enum ('notebook', 'envelope', 'music-box');
create type public.world_kind as enum ('underwater', 'night-garden', 'paper-meadow');
create type public.media_kind as enum ('photo', 'voice');
create type public.link_kind as enum ('spotify', 'youtube');

create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-zA-Z0-9_-]{12,32}$'),
  opening public.opening_kind not null,
  lock jsonb not null default '{"kind":"none"}'::jsonb,
  world public.world_kind not null,
  letter jsonb not null default '{}'::jsonb,
  bouquet jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  deleted_at timestamptz
);

create table public.gift_media (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.gifts(id) on delete cascade,
  kind public.media_kind not null,
  url text not null,
  caption text,
  taken_at date,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.gift_links (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.gifts(id) on delete cascade,
  type public.link_kind not null,
  url text not null,
  title text,
  created_at timestamptz not null default now()
);

create table public.gift_pins (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.gifts(id) on delete cascade,
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  title text not null,
  media_id uuid references public.gift_media(id) on delete set null
);

create index gifts_owner_id_idx on public.gifts(owner_id);
create index gifts_slug_published_idx on public.gifts(slug) where deleted_at is null and published_at is not null;
create index gift_media_gift_id_idx on public.gift_media(gift_id);
create index gift_links_gift_id_idx on public.gift_links(gift_id);

alter table public.gifts enable row level security;
alter table public.gift_media enable row level security;
alter table public.gift_links enable row level security;
alter table public.gift_pins enable row level security;

create policy "owners can manage gifts" on public.gifts for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners can manage gift media" on public.gift_media for all using (exists (select 1 from public.gifts where gifts.id = gift_media.gift_id and gifts.owner_id = auth.uid())) with check (exists (select 1 from public.gifts where gifts.id = gift_media.gift_id and gifts.owner_id = auth.uid()));
create policy "owners can manage gift links" on public.gift_links for all using (exists (select 1 from public.gifts where gifts.id = gift_links.gift_id and gifts.owner_id = auth.uid())) with check (exists (select 1 from public.gifts where gifts.id = gift_links.gift_id and gifts.owner_id = auth.uid()));
create policy "owners can manage gift pins" on public.gift_pins for all using (exists (select 1 from public.gifts where gifts.id = gift_pins.gift_id and gifts.owner_id = auth.uid())) with check (exists (select 1 from public.gifts where gifts.id = gift_pins.gift_id and gifts.owner_id = auth.uid()));

-- Public gifts are intentionally read by the server service-role route only.
