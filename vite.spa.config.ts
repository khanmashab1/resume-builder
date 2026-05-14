import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  const define = {
    "import.meta.env.VITE_SPA": '"true"',
  };
  for (const [key, value] of Object.entries(env)) {
    define[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define,
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
  };
});
