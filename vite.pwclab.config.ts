import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Standalone build for the PWC Lab app (pwclab.html → /pwclab/).
// Relative base so the bundle works from the /pwclab/ subdirectory of the
// static deploy; product images are copied in by scripts/build-pwclab.mjs.
export default defineConfig({
  plugins: [react()],
  base: "./",
  publicDir: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8081,
    open: "/pwclab.html",
  },
  build: {
    outDir: "pwclab",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "pwclab.html"),
    },
  },
});
