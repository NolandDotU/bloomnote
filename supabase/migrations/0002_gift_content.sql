-- Single-row CMS store: whole gift document as JSON.
create table if not exists public.gift_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.gift_content enable row level security;

-- Server uses the service-role key only; no public policies on purpose.

-- Storage bucket for admin uploads.
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;
