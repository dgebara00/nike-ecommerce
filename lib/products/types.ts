export type ProductFilters = {
	search?: string;
	gender?: string[];
	category?: string[];
	price?: string[];
	sort?: string;
};

export type Variant = {
	id: string;
	color: string;
	sku: string;
	images: Image[] | null;
	sizes: VariantSize[];
};

export type Image = {
	id: string;
	isPrimary: boolean;
	url: string;
	order: number;
};

export type Product = {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	createdAt: Date;
	gender: string | null;
	defaultVariantId: string | null;
	priceMin: number;
	priceMax: number;
	category: string | null;
	variants: Variant[];
};

export type VariantSize = {
	id: string;
	inStock: number;
	price: number;
	salePrice: number | null;
	size: string;
};
