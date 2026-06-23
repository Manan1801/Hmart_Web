import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCards } from "@/src/components/storefront/category-cards";
import { ProductGrid } from "@/src/components/storefront/product-card";
import { StorefrontEmptyState } from "@/src/components/storefront/product-card";
import { getFeaturedCategories } from "@/src/lib/storefront/categories";
import { getFeaturedProducts } from "@/src/lib/storefront/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HMART | Shop Groceries & Essentials",
  description:
    "Browse HMART categories and discover everyday groceries, household essentials, and featured products.",
  openGraph: {
    title: "HMART | Shop Groceries & Essentials",
    description:
      "Browse HMART categories and discover everyday groceries, household essentials, and featured products.",
    type: "website",
  },
};

export default async function HomePage() {
  const [featuredCategories, featuredProducts] = await Promise.all([
    getFeaturedCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl bg-zinc-950 px-6 py-12 text-white sm:px-10 lg:px-14">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-400">
            Welcome to HMART
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything you need, delivered with care
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            Shop fresh groceries, daily essentials, and household favorites from
            your trusted neighborhood store.
          </p>
          <form action="/products" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              className="h-12 flex-1 rounded-full border border-white/10 bg-white/10 px-5 text-sm text-white outline-none placeholder:text-zinc-400 focus:border-white"
              name="q"
              placeholder="Search products, brands, or SKUs"
              type="search"
            />
            <button
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
              type="submit"
            >
              Search catalog
            </button>
          </form>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Featured categories
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Explore popular departments across the store.
            </p>
          </div>
          <Link
            className="text-sm font-medium text-zinc-950 underline"
            href="/products"
          >
            View all products
          </Link>
        </div>

        {featuredCategories.error ? (
          <p className="text-sm text-red-700">{featuredCategories.error}</p>
        ) : featuredCategories.categories.length === 0 ? (
          <StorefrontEmptyState
            description="Categories will appear here once they are published in the catalog."
            title="No categories yet"
          />
        ) : (
          <CategoryCards categories={featuredCategories.categories} />
        )}
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Featured products
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Recently added items ready to shop.
            </p>
          </div>
          <Link
            className="text-sm font-medium text-zinc-950 underline"
            href="/products"
          >
            Browse catalog
          </Link>
        </div>

        {featuredProducts.error ? (
          <p className="text-sm text-red-700">{featuredProducts.error}</p>
        ) : featuredProducts.products.length === 0 ? (
          <StorefrontEmptyState
            description="Active products will appear here once they are published."
            title="No products yet"
          />
        ) : (
          <ProductGrid products={featuredProducts.products} />
        )}
      </section>
    </div>
  );
}
