
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/chess-lite"],
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;

