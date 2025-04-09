import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ViteSitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    ViteSitemap({
      robotsTxt: false,
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
    }),
  ],
  cors: true,
});
