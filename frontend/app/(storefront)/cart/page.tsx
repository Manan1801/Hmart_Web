import type { Metadata } from "next";
import { CartPageClient } from "@/src/components/storefront/cart-page";
import { getCurrentUser } from "@/src/lib/auth/session";
import { getPersistentCart } from "@/src/lib/storefront/cart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart | HMART",
  description: "Review your HMART cart, update quantities, and check subtotal.",
};

function createEmptyCart() {
  return {
    items: [],
    summary: {
      itemCount: 0,
      totalQuantity: 0,
      subtotal: 0,
    },
  };
}

export default async function CartPage() {
  const user = await getCurrentUser();
  const cart = user ? await getPersistentCart(user.id) : createEmptyCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Shopping cart
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Review quantities, stock availability, and your current subtotal.
        </p>
      </div>

      <CartPageClient
        initialCart={cart}
        initialIsAuthenticated={Boolean(user)}
      />
    </div>
  );
}
