/**
 * Cache management utilities for database queries.
 *
 * This module provides functions to manually invalidate caches when data changes.
 * Use these functions after modifying products, filters, or other cached data.
 */

import { revalidateTag } from "next/cache";

/**
 * Invalidates the product cache.
 * Call this after creating, updating, or deleting products.
 */
export function invalidateProductsCache(): void {
  revalidateTag("products");
}

/**
 * Invalidates all filter caches (genders, categories, brands, colors, sizes).
 * Call this after modifying any filter options.
 */
export function invalidateFiltersCache(): void {
  revalidateTag("filters");
}

/**
 * Invalidates a specific filter cache.
 * @param filterType - The type of filter to invalidate
 */
export function invalidateFilterCache(
  filterType: "genders" | "categories" | "brands" | "colors" | "sizes",
): void {
  revalidateTag(filterType);
}

/**
 * Invalidates all application caches.
 * Use sparingly - typically only during full data migrations or seeding.
 */
export function invalidateAllCaches(): void {
  invalidateProductsCache();
  invalidateFiltersCache();
}
