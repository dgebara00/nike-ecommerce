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
  productVariantSizes,
  productImages,
  productCollections,
} from "../db/schema";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateSku(productSlug: string, colorSlug: string): string {
  const productCode = productSlug.slice(0, 10).toUpperCase().replace(/-/g, "");
  return `NK-${productCode}-${colorSlug.toUpperCase()}`;
}

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function logSection(title: string): void {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

function logSuccess(message: string): void {
  console.log(`[SUCCESS] ${message}`);
}

function logInfo(message: string): void {
  console.log(`[INFO] ${message}`);
}

function logError(message: string, error?: unknown): void {
  console.error(`[ERROR] ${message}`);
  if (error instanceof Error) {
    console.error(`  -> ${error.message}`);
    if (error.stack) {
      console.error(`  Stack: ${error.stack.split("\n").slice(1, 3).join("\n")}`);
    }
  }
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
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
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
];

// ============================================================================
// IMAGE URLs (Nike product images from Unsplash)
// ============================================================================

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

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seed() {
  console.log("\n");
  console.log("*".repeat(60));
  console.log("*" + " ".repeat(58) + "*");
  console.log("*" + "       NIKE E-COMMERCE DATABASE SEED SCRIPT".padEnd(58) + "*");
  console.log("*" + " ".repeat(58) + "*");
  console.log("*".repeat(60));
  console.log("\nStarting seed process at:", new Date().toISOString());

  try {
    // ========================================================================
    // STEP 1: Clear existing data (in reverse order of dependencies)
    // ========================================================================
    logSection("STEP 1: Clearing Existing Data");

    logInfo("Deleting product collections...");
    await db.delete(productCollections);

    logInfo("Deleting product images...");
    await db.delete(productImages);

    logInfo("Deleting product variant sizes...");
    await db.delete(productVariantSizes);

    logInfo("Deleting product variants...");
    await db.delete(productVariants);

    logInfo("Deleting products...");
    await db.delete(products);

    logInfo("Deleting collections...");
    await db.delete(collections);

    logInfo("Deleting categories...");
    await db.delete(categories);

    logInfo("Deleting brands...");
    await db.delete(brands);

    logInfo("Deleting sizes...");
    await db.delete(sizes);

    logInfo("Deleting colors...");
    await db.delete(colors);

    logInfo("Deleting genders...");
    await db.delete(genders);

    logSuccess("All existing data cleared successfully!");

    // ========================================================================
    // STEP 2: Seed Filters (Genders, Colors, Sizes, Brands)
    // ========================================================================
    logSection("STEP 2: Seeding Filters");

    // Seed Genders
    logInfo("Seeding genders...");
    const insertedGenders = await db.insert(genders).values(genderData).returning();
    const genderMap = new Map(insertedGenders.map((g) => [g.slug, g.id]));
    logSuccess(`Seeded ${insertedGenders.length} genders: ${insertedGenders.map((g) => g.label).join(", ")}`);

    // Seed Colors
    logInfo("Seeding colors...");
    const insertedColors = await db.insert(colors).values(colorData).returning();
    logSuccess(`Seeded ${insertedColors.length} colors: ${insertedColors.map((c) => c.name).join(", ")}`);

    // Seed Sizes
    logInfo("Seeding sizes...");
    const insertedSizes = await db.insert(sizes).values(sizeData).returning();
    logSuccess(`Seeded ${insertedSizes.length} sizes: ${insertedSizes.map((s) => s.name).join(", ")}`);

    // Seed Brands
    logInfo("Seeding brands...");
    const insertedBrands = await db.insert(brands).values(brandData).returning();
    const brandMap = new Map(insertedBrands.map((b) => [b.slug, b.id]));
    logSuccess(`Seeded ${insertedBrands.length} brands: ${insertedBrands.map((b) => b.name).join(", ")}`);

    // ========================================================================
    // STEP 3: Seed Categories
    // ========================================================================
    logSection("STEP 3: Seeding Categories");

    logInfo("Seeding categories...");
    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    const categoryMap = new Map(insertedCategories.map((c) => [c.slug, c.id]));
    logSuccess(`Seeded ${insertedCategories.length} categories: ${insertedCategories.map((c) => c.name).join(", ")}`);

    // ========================================================================
    // STEP 4: Seed Collections
    // ========================================================================
    logSection("STEP 4: Seeding Collections");

    logInfo("Seeding collections...");
    const insertedCollections = await db.insert(collections).values(collectionData).returning();
    logSuccess(
      `Seeded ${insertedCollections.length} collections: ${insertedCollections.map((c) => c.name).join(", ")}`
    );

    // ========================================================================
    // STEP 5: Seed Products with Variants, Sizes, and Images
    // ========================================================================
    logSection("STEP 5: Seeding Products");

    let totalProducts = 0;
    let totalVariants = 0;
    let totalVariantSizes = 0;
    let totalImages = 0;
    let totalProductCollections = 0;

    for (const productData of nikeProductData) {
      const productSlug = generateSlug(productData.name);

      // Validate required references
      const categoryId = categoryMap.get(productData.categorySlug);
      const genderId = genderMap.get(productData.genderSlug);
      const brandId = brandMap.get("nike");

      if (!categoryId) {
        logError(`Category not found for slug: ${productData.categorySlug}`);
        continue;
      }
      if (!genderId) {
        logError(`Gender not found for slug: ${productData.genderSlug}`);
        continue;
      }
      if (!brandId) {
        logError("Nike brand not found!");
        continue;
      }

      // Insert product
      const [insertedProduct] = await db
        .insert(products)
        .values({
          name: productData.name,
          slug: productSlug,
          description: productData.description,
          categoryId,
          genderId,
          brandId,
          isPublished: true,
        })
        .returning();

      totalProducts++;
      logInfo(`Created product: ${productData.name} (${productSlug})`);

      // Randomize: 2-4 color variants per product
      const numColors = getRandomInRange(2, 4);
      const productColors = getRandomItems(insertedColors, numColors);

      // Randomize: 6-10 sizes available per variant
      const numSizes = getRandomInRange(6, 10);
      const productSizes = getRandomItems(insertedSizes, numSizes);

      let firstVariantId: string | null = null;

      // Create variants (one per color)
      for (const color of productColors) {
        const sku = generateSku(productSlug, color.slug);

        // Insert variant (product + color combination)
        const [variant] = await db
          .insert(productVariants)
          .values({
            productId: insertedProduct.id,
            sku,
            colorId: color.id,
          })
          .returning();

        totalVariants++;

        if (!firstVariantId) {
          firstVariantId = variant.id;
        }

        // Create variant sizes (one per size for this variant)
        for (const size of productSizes) {
          const basePrice = productData.basePrice;
          const hasSale = Math.random() > 0.7; // 30% chance of sale
          const saleDiscount = hasSale ? getRandomInRange(10, 30) : 0;
          const salePrice = hasSale ? (basePrice * (1 - saleDiscount / 100)).toFixed(2) : null;

          // Randomize stock: 0-50, with some sizes out of stock
          const inStock = Math.random() > 0.15 ? getRandomInRange(1, 50) : 0;

          await db.insert(productVariantSizes).values({
            variantId: variant.id,
            sizeId: size.id,
            price: basePrice.toFixed(2),
            salePrice,
            inStock,
          });

          totalVariantSizes++;
        }

        // Add images for this variant (1-3 images per color variant)
        const numImages = getRandomInRange(1, 3);
        for (let i = 0; i < numImages; i++) {
          const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
          await db.insert(productImages).values({
            variantId: variant.id,
            url: randomImageUrl,
            sortOrder: i,
            isPrimary: i === 0,
          });
          totalImages++;
        }
      }

      // Update product with default variant
      if (firstVariantId) {
        await db.update(products).set({ defaultVariantId: firstVariantId }).where(eq(products.id, insertedProduct.id));
      }

      // Assign product to random collections (1-2 collections)
      const numCollections = getRandomInRange(1, 2);
      const productCollectionsList = getRandomItems(insertedCollections, numCollections);
      for (const collection of productCollectionsList) {
        await db.insert(productCollections).values({
          productId: insertedProduct.id,
          collectionId: collection.id,
        });
        totalProductCollections++;
      }
    }

    // ========================================================================
    // SUMMARY
    // ========================================================================
    logSection("SEED COMPLETE - SUMMARY");

    console.log("\n  Filter Tables:");
    console.log(`    - Genders:    ${insertedGenders.length}`);
    console.log(`    - Colors:     ${insertedColors.length}`);
    console.log(`    - Sizes:      ${insertedSizes.length}`);
    console.log(`    - Brands:     ${insertedBrands.length}`);

    console.log("\n  Category & Collection Tables:");
    console.log(`    - Categories: ${insertedCategories.length}`);
    console.log(`    - Collections: ${insertedCollections.length}`);

    console.log("\n  Product Tables:");
    console.log(`    - Products:           ${totalProducts}`);
    console.log(`    - Product Variants:   ${totalVariants}`);
    console.log(`    - Variant Sizes:      ${totalVariantSizes}`);
    console.log(`    - Product Images:     ${totalImages}`);
    console.log(`    - Product Collections: ${totalProductCollections}`);

    console.log("\n" + "=".repeat(60));
    logSuccess("Database seeded successfully!");
    console.log("=".repeat(60));
    console.log("\nCompleted at:", new Date().toISOString());
  } catch (error) {
    logSection("SEED FAILED");
    logError("An error occurred during seeding:", error);

    if (error instanceof Error) {
      console.error("\nFull error details:");
      console.error("  Name:", error.name);
      console.error("  Message:", error.message);
      if (error.stack) {
        console.error("  Stack trace:");
        console.error(error.stack);
      }
    }

    throw error;
  }
}

// ============================================================================
// EXECUTE SEED
// ============================================================================

seed()
  .then(() => {
    console.log("\nExiting with success code (0)");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n[FATAL] Seed script failed!");
    console.error(error);
    process.exit(1);
  });
