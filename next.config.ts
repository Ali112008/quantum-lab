import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // NOTE: bumping this comment forces `next dev` to perform a full server
  // restart (fresh module cache) — used once to pick up a regenerated
  // Prisma client after `bun run db:push` added the Subscriber model.
};

export default nextConfig;
