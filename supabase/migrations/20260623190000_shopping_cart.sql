begin;

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'converted', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists carts_user_active_unique_idx
  on public.carts (user_id)
  where status = 'active';

create index if not exists carts_user_id_idx
  on public.carts (user_id);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

create index if not exists cart_items_cart_id_idx
  on public.cart_items (cart_id);

create index if not exists cart_items_variant_id_idx
  on public.cart_items (variant_id);

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'carts'
      and policyname = 'Users can read their own carts'
  ) then
    create policy "Users can read their own carts"
    on public.carts
    for select
    to authenticated
    using ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'carts'
      and policyname = 'Users can create their own carts'
  ) then
    create policy "Users can create their own carts"
    on public.carts
    for insert
    to authenticated
    with check ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'carts'
      and policyname = 'Users can update their own carts'
  ) then
    create policy "Users can update their own carts"
    on public.carts
    for update
    to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'carts'
      and policyname = 'Users can delete their own carts'
  ) then
    create policy "Users can delete their own carts"
    on public.carts
    for delete
    to authenticated
    using ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'cart_items'
      and policyname = 'Users can read items in their own carts'
  ) then
    create policy "Users can read items in their own carts"
    on public.cart_items
    for select
    to authenticated
    using (
      exists (
        select 1
        from public.carts
        where carts.id = cart_items.cart_id
          and carts.user_id = (select auth.uid())
      )
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'cart_items'
      and policyname = 'Users can create items in their own carts'
  ) then
    create policy "Users can create items in their own carts"
    on public.cart_items
    for insert
    to authenticated
    with check (
      exists (
        select 1
        from public.carts
        where carts.id = cart_items.cart_id
          and carts.user_id = (select auth.uid())
      )
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'cart_items'
      and policyname = 'Users can update items in their own carts'
  ) then
    create policy "Users can update items in their own carts"
    on public.cart_items
    for update
    to authenticated
    using (
      exists (
        select 1
        from public.carts
        where carts.id = cart_items.cart_id
          and carts.user_id = (select auth.uid())
      )
    )
    with check (
      exists (
        select 1
        from public.carts
        where carts.id = cart_items.cart_id
          and carts.user_id = (select auth.uid())
      )
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'cart_items'
      and policyname = 'Users can delete items in their own carts'
  ) then
    create policy "Users can delete items in their own carts"
    on public.cart_items
    for delete
    to authenticated
    using (
      exists (
        select 1
        from public.carts
        where carts.id = cart_items.cart_id
          and carts.user_id = (select auth.uid())
      )
    );
  end if;
end;
$$;

create or replace function public.get_variant_available_stock(p_variant_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    sum(greatest(inventory.quantity_on_hand - inventory.quantity_reserved, 0)),
    0
  )::integer
  from public.inventory
  where inventory.variant_id = p_variant_id;
$$;

create or replace function public.get_active_cart_id()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  active_cart_id uuid;
  current_user_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Sign in to use your saved cart.';
  end if;

  select carts.id
  into active_cart_id
  from public.carts
  where carts.user_id = current_user_id
    and carts.status = 'active'
  limit 1;

  if active_cart_id is null then
    insert into public.carts (user_id)
    values (current_user_id)
    returning id into active_cart_id;
  end if;

  return active_cart_id;
end;
$$;

create or replace function public.assert_variant_cartable(
  p_variant_id uuid,
  p_quantity integer
)
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  available_stock integer;
  variant_exists boolean;
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Quantity must be at least 1.';
  end if;

  select exists (
    select 1
    from public.product_variants
    join public.products on products.id = product_variants.product_id
    where product_variants.id = p_variant_id
      and product_variants.is_active is distinct from false
      and products.status = 'active'
      and products.deleted_at is null
  )
  into variant_exists;

  if not variant_exists then
    raise exception 'This product variant is no longer available.';
  end if;

  available_stock := public.get_variant_available_stock(p_variant_id);

  if p_quantity > available_stock then
    raise exception 'Only % item(s) are available for this variant.', available_stock;
  end if;
end;
$$;

create or replace function public.add_cart_item(
  p_variant_id uuid,
  p_quantity integer default 1
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  active_cart_id uuid;
  existing_quantity integer;
  requested_quantity integer;
begin
  active_cart_id := public.get_active_cart_id();

  select cart_items.quantity
  into existing_quantity
  from public.cart_items
  where cart_items.cart_id = active_cart_id
    and cart_items.variant_id = p_variant_id;

  requested_quantity := coalesce(existing_quantity, 0) + p_quantity;

  perform public.assert_variant_cartable(p_variant_id, requested_quantity);

  insert into public.cart_items (cart_id, variant_id, quantity)
  values (active_cart_id, p_variant_id, p_quantity)
  on conflict (cart_id, variant_id)
  do update set
    quantity = requested_quantity,
    updated_at = now();

  update public.carts
  set updated_at = now()
  where id = active_cart_id;
end;
$$;

create or replace function public.update_cart_item_quantity(
  p_variant_id uuid,
  p_quantity integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  active_cart_id uuid;
  item_exists boolean;
begin
  active_cart_id := public.get_active_cart_id();

  if p_quantity <= 0 then
    delete from public.cart_items
    where cart_id = active_cart_id
      and variant_id = p_variant_id;

    update public.carts
    set updated_at = now()
    where id = active_cart_id;

    return;
  end if;

  perform public.assert_variant_cartable(p_variant_id, p_quantity);

  select exists (
    select 1
    from public.cart_items
    where cart_id = active_cart_id
      and variant_id = p_variant_id
  )
  into item_exists;

  if not item_exists then
    raise exception 'This item is not in your cart.';
  end if;

  update public.cart_items
  set
    quantity = p_quantity,
    updated_at = now()
  where cart_id = active_cart_id
    and variant_id = p_variant_id;

  update public.carts
  set updated_at = now()
  where id = active_cart_id;
end;
$$;

create or replace function public.remove_cart_item(p_variant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  active_cart_id uuid;
begin
  active_cart_id := public.get_active_cart_id();

  delete from public.cart_items
  where cart_id = active_cart_id
    and variant_id = p_variant_id;

  update public.carts
  set updated_at = now()
  where id = active_cart_id;
end;
$$;

create or replace function public.empty_active_cart()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  active_cart_id uuid;
begin
  active_cart_id := public.get_active_cart_id();

  delete from public.cart_items
  where cart_id = active_cart_id;

  update public.carts
  set updated_at = now()
  where id = active_cart_id;
end;
$$;

revoke all on function public.get_variant_available_stock(uuid) from public;
revoke all on function public.get_active_cart_id() from public;
revoke all on function public.assert_variant_cartable(uuid, integer) from public;
revoke all on function public.add_cart_item(uuid, integer) from public;
revoke all on function public.update_cart_item_quantity(uuid, integer) from public;
revoke all on function public.remove_cart_item(uuid) from public;
revoke all on function public.empty_active_cart() from public;

grant select, insert, update, delete on public.carts to authenticated;
grant select, insert, update, delete on public.cart_items to authenticated;

grant execute on function public.get_variant_available_stock(uuid) to authenticated;
grant execute on function public.get_active_cart_id() to authenticated;
grant execute on function public.add_cart_item(uuid, integer) to authenticated;
grant execute on function public.update_cart_item_quantity(uuid, integer) to authenticated;
grant execute on function public.remove_cart_item(uuid) to authenticated;
grant execute on function public.empty_active_cart() to authenticated;

commit;
