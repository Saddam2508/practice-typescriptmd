export interface Banner {
  _id: string;
  title: string;
  subTitle: string;
  position: number;
  isActive: boolean;
}

export type BannerStatus = "idle" | "pending" | "fulfilled" | "rejected";

export interface BannerState {
  banners: Banner[];
  status: BannerStatus;
  error: string | null;
}
