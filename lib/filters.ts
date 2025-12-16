import { db } from "@/db";

export async function getGenders() {
  try {
    return await db.query.genders.findMany({
      orderBy: (gender, { asc }) => asc(gender.label),
    });
  } catch (error) {
    console.error("Failed to fetch genders", error);
    return [];
  }
}

export async function getBrands() {
  try {
    return await db.query.brands.findMany({
      orderBy: (brand, { asc }) => asc(brand.name),
    });
  } catch (error) {
    console.error("Failed to fetch brands", error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await db.query.categories.findMany({
      orderBy: (category, { asc }) => asc(category.name),
    });
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
}

export async function getColors() {
  try {
    return await db.query.colors.findMany({
      orderBy: (color, { asc }) => asc(color.name),
    });
  } catch (error) {
    console.error("Failed to fetch colors", error);
    return [];
  }
}

export async function getSizes() {
  try {
    return await db.query.sizes.findMany({
      orderBy: (size, { asc }) => asc(size.sortOrder),
    });
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
