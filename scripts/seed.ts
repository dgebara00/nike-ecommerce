import "dotenv/config";

import { db } from "../db";
import { products } from "../lib/db/schema";

const nikeProducts = [
  {
    slug: "air-max-90-essential",
    name: "Air Max 90 Essential",
    category: "Running",
    description:
      "Classic Air Max cushioning with premium leather overlays built for all-day comfort.",
    price: "129.99",
    imageUrl:
      "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=900&q=80",
    inventory: 125,
  },
  {
    slug: "air-force-1-07",
    name: "Air Force 1 '07",
    category: "Lifestyle",
    description: "Iconic AF1 silhouette updated with crisp leather and soft foam comfort.",
    price: "110.00",
    imageUrl:
      "https://images.unsplash.com/photo-1528701800489-20be3c21fa3b?auto=format&fit=crop&w=900&q=80",
    inventory: 200,
  },
  {
    slug: "pegasus-41",
    name: "Pegasus 41",
    category: "Running",
    description: "Daily trainer with React X foam for energized transitions mile after mile.",
    price: "139.99",
    imageUrl:
      "https://images.unsplash.com/photo-1489819986955-3df3b83a1bd0?auto=format&fit=crop&w=900&q=80",
    inventory: 160,
  },
  {
    slug: "metcon-9",
    name: "Metcon 9",
    category: "Training",
    description: "Stability-focused training shoe engineered for heavy lifts and explosive HIIT.",
    price: "149.99",
    imageUrl:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=900&q=80",
    inventory: 90,
  },
  {
    slug: "vomero-17",
    name: "Vomero 17",
    category: "Running",
    description: "Plush ZoomX cushioning and engineered mesh upper for premium recovery runs.",
    price: "179.99",
    imageUrl:
      "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=900&q=80",
    inventory: 80,
  },
  {
    slug: "ja-2-hunger",
    name: "JA 2 'Hunger'",
    category: "Basketball",
    description: "Responsive Zoom Air unit pairs with herringbone traction for explosive guards.",
    price: "119.99",
    imageUrl:
      "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=900&q=80",
    inventory: 140,
  },
  {
    slug: "invincible-3",
    name: "Invincible 3",
    category: "Running",
    description: "Max-cushioned super shoe that keeps long efforts feeling light and supported.",
    price: "199.99",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    inventory: 70,
  },
];

async function seed() {
  await db.delete(products);
  await db.insert(products).values(nikeProducts);
  console.log(`Seeded ${nikeProducts.length} Nike products.`);
}

seed()
  .catch((error) => {
    console.error("Failed to seed database", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
