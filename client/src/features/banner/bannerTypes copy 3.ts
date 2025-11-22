export interface Banner {
  _id?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  isActive?: boolean;
  position?: number;
  image?: string;

  [key: string]: unknown;
}

export type BannerStatus = "idle" | "pending" | "fulfilled" | "rejected";

export interface BannerState {
  banners: Banner[];
  backendResponse?: Banner;
  backendHistory: Banner[];
  status: BannerStatus;
  error: string | null | undefined;
}
