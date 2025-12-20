import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { products } from "./products";
import { colors } from "./filters";

export const productVariants = pgTable("product_variants", {
	id: uuid("id").primaryKey().defaultRandom(),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	sku: text("sku").notNull().unique(),
	colorId: uuid("color_id")
		.notNull()
		.references(() => colors.id, { onDelete: "restrict" }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductVariantSchema = createInsertSchema(productVariants);
export const selectProductVariantSchema = createSelectSchema(productVariants);

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
