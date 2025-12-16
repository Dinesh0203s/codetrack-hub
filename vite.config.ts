import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Frontend (Vite dev server) port – configurable via env, default 5000
  const FRONTEND_PORT = Number(env.FRONTEND_PORT || env.VITE_PORT || 5000);

  // Backend port – configurable via env, default 3000
  const BACKEND_PORT = Number(env.PORT || env.BACKEND_PORT || 3000);

  return {
    server: {
      host: "0.0.0.0",
      port: FRONTEND_PORT,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: `http://localhost:${BACKEND_PORT}`,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
