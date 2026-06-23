"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { getPersistentCart, hydrateCartItems } from "@/src/lib/storefront/cart";
import {
  CART_MAX_QUANTITY,
  type CartActionResult,
  type CartStorageItem,
} from "@/src/lib/storefront/cart-types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateUuid(value: string) {
  return UUID_PATTERN.test(value);
}

function normalizeQuantity(value: number) {
  const quantity = Math.floor(Number(value));

  if (!Number.isFinite(quantity)) {
    return 0;
  }

  return Math.min(Math.max(quantity, 0), CART_MAX_QUANTITY);
}

function normalizeCartItems(items: CartStorageItem[]) {
  const quantityByVariantId = new Map<string, number>();

  for (const item of items) {
    if (!validateUuid(item.variantId)) {
      continue;
    }

    const quantity = normalizeQuantity(item.quantity);

    if (quantity < 1) {
      continue;
    }

    const current = quantityByVariantId.get(item.variantId) ?? 0;
    quantityByVariantId.set(
      item.variantId,
      Math.min(current + quantity, CART_MAX_QUANTITY),
    );
  }

  return Array.from(quantityByVariantId, ([variantId, quantity]) => ({
    variantId,
    quantity,
  }));
}

type AuthenticatedUserResult =
  | { userId: string; error: null }
  | { userId: null; error: string };

async function getAuthenticatedUserId(): Promise<AuthenticatedUserResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { userId: null, error: "Sign in to use your saved cart." };
  }

  return { userId: data.user.id, error: null };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Try again.";
}

async function getUpdatedCart(userId: string): Promise<CartActionResult> {
  return {
    status: "success",
    message: "Cart updated.",
    cart: await getPersistentCart(userId),
  };
}

export async function hydrateLocalCartAction(
  items: CartStorageItem[],
): Promise<CartActionResult> {
  try {
    return {
      status: "success",
      message: "Cart loaded.",
      cart: await hydrateCartItems(normalizeCartItems(items)),
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function getCurrentCartAction(): Promise<CartActionResult> {
  const auth = await getAuthenticatedUserId();

  if (auth.userId === null) {
    return { status: "error", message: auth.error };
  }

  try {
    return {
      status: "success",
      message: "Cart loaded.",
      cart: await getPersistentCart(auth.userId),
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function mergeLocalCartAction(
  items: CartStorageItem[],
): Promise<CartActionResult> {
  const auth = await getAuthenticatedUserId();

  if (auth.userId === null) {
    return { status: "error", message: auth.error };
  }

  const normalizedItems = normalizeCartItems(items);

  if (normalizedItems.length === 0) {
    return getUpdatedCart(auth.userId);
  }

  const supabase = await createClient();

  try {
    for (const item of normalizedItems) {
      const { error } = await supabase.rpc("add_cart_item", {
        p_variant_id: item.variantId,
        p_quantity: item.quantity,
      });

      if (error) {
        return { status: "error", message: error.message };
      }
    }

    revalidatePath("/cart");

    return {
      status: "success",
      message: "Your saved items were added to your cart.",
      cart: await getPersistentCart(auth.userId),
    };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function addCartItemAction({
  quantity,
  variantId,
}: {
  quantity: number;
  variantId: string;
}): Promise<CartActionResult> {
  const auth = await getAuthenticatedUserId();

  if (auth.userId === null) {
    return { status: "error", message: auth.error };
  }

  const resolvedQuantity = normalizeQuantity(quantity);

  if (!validateUuid(variantId) || resolvedQuantity < 1) {
    return { status: "error", message: "Choose a valid item quantity." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("add_cart_item", {
    p_variant_id: variantId,
    p_quantity: resolvedQuantity,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/cart");

  return {
    status: "success",
    message: "Added to cart.",
    cart: await getPersistentCart(auth.userId),
  };
}

export async function updateCartItemQuantityAction({
  quantity,
  variantId,
}: {
  quantity: number;
  variantId: string;
}): Promise<CartActionResult> {
  const auth = await getAuthenticatedUserId();

  if (auth.userId === null) {
    return { status: "error", message: auth.error };
  }

  const resolvedQuantity = normalizeQuantity(quantity);

  if (!validateUuid(variantId)) {
    return { status: "error", message: "Choose a valid cart item." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_cart_item_quantity", {
    p_variant_id: variantId,
    p_quantity: resolvedQuantity,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/cart");

  return getUpdatedCart(auth.userId);
}

export async function removeCartItemAction(
  variantId: string,
): Promise<CartActionResult> {
  const auth = await getAuthenticatedUserId();

  if (auth.userId === null) {
    return { status: "error", message: auth.error };
  }

  if (!validateUuid(variantId)) {
    return { status: "error", message: "Choose a valid cart item." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("remove_cart_item", {
    p_variant_id: variantId,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/cart");

  return getUpdatedCart(auth.userId);
}

export async function emptyCartAction(): Promise<CartActionResult> {
  const auth = await getAuthenticatedUserId();

  if (auth.userId === null) {
    return { status: "error", message: auth.error };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("empty_active_cart");

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/cart");

  return {
    status: "success",
    message: "Cart emptied.",
    cart: await getPersistentCart(auth.userId),
  };
}
