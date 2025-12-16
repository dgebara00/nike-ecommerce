import "dotenv/config";

import { eq } from "drizzle-orm";

import { db } from "../db";
import {
  genders,
  colors,
  sizes,
  brands,
  categories,
  collections,
  products,
  productVariants,
  productImages,
  productCollections,
} from "../db/schema";

// Helper function to generate SKU
function generateSku(
  productName: string,
  colorSlug: string,
  sizeSlug: string
): string {
  const productCode = productName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 6)
    .toUpperCase();
  return `NK-${productCode}-${colorSlug.toUpperCase()}-${sizeSlug.toUpperCase()}`;
}

// Helper function to get random items from array
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to get random number in range
function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get random price
function getRandomPrice(min: number, max: number): string {
  return (Math.random() * (max - min) + min).toFixed(2);
}

// Seed data
const genderData = [
  { label: "Men", slug: "men" },
  { label: "Women", slug: "women" },
  { label: "Unisex", slug: "unisex" },
  { label: "Kids", slug: "kids" },
];

const colorData = [
  { name: "Black", slug: "black", hexCode: "#000000" },
  { name: "White", slug: "white", hexCode: "#FFFFFF" },
  { name: "Red", slug: "red", hexCode: "#FF0000" },
  { name: "Blue", slug: "blue", hexCode: "#0000FF" },
  { name: "Green", slug: "green", hexCode: "#00FF00" },
  { name: "Yellow", slug: "yellow", hexCode: "#FFFF00" },
  { name: "Orange", slug: "orange", hexCode: "#FFA500" },
  { name: "Purple", slug: "purple", hexCode: "#800080" },
  { name: "Pink", slug: "pink", hexCode: "#FFC0CB" },
  { name: "Grey", slug: "grey", hexCode: "#808080" },
  { name: "Navy", slug: "navy", hexCode: "#000080" },
  { name: "Volt", slug: "volt", hexCode: "#CEFF00" },
];

const sizeData = [
  { name: "US 6", slug: "us-6", sortOrder: 1 },
  { name: "US 6.5", slug: "us-6-5", sortOrder: 2 },
  { name: "US 7", slug: "us-7", sortOrder: 3 },
  { name: "US 7.5", slug: "us-7-5", sortOrder: 4 },
  { name: "US 8", slug: "us-8", sortOrder: 5 },
  { name: "US 8.5", slug: "us-8-5", sortOrder: 6 },
  { name: "US 9", slug: "us-9", sortOrder: 7 },
  { name: "US 9.5", slug: "us-9-5", sortOrder: 8 },
  { name: "US 10", slug: "us-10", sortOrder: 9 },
  { name: "US 10.5", slug: "us-10-5", sortOrder: 10 },
  { name: "US 11", slug: "us-11", sortOrder: 11 },
  { name: "US 11.5", slug: "us-11-5", sortOrder: 12 },
  { name: "US 12", slug: "us-12", sortOrder: 13 },
  { name: "US 13", slug: "us-13", sortOrder: 14 },
];

const brandData = [
  {
    name: "Nike",
    slug: "nike",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  },
];

const categoryData = [
  { name: "Running", slug: "running", parentId: null },
  { name: "Basketball", slug: "basketball", parentId: null },
  { name: "Lifestyle", slug: "lifestyle", parentId: null },
  { name: "Training", slug: "training", parentId: null },
  { name: "Soccer", slug: "soccer", parentId: null },
  { name: "Skateboarding", slug: "skateboarding", parentId: null },
  { name: "Tennis", slug: "tennis", parentId: null },
  { name: "Golf", slug: "golf", parentId: null },
];

const collectionData = [
  { name: "Summer '25", slug: "summer-25" },
  { name: "Winter Essentials", slug: "winter-essentials" },
  { name: "New Arrivals", slug: "new-arrivals" },
  { name: "Best Sellers", slug: "best-sellers" },
  { name: "Limited Edition", slug: "limited-edition" },
];

// Nike product data with realistic names and descriptions
const nikeProductData = [
  {
    name: "Air Max 90",
    description:
      "The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle outsole, stitched overlays and classic TPU accents. Classic colors celebrate your fresh style while Max Air cushioning adds comfort to your journey.",
    categorySlug: "lifestyle",
    genderSlug: "men",
    basePrice: 130,
  },
  {
    name: "Air Force 1 '07",
    description:
      "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    basePrice: 115,
  },
  {
    name: "Pegasus 41",
    description:
      "Responsive satisfying running. The Pegasus 41 is a reliable, versatile road-running shoe that delivers a smooth, responsive ride. ReactX foam provides 13% more energy return compared to React foam.",
    categorySlug: "running",
    genderSlug: "men",
    basePrice: 140,
  },
  {
    name: "Metcon 9",
    description:
      "The Nike Metcon 9 is the gold standard for weight training—even better than before. We've added React foam for comfort and responsiveness, plus a wider, more stable base for heavy lifts.",
    categorySlug: "training",
    genderSlug: "men",
    basePrice: 150,
  },
  {
    name: "Vomero 17",
    description:
      "Plush satisfying cushioning. The Vomero 17 is a premium neutral road-running shoe that delivers a soft, smooth ride. ZoomX foam provides a responsive, bouncy feel mile after mile.",
    categorySlug: "running",
    genderSlug: "women",
    basePrice: 180,
  },
  {
    name: "Air Jordan 1 Retro High OG",
    description:
      "The Air Jordan 1 Retro High remakes the classic sneaker, giving you a fresh look with a familiar feel. Premium leather in the upper provides a comfortable fit, while the Air-Sole unit cushions your every step.",
    categorySlug: "basketball",
    genderSlug: "men",
    basePrice: 180,
  },
  {
    name: "Dunk Low",
    description:
      "Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colors. This basketball icon channels '80s vibes with premium leather in the upper.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    basePrice: 115,
  },
  {
    name: "ZoomX Vaporfly NEXT% 3",
    description:
      "Continuing to push the boundaries of speed, the Nike ZoomX Vaporfly NEXT% 3 helps you chase new goals and records. It has the same responsive foam and carbon-fiber plate you love.",
    categorySlug: "running",
    genderSlug: "men",
    basePrice: 260,
  },
  {
    name: "Air Zoom Alphafly NEXT% 3",
    description:
      "Once you take flight, there's no turning back. The Nike Air Zoom Alphafly NEXT% 3 is made for the race day you've been training for with maximum energy return.",
    categorySlug: "running",
    genderSlug: "women",
    basePrice: 285,
  },
  {
    name: "Invincible 3",
    description:
      "With maximum cushioning to support every mile, the Invincible 3 gives you our highest level of comfort underfoot to help you stay on your feet today, tomorrow and beyond.",
    categorySlug: "running",
    genderSlug: "men",
    basePrice: 180,
  },
  {
    name: "Air Max Plus",
    description:
      "Let your attitude have the edge in the pointed design lines of the Air Max Plus. Featuring its original plastic accents and airy mesh, it celebrates the past while looking to the future.",
    categorySlug: "lifestyle",
    genderSlug: "men",
    basePrice: 175,
  },
  {
    name: "Air Max 97",
    description:
      "Push your style full speed ahead with the Nike Air Max 97. Its full-length Max Air unit and sleek, bullet-inspired design give you a smooth ride that looks as fast as it feels.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    basePrice: 175,
  },
  {
    name: "LeBron XXI",
    description:
      "LeBron's game is defined by his ability to adapt. The LeBron XXI is designed to help you do the same. It features a new Zoom Air Strobel that sits directly under your foot for responsive cushioning.",
    categorySlug: "basketball",
    genderSlug: "men",
    basePrice: 200,
  },
  {
    name: "KD 16",
    description:
      "Kevin Durant's 16th signature shoe is built for his smooth, calculated game. Full-length Zoom Air provides responsive cushioning, while the lightweight upper keeps you quick on your feet.",
    categorySlug: "basketball",
    genderSlug: "men",
    basePrice: 160,
  },
  {
    name: "Giannis Immortality 3",
    description:
      "Giannis plays with a relentless energy that powers him through every game. The Giannis Immortality 3 is designed to help you do the same with lightweight cushioning and a durable design.",
    categorySlug: "basketball",
    genderSlug: "men",
    basePrice: 85,
  },
  {
    name: "Mercurial Superfly 9 Elite",
    description:
      "Engineered for explosive speed, the Mercurial Superfly 9 Elite features a Zoom Air unit and a Vaporposite upper that wraps your foot for a second-skin fit.",
    categorySlug: "soccer",
    genderSlug: "unisex",
    basePrice: 275,
  },
  {
    name: "Phantom GX 2 Elite",
    description:
      "The Phantom GX 2 Elite is designed for the creative playmaker. Its Gripknit upper provides enhanced ball touch, while the NikeSkin overlay adds durability.",
    categorySlug: "soccer",
    genderSlug: "men",
    basePrice: 275,
  },
  {
    name: "SB Dunk Low Pro",
    description:
      "The Nike SB Dunk Low Pro takes the classic Dunk silhouette and adds skateboarding-specific features like Zoom Air cushioning in the heel and a padded tongue for impact protection.",
    categorySlug: "skateboarding",
    genderSlug: "men",
    basePrice: 115,
  },
  {
    name: "SB Blazer Mid",
    description:
      "The Nike SB Blazer Mid is a skateboarding icon. Its durable suede upper and Zoom Air cushioning provide the support and comfort you need for your session.",
    categorySlug: "skateboarding",
    genderSlug: "unisex",
    basePrice: 100,
  },
  {
    name: "Court Vision Low",
    description:
      "Inspired by the iconic AF-1, the Nike Court Vision Low brings a crisp, clean look to your everyday rotation. Its durable leather upper and classic design make it a versatile choice.",
    categorySlug: "lifestyle",
    genderSlug: "men",
    basePrice: 75,
  },
  {
    name: "Revolution 7",
    description:
      "The Nike Revolution 7 is a lightweight, breathable running shoe that provides a comfortable ride for your daily runs. Its soft foam midsole cushions every step.",
    categorySlug: "running",
    genderSlug: "women",
    basePrice: 70,
  },
  {
    name: "Free Run 5.0",
    description:
      "The Nike Free Run 5.0 delivers a barefoot-like feel with flexible grooves that let your foot move naturally. Its lightweight design makes it perfect for short runs and gym workouts.",
    categorySlug: "running",
    genderSlug: "men",
    basePrice: 110,
  },
  {
    name: "React Infinity Run 4",
    description:
      "The Nike React Infinity Run 4 is designed to help reduce injury and keep you on the run. Its wider platform and React foam provide a stable, cushioned ride.",
    categorySlug: "running",
    genderSlug: "women",
    basePrice: 160,
  },
  {
    name: "Air Zoom Structure 25",
    description:
      "The Nike Air Zoom Structure 25 provides stability for overpronators without sacrificing speed. Its dual-density midsole and Zoom Air unit deliver a responsive ride.",
    categorySlug: "running",
    genderSlug: "men",
    basePrice: 140,
  },
  {
    name: "Zoom Court Pro",
    description:
      "The NikeCourt Zoom Pro is designed for the competitive tennis player. Its Zoom Air unit provides responsive cushioning, while the durable outsole offers excellent traction on hard courts.",
    categorySlug: "tennis",
    genderSlug: "men",
    basePrice: 130,
  },
  {
    name: "Air Zoom Vapor 11",
    description:
      "The NikeCourt Air Zoom Vapor 11 is built for speed on the tennis court. Its lightweight design and Zoom Air cushioning help you move quickly and react to every shot.",
    categorySlug: "tennis",
    genderSlug: "women",
    basePrice: 160,
  },
  {
    name: "Air Max 270",
    description:
      "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh colors.",
    categorySlug: "lifestyle",
    genderSlug: "unisex",
    basePrice: 160,
  },
  {
    name: "Air Zoom GT Cut 3",
    description:
      "The Nike Air Zoom GT Cut 3 is designed for the quick, crafty player who wants to create space on the court. Its Zoom Air Strobel provides responsive cushioning for explosive cuts.",
    categorySlug: "basketball",
    genderSlug: "men",
    basePrice: 190,
  },
  {
    name: "Air Max DN",
    description:
      "Introducing the Air Max DN, the next generation of Air Max. Dynamic Air technology features tube-shaped Air units that deliver a reactive sensation with every step.",
    categorySlug: "lifestyle",
    genderSlug: "men",
    basePrice: 160,
  },
  {
    name: "P-6000",
    description:
      "The Nike P-6000 draws inspiration from the Pegasus line of the early 2000s. Its combination of mesh and leather creates a layered look, while the foam midsole provides lightweight cushioning.",
    categorySlug: "lifestyle",
    genderSlug: "women",
    basePrice: 110,
  },
];

// Image URLs (using placeholder images)
const imageUrls = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&q=80",
];

async function seed() {
  console.log("Starting seed process...\n");

  try {
    // Clear existing data in reverse order of dependencies
    console.log("Clearing existing data...");
    await db.delete(productCollections);
    await db.delete(productImages);
    await db.delete(productVariants);
    await db.delete(products);
    await db.delete(collections);
    await db.delete(categories);
    await db.delete(brands);
    await db.delete(sizes);
    await db.delete(colors);
    await db.delete(genders);
    console.log("Existing data cleared.\n");

    // Seed genders
    console.log("Seeding genders...");
    const insertedGenders = await db
      .insert(genders)
      .values(genderData)
      .returning();
    const genderMap = new Map(insertedGenders.map((g) => [g.slug, g.id]));
    console.log(`Seeded ${insertedGenders.length} genders.\n`);

    // Seed colors
    console.log("Seeding colors...");
    const insertedColors = await db
      .insert(colors)
      .values(colorData)
      .returning();
    const colorMap = new Map(insertedColors.map((c) => [c.slug, c.id]));
    console.log(`Seeded ${insertedColors.length} colors.\n`);

    // Seed sizes
    console.log("Seeding sizes...");
    const insertedSizes = await db.insert(sizes).values(sizeData).returning();
    const sizeMap = new Map(insertedSizes.map((s) => [s.slug, s.id]));
    console.log(`Seeded ${insertedSizes.length} sizes.\n`);

    // Seed brands
    console.log("Seeding brands...");
    const insertedBrands = await db
      .insert(brands)
      .values(brandData)
      .returning();
    const brandMap = new Map(insertedBrands.map((b) => [b.slug, b.id]));
    console.log(`Seeded ${insertedBrands.length} brands.\n`);

    // Seed categories
    console.log("Seeding categories...");
    const insertedCategories = await db
      .insert(categories)
      .values(categoryData)
      .returning();
    const categoryMap = new Map(insertedCategories.map((c) => [c.slug, c.id]));
    console.log(`Seeded ${insertedCategories.length} categories.\n`);

    // Seed collections
    console.log("Seeding collections...");
    const insertedCollections = await db
      .insert(collections)
      .values(collectionData)
      .returning();
    const collectionMap = new Map(
      insertedCollections.map((c) => [c.slug, c.id])
    );
    console.log(`Seeded ${insertedCollections.length} collections.\n`);

    // Seed products with variants and images
    console.log("Seeding products with variants and images...");
    let totalVariants = 0;
    let totalImages = 0;

    for (const productData of nikeProductData) {
      // Insert product
      const [insertedProduct] = await db
        .insert(products)
        .values({
          name: productData.name,
          description: productData.description,
          categoryId: categoryMap.get(productData.categorySlug)!,
          genderId: genderMap.get(productData.genderSlug)!,
          brandId: brandMap.get("nike")!,
          isPublished: true,
        })
        .returning();

      console.log(`  Created product: ${productData.name}`);

      // Get random colors and sizes for this product
      const productColors = getRandomItems(
        insertedColors,
        getRandomInRange(2, 4)
      );
      const productSizes = getRandomItems(
        insertedSizes,
        getRandomInRange(6, 10)
      );

      let firstVariantId: string | null = null;

      // Create variants for each color-size combination
      for (const color of productColors) {
        for (const size of productSizes) {
          const basePrice = productData.basePrice;
          const hasSale = Math.random() > 0.7; // 30% chance of sale
          const saleDiscount = hasSale ? getRandomInRange(10, 30) : 0;
          const salePrice = hasSale
            ? (basePrice * (1 - saleDiscount / 100)).toFixed(2)
            : null;

          const [variant] = await db
            .insert(productVariants)
            .values({
              productId: insertedProduct.id,
              sku: generateSku(productData.name, color.slug, size.slug),
              price: basePrice.toFixed(2),
              salePrice,
              colorId: color.id,
              sizeId: size.id,
              inStock: getRandomInRange(0, 50),
              weight: parseFloat(getRandomPrice(0.3, 0.8)),
              dimensions: {
                length: parseFloat(getRandomPrice(28, 35)),
                width: parseFloat(getRandomPrice(10, 14)),
                height: parseFloat(getRandomPrice(10, 15)),
              },
            })
            .returning();

          if (!firstVariantId) {
            firstVariantId = variant.id;
          }

          totalVariants++;
        }

        // Add images for this color variant (1-3 images per color)
        const numImages = getRandomInRange(1, 3);
        for (let i = 0; i < numImages; i++) {
          const randomImageUrl =
            imageUrls[Math.floor(Math.random() * imageUrls.length)];
          await db.insert(productImages).values({
            productId: insertedProduct.id,
            url: randomImageUrl,
            sortOrder: i,
            isPrimary: i === 0,
          });
          totalImages++;
        }
      }

      // Update product with default variant
      if (firstVariantId) {
        await db
          .update(products)
          .set({ defaultVariantId: firstVariantId })
          .where(eq(products.id, insertedProduct.id));
      }

      // Assign product to random collections (1-2 collections)
      const productCollectionsList = getRandomItems(
        insertedCollections,
        getRandomInRange(1, 2)
      );
      for (const collection of productCollectionsList) {
        await db.insert(productCollections).values({
          productId: insertedProduct.id,
          collectionId: collection.id,
        });
      }
    }

    console.log(`\nSeeded ${nikeProductData.length} products.`);
    console.log(`Seeded ${totalVariants} product variants.`);
    console.log(`Seeded ${totalImages} product images.`);

    console.log("\nSeed completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

seed()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
