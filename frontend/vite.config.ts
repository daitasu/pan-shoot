import { defineConfig } from "vite";
import { resolve } from "path";

const root = "src";

export default defineConfig({
  root,
  envDir: "../",
  publicDir: "../public",
  build: {
    outDir: "../../dist",
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        // authorize: resolve(root, "authorize/index.html"),
      },
    },
  },
  server: {
    port: 9000,
  },
});
