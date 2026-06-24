import type { Metadata } from "next";
import { CheckoutPageClient } from "@/src/components/checkout/checkout-page";
import { requireUser } from "@/src/lib/auth/session";
import { getCheckoutData } from "@/src/lib/checkout/checkout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout | HMART",
  description: "Select a shipping address and review your HMART order summary.",
};

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  const checkout = await getCheckoutData(user.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Checkout
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Confirm your shipping address and order totals before placing the order.
        </p>
      </div>

      <CheckoutPageClient checkout={checkout} />
    </div>
  );
}
