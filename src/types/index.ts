/**
 * Shared domain types for the frontend. These mirror the API's DTOs so data
 * flows from backend to UI with a single source of truth.
 */
export interface Painting {
  id: string;
  title: string;
  description: string | null;
  price: number;
  /** Sale price when a promotion applies; null at full price. */
  discountedPrice: number | null;
  currency: string;
  widthCm: number;
  heightCm: number;
  mediumId: string | null;
  mediumName: string | null;
  imageUrl: string | null;
  stockQuantity: number;
  isPublished: boolean;
  categoryId: string | null;
  categoryName: string | null;
  averageRating: number;
  ratingCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export interface Medium {
  id: string;
  name: string;
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

export type CustomRequestStatus =
  | "Submitted"
  | "Reviewed"
  | "Quoted"
  | "InProgress"
  | "Completed"
  | "Declined";

export interface CustomRequestImage {
  id: string;
  url: string;
  fileName: string | null;
}

export interface CustomRequestStatusEvent {
  status: CustomRequestStatus;
  note: string | null;
  occurredAt: string;
}

export interface CustomRequest {
  id: string;
  customerEmail: string;
  title: string;
  description: string;
  preferredSize: string | null;
  quoteAmount: number | null;
  currency: string;
  status: CustomRequestStatus;
  isEditable: boolean;
  images: CustomRequestImage[];
  history: CustomRequestStatusEvent[];
  createdAt: string;
}

export interface CustomRequestSummary {
  id: string;
  title: string;
  status: CustomRequestStatus;
  imageCount: number;
  createdAt: string;
}

// ----- Admin dashboard -----

export interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  roles: string[];
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminOrderListItem {
  id: string;
  orderNumber: string;
  customerEmail: string;
  status: OrderStatus;
  currency: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface AdminCustomRequestListItem {
  id: string;
  title: string;
  customerEmail: string;
  status: CustomRequestStatus;
  imageCount: number;
  createdAt: string;
}

export interface DashboardSummary {
  totalRevenue: number;
  currency: string;
  totalOrders: number;
  pendingOrders: number;
  ordersByStatus: Record<string, number>;
  totalUsers: number;
  activeUsers: number;
  newUsersLast30Days: number;
  totalRequests: number;
  openRequests: number;
  requestsByStatus: Record<string, number>;
  totalPaintings: number;
  publishedPaintings: number;
  outOfStockPaintings: number;
  recentOrders: AdminOrderListItem[];
  recentRequests: AdminCustomRequestListItem[];
}

export interface ReportPoint {
  date: string;
  revenue: number;
  orders: number;
  newUsers: number;
  newRequests: number;
}

export interface Report {
  days: number;
  currency: string;
  totalRevenue: number;
  totalOrders: number;
  totalNewUsers: number;
  totalNewRequests: number;
  points: ReportPoint[];
}

export type ReviewStatus = "Pending" | "Approved" | "Rejected";

export interface Review {
  id: string;
  paintingId: string;
  authorName: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: ReviewStatus;
  createdAt: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  /** Count of approved reviews per star (keys "1".."5"). */
  distribution: Record<string, number>;
}

export interface AdminReviewListItem {
  id: string;
  paintingId: string;
  paintingTitle: string;
  customerEmail: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: ReviewStatus;
  createdAt: string;
}

// ----- Promotions / discounts -----

export type DiscountType = "Percentage" | "FixedAmount";

export type PromotionScope = "All" | "Category" | "Paintings";

export interface Promotion {
  id: string;
  name: string;
  discountType: DiscountType;
  value: number;
  scope: PromotionScope;
  categoryId: string | null;
  categoryName: string | null;
  paintingIds: string[];
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  /** True when currently active and within its date window. */
  isLive: boolean;
  createdAt: string;
}

/** Public, slim view of a live promotion for the storefront banner. */
export interface ActivePromotion {
  name: string;
  discountType: DiscountType;
  value: number;
  scope: PromotionScope;
  endsAt: string | null;
}

export interface SavePromotionPayload {
  name: string;
  discountType: DiscountType;
  value: number;
  scope: PromotionScope;
  categoryId?: string | null;
  paintingIds: string[];
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
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
