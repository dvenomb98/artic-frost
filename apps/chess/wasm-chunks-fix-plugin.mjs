/**
* This plugin fixes the cunks issue in next.js
* https://github.com/vercel/next.js/issues/29362#issuecomment-971377869
 */
class WasmChunksFixPlugin {
    apply(compiler) {
      compiler.hooks.thisCompilation.tap("WasmChunksFixPlugin", (compilation) => {
        compilation.hooks.processAssets.tap(
          { name: "WasmChunksFixPlugin" },
          (assets) =>
            Object.entries(assets).forEach(([pathname, source]) => {
              if (!pathname.match(/\.wasm$/)) return;
              compilation.deleteAsset(pathname);
  
              const name = pathname.split("/")[1];
              const info = compilation.assetsInfo.get(pathname);
              compilation.emitAsset(name, source, info);
            })
        );
      });
    }
  }

export { WasmChunksFixPlugin };