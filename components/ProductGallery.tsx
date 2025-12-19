"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, Star } from "lucide-react";

export interface GalleryImage {
	id: string;
	url: string;
	alt: string;
}

interface ProductGalleryProps {
	images: GalleryImage[];
	badge?: string;
}

export function ProductGallery({ images, badge }: ProductGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
	const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const mainImageRef = useRef<HTMLDivElement>(null);

	const hasMultipleImages = images.length > 1;

	const handlePrevious = useCallback(() => {
		setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	}, [images.length]);

	const handleNext = useCallback(() => {
		setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	}, [images.length]);

	const handleThumbnailClick = useCallback((index: number) => {
		setSelectedIndex(index);
	}, []);

	const handleImageError = useCallback((imageId: string) => {
		setImageErrors((prev) => new Set(prev).add(imageId));
	}, []);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			switch (event.key) {
				case "ArrowLeft":
					event.preventDefault();
					handlePrevious();
					break;
				case "ArrowRight":
					event.preventDefault();
					handleNext();
					break;
				case "ArrowUp":
					event.preventDefault();
					handlePrevious();
					break;
				case "ArrowDown":
					event.preventDefault();
					handleNext();
					break;
				case "Home":
					event.preventDefault();
					setSelectedIndex(0);
					break;
				case "End":
					event.preventDefault();
					setSelectedIndex(images.length - 1);
					break;
			}
		},
		[handlePrevious, handleNext, images.length]
	);

	useEffect(() => {
		thumbnailRefs.current[selectedIndex]?.focus();
	}, [selectedIndex]);

	const currentImage = images[selectedIndex];
	const hasError = currentImage && imageErrors.has(currentImage.id);

	if (images.length === 0) {
		return (
			<div className="flex aspect-square items-center justify-center bg-light-200 rounded-lg">
				<ImageOff className="h-16 w-16 text-dark-500" aria-hidden="true" />
				<span className="sr-only">No images available</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
			{hasMultipleImages && (
				<div
					className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[600px]"
					role="tablist"
					aria-label="Product image thumbnails"
				>
					{images.map((image, index) => {
						const isSelected = index === selectedIndex;
						const hasThumbError = imageErrors.has(image.id);

						return (
							<button
								key={image.id}
								ref={(el) => {
									thumbnailRefs.current[index] = el;
								}}
								type="button"
								role="tab"
								aria-selected={isSelected}
								aria-controls="main-product-image"
								aria-label={`View ${image.alt}, image ${index + 1} of ${images.length}`}
								tabIndex={isSelected ? 0 : -1}
								onClick={() => handleThumbnailClick(index)}
								onKeyDown={handleKeyDown}
								className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
									isSelected ? "border-dark-900" : "border-transparent hover:border-dark-500"
								}`}
							>
								{hasThumbError ? (
									<div className="flex h-full w-full items-center justify-center bg-light-200">
										<ImageOff className="h-6 w-6 text-dark-500" aria-hidden="true" />
									</div>
								) : (
									<Image
										src={image.url}
										alt=""
										fill
										sizes="80px"
										className="object-cover"
										onError={() => handleImageError(image.id)}
									/>
								)}
							</button>
						);
					})}
				</div>
			)}

			<div
				ref={mainImageRef}
				id="main-product-image"
				role="tabpanel"
				aria-label={currentImage?.alt || "Product image"}
				className={`relative order-1 flex-1 lg:order-2 ${hasMultipleImages ? "" : "w-full"}`}
			>
				<div className="relative aspect-square overflow-hidden rounded-lg bg-light-200">
					{badge && (
						<span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-light-100 px-3 py-1.5 text-caption font-caption text-dark-900 shadow-sm">
							<Star className="h-4 w-4 fill-current" aria-hidden="true" />
							{badge}
						</span>
					)}

					{hasError ? (
						<div className="flex h-full w-full items-center justify-center">
							<ImageOff className="h-16 w-16 text-dark-500" aria-hidden="true" />
							<span className="sr-only">Image failed to load</span>
						</div>
					) : (
						currentImage && (
							<Image
								src={currentImage.url}
								alt={currentImage.alt}
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
								priority
								onError={() => handleImageError(currentImage.id)}
							/>
						)
					)}
				</div>

				{hasMultipleImages && (
						<div className="absolute bottom-4 right-4 flex gap-2">
						<button
							type="button"
							onClick={handlePrevious}
							aria-label="Previous image"
							className="flex h-10 w-10 items-center justify-center rounded-full bg-light-100 shadow-md transition-colors hover:bg-light-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
						>
							<ChevronLeft className="h-5 w-5 text-dark-900" aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={handleNext}
							aria-label="Next image"
							className="flex h-10 w-10 items-center justify-center rounded-full bg-light-100 shadow-md transition-colors hover:bg-light-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
						>
							<ChevronRight className="h-5 w-5 text-dark-900" aria-hidden="true" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default ProductGallery;
