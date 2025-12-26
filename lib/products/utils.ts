import { products } from "@/db/schema";
import { SQL, sql } from "drizzle-orm";

import { ProductFilters, Product } from "./types";

export function parsePriceRange(priceRange: string): { min: number; max: number } | null {
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

export const getOrderBy = (sortKey: SQL.Aliased<number>, filters?: ProductFilters) => {
	switch (filters?.sort) {
		case "price-high-to-low":
			return sql`${sortKey} DESC`;
		case "price-low-to-high":
			return sql`${sortKey} ASC`;
		case "newest":
		default:
			return sql`${products.createdAt} DESC`;
	}
};

export function getDefaultSku(product: Omit<Product, "priceMin" | "priceMax">): string | null {
	const defaultVariant = product.variants.find(v => v.id === product.defaultVariantId);

	if (defaultVariant) {
		return defaultVariant.sku;
	}

	return null;
}

export function isValidSku(product: Omit<Product, "priceMin" | "priceMax">, sku: string): boolean {
	return product?.variants?.some(v => v.sku === sku) ?? false;
}
