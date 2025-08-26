/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@artic-frost/ui", "@artic-frost/chess-lite"],
  serverExternalPackages: ["wasm-chess"]
};

export default nextConfig;
