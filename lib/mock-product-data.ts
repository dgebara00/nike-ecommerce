export interface ProductImage {
	id: string;
	url: string;
	alt: string;
}

export interface ProductColor {
	id: string;
	name: string;
	slug: string;
	hexCode: string;
	image: string;
}

export interface ProductSize {
	id: string;
	name: string;
	inStock: boolean;
}

export interface ProductReview {
	id: string;
	rating: number;
	title: string;
	content: string;
	author: string;
	date: string;
}

export interface ProductDetails {
	description: string;
	features: string[];
	colorway: string;
	styleCode: string;
}

export interface ShippingInfo {
	freeShipping: string;
	returns: string;
	pickup: string;
}

export interface Product {
	id: string;
	slug: string;
	sku: string;
	name: string;
	category: string;
	price: number;
	promoText?: string;
	badge?: string;
	images: ProductImage[];
	colors: ProductColor[];
	sizes: ProductSize[];
	details: ProductDetails;
	shipping: ShippingInfo;
	reviews: ProductReview[];
	averageRating: number;
}

export interface RelatedProduct {
	id: string;
	slug: string;
	name: string;
	category: string;
	priceMin: number;
	priceMax: number;
	image: string;
	badge?: string;
	colorCount?: number;
}

const mockImages: ProductImage[] = [
	{
		id: "1",
		url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
		alt: "Nike Air Max 90 SE - Side view",
	},
	{
		id: "2",
		url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop",
		alt: "Nike Air Max 90 SE - Top view",
	},
	{
		id: "3",
		url: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&h=800&fit=crop",
		alt: "Nike Air Max 90 SE - Back view",
	},
	{
		id: "4",
		url: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop",
		alt: "Nike Air Max 90 SE - Detail view",
	},
	{
		id: "5",
		url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
		alt: "Nike Air Max 90 SE - Sole view",
	},
	{
		id: "6",
		url: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&h=800&fit=crop",
		alt: "Nike Air Max 90 SE - Angle view",
	},
	{
		id: "7",
		url: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&h=800&fit=crop",
		alt: "Nike Air Max 90 SE - Front view",
	},
];

const mockColors: ProductColor[] = [
	{
		id: "1",
		name: "Dark Team Red",
		slug: "dark-team-red",
		hexCode: "#8B2942",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
	},
	{
		id: "2",
		name: "Sail",
		slug: "sail",
		hexCode: "#F5F5DC",
		image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop",
	},
	{
		id: "3",
		name: "Black",
		slug: "black",
		hexCode: "#111111",
		image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=100&h=100&fit=crop",
	},
	{
		id: "4",
		name: "White",
		slug: "white",
		hexCode: "#FFFFFF",
		image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=100&h=100&fit=crop",
	},
	{
		id: "5",
		name: "Light Silver",
		slug: "light-silver",
		hexCode: "#C0C0C0",
		image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop",
	},
	{
		id: "6",
		name: "Platinum Tint",
		slug: "platinum-tint",
		hexCode: "#E5E4E2",
		image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=100&h=100&fit=crop",
	},
];

const mockSizes: ProductSize[] = [
	{ id: "1", name: "5", inStock: true },
	{ id: "2", name: "5.5", inStock: true },
	{ id: "3", name: "6", inStock: true },
	{ id: "4", name: "6.5", inStock: true },
	{ id: "5", name: "7", inStock: true },
	{ id: "6", name: "7.5", inStock: true },
	{ id: "7", name: "8", inStock: true },
	{ id: "8", name: "8.5", inStock: true },
	{ id: "9", name: "9", inStock: true },
	{ id: "10", name: "9.5", inStock: true },
	{ id: "11", name: "10", inStock: false },
	{ id: "12", name: "10.5", inStock: false },
	{ id: "13", name: "11", inStock: false },
	{ id: "14", name: "11.5", inStock: false },
	{ id: "15", name: "12", inStock: false },
];

const mockReviews: ProductReview[] = [
	{
		id: "1",
		rating: 5,
		title: "Perfect fit and style!",
		content: "These shoes are amazing. The comfort level is incredible and they look great with everything.",
		author: "Sarah M.",
		date: "2024-01-15",
	},
	{
		id: "2",
		rating: 5,
		title: "Best Air Max yet",
		content: "I've owned many Air Max shoes but these are by far my favorite. The color is beautiful.",
		author: "John D.",
		date: "2024-01-10",
	},
	{
		id: "3",
		rating: 4,
		title: "Great quality",
		content: "Very comfortable and well-made. Would recommend to anyone looking for stylish sneakers.",
		author: "Emily R.",
		date: "2024-01-05",
	},
];

const mockDetails: ProductDetails = {
	description:
		"The Air Max 90 stays true to its running roots with the iconic Waffle sole. Plus, stitched overlays and textured accents create the '90s look you love. Complete with romantic hues, its visible Air cushioning adds comfort to your journey.",
	features: ["Padded collar", "Foam midsole", "Rubber Waffle outsole", "Max Air unit in heel"],
	colorway: "Dark Team Red/Platinum Tint/Pure Platinum/White",
	styleCode: "HM9451-600",
};

const mockShipping: ShippingInfo = {
	freeShipping: "Free standard shipping on orders $50+ and free 60-day returns for Nike Members.",
	returns:
		"Return or exchange your order within 60 days. Items must be unworn and unwashed. Some exclusions apply.",
	pickup: "Select 'Pick Up' at checkout to see if your item is available at a store near you.",
};

export const mockProduct: Product = {
	id: "1",
	slug: "air-max-90-se",
	sku: "HM9451-600",
	name: "Nike Air Max 90 SE",
	category: "Women's Shoes",
	price: 140,
	promoText: "Extra 20% off w/ code SPORT",
	badge: "Highly Rated",
	images: mockImages,
	colors: mockColors,
	sizes: mockSizes,
	details: mockDetails,
	shipping: mockShipping,
	reviews: mockReviews,
	averageRating: 4.7,
};

export const mockRelatedProducts: RelatedProduct[] = [
	{
		id: "2",
		slug: "air-force-1-mid-07",
		name: "Nike Air Force 1 Mid '07",
		category: "Men's Shoes",
		priceMin: 98.3,
		priceMax: 98.3,
		image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop",
		badge: "Best Seller",
		colorCount: 6,
	},
	{
		id: "3",
		slug: "court-vision-low-next-nature",
		name: "Nike Court Vision Low Next Nature",
		category: "Men's Shoes",
		priceMin: 98.3,
		priceMax: 98.3,
		image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop",
		badge: "Extra 20% off",
		colorCount: 4,
	},
	{
		id: "4",
		slug: "dunk-low-retro",
		name: "Nike Dunk Low Retro",
		category: "Men's Shoes",
		priceMin: 98.3,
		priceMax: 98.3,
		image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
		badge: "Extra 10% off",
		colorCount: 6,
	},
	{
		id: "5",
		slug: "air-max-97",
		name: "Nike Air Max 97",
		category: "Women's Shoes",
		priceMin: 175,
		priceMax: 175,
		image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&h=800&fit=crop",
		colorCount: 3,
	},
];

export function getProductBySlugAndSku(slug: string, sku: string): Product | null {
	if (mockProduct.slug === slug) {
		const colorVariant = mockProduct.colors.find((c) => c.slug === sku);
		if (colorVariant) {
			return {
				...mockProduct,
				sku: colorVariant.slug,
			};
		}
		return mockProduct;
	}
	return null;
}

export function getDefaultSku(slug: string): string | null {
	if (mockProduct.slug === slug) {
		return mockProduct.colors[0]?.slug || null;
	}
	return null;
}

export function isValidSku(slug: string, sku: string): boolean {
	if (mockProduct.slug === slug) {
		return mockProduct.colors.some((c) => c.slug === sku);
	}
	return false;
}
