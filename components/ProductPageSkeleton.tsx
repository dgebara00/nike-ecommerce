export default function ProductPageSkeleton() {
	return (
		<main className="min-h-screen bg-light-100">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
					<div className="aspect-4/5 animate-pulse rounded-lg bg-light-200" />
					<div className="space-y-6">
						<div className="space-y-3">
							<div className="h-10 w-3/4 animate-pulse rounded bg-light-200" />
							<div className="h-4 w-1/2 animate-pulse rounded bg-light-200" />
							<div className="h-8 w-24 animate-pulse rounded bg-light-200" />
						</div>
						<div className="h-48 w-full animate-pulse rounded bg-light-200" />
						<div className="space-y-4">
							<div className="h-12 w-full animate-pulse rounded bg-light-200" />
							<div className="h-12 w-full animate-pulse rounded bg-light-200" />
						</div>
						<div className="h-32 w-full animate-pulse rounded bg-light-200" />
					</div>
				</div>
			</div>
		</main>
	);
}
