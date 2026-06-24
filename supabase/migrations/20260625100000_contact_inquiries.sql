begin;

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'general',
  name text not null,
  email text not null,
  phone text,
  order_reference text,
  message text not null,
  image_url text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_inquiries_status_idx on public.contact_inquiries (status);
create index if not exists contact_inquiries_created_at_idx on public.contact_inquiries (created_at desc);

alter table public.contact_inquiries enable row level security;

create policy "Anyone can create inquiries" on public.contact_inquiries
  for insert to anon, authenticated
  with check (true);

create policy "Admins can read all inquiries" on public.contact_inquiries
  for select to authenticated
  using (public.user_has_role('admin'));

create policy "Admins can update inquiries" on public.contact_inquiries
  for update to authenticated
  using (public.user_has_role('admin'))
  with check (public.user_has_role('admin'));

commit;
