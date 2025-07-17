# Go Yours Vite SSR 使用指南

🎉 **恭喜！你的專案已經成功配置了 Vite SSR**

## 📋 已完成的配置

### ✅ 核心設置
- **Vite SSR 配置** - 支援服務端渲染
- **Express 服務器** - 處理 SSR 請求
- **水合 (Hydration)** - 客戶端接管服務端渲染的內容
- **數據預取** - 在服務端預先獲取路由數據
- **SEO 優化** - 服務端渲染 meta tags

### ✅ 保持的功能
- **現有代碼結構** - 無需大規模重構
- **React Router** - 路由系統保持不變
- **Sanity CMS** - 內容管理系統完全兼容
- **所有組件** - 現有組件正常工作

## 🚀 如何使用

### 開發模式 (SSR)
```bash
npm run dev:ssr
```
- 啟動在 http://localhost:3000
- 支援熱重載
- 服務端渲染所有頁面

### 傳統開發模式 (僅客戶端)
```bash
npm run dev
```
- 啟動在 http://localhost:5173
- 只有客戶端渲染 (原本的方式)

### 生產環境建構
```bash
# 建構 SSR 版本
npm run build:ssr

# 啟動生產 SSR 服務器
npm run serve:ssr
```

## 🎯 SSR 的好處

### 1. **SEO 優化**
- 搜尋引擎可以直接讀取渲染後的 HTML
- Meta tags 在服務端生成
- 更好的社群媒體分享效果

### 2. **更快的首次載入**
- 用戶看到內容更快
- 減少「白屏」時間
- 更好的用戶體驗

### 3. **更好的性能**
- 數據在服務端預取
- 減少客戶端 API 請求
- 更快的互動時間

## 🔍 如何驗證 SSR 工作

### 1. 檢查頁面源碼
```bash
curl http://localhost:3000/ | grep -A5 -B5 "GoYours"
```
- 應該看到完整的 HTML 內容，不是空的 `<div id="root"></div>`

### 2. 禁用 JavaScript
- 在瀏覽器中禁用 JavaScript
- 頁面應該仍然顯示內容 (雖然無法互動)

### 3. 網路面板
- 查看網路面板
- 第一個 HTML 請求應該包含完整內容

## 📊 支援的數據預取

以下路由會自動預取數據：
- `/` - 首頁文章和工作列表
- `/goyours-post` - 所有文章
- `/goyours-post/[slug]` - 特定文章
- `/studying-in-jp-school` - 所有學校
- `/studying-in-jp-school/[slug]` - 特定學校
- `/jp-jobs` - 所有工作
- `/jp-jobs/[slug]` - 特定工作

## 🛠 自定義數據預取

在 `src/lib/data-fetching.js` 中添加新路由：

```javascript
case pathname === '/your-new-route':
  return await client.fetch(`your sanity query`)
```

## 📈 性能監控

### 開發工具
```bash
# 分析建構大小
npm run build:ssr
ls -la dist/

# 檢查 SSR 響應時間
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/
```

### 生產監控
- 使用 lighthouse 測試 SSR 頁面
- 監控 Time to First Byte (TTFB)
- 檢查 Core Web Vitals

## 🚨 常見問題

### 1. 水合錯誤
如果看到 "hydration failed" 錯誤：
- 檢查服務端和客戶端渲染是否一致
- 確保沒有在服務端使用瀏覽器 API

### 2. 數據不一致
如果數據在 SSR 和客戶端不同：
- 檢查 `src/lib/data-fetching.js`
- 確保 Sanity 查詢在兩端一致

### 3. 樣式閃爍
如果有樣式閃爍：
- 確保 CSS 在服務端正確載入
- 檢查 CSS-in-JS 是否需要特殊配置

## 🔄 部署到 Vercel

Vercel 需要特殊配置來支援 SSR：

### 1. 創建 `vercel.json`
```json
{
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### 2. 或者使用 Vercel Functions
考慮重構為 Vercel Functions 以獲得更好的 serverless 體驗。

## 🎊 下一步

你現在擁有了一個功能完整的 SSR 應用！

### 建議的改進：
1. **添加快取** - 實現 Redis 或記憶體快取
2. **圖片優化** - 添加圖片預加載和優化
3. **Error Boundaries** - 添加更好的錯誤處理
4. **Service Worker** - 添加離線支援
5. **監控** - 添加性能和錯誤監控

---

🤝 **需要協助？** 
隨時詢問關於 SSR 的任何問題！