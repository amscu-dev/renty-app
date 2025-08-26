import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rentease-property-images.s3.eu-north-1.amazonaws.com",
        pathname: "/**", // sau '/properties/**' dacă vrei mai strict
      },
    ],
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1536],
  },
};

export default nextConfig;
