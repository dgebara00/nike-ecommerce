import { unstable_cache } from "next/cache";
import { db } from "@/db";

/**
 * Fetches all genders with caching.
 * Uses Next.js unstable_cache to prevent redundant database queries.
 */
const getCachedGenders = unstable_cache(
  async () => {
    return await db.query.genders.findMany({
      orderBy: (gender, { asc }) => asc(gender.label),
    });
  },
  ["genders"],
  {
    tags: ["filters", "genders"],
    revalidate: 3600, // Cache for 1 hour
  },
);

export async function getGenders() {
  try {
    return await getCachedGenders();
  } catch (error) {
    console.error("Failed to fetch genders", error);
    return [];
  }
}

/**
 * Fetches all brands with caching.
 */
const getCachedBrands = unstable_cache(
  async () => {
    return await db.query.brands.findMany({
      orderBy: (brand, { asc }) => asc(brand.name),
    });
  },
  ["brands"],
  {
    tags: ["filters", "brands"],
    revalidate: 3600,
  },
);

export async function getBrands() {
  try {
    return await getCachedBrands();
  } catch (error) {
    console.error("Failed to fetch brands", error);
    return [];
  }
}

/**
 * Fetches all categories with caching.
 */
const getCachedCategories = unstable_cache(
  async () => {
    return await db.query.categories.findMany({
      orderBy: (category, { asc }) => asc(category.name),
    });
  },
  ["categories"],
  {
    tags: ["filters", "categories"],
    revalidate: 3600,
  },
);

export async function getCategories() {
  try {
    return await getCachedCategories();
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
}

/**
 * Fetches all colors with caching.
 */
const getCachedColors = unstable_cache(
  async () => {
    return await db.query.colors.findMany({
      orderBy: (color, { asc }) => asc(color.name),
    });
  },
  ["colors"],
  {
    tags: ["filters", "colors"],
    revalidate: 3600,
  },
);

export async function getColors() {
  try {
    return await getCachedColors();
  } catch (error) {
    console.error("Failed to fetch colors", error);
    return [];
  }
}

/**
 * Fetches all sizes with caching.
 */
const getCachedSizes = unstable_cache(
  async () => {
    return await db.query.sizes.findMany({
      orderBy: (size, { asc }) => asc(size.sortOrder),
    });
  },
  ["sizes"],
  {
    tags: ["filters", "sizes"],
    revalidate: 3600,
  },
);

export async function getSizes() {
  try {
    return await getCachedSizes();
  } catch (error) {
    console.error("Failed to fetch sizes", error);
    return [];
  }
}

export interface FilterOptions {
  genders: { value: string; label: string }[];
  categories: { value: string; label: string }[];
  brands: { value: string; label: string }[];
  colors: { value: string; label: string }[];
  sizes: { value: string; label: string }[];
  priceRanges: { value: string; label: string }[];
}

export async function getAllFilterOptions(): Promise<FilterOptions> {
  const [genders, categories, brands, colors, sizes] = await Promise.all([
    getGenders(),
    getCategories(),
    getBrands(),
    getColors(),
    getSizes(),
  ]);

  return {
    genders: genders.map((g) => ({ value: g.slug, label: g.label })),
    categories: categories.map((c) => ({ value: c.slug, label: c.name })),
    brands: brands.map((b) => ({ value: b.slug, label: b.name })),
    colors: colors.map((c) => ({ value: c.slug, label: c.name })),
    sizes: sizes.map((s) => ({ value: s.slug, label: s.name })),
    priceRanges: [
      { value: "0-50", label: "$25 - $50" },
      { value: "50-100", label: "$50 - $100" },
      { value: "100-150", label: "$100 - $150" },
      { value: "150-plus", label: "Over $150" },
    ],
  };
}
