export interface Banner {
  _id?: string;
  title?: string;
  subTitle: string;
  link?: string;
  image?: string;
  position?: number;
  isActive?: boolean;
  [key: string]: unknown;
}

export type AsyncStatusValue = 'idle' | 'pending' | 'fulfilled' | 'rejected';

interface AsyncStatus {
  status: AsyncStatusValue;
  error: string | null | undefined;
}
export interface BannerState {
  banners: Banner[];
  backendBanner?: Banner;
  bannerHistory: Banner[];
  fetch: AsyncStatus;
  create: AsyncStatus;
  update: AsyncStatus;
  delete: AsyncStatus;
}
