/**
 * Shared domain types for the frontend. These mirror the API's DTOs so data
 * flows from backend to UI with a single source of truth.
 */
export interface Painting {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  widthCm: number;
  heightCm: number;
  medium: string | null;
  imageUrl: string | null;
  stockQuantity: number;
  isPublished: boolean;
  categoryId: string | null;
  categoryName: string | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export interface CartItem {
  id: string;
  paintingId: string;
  title: string;
  imageUrl: string | null;
  unitPrice: number;
  currency: string;
  quantity: number;
  stockQuantity: number;
  lineTotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  currency: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
