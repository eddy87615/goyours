import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ViteSitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    ViteSitemap({
      hostname: "https://www.goyours.tw",
      dynamicRoutes: [
        "/",
        "/about-us",
        "/goyours-post",
        "/studying-in-jp",
        "/working-holiday",
        "/Q&A-section",
        "/document-download",
        "/contact-us",
      ],
      // 完全省略 robots 配置
    }),
  ],
  cors: true,
});
