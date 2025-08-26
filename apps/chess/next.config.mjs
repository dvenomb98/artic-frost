/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@artic-frost/ui", "@artic-frost/chess-lite"],
  /**
   * @param {import('webpack').Configuration} config
   * @param {import('next/dist/server/config-shared').WebpackConfigContext} context
   * @returns {import('webpack').Configuration}
   */
  webpack: config => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true
    };
    return config;
  },
};

export default nextConfig;
