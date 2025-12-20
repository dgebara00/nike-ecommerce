import { pgTable, text, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { productVariants } from "./variants";

export const productImages = pgTable("product_images", {
	id: uuid("id").primaryKey().defaultRandom(),
	variantId: uuid("variant_id").references(() => productVariants.id, {
		onDelete: "cascade",
	}),
	url: text("url").notNull(),
	sortOrder: integer("sort_order").notNull().default(0),
	isPrimary: boolean("is_primary").notNull().default(false),
});

export const insertProductImageSchema = createInsertSchema(productImages);
export const selectProductImageSchema = createSelectSchema(productImages);

export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
