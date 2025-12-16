import { db } from "@/db";

export async function getProducts() {
  try {
    return await db.query.products.findMany({
      with: {
        category: true,
        variants: true,
        images: true,
      },
      orderBy: (product, { desc }) => desc(product.createdAt),
    });
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}
