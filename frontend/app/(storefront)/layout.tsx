import { StorefrontFooter, StorefrontHeader } from "@/src/components/storefront/storefront-shell";
import { getStorefrontCategories } from "@/src/lib/storefront/categories";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories } = await getStorefrontCategories();

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-950">
      <StorefrontHeader categories={categories} />
      <main className="flex-1">{children}</main>
      <StorefrontFooter />
    </div>
  );
}
