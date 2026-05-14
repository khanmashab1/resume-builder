import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  define: {
    "import.meta.env.VITE_SPA": '"true"',
  },
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
  },
  plugins: [tailwindcss(), tsConfigPaths({ projects: ["./tsconfig.json"] }), react()],
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
});
