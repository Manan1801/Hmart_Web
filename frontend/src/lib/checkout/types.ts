import type { StorefrontCart } from "@/src/lib/storefront/cart-types";

export const CHECKOUT_FREE_SHIPPING_THRESHOLD = 1000;
export const CHECKOUT_SHIPPING_AMOUNT = 99;
export const CHECKOUT_TAX_RATE = 0.18;

export type CheckoutAddress = {
  id: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type CheckoutTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  grandTotal: number;
};

export type CheckoutData = {
  addresses: CheckoutAddress[];
  cart: StorefrontCart;
  totals: CheckoutTotals;
  error: string | null;
};

export type CheckoutActionState = {
  status: "idle" | "success" | "error";
  message: string;
  orderId?: string;
};

export const initialCheckoutActionState: CheckoutActionState = {
  status: "idle",
  message: "",
};
