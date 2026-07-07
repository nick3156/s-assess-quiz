import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // 絶対パス必須。相対 ("./") だと、iOSホーム画面が旧start_urlから開いた時に
  // アセット解決が /旧パス/assets/... になり404 → 真っ白になる
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Sアセス一次試験",
        short_name: "Sアセス",
        description: "Sアセス一次試験の問題演習と教科書確認",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f5f5f7",
        theme_color: "#f5f5f7",
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // 教科書チャンク含め全部プリキャッシュしてオフラインで開けるようにする
        globPatterns: ["**/*.{js,css,html,svg,png,webmanifest}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: "/index.html",
        // 同期APIはSWを通さず常にネットワークへ
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
});
