import { pgTable, text, uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { categories } from "./categories";
import { genders, brands } from "./filters";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  genderId: uuid("gender_id")
    .notNull()
    .references(() => genders.id, { onDelete: "restrict" }),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "restrict" }),
  isPublished: boolean("is_published").notNull().default(false),
  defaultVariantId: uuid("default_variant_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
