"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import type { CheckoutActionState } from "./types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;

type AddressInput = {
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

type AddressValidationResult =
  | { data: AddressInput; error?: never }
  | { data?: never; error: string };

async function getCurrentUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { userId: null, error: "Sign in to continue checkout." };
  }

  return { userId: data.user.id, error: null };
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalStringValue(formData: FormData, key: string) {
  const value = getStringValue(formData, key);

  return value ? value : null;
}

function validateUuid(value: string) {
  return UUID_PATTERN.test(value);
}

function validateAddress(formData: FormData): AddressValidationResult {
  const fullName = getStringValue(formData, "fullName");
  const phone = getStringValue(formData, "phone");
  const line1 = getStringValue(formData, "line1");
  const line2 = getOptionalStringValue(formData, "line2");
  const city = getStringValue(formData, "city");
  const state = getStringValue(formData, "state");
  const postalCode = getStringValue(formData, "postalCode");
  const country = getStringValue(formData, "country") || "India";
  const isDefault = formData.get("isDefault") === "on";

  if (fullName.length < 2 || fullName.length > 120) {
    return { error: "Enter a recipient name between 2 and 120 characters." };
  }

  if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {
    return { error: "Enter a valid phone number." };
  }

  if (line1.length < 5 || line1.length > 200) {
    return { error: "Address line 1 must be between 5 and 200 characters." };
  }

  if (line2 && line2.length > 200) {
    return { error: "Address line 2 must be 200 characters or fewer." };
  }

  if (city.length < 2 || city.length > 80) {
    return { error: "Enter a valid city." };
  }

  if (state.length < 2 || state.length > 80) {
    return { error: "Enter a valid state." };
  }

  if (!/^[A-Za-z0-9 -]{3,12}$/.test(postalCode)) {
    return { error: "Enter a valid postal code." };
  }

  if (country.length < 2 || country.length > 80) {
    return { error: "Enter a valid country." };
  }

  return {
    data: {
      recipient_name: fullName,
      phone,
      line1,
      line2,
      city,
      state,
      postal_code: postalCode,
      country,
      is_default: isDefault,
    },
  };
}

async function clearDefaultAddress(userId: string) {
  const supabase = await createClient();

  await supabase
    .from("addresses")
    .update({ is_default: false, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("type", "shipping");
}

export async function createAddressAction(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const auth = await getCurrentUserId();

  if (auth.userId === null) {
    return { status: "error", message: auth.error };
  }

  const validation = validateAddress(formData);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  const supabase = await createClient();
  const { count } = await supabase
    .from("addresses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", auth.userId)
    .eq("type", "shipping");

  const isDefault = validation.data.is_default || (count ?? 0) === 0;

  if (isDefault) {
    await clearDefaultAddress(auth.userId);
  }

  const { error } = await supabase.from("addresses").insert({
    ...validation.data,
    is_default: isDefault,
    type: "shipping",
    user_id: auth.userId,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/checkout");

  return { status: "success", message: "Address saved." };
}

export async function updateAddressAction(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const auth = await getCurrentUserId();

  if (auth.userId === null) {
    return { status: "error", message: auth.error };
  }

  const addressId = getStringValue(formData, "addressId");

  if (!validateUuid(addressId)) {
    return { status: "error", message: "Select a valid address." };
  }

  const validation = validateAddress(formData);

  if (!validation.data) {
    return { status: "error", message: validation.error };
  }

  if (validation.data.is_default) {
    await clearDefaultAddress(auth.userId);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("addresses")
    .update({
      ...validation.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", addressId)
    .eq("user_id", auth.userId)
    .eq("type", "shipping");

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/checkout");

  return { status: "success", message: "Address updated." };
}

export async function deleteAddressAction(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const auth = await getCurrentUserId();

  if (auth.userId === null) {
    return { status: "error", message: auth.error };
  }

  const addressId = getStringValue(formData, "addressId");

  if (!validateUuid(addressId)) {
    return { status: "error", message: "Select a valid address." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", auth.userId)
    .eq("type", "shipping");

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/checkout");

  return { status: "success", message: "Address deleted." };
}

export async function placeOrderAction(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const auth = await getCurrentUserId();

  if (auth.userId === null) {
    return { status: "error", message: auth.error };
  }

  const addressId = getStringValue(formData, "addressId");

  if (!validateUuid(addressId)) {
    return { status: "error", message: "Select a shipping address." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("create_order_from_cart", {
      p_address_id: addressId,
    })
    .returns<string>();

  if (error || !data) {
    return {
      status: "error",
      message: error?.message ?? "Unable to place order.",
    };
  }

  const orderId = data as string;

  revalidatePath("/checkout");
  revalidatePath("/admin/orders");
  revalidatePath("/orders");

  return {
    status: "success",
    message: "Order placed. Payment will be added in the next step.",
    orderId,
  };
}
