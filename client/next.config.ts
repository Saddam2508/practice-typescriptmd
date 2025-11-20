import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "upload.wikimedia.org"], // তোমার ইমেজের ডোমেইন এখানে দাও
  },
};

export default nextConfig;
