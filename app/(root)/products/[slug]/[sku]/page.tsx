import { redirect } from "next/navigation";
import { Heart, Star } from "lucide-react";

import Button from "@/components/Button";
import ProductGallery from "@/components/ProductGallery";
import ColorPicker from "@/components/ColorPicker";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import RelatedProducts from "@/components/RelatedProducts";
import { mockRelatedProducts, getProductBySlugAndSku, getDefaultSku, isValidSku } from "@/lib/mock-product-data";

interface ProductPageProps {
	params: Promise<{
		slug: string;
		color: string;
	}>;
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { slug, color } = await params;

	if (!isValidSku(slug, color)) {
		const defaultColor = getDefaultSku(slug);
		if (defaultColor) {
			redirect(`/products/${slug}/${defaultColor}`);
		}
		redirect("/");
	}

	const product = getProductBySlugAndSku(slug, color);

	if (!product) {
		redirect("/");
	}

	const currentColor = product.colors.find(c => c.slug === color);

	return (
		<main className="min-h-screen bg-light-100">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
					<ProductGallery images={product.images} badge={product.badge} />

					<div className="flex flex-col">
						<div className="mb-6">
							<h1 className="text-heading-3 font-heading-3 text-dark-900 lg:text-heading-2 lg:font-heading-2">
								{product.name}
							</h1>
							<p className="mt-1 text-body text-dark-700">{product.category}</p>

							<div className="mt-4">
								<span className="text-heading-3 font-heading-3 text-dark-900">${product.price}</span>
							</div>

							{product.promoText && <p className="mt-2 text-caption font-caption text-green">{product.promoText}</p>}
						</div>

						<div className="mb-6">
							<ColorPicker colors={product.colors} currentSlug={color} productSlug={product.slug} />
							{currentColor && <p className="mt-2 text-caption text-dark-700">{currentColor.name}</p>}
						</div>

						<div className="mb-6">
							<SizePicker sizes={product.sizes} />
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
									<p>{product.details.description}</p>

									<ul className="list-inside list-disc space-y-1">
										{product.details.features.map((feature, index) => (
											<li key={index}>{feature}</li>
										))}
									</ul>

									<div className="space-y-1">
										<p>
											<span className="text-dark-900">Shown:</span> {product.details.colorway}
										</p>
										<p>
											<span className="text-dark-900">Style:</span> {product.details.styleCode}
										</p>
									</div>
								</div>
							</CollapsibleSection>

							<CollapsibleSection title="Shipping & Returns">
								<div className="space-y-4 text-body text-dark-700">
									<p>{product.shipping.freeShipping}</p>
									<p>{product.shipping.returns}</p>
									<p>{product.shipping.pickup}</p>
								</div>
							</CollapsibleSection>

							<CollapsibleSection
								title={`Reviews (${product.reviews.length})`}
								rightContent={
									<div className="flex items-center gap-1">
										{Array.from({ length: 5 }).map((_, index) => (
											<Star
												key={index}
												className={`h-4 w-4 ${
													index < Math.round(product.averageRating)
														? "fill-dark-900 text-dark-900"
														: "fill-light-300 text-light-300"
												}`}
												aria-hidden="true"
											/>
										))}
									</div>
								}
							>
								<div className="space-y-6">
									{product.reviews.map(review => (
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
