import { db } from "@/db";
import { eq, SQL, inArray, ilike, or, and, lte, gte, sql } from "drizzle-orm";

import { genders, products, categories, productVariants, productImages } from "@/db/schema";

export interface ProductFilters {
	search?: string;
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

export async function getProducts(filters?: ProductFilters) {
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

	const variantConditions: SQL[] = [];

	// product variants

	if (filters?.price?.length) {
		const priceConditions = filters.price
			.map(priceRange => {
				const parsedPriceRange = parsePriceRange(priceRange);

				if (!parsedPriceRange) {
					return null;
				}

				return and(
					gte(productVariants.price, parsedPriceRange.min.toString()),
					lte(productVariants.price, parsedPriceRange.max.toString())
				);
			})
			.filter(Boolean);

		if (priceConditions.length) {
			variantConditions.push(or(...(priceConditions as SQL[])) as SQL);
		}
	}

	// product images

	const productImagesQuery = db
		.select({
			variantId: productImages.variantId,
			images: sql`
        json_agg(
          json_build_object(
            'isPrimary', ${productImages.isPrimary},
            'url', ${productImages.url}
          )
          ORDER BY ${productImages.isPrimary}
        )
      `.as("variantImages"),
		})
		.from(productImages)
		.groupBy(productImages.variantId)
		.as("productImages");

	const productVariantsQuery = db
		.select({
			productId: productVariants.productId,
			variants: sql`
        json_agg(
          json_build_object(
            'inStock', ${productVariants.inStock},
            'price', ${productVariants.price},
            'salePrice', ${productVariants.salePrice}))
    `.as("variants"),
			priceMin: sql`MIN(${productVariants.price})`.as("priceMin"),
			priceMax: sql`MAX(${productVariants.price})`.as("priceMax"),
		})
		.from(productVariants)
		.where(variantConditions.length ? and(...variantConditions) : undefined)
		.groupBy(productVariants.productId)
		.as("productVariants");

	try {
		const filteredProducts = await db
			.select({
				id: products.id,
				name: products.name,
				createdAt: products.createdAt,
				gender: genders.label,
				category: categories.name,
				variants: productVariantsQuery.variants,
				defaultVariantImages: productImagesQuery.images,
				priceMin: productVariantsQuery.priceMin,
				priceMax: productVariantsQuery.priceMax,
			})
			.from(products)
			.innerJoin(productVariantsQuery, eq(products.id, productVariantsQuery.productId))
			.leftJoin(productImagesQuery, eq(products.defaultVariantId, productImagesQuery.variantId))
			.leftJoin(categories, eq(products.categoryId, categories.id))
			.leftJoin(genders, eq(products.genderId, genders.id))
			.where(and(...baseCondition));

		return filteredProducts;
	} catch (error) {
		console.error("Failed to fetch products", error);
		return [];
	}
}

export async function getProduct(productId: string) {
	return db.query.products.findFirst({
		with: {
			brand: true,
			category: true,
			defaultVariant: true,
			gender: true,
			images: true,
			productCollections: true,
			reviews: true,
			variants: true,
			wishlists: true,
		},
		where: {
			id: productId,
		},
	});
}
