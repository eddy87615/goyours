// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ViteSitemap from "vite-plugin-sitemap";

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
      outDir: "dist",
      generateRobotsTxt: false, // 不讓插件自動生成 robots.txt
    }),
  ],
  cors: true,
  // 暫時註解掉代理設定
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://open-api.omnichat.ai',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
});
