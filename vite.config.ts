import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  envDir: "../",
  publicDir: "../public",
  build: {
    outDir: "../dist",
  },
  server: {
    port: 9000,
  },
});
