begin;

create or replace function public.hmart_shipping_amount(p_subtotal numeric)
returns numeric
language sql
immutable
as $$
  select case when coalesce(p_subtotal, 0) >= 1000 then 0::numeric else 99::numeric end;
$$;

create or replace function public.create_order_from_cart(p_address_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  active_cart_id uuid;
  selected_address public.addresses%rowtype;
  new_order_id uuid;
  new_order_number text;
  subtotal_amount numeric(12, 2);
  discount_amount numeric(12, 2) := 0;
  tax_amount numeric(12, 2);
  shipping_amount numeric(12, 2);
  grand_total_amount numeric(12, 2);
  address_snapshot text;
  cart_item record;
  inventory_row record;
  remaining_quantity integer;
  reserve_quantity integer;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Sign in to place an order.';
  end if;

  select *
  into selected_address
  from public.addresses
  where id = p_address_id
    and user_id = current_user_id
    and type = 'shipping';

  if selected_address.id is null then
    raise exception 'Select a valid shipping address.';
  end if;

  select id
  into active_cart_id
  from public.carts
  where user_id = current_user_id
    and status = 'active'
  limit 1;

  if active_cart_id is null then
    raise exception 'Your cart is empty.';
  end if;

  if not exists (
    select 1 from public.cart_items where cart_id = active_cart_id
  ) then
    raise exception 'Your cart is empty.';
  end if;

  for cart_item in
    select
      ci.variant_id,
      ci.quantity,
      pv.sku,
      public.get_variant_available_stock(ci.variant_id) as available_stock
    from public.cart_items ci
    join public.product_variants pv on pv.id = ci.variant_id
    join public.products p on p.id = pv.product_id
    where ci.cart_id = active_cart_id
      and pv.is_active is distinct from false
      and p.status = 'active'
      and p.deleted_at is null
  loop
    if cart_item.quantity > cart_item.available_stock then
      raise exception 'Only % item(s) are available for %.', cart_item.available_stock, cart_item.sku;
    end if;
  end loop;

  select
    round(sum(ci.quantity * pv.price), 2),
    round(sum((ci.quantity * pv.price) * coalesce(pv.tax_rate, 18) / 100), 2)
  into subtotal_amount, tax_amount
  from public.cart_items ci
  join public.product_variants pv on pv.id = ci.variant_id
  join public.products p on p.id = pv.product_id
  where ci.cart_id = active_cart_id
    and pv.is_active is distinct from false
    and p.status = 'active'
    and p.deleted_at is null;

  if subtotal_amount is null or subtotal_amount <= 0 then
    raise exception 'Your cart does not contain purchasable items.';
  end if;

  tax_amount := coalesce(tax_amount, 0);
  shipping_amount := public.hmart_shipping_amount(subtotal_amount);
  grand_total_amount := subtotal_amount - discount_amount + tax_amount + shipping_amount;
  new_order_number := 'HM-' || to_char(now(), 'YYYYMMDD') || '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  address_snapshot := concat_ws(
    E'\n',
    selected_address.recipient_name || ' · ' || selected_address.phone,
    selected_address.line1,
    nullif(selected_address.line2, ''),
    selected_address.city || ', ' || selected_address.state || ' ' || selected_address.postal_code,
    selected_address.country
  );

  insert into public.orders (
    order_number,
    buyer_id,
    organization_id,
    status,
    currency,
    coupon_id,
    coupon_code_snapshot,
    subtotal,
    discount_total,
    tax_total,
    shipping_total,
    grand_total,
    notes
  )
  values (
    new_order_number,
    current_user_id,
    selected_address.organization_id,
    'pending',
    'INR',
    null,
    null,
    subtotal_amount,
    discount_amount,
    tax_amount,
    shipping_amount,
    grand_total_amount,
    address_snapshot
  )
  returning id into new_order_id;

  for cart_item in
    select
      ci.variant_id,
      ci.quantity,
      pv.sku,
      pv.price,
      pv.attributes,
      coalesce(pv.tax_rate, 18) as tax_rate,
      p.name as product_name
    from public.cart_items ci
    join public.product_variants pv on pv.id = ci.variant_id
    join public.products p on p.id = pv.product_id
    where ci.cart_id = active_cart_id
      and pv.is_active is distinct from false
      and p.status = 'active'
      and p.deleted_at is null
  loop
    remaining_quantity := cart_item.quantity;

    for inventory_row in
      select
        variant_id,
        location_id,
        quantity_on_hand,
        quantity_reserved,
        greatest(quantity_on_hand - quantity_reserved, 0) as available_quantity
      from public.inventory
      where variant_id = cart_item.variant_id
        and quantity_on_hand > quantity_reserved
      order by updated_at asc
      for update
    loop
      exit when remaining_quantity <= 0;

      reserve_quantity := least(remaining_quantity, inventory_row.available_quantity);

      update public.inventory
      set
        quantity_reserved = quantity_reserved + reserve_quantity,
        quantity_available = greatest(
          quantity_on_hand - (quantity_reserved + reserve_quantity),
          0
        ),
        updated_at = now()
      where variant_id = inventory_row.variant_id
        and location_id = inventory_row.location_id;

      remaining_quantity := remaining_quantity - reserve_quantity;
    end loop;

    if remaining_quantity > 0 then
      raise exception 'Unable to reserve enough inventory for %.', cart_item.sku;
    end if;

    insert into public.order_items (
      order_id,
      variant_id,
      sku_snapshot,
      product_name_snapshot,
      variant_attributes_snapshot,
      quantity,
      unit_price,
      discount_amount,
      tax_amount,
      line_total
    )
    values (
      new_order_id,
      cart_item.variant_id,
      cart_item.sku,
      cart_item.product_name,
      cart_item.attributes,
      cart_item.quantity,
      cart_item.price,
      0,
      round((cart_item.quantity * cart_item.price) * cart_item.tax_rate / 100, 2),
      round(cart_item.quantity * cart_item.price, 2)
    );
  end loop;

  delete from public.cart_items
  where cart_id = active_cart_id;

  update public.carts
  set
    status = 'converted',
    updated_at = now()
  where id = active_cart_id;

  return new_order_id;
end;
$$;

revoke all on function public.hmart_shipping_amount(numeric) from public;
revoke all on function public.create_order_from_cart(uuid) from public;

grant execute on function public.hmart_shipping_amount(numeric) to authenticated;
grant execute on function public.create_order_from_cart(uuid) to authenticated;

commit;
