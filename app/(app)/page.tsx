import { getProducts } from "@/lib/products";
import Card from "@/components/Card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen space-y-16 px-4 py-12 text-zinc-50 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold text-white">Latest shoes</h2>
        {products.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const priceValue = Number.parseFloat(`${product.price}`);

              return (
                <Card
                  key={product.id ?? product.slug}
                  id={product.id}
                  title={product.name}
                  category={product.category}
                  price={Number.isNaN(priceValue) ? 0 : priceValue}
                  image={product.imageUrl}
                  colorCount={product.inventory}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-black/30 p-10 text-center text-sm text-white/70">
            Inventory is syncing—check back soon for fresh drops.
          </div>
        )}
      </section>
    </div>
  );
}
