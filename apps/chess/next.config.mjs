import { WasmChunksFixPlugin } from "./wasm-chunks-fix-plugin.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@artic-frost/ui", "@artic-frost/form"],
  /**
   * @param {import('webpack').Configuration} config
   * @param {import('next/dist/server/config-shared').WebpackConfigContext} context
   * @returns {import('webpack').Configuration}
   */
  webpack(config, { isServer, dev }) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    if (!dev && isServer) {
      config.output.webassemblyModuleFilename = "chunks/[id].wasm";
      config.plugins.push(new WasmChunksFixPlugin());
    }


    return config;
  },
};

export default nextConfig;
