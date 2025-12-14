import { db } from "@/db";
import type { Product } from "@/lib/db/schema";

export async function getProducts(): Promise<Product[]> {
  try {
    return await db.query.products.findMany({
      orderBy: (product, { desc }) => desc(product.createdAt),
    });
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}
