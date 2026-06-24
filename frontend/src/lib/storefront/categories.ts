import { createClient } from "@/src/lib/supabase/server";
import {
  STOREFRONT_FEATURED_CATEGORIES_LIMIT,
  type StorefrontCategory,
} from "@/src/lib/storefront/types";

type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function getStorefrontCategories(): Promise<{
  categories: StorefrontCategory[];
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, sort_order, is_active")
    .is("deleted_at", null)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .limit(100)
    .returns<CategoryRecord[]>();

  if (error) {
    return { categories: [], error: error.message };
  }

  return {
    categories: (data ?? []).map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: null,
    })),
    error: null,
  };
}

export async function getFeaturedCategories(): Promise<{
  categories: StorefrontCategory[];
  error: string | null;
}> {
  const result = await getStorefrontCategories();

  return {
    categories: result.categories.slice(0, STOREFRONT_FEATURED_CATEGORIES_LIMIT),
    error: result.error,
  };
}

export async function getCategoryBySlug(slug: string): Promise<{
  category: StorefrontCategory | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle()
    .returns<{ id: string; name: string; slug: string; description: string | null } | null>();

  if (error) {
    return { category: null, error: error.message };
  }

  return {
    category: data
      ? {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          imageUrl: null,
        }
      : null,
    error: null,
  };
}
