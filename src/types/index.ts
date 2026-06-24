/**
 * Shared domain types for the frontend. `Painting` mirrors the API's
 * `PaintingDto` so data flows from backend to UI with a single source of truth.
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
  createdAt: string;
}
