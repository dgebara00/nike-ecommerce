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
	const scrollContainerRef = useRef<HTMLDivElement>(null);

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

	const handleDotClick = useCallback((index: number) => {
		setSelectedIndex(index);
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const scrollWidth = container.scrollWidth / images.length;
			container.scrollTo({ left: scrollWidth * index, behavior: "smooth" });
		}
	}, [images.length]);

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

	const handleScroll = useCallback(() => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const scrollWidth = container.scrollWidth / images.length;
			const newIndex = Math.round(container.scrollLeft / scrollWidth);
			if (newIndex !== selectedIndex && newIndex >= 0 && newIndex < images.length) {
				setSelectedIndex(newIndex);
			}
		}
	}, [images.length, selectedIndex]);

	useEffect(() => {
		thumbnailRefs.current[selectedIndex]?.focus();
	}, [selectedIndex]);

	const currentImage = images[selectedIndex];
	const hasError = currentImage && imageErrors.has(currentImage.id);

	if (images.length === 0) {
		return (
			<div className="flex aspect-[4/5] items-center justify-center bg-light-200 rounded-lg">
				<ImageOff className="h-16 w-16 text-dark-500" aria-hidden="true" />
				<span className="sr-only">No images available</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
			{/* Desktop thumbnails - hidden on mobile */}
			{hasMultipleImages && (
				<div
					className="hidden lg:flex order-2 lg:order-1 lg:flex-col gap-2 lg:overflow-y-auto lg:max-h-[700px]"
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
								className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
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

			{/* Main image area */}
			<div
				ref={mainImageRef}
				id="main-product-image"
				role="tabpanel"
				aria-label={currentImage?.alt || "Product image"}
				className={`relative order-1 flex-1 lg:order-2 ${hasMultipleImages ? "" : "w-full"}`}
			>
				{/* Mobile: Scrollable gallery with dots */}
				<div className="lg:hidden">
					<div
						ref={scrollContainerRef}
						className="flex snap-x snap-mandatory overflow-x-auto"
						onScroll={handleScroll}
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						<style jsx>{`
							div::-webkit-scrollbar {
								display: none;
							}
						`}</style>
						{images.map((image, index) => {
							const hasImgError = imageErrors.has(image.id);
							return (
								<div
									key={image.id}
									className="relative flex-shrink-0 w-full snap-center"
								>
									<div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-light-200">
										{badge && index === 0 && (
											<span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-light-100 px-3 py-1.5 text-caption font-caption text-dark-900 shadow-sm">
												<Star className="h-4 w-4 fill-current" aria-hidden="true" />
												{badge}
											</span>
										)}
										{hasImgError ? (
											<div className="flex h-full w-full items-center justify-center">
												<ImageOff className="h-16 w-16 text-dark-500" aria-hidden="true" />
												<span className="sr-only">Image failed to load</span>
											</div>
										) : (
											<Image
												src={image.url}
												alt={image.alt}
												fill
												sizes="100vw"
												className="object-cover"
												priority={index === 0}
												onError={() => handleImageError(image.id)}
											/>
										)}
									</div>
								</div>
							);
						})}
					</div>

					{/* Dots indicator for mobile */}
					{hasMultipleImages && (
						<div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Image navigation dots">
							{images.map((_, index) => (
								<button
									key={index}
									type="button"
									role="tab"
									aria-selected={index === selectedIndex}
									aria-label={`Go to image ${index + 1}`}
									onClick={() => handleDotClick(index)}
									className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
										index === selectedIndex
											? "bg-dark-900"
											: "bg-dark-500 hover:bg-dark-700"
									}`}
								/>
							))}
						</div>
					)}
				</div>

				{/* Desktop: Single image with navigation */}
				<div className="hidden lg:block">
					<div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-light-200">
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
									sizes="50vw"
									className="object-cover"
									priority
									onError={() => handleImageError(currentImage.id)}
								/>
							)
						)}

						{hasMultipleImages && (
							<div className="absolute bottom-4 right-4 z-10 flex gap-2">
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
			</div>
		</div>
	);
}

export default ProductGallery;
