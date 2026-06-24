"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/use-auth";
import { formatPriceRange } from "@/src/lib/storefront/format";
import { addCartItemAction } from "@/src/lib/storefront/cart-actions";
import { addLocalCartItem, broadcastCartCount } from "@/src/lib/storefront/cart-storage";
import type { StorefrontProductCard } from "@/src/lib/storefront/types";

export function StorefrontEmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-green-200 bg-green-50/50 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-green-100 text-base font-bold text-green-700">
        HM
      </div>
      <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
        {description}
      </p>
      <Link
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        href="/products"
      >
        Browse products
      </Link>
    </div>
  );
}

function AddToCartButton({ product }: { product: StorefrontProductCard }) {
  const { isAuthenticated } = useAuth();
  const [qty, setQty] = useState(0);
  const [pending, setPending] = useState(false);

  if (!product.inStock || !product.defaultVariantId) {
    return null;
  }

  async function add() {
    if (!product.defaultVariantId) return;
    setPending(true);
    try {
      if (isAuthenticated) {
        const result = await addCartItemAction({
          variantId: product.defaultVariantId,
          quantity: 1,
        });
        if (result.cart) broadcastCartCount(result.cart.summary.totalQuantity);
        if (result.status === "success") setQty((q) => q + 1);
      } else {
        const result = addLocalCartItem({
          variantId: product.defaultVariantId,
          quantity: 1,
          availableStock: product.availableStock,
        });
        if (result.status === "success") setQty((q) => q + 1);
      }
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    if (!product.defaultVariantId || qty <= 0) return;
    setPending(true);
    try {
      if (isAuthenticated) {
        const { updateCartItemQuantityAction } = await import(
          "@/src/lib/storefront/cart-actions"
        );
        const result = await updateCartItemQuantityAction({
          variantId: product.defaultVariantId,
          quantity: qty - 1,
        });
        if (result.cart) broadcastCartCount(result.cart.summary.totalQuantity);
        if (result.status === "success") setQty((q) => q - 1);
      } else {
        const { updateLocalCartItem } = await import(
          "@/src/lib/storefront/cart-storage"
        );
        updateLocalCartItem({
          variantId: product.defaultVariantId,
          quantity: qty - 1,
          availableStock: product.availableStock,
        });
        setQty((q) => q - 1);
      }
    } finally {
      setPending(false);
    }
  }

  if (qty === 0) {
    return (
      <button
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white shadow-md transition-all hover:bg-green-700 hover:scale-110 disabled:opacity-50"
        disabled={pending}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); add(); }}
        type="button"
        title="Add to cart"
      >
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    );
  }

  return (
    <div
      className="inline-flex h-8 items-center rounded-full bg-green-600 shadow-md"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      <button
        className="flex h-full w-8 items-center justify-center rounded-l-full text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        disabled={pending}
        onClick={remove}
        type="button"
      >
        <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
      </button>
      <span className="min-w-[20px] text-center text-xs font-bold text-white">{qty}</span>
      <button
        className="flex h-full w-8 items-center justify-center rounded-r-full text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        disabled={pending || qty >= product.availableStock}
        onClick={add}
        type="button"
      >
        <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}

export function ProductCard({ product }: { product: StorefrontProductCard }) {
  const outOfStock = !product.inStock;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:border-green-300 hover:shadow-md hover:scale-[1.02]">
      <Link className="block" href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={product.imageAlt ?? product.name}
              className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${outOfStock ? "grayscale opacity-60" : ""}`}
              src={product.imageUrl}
            />
          ) : (
            <div className={`flex h-full items-center justify-center bg-gradient-to-br from-green-700 to-emerald-800 text-sm font-medium text-white/30 ${outOfStock ? "grayscale opacity-60" : ""}`}>
              No image
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-zinc-800">
                Out of stock
              </span>
            </div>
          )}

          {/* Add button — positioned bottom-right of image */}
          {!outOfStock && (
            <div className="absolute bottom-2 right-2">
              <AddToCartButton product={product} />
            </div>
          )}
        </div>

        <div className="p-4">
          {product.brand ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              {product.brand}
            </p>
          ) : null}
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-950">
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">{product.categoryName}</p>
          <p className="mt-1.5 text-sm font-bold text-zinc-950">
            {formatPriceRange(product.minPrice, product.maxPrice)}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function ProductGrid({ products }: { products: StorefrontProductCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
