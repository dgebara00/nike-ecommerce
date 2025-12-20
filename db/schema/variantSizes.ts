import { pgTable, uuid, numeric, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const productVariantSizes = pgTable("variant_sizes", {
	id: uuid("id").primaryKey().defaultRandom(),
	variantId: uuid("variant_id").notNull(),
	sizeId: uuid("size_id").notNull(),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
	inStock: integer("in_stock").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertVariantSizeSchema = createInsertSchema(productVariantSizes);
export const selectVariantSizeSchema = createSelectSchema(productVariantSizes);

export type VariantSize = typeof productVariantSizes.$inferSelect;
export type NewVariantSize = typeof productVariantSizes.$inferInsert;
