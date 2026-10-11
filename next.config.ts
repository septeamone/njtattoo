import type { NextConfig } from "next";

// A project page on GitHub Pages lives under /<repo>/; the build is told so with BASE_PATH (empty on a domain root).
const base = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath: base,
  env: { NEXT_PUBLIC_BASE: base },
  // Static site: hosted abroad as plain files (see site hosting plan).
  output: "export",
  // Every route becomes folder/index.html so any static host serves it.
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
  // own 404 page for any address that matches no route (see src/app/global-not-found.tsx)
  experimental: { globalNotFound: true },
};

export default nextConfig;
