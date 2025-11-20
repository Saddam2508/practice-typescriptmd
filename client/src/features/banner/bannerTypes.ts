export interface Banner {
  _id?: string; // Optional ID
  title?: string; // Optional title
  image?: string; // Optional image
  [key: string]: unknown; // Optional extra fields from backend
}

export type BannerStatus = "idle" | "pending" | "fulfilled" | "rejected";

export interface BannerState {
  banners: Banner[]; // UI render এর জন্য main array
  backendResponse?: Banner; // backend থেকে latest response (optional)
  backendHistory: Banner[]; // backend থেকে আসা সব responses (history)
  status: BannerStatus;
  error: string | null | undefined;
}
