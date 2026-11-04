import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves static files only: `next build` writes the site to out/.
  output: "export",
  // A project site lives under /<repo>. The Pages workflow passes that path in;
  // locally it is unset, so `pnpm dev` stays at the root.
  basePath: process.env.PAGES_BASE_PATH || undefined,
};

export default nextConfig;
