"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/src/components/auth/logout-button";
import { useAuth } from "@/src/hooks/use-auth";
import { readLocalCart, subscribeToCartCount, broadcastCartCount } from "@/src/lib/storefront/cart-storage";
import { getCurrentCartAction, hydrateLocalCartAction, addCartItemAction, updateCartItemQuantityAction } from "@/src/lib/storefront/cart-actions";
import type { StorefrontCategory } from "@/src/lib/storefront/types";
import type { CartDisplayItem } from "@/src/lib/storefront/cart-types";
import { formatCurrency } from "@/src/lib/storefront/format";

// ─── Icons ────────────────────────────────────────────────────────────────────

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Cart panel items ─────────────────────────────────────────────────────────

function CartItemRow({
  item,
  isAuthenticated,
  onCartUpdate,
}: {
  item: CartDisplayItem;
  isAuthenticated: boolean;
  onCartUpdate: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [qty, setQty] = useState(item.quantity);

  async function update(newQty: number) {
    setPending(true);
    try {
      if (isAuthenticated) {
        const result = await updateCartItemQuantityAction({
          variantId: item.variantId,
          quantity: newQty,
        });
        if (result.cart) {
          broadcastCartCount(result.cart.summary.totalQuantity);
          onCartUpdate();
        }
        if (result.status === "success") setQty(newQty);
      } else {
        const { updateLocalCartItem } = await import("@/src/lib/storefront/cart-storage");
        updateLocalCartItem({
          variantId: item.variantId,
          quantity: newQty,
          availableStock: item.availableStock,
        });
        setQty(newQty);
        onCartUpdate();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex gap-3 py-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={item.imageAlt ?? item.productName}
            className="h-full w-full object-cover"
            src={item.imageUrl}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-700 to-emerald-800 text-xs font-bold text-white/40">
            HM
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-950">{item.productName}</p>
        <p className="text-xs text-zinc-500">{formatCurrency(item.price)}</p>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="inline-flex h-7 items-center rounded-full bg-green-600">
            <button
              className="flex h-full w-7 items-center justify-center rounded-l-full text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              disabled={pending}
              onClick={() => update(qty - 1)}
              type="button"
            >
              <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
            <span className="min-w-[18px] text-center text-[11px] font-bold text-white">{qty}</span>
            <button
              className="flex h-full w-7 items-center justify-center rounded-r-full text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              disabled={pending || qty >= item.availableStock}
              onClick={() => update(qty + 1)}
              type="button"
            >
              <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
          <p className="text-sm font-bold text-zinc-950">{formatCurrency(item.price * qty)}</p>
        </div>
      </div>
    </div>
  );
}

function CartPanelSkeleton() {
  return (
    <div className="space-y-4 px-5 pt-4">
      {[1, 2, 3].map((i) => (
        <div className="flex gap-3" key={i}>
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-zinc-200" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main header ──────────────────────────────────────────────────────────────

export function StorefrontHeader({
  categories,
  userEmail,
  userName,
}: {
  categories: StorefrontCategory[];
  userEmail: string | null;
  userName?: string | null;
}) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartDisplayItem[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
    setCartOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      getCurrentCartAction().then((r) => {
        if (r.cart) setCartCount(r.cart.summary.totalQuantity);
      });
    } else {
      const items = readLocalCart();
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
    }
  }, [isAuthenticated, authLoading, pathname]);

  useEffect(() => subscribeToCartCount(setCartCount), []);

  const openCart = useCallback(async () => {
    if (sidebarOpen) setSidebarOpen(false);
    setCartOpen(true);
    setCartLoading(true);
    try {
      let result;
      if (isAuthenticated) {
        result = await getCurrentCartAction();
      } else {
        result = await hydrateLocalCartAction(readLocalCart());
      }
      if (result.cart) {
        setCartItems(result.cart.items);
        setCartSubtotal(result.cart.summary.subtotal);
        setCartCount(result.cart.summary.totalQuantity);
      }
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated, sidebarOpen]);

  useEffect(() => {
    if (!cartOpen) return;
    openCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartCount]);

  const backdrop = sidebarOpen || cartOpen;

  return (
    <>
      {/* Shared backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          backdrop ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => { setSidebarOpen(false); setCartOpen(false); }}
      />

      {/* ── Account sidebar ───────────────────────────────────────────────── */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Profile header */}
        <div className="border-b border-zinc-100 px-5 py-5">
          <div className="flex items-center justify-between">
            {userEmail ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {(userName ?? userEmail).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-950">
                    {userName ?? userEmail.split("@")[0]}
                  </p>
                  <p className="truncate text-xs text-zinc-500">{userEmail}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold text-zinc-950">Welcome to HMART</p>
            )}
            <button
              className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
              onClick={() => setSidebarOpen(false)}
            >
              <XIcon className="size-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {userEmail ? (
            <>
              {/* Main navigation */}
              <div className="px-3 pt-3">
                <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">My Account</p>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-green-50 hover:text-green-800" href="/account">
                  <svg className="size-[18px] text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                  My Profile
                </Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-green-50 hover:text-green-800" href="/orders">
                  <svg className="size-[18px] text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                  My Orders
                </Link>
              </div>

              {/* Support section */}
              <div className="mt-2 border-t border-zinc-100 px-3 pt-3">
                <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Support</p>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-green-50 hover:text-green-800" href="/contact">
                  <svg className="size-[18px] text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>
                  Contact Us
                </Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-green-50 hover:text-green-800" href="/refund-policy">
                  <svg className="size-[18px] text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>
                  Refund Policy
                </Link>
              </div>

              {/* Sign out */}
              <div className="mt-2 border-t border-zinc-100 px-3 pt-3">
                <LogoutButton className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50" label="Sign out" />
              </div>
            </>
          ) : (
            <div className="space-y-3 px-5 pt-6">
              <p className="text-sm text-zinc-600">Sign in to track orders, manage your profile, and more.</p>
              <Link className="flex w-full items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700" href="/login">
                Sign in
              </Link>
              <Link className="flex w-full items-center justify-center rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50" href="/signup">
                Create account
              </Link>
              <div className="mt-4 border-t border-zinc-100 pt-4">
                <Link className="flex items-center gap-3 rounded-lg px-1 py-2 text-sm text-zinc-600 hover:text-green-700" href="/contact">
                  <svg className="size-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>
                  Contact Us
                </Link>
                <Link className="flex items-center gap-3 rounded-lg px-1 py-2 text-sm text-zinc-600 hover:text-green-700" href="/refund-policy">
                  <svg className="size-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>
                  Refund Policy
                </Link>
              </div>
            </div>
          )}
        </nav>

        <div className="border-t border-zinc-100 px-5 py-3">
          <p className="text-[11px] text-zinc-400">HMART · Your Complete Supply Partner</p>
        </div>
      </aside>

      {/* ── Mini cart panel ───────────────────────────────────────────────── */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-96 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-emerald-900">Your Cart</h2>
            {cartCount > 0 && (
              <p className="text-xs text-zinc-500">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
            )}
          </div>
          <button
            className="rounded-xl p-1.5 text-zinc-400 transition-colors hover:bg-green-50 hover:text-green-700"
            onClick={() => setCartOpen(false)}
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cartLoading ? (
            <CartPanelSkeleton />
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <CartIcon className="size-7 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-zinc-950">Your cart is empty</p>
              <p className="mt-1 text-xs text-zinc-500">Add some items to get started.</p>
              <Link
                className="mt-5 inline-flex h-9 items-center justify-center rounded-full bg-green-600 px-5 text-xs font-semibold text-white transition-colors hover:bg-green-700"
                href="/products"
                onClick={() => setCartOpen(false)}
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 px-5">
              {cartItems.map((item) => (
                <CartItemRow item={item} isAuthenticated={isAuthenticated} key={item.variantId} onCartUpdate={openCart} />
              ))}
            </div>
          )}
        </div>

        {!cartLoading && cartItems.length > 0 && (
          <div className="border-t border-zinc-100 px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-zinc-600">Subtotal</span>
              <span className="text-base font-bold text-zinc-950">{formatCurrency(cartSubtotal)}</span>
            </div>
            <Link
              className="flex w-full items-center justify-center rounded-full bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              href="/cart"
              onClick={() => setCartOpen(false)}
            >
              View full cart →
            </Link>
            <button
              className="mt-2 w-full text-center text-xs text-zinc-400 transition-colors hover:text-zinc-700"
              onClick={() => setCartOpen(false)}
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>

      {/* ── Floating cart pill (hides on /cart) ────────────────────────────── */}
      {pathname !== "/cart" && (
        <button
          aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount !== 1 ? "s" : ""}` : ""}`}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 text-white shadow-lg shadow-green-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          onClick={openCart}
        >
          <CartIcon className="size-5" />
          <span className="text-sm font-semibold">Cart</span>
          {cartCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[11px] font-bold leading-none text-white">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
      )}

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link className="shrink-0" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="H-MART" className="h-11 w-auto sm:h-12" src="/logo.png" />
          </Link>

          <form action="/products" className="mx-2 flex flex-1 gap-2">
            <label className="flex-1">
              <span className="sr-only">Search products</span>
              <input
                className="h-10 w-full rounded-full border border-zinc-300 bg-zinc-50 px-5 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-100"
                name="q"
                placeholder="Search products, brands, or SKUs…"
                type="search"
              />
            </label>
            <button
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-green-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              type="submit"
            >
              Search
            </button>
          </form>

          {/* Navbar cart icon */}
          <button
            aria-label={`Cart${cartCount > 0 ? ` (${cartCount})` : ""}`}
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-green-50 hover:text-green-700"
            onClick={openCart}
            title="Cart"
          >
            <CartIcon className="size-6" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-0.5 text-[10px] font-bold leading-none text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Hamburger / profile */}
          <button
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-green-50 hover:text-green-700"
            onClick={() => { setCartOpen(false); setSidebarOpen(true); }}
            title="Menu"
          >
            <MenuIcon className="size-6" />
          </button>
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="border-t border-zinc-100">
            <nav
              aria-label="Categories"
              className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((category) => (
                <Link
                  className="inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-green-50 hover:text-green-700"
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  key={category.id}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export function StorefrontFooter({ userEmail }: { userEmail: string | null }) {
  return (
    <footer className="mt-auto bg-emerald-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="H-MART" className="h-10 w-auto brightness-0 invert" src="/logo.png" />
          <p className="mt-3 max-w-xs text-sm leading-6 text-emerald-300/70">
            Your neighborhood store for groceries, household essentials, and everyday needs.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-emerald-300/70 sm:flex sm:flex-wrap sm:gap-5">
          <Link className="transition-colors hover:text-white" href="/products">Products</Link>
          <Link className="transition-colors hover:text-white" href="/cart">Cart</Link>
          {userEmail ? (
            <>
              <Link className="transition-colors hover:text-white" href="/account">Account</Link>
              <Link className="transition-colors hover:text-white" href="/orders">Orders</Link>
              <LogoutButton className="text-left text-sm text-emerald-300/70 transition-colors hover:text-white" label="Sign out" />
            </>
          ) : (
            <>
              <Link className="transition-colors hover:text-white" href="/login">Sign in</Link>
              <Link className="transition-colors hover:text-white" href="/signup">Create account</Link>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-emerald-800 py-4 text-center text-xs text-emerald-600/50">
        © 2025 HMART. All rights reserved.
      </div>
    </footer>
  );
}
