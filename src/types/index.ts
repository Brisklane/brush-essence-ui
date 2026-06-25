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

export type OrderStatus =
  | "Placed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postalCode: string;
  country: string;
  phone: string | null;
}

export interface OrderItem {
  id: string;
  paintingId: string | null;
  title: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  currency: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  note: string | null;
  occurredAt: string;
}

export interface OrderTracking {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  isComplete: boolean;
  history: OrderStatusEvent[];
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
