import { createClient } from "@/src/lib/supabase/server";
import { getPersistentCart } from "@/src/lib/storefront/cart";
import {
  CHECKOUT_FREE_SHIPPING_THRESHOLD,
  CHECKOUT_SHIPPING_AMOUNT,
  type CheckoutAddress,
  type CheckoutData,
  type CheckoutTotals,
} from "./types";

type AddressRecord = {
  id: string;
  recipient_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

type TaxRateRecord = {
  id: string;
  tax_rate: number | null;
};

export function calculateCheckoutTotals(subtotal: number, tax = 0): CheckoutTotals {
  const shipping =
    subtotal >= CHECKOUT_FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : CHECKOUT_SHIPPING_AMOUNT;

  return {
    subtotal,
    shipping,
    tax,
    grandTotal: subtotal + shipping + tax,
  };
}

async function calculateCartTax(cart: CheckoutData["cart"]) {
  if (cart.items.length === 0) {
    return 0;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("id, tax_rate")
    .in(
      "id",
      cart.items.map((item) => item.variantId),
    )
    .returns<TaxRateRecord[]>();

  if (error) {
    return 0;
  }

  const taxRateByVariantId = new Map(
    (data ?? []).map((row) => [row.id, row.tax_rate ?? 18]),
  );

  return Math.round(
    cart.items.reduce((sum, item) => {
      const taxRate = taxRateByVariantId.get(item.variantId) ?? 18;

      return sum + item.lineSubtotal * (taxRate / 100);
    }, 0) * 100,
  ) / 100;
}

function mapAddress(row: AddressRecord): CheckoutAddress {
  return {
    id: row.id,
    recipientName: row.recipient_name,
    phone: row.phone,
    line1: row.line1,
    line2: row.line2,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country,
    isDefault: row.is_default,
  };
}

export async function getCheckoutData(userId: string): Promise<CheckoutData> {
  const supabase = await createClient();

  const [cart, addressesResult] = await Promise.all([
    getPersistentCart(userId),
    supabase
      .from("addresses")
      .select(
        "id, recipient_name, phone, line1, line2, city, state, postal_code, country, is_default",
      )
      .eq("user_id", userId)
      .eq("type", "shipping")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .returns<AddressRecord[]>(),
  ]);
  const tax = await calculateCartTax(cart);

  if (addressesResult.error) {
    return {
      addresses: [],
      cart,
      totals: calculateCheckoutTotals(cart.summary.subtotal, tax),
      error: addressesResult.error.message,
    };
  }

  return {
    addresses: (addressesResult.data ?? []).map(mapAddress),
    cart,
    totals: calculateCheckoutTotals(cart.summary.subtotal, tax),
    error: null,
  };
}
