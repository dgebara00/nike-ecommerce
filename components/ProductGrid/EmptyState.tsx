function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-light-200 p-6">
        <svg
          className="h-12 w-12 text-dark-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-heading-3 font-heading-3 text-dark-900">No products found</h3>
      <p className="max-w-md text-body font-body text-dark-700">
        We couldn&apos;t find any products matching your filters. Try adjusting your selection or
        clearing all filters to see more options.
      </p>
    </div>
  );
}

export default EmptyState;
