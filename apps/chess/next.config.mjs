/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@artic-frost/ui", "@artic-frost/chess-lite"],
  serverExternalPackages: ["wasm-chess"],
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
