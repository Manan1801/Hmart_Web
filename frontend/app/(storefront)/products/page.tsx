import type { Metadata } from "next";
import { CatalogFilters } from "@/src/components/storefront/catalog-filters";
import { CatalogPagination } from "@/src/components/storefront/category-cards";
import {
  ProductGrid,
  StorefrontEmptyState,
} from "@/src/components/storefront/product-card";
import { getStorefrontCategories } from "@/src/lib/storefront/categories";
import { getStorefrontCatalog } from "@/src/lib/storefront/catalog";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getPageParam(value: string) {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parsePrice(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const search = getSearchParam(params, "q").trim();
  const category = getSearchParam(params, "category").trim();

  const titleParts = ["Products"];

  if (category) {
    titleParts.unshift(category.replace(/-/g, " "));
  }

  if (search) {
    titleParts.push(`Search: ${search}`);
  }

  return {
    title: `${titleParts.join(" | ")} | HMART`,
    description:
      "Browse the HMART product catalog with search, category filters, and price range options.",
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = getSearchParam(params, "q").trim();
  const category = getSearchParam(params, "category").trim();
  const minPriceRaw = getSearchParam(params, "minPrice").trim();
  const maxPriceRaw = getSearchParam(params, "maxPrice").trim();
  const page = getPageParam(getSearchParam(params, "page"));
  const minPrice = parsePrice(minPriceRaw);
  const maxPrice = parsePrice(maxPriceRaw);

  const [categories, catalog] = await Promise.all([
    getStorefrontCategories(),
    getStorefrontCatalog({
      categorySlug: category,
      maxPrice:
        minPrice !== null && maxPrice !== null && maxPrice >= minPrice
          ? maxPrice
          : null,
      minPrice:
        minPrice !== null && maxPrice !== null && maxPrice >= minPrice
          ? minPrice
          : null,
      page,
      search,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Product catalog
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Search and filter active HMART products by category and price range.
        </p>
      </div>

      <div className="space-y-8">
        {categories.error ? (
          <p className="text-sm text-red-700">{categories.error}</p>
        ) : (
          <CatalogFilters
            categories={categories.categories}
            category={category}
            maxPrice={maxPriceRaw}
            minPrice={minPriceRaw}
            search={search}
          />
        )}

        {catalog.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
            <h2 className="text-base font-semibold">Unable to load products</h2>
            <p className="mt-2 text-sm leading-6">{catalog.error}</p>
          </div>
        ) : catalog.products.length === 0 ? (
          <StorefrontEmptyState
            description="Try adjusting your search, category, or price filters."
            title="No products found"
          />
        ) : (
          <>
            <ProductGrid products={catalog.products} />
            <CatalogPagination
              category={category}
              maxPrice={maxPriceRaw}
              minPrice={minPriceRaw}
              page={catalog.page}
              pageSize={catalog.pageSize}
              search={search}
              totalCount={catalog.totalCount}
            />
          </>
        )}
      </div>
    </div>
  );
}
