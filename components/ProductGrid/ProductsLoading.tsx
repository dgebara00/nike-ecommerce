function ProductsLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-light-200"
          style={{ aspectRatio: "1/1.3" }}
        />
      ))}
    </div>
  );
}

export default ProductsLoading;
