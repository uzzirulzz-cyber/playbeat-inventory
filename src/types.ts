export interface ProductOffer {
  id: string;
  title: string;
  category: string;
  region: string;
  regionFlag?: string;
  imageUrl?: string;
  soldCount: number;
  offerCount: number;
  basePrice: number;
  sellingPrice?: number;
  minPrice: number;
  maxPrice: number;
  url: string;
  isPrivateAccount: boolean;
  isSharedAccount: boolean;
  isResellerPanel: boolean;
}

export type ProductStatus = 'Published' | 'Draft' | 'Hidden' | 'Scheduled';
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Coming Soon' | 'Unlimited/Digital Stock';
export type ProductBadge = 'NEW' | 'HOT' | 'TRENDING' | 'BEST SELLER' | 'LIMITED' | 'SALE';

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  status: StockStatus;
  imageUrl?: string;
  enabled: boolean;
}

export interface ProductImageItem {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductCatalogItem extends ProductOffer {
  shortDescription: string;
  fullDescription: string;
  compareAtPrice: number;
  discountPercent: number;
  subcategory: string;
  stock: number;
  stockStatus: StockStatus;
  sku: string;
  availability: boolean;
  visibility: ProductStatus;
  minPurchaseQty: number;
  maxPurchaseQty: number;
  isFeatured: boolean;
  isTrending: boolean;
  isComingSoon: boolean;
  isOnLandingPage: boolean;
  badges: ProductBadge[];
  gallery: string[];
  variations: ProductVariation[];
  updatedAt: string;
}

export interface CategoryStat {
  category: string;
  productCount: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  totalSold: number;
}
