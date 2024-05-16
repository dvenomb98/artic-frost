import { defineConfig } from "tsup";


export default defineConfig({
  clean: true,
  plugins: [],
  dts: false,
  entry: ["src/index.ts"],
  format: ["esm"],
  sourcemap: true,
  minify: true,
  target: "esnext",
  outDir: "dist",
  // causing error Dynamic require of "fs" is not supported
  external: ["gray-matter"]
});
