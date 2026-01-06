import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Heart, Star } from "lucide-react";

import Button from "@/components/Button";
import ProductGallery from "@/components/ProductGallery";
import VariantPicker from "@/components/VariantPicker";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import RelatedProducts from "@/components/RelatedProducts";
import { mockRelatedProducts, mockShipping, mockReviews } from "@/lib/mock-product-data";
import { getProduct } from "@/lib/products";
import { isValidSku, getDefaultSku } from "@/lib/products/utils";
import type { VariantSize, Image as VariantImage, Variant } from "@/lib/products/types";
import ProductPageSkeleton from "@/components/ProductPageSkeleton";

type Props = {
	params: Promise<{
		slug: string;
		sku: string;
	}>;
};

export default function ProductPage(props: Props) {
	return (
		<Suspense fallback={<ProductPageSkeleton />}>
			<ProductPageContent {...props} />
		</Suspense>
	);
}

async function ProductPageContent({ params }: Props) {
	const { slug, sku } = await params;
	const product = await getProduct(slug);

	if (!product) {
		redirect("/");
	}

	if (!isValidSku(product, sku)) {
		const defaultSku = getDefaultSku(product);

		if (defaultSku) {
			redirect(`/products/${slug}/${defaultSku}`);
		}
		redirect("/");
	}

	const currentVariant = product.variants.find(variant => variant.sku === sku);
	const firstAvailableSize = currentVariant?.sizes.find(size => size.inStock > 0);

	return (
		<main className="min-h-screen bg-light-100">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
					<ProductGallery images={currentVariant?.images as VariantImage[]} />

					<div className="flex flex-col">
						<div className="mb-6">
							<h1 className="text-heading-3 font-heading-3 text-dark-900 lg:text-heading-2 lg:font-heading-2">
								{product.name}
							</h1>
							<p className="mt-1 text-body text-dark-700">{product.category}</p>

							<div className="mt-4">
								<span className="text-heading-3 font-heading-3 text-dark-900">
									${firstAvailableSize?.price ?? "Not Available"}
								</span>
							</div>
						</div>

						<div className="mb-6">
							<VariantPicker variants={product.variants} currentVariantSku={sku} productSlug={slug} />
							{currentVariant?.color && <p className="mt-2 text-caption text-dark-700">{currentVariant.color}</p>}
						</div>

						<div className="mb-6">
							<SizePicker sizes={currentVariant?.sizes as VariantSize[]} defaultSizeId={firstAvailableSize?.id ?? ""} />
						</div>

						<div className="mb-8 flex flex-col gap-3">
							<Button fullWidth>Add to Bag</Button>
							<Button variant="outline" fullWidth>
								<Heart className="h-5 w-5" aria-hidden="true" />
								Favorite
							</Button>
						</div>

						<div className="border-t border-light-300">
							<CollapsibleSection title="Product Details" defaultOpen disabled>
								<div className="space-y-4 text-body text-dark-700">
									<p>{product.description}</p>

									<div className="space-y-1">
										<p>
											<span className="text-dark-900">Shown:</span> {currentVariant?.sku}
										</p>
										<p>
											<span className="text-dark-900">Style:</span> {currentVariant?.color}
										</p>
									</div>
								</div>
							</CollapsibleSection>

							<CollapsibleSection title="Shipping & Returns">
								<div className="space-y-4 text-body text-dark-700">
									<p>{mockShipping.freeShipping}</p>
									<p>{mockShipping.returns}</p>
									<p>{mockShipping.pickup}</p>
								</div>
							</CollapsibleSection>

							<CollapsibleSection
								title={`Reviews (${mockReviews.length})`}
								rightContent={
									<div className="flex items-center gap-1">
										{Array.from({ length: 5 }).map((_, index) => (
											<Star
												key={index}
												className={`h-4 w-4 ${
													index < Math.round(4.3) ? "fill-dark-900 text-dark-900" : "fill-light-300 text-light-300"
												}`}
												aria-hidden="true"
											/>
										))}
									</div>
								}
							>
								<div className="space-y-6">
									{mockReviews.map(review => (
										<div key={review.id} className="space-y-2">
											<div className="flex items-center gap-2">
												<div className="flex">
													{Array.from({ length: 5 }).map((_, index) => (
														<Star
															key={index}
															className={`h-4 w-4 ${
																index < review.rating ? "fill-dark-900 text-dark-900" : "fill-light-300 text-light-300"
															}`}
															aria-hidden="true"
														/>
													))}
												</div>
												<span className="text-caption font-caption text-dark-900">{review.title}</span>
											</div>
											<p className="text-body text-dark-700">{review.content}</p>
											<p className="text-footnote text-dark-500">
												{review.author} - {new Date(review.date).toLocaleDateString()}
											</p>
										</div>
									))}
								</div>
							</CollapsibleSection>
						</div>
					</div>
				</div>

				<RelatedProducts products={mockRelatedProducts} />
			</div>
		</main>
	);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	"use cache";

	const resolvedPararent = await params;
	const { slug, sku } = resolvedPararent;

	const product = await getProduct(slug);

	if (!product || !isValidSku(product, sku)) {
		return {};
	}

	const currentVariant = product.variants.find(variant => variant.sku === sku) as Variant;
	const availableSizes = currentVariant.sizes.filter(size => size.inStock > 0);

	const title = `${product.name} - ${currentVariant.color} (${availableSizes.map(size => size.size).join(", ")}) | Nike Store`;
	const description = product.description;

	return {
		title,
		description,
		keywords: [
			product.name,
			product.category as string,
			product.gender as string,
			currentVariant.color,
			...availableSizes.map(size => size.size),
		],
	};
}
