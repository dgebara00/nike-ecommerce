import { db } from "@/db";
import { eq, SQL, inArray, ilike, or, and, lte, gte, sql, gt } from "drizzle-orm";

import { productVariants, productImages, productVariantSizes, sizes, colors } from "@/db/schema";
import type { Variant, VariantSize, Image } from "./types";
import { parsePriceRange } from "./utils";

export const buildVariantSizesJoin = (conditions?: SQL[]) =>
	db
		.select({
			variantId: productVariantSizes.variantId,
			sizes: sql<VariantSize[]>`
        json_agg(
          json_build_object(
			'id', ${productVariantSizes.id},
            'inStock', ${productVariantSizes.inStock},
            'price', ${productVariantSizes.price},
            'salePrice', ${productVariantSizes.salePrice},
            'size', ${sizes.name}
          ) ORDER BY ${sizes.sortOrder} ASC
        )`.as("sizes"),
			priceMin: sql<number>`MIN(${productVariantSizes.price})`.as("priceMin"),
			priceMax: sql<number>`MAX(${productVariantSizes.price})`.as("priceMax"),
		})
		.from(productVariantSizes)
		.innerJoin(sizes, eq(productVariantSizes.sizeId, sizes.id))
		.where(conditions?.length ? and(...conditions) : undefined)
		.groupBy(productVariantSizes.variantId)
		.as("variantSizesJoin");

export const buildVariantImagesJoin = () =>
	db
		.select({
			variantId: productImages.variantId,
			images: sql<Image[]>`
        json_agg(
          json_build_object(
			'id', ${productImages.id},
            'isPrimary', ${productImages.isPrimary},
            'url', ${productImages.url},
            'order', ${productImages.sortOrder}
          ) ORDER BY ${productImages.sortOrder} ASC
        )`.as("images"),
		})
		.from(productImages)
		.groupBy(productImages.variantId)
		.as("productImagesJoin");

export const buildProductVariantsJoin = (conditions?: { variantSizesConditions: SQL[] }) => {
	const imagesJoin = buildVariantImagesJoin();
	const variantSizesJoin = buildVariantSizesJoin(conditions?.variantSizesConditions);

	return db
		.select({
			productId: productVariants.productId,
			variants: sql<Variant[]>`
        json_agg(
          json_build_object(
           'id', ${productVariants.id},
           'sku', LOWER(${productVariants.sku}),
           'color', ${colors.name},
           'images', ${imagesJoin.images},
           'sizes', ${variantSizesJoin.sizes}
          )
        )`.as("variants"),
			priceMin: sql<number>`MIN(${variantSizesJoin.priceMin})`.as("priceMin"),
			priceMax: sql<number>`MAX(${variantSizesJoin.priceMax})`.as("priceMax"),
		})
		.from(productVariants)
		.innerJoin(variantSizesJoin, eq(productVariants.id, variantSizesJoin.variantId))
		.innerJoin(colors, eq(productVariants.colorId, colors.id))
		.innerJoin(imagesJoin, eq(productVariants.id, imagesJoin.variantId))
		.groupBy(productVariants.productId)
		.as("productVariants");
};
