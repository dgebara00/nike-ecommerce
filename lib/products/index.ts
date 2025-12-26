import { db } from "@/db";
import { eq, SQL, inArray, ilike, or, and, lte, gte, gt } from "drizzle-orm";

import { genders, products, categories, productVariantSizes } from "@/db/schema";
import type { ProductFilters, Product } from "./types";
import { parsePriceRange, getOrderBy } from "./utils";
import { buildProductVariantsJoin } from "./joins";

export async function getProducts(filters?: ProductFilters): Promise<{ total: number; products: Product[] }> {
	const baseCondition: SQL[] = [eq(products.isPublished, true)];

	if (filters?.search) {
		baseCondition.push(
			or(ilike(products.description, `%${filters.search}%`), ilike(products.name, `%${filters.search}%`)) as SQL
		);
	}

	if (filters?.category?.length) {
		baseCondition.push(inArray(categories.slug, filters.category));
	}

	if (filters?.gender?.length) {
		baseCondition.push(inArray(genders.slug, filters.gender));
	}

	const variantSizesConditions: SQL[] = [gt(productVariantSizes.inStock, 0)];

	if (filters?.price?.length) {
		const priceConditions = filters.price
			.map(priceRange => {
				const parsedPriceRange = parsePriceRange(priceRange);

				if (!parsedPriceRange) {
					return null;
				}

				return and(
					gte(productVariantSizes.price, parsedPriceRange.min.toString()),
					lte(productVariantSizes.price, parsedPriceRange.max.toString())
				);
			})
			.filter(Boolean);

		if (priceConditions.length) {
			variantSizesConditions.push(or(...(priceConditions as SQL[])) as SQL);
		}
	}

	const productVariantsJoin = buildProductVariantsJoin({ variantSizesConditions });

	try {
		const filteredProducts: Product[] = await db
			.select({
				id: products.id,
				slug: products.slug,
				name: products.name,
				description: products.description,
				createdAt: products.createdAt,
				gender: genders.label,
				category: categories.name,
				defaultVariantId: products.defaultVariantId,
				variants: productVariantsJoin.variants,
				priceMin: productVariantsJoin.priceMin,
				priceMax: productVariantsJoin.priceMax,
			})
			.from(products)
			.innerJoin(productVariantsJoin, eq(products.id, productVariantsJoin.productId))
			.leftJoin(categories, eq(products.categoryId, categories.id))
			.leftJoin(genders, eq(products.genderId, genders.id))
			.where(and(...baseCondition))
			.orderBy(getOrderBy(productVariantsJoin.priceMin, filters));

		return { total: filteredProducts.length, products: filteredProducts };
	} catch (error) {
		console.error("Failed to fetch products", error);
		return { total: 0, products: [] };
	}
}

export async function getProduct(slug: string): Promise<Omit<Product, "priceMin" | "priceMax"> | null> {
	const productVariantsJoin = buildProductVariantsJoin();

	const product = await db
		.select({
			id: products.id,
			slug: products.slug,
			name: products.name,
			description: products.description,
			createdAt: products.createdAt,
			defaultVariantId: products.defaultVariantId,
			gender: genders.label,
			category: categories.name,
			variants: productVariantsJoin.variants,
		})
		.from(products)
		.innerJoin(productVariantsJoin, eq(products.id, productVariantsJoin.productId))
		.leftJoin(categories, eq(products.categoryId, categories.id))
		.leftJoin(genders, eq(products.genderId, genders.id))
		.where(eq(products.slug, slug));

	return product?.[0] ?? null;
}
