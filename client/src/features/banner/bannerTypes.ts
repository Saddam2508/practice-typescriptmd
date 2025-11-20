// src/features/banner/bannerTypes.ts

// =====================
// 🔹 Banner Interface
// =====================
export interface Banner {
  id: number; // Prisma মডেল অনুসারে 'id' হলো number
  title: string;
  subTitle?: string; // optional
  link?: string; // optional
  image: string; // ব্যাকএন্ডে image path/URL
  position: number; // ডিফল্ট 0
  isActive: boolean; // ডিফল্ট true
  productId?: number | null; // optional foreign key
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// =====================
// 🔹 Banner Status
// =====================
export type BannerStatus = "idle" | "pending" | "fulfilled" | "rejected";

// =====================
// 🔹 Banner Slice State
// =====================
export interface BannerState {
  banner: Banner | null;
  status: BannerStatus;
  error: string | null;
}
