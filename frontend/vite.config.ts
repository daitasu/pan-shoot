import { defineConfig } from "vite";
import { resolve } from "path";
import updateIndexHtml from "./src/scripts/buildPlugin";

const root = "src";

export default defineConfig({
  root,
  envDir: "../",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
      },
    },
  },
  plugins: [updateIndexHtml()],
  server: {
    port: 9000,
  },
});
