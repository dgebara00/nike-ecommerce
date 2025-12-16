import { unstable_cache } from "next/cache";
import { db } from "@/db";

export interface ProductFilters {
  gender?: string[];
  category?: string[];
  price?: string[];
  sort?: string;
}

function parsePriceRange(priceRange: string): { min: number; max: number } | null {
  switch (priceRange) {
    case "0-50":
      return { min: 0, max: 50 };
    case "50-100":
      return { min: 50, max: 100 };
    case "100-150":
      return { min: 100, max: 150 };
    case "150-plus":
      return { min: 150, max: 999999 };
    default:
      return null;
  }
}

/**
 * Fetches all products from the database with caching.
 * Uses Next.js unstable_cache to deduplicate concurrent requests and cache results.
 * Cache is tagged with 'products' for revalidation.
 */
const getCachedProducts = unstable_cache(
  async () => {
    return await db.query.products.findMany({
      with: {
        category: true,
        gender: true,
        variants: true,
        images: true,
      },
    });
  },
  ["products"],
  {
    tags: ["products"],
    revalidate: 3600, // Cache for 1 hour
  },
);

export async function getProducts(filters?: ProductFilters) {
  try {
    const allProducts = await getCachedProducts();

    let filteredProducts = allProducts;

    if (filters?.gender && filters.gender.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.gender && filters.gender!.includes(product.gender.slug),
      );
    }

    if (filters?.category && filters.category.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category && filters.category!.includes(product.category.slug),
      );
    }

    if (filters?.price && filters.price.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const defaultVariant = product.variants.find((v) => v.id === product.defaultVariantId);
        if (!defaultVariant) return false;
        const price = Number.parseFloat(`${defaultVariant.price}`);

        return filters.price!.some((range) => {
          const parsed = parsePriceRange(range);
          if (!parsed) return false;
          return price >= parsed.min && price < parsed.max;
        });
      });
    }

    switch (filters?.sort) {
      case "newest":
        filteredProducts.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "price-high-to-low":
        filteredProducts.sort((a, b) => {
          const priceA = Number.parseFloat(
            `${a.variants.find((v) => v.id === a.defaultVariantId)?.price || 0}`,
          );
          const priceB = Number.parseFloat(
            `${b.variants.find((v) => v.id === b.defaultVariantId)?.price || 0}`,
          );
          return priceB - priceA;
        });
        break;
      case "price-low-to-high":
        filteredProducts.sort((a, b) => {
          const priceA = Number.parseFloat(
            `${a.variants.find((v) => v.id === a.defaultVariantId)?.price || 0}`,
          );
          const priceB = Number.parseFloat(
            `${b.variants.find((v) => v.id === b.defaultVariantId)?.price || 0}`,
          );
          return priceA - priceB;
        });
        break;
      case "featured":
      default:
        filteredProducts.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return filteredProducts;
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}
