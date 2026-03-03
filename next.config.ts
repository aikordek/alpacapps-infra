import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // basePath matches the GitHub repo name for GitHub Pages deployment
  basePath: "/alpacapps-infra",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
