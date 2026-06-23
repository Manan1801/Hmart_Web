import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/src/components/storefront/product-card";
import {
  ProductAddToCartPanel,
  ProductImageGallery,
  ProductStockBadge,
  ProductVariantList,
} from "@/src/components/storefront/product-detail";
import { buildProductsHref } from "@/src/components/storefront/catalog-filters";
import { formatPriceRange } from "@/src/lib/storefront/format";
import {
  getRelatedProducts,
  getStorefrontProductBySlug,
} from "@/src/lib/storefront/catalog";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getStorefrontProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found | HMART",
    };
  }

  return {
    title: `${product.name} | HMART`,
    description:
      product.description ??
      `Shop ${product.name} at HMART. View variants, pricing, and availability.`,
    openGraph: {
      title: product.name,
      description:
        product.description ??
        `Shop ${product.name} at HMART. View variants, pricing, and availability.`,
      images: product.images[0]?.publicUrl
        ? [{ url: product.images[0].publicUrl }]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const { product, error } = await getStorefrontProductBySlug(slug);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
          <h1 className="text-base font-semibold">Unable to load product</h1>
          <p className="mt-2 text-sm leading-6">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts({
    categoryId: product.categoryId,
    excludeProductId: product.id,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link className="hover:text-zinc-950" href="/">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link className="hover:text-zinc-950" href="/products">
          Products
        </Link>
        {product.categorySlug ? (
          <>
            <span className="mx-2">/</span>
            <Link
              className="hover:text-zinc-950"
              href={buildProductsHref({ category: product.categorySlug })}
            >
              {product.categoryName}
            </Link>
          </>
        ) : null}
        <span className="mx-2">/</span>
        <span className="text-zinc-950">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductImageGallery images={product.images} productName={product.name} />

        <div className="space-y-6">
          {product.brand ? (
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              {product.brand}
            </p>
          ) : null}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              {product.name}
            </h1>
            <p className="mt-3 text-lg font-medium text-zinc-950">
              {formatPriceRange(product.minPrice, product.maxPrice)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ProductStockBadge inStock={product.inStock} />
            {product.categorySlug ? (
              <Link
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
                href={buildProductsHref({ category: product.categorySlug })}
              >
                {product.categoryName}
              </Link>
            ) : (
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
                {product.categoryName}
              </span>
            )}
          </div>

          {product.description ? (
            <div>
              <h2 className="text-base font-semibold text-zinc-950">About this product</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {product.description}
              </p>
            </div>
          ) : null}

          <ProductAddToCartPanel variants={product.variants} />
        </div>
      </div>

      <section className="mt-12 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Available variants
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Compare SKUs, units, pricing, and current stock availability.
          </p>
        </div>
        <ProductVariantList variants={product.variants} />
      </section>

      {related.products.length > 0 ? (
        <section className="mt-12 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Related products
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              More items from {product.categoryName}.
            </p>
          </div>
          <ProductGrid products={related.products} />
        </section>
      ) : null}
    </div>
  );
}
