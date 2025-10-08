import CopyPlugin from "copy-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@artic-frost/ui", "@artic-frost/form"],
  /**
   * @param {import('webpack').Configuration} config
   * @param {import('next/dist/server/config-shared').WebpackConfigContext} context
   * @returns {import('webpack').Configuration}
   */
  webpack: (config, {isServer, dev}) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    if (!dev && isServer) {
      const patterns = [];

      const destinations = [
        "../static/wasm/[name][ext]", // -> .next/static/wasm
        "./static/wasm/[name][ext]", // -> .next/server/static/wasm
        ".", // -> .next/server/chunks (for some reason this is necessary)
      ];
      for (const dest of destinations) {
        patterns.push({
          context: ".next/server/chunks",
          from: ".",
          to: dest,
          filter: resourcePath => resourcePath.endsWith(".wasm"),
          noErrorOnMissing: true,
        });
      }

      config.plugins.push(new CopyPlugin({patterns}));
    }

    return config;
  },
};

export default nextConfig;
