# Pure Client-Side Rendering (純客戶端渲染) 實現說明

## 概覽

此實現完全禁用了 React 的服務端渲染和水合功能，改為使用純客戶端渲染，同時保留了 SEO 所需的 meta tags。

## 核心特點

1. **無水合問題**：完全避免了 SSR 水合錯誤
2. **SEO 優化**：服務端生成完整的 meta tags
3. **更好的性能**：減少了服務端渲染的負擔
4. **簡單維護**：不需要處理 SSR/CSR 的同步問題

## 實現架構

### 1. 服務端 (pure-csr-server-simple.js)
- 只負責生成 HTML shell 和 meta tags
- 不執行任何 React 渲染
- 返回載入中的畫面給搜尋引擎爬蟲

### 2. 客戶端 (entry-client.jsx)
- 使用 `createRoot` 而非 `hydrateRoot`
- 完全在客戶端渲染所有內容
- 清空服務端的載入畫面後再渲染

### 3. 組件策略
- **CSR 組件**：使用 LazyWrapper 進行懶載入
- **客戶端專用**：使用 ClientOnly 包裝器
- **數據獲取**：使用 useClientData Hook

## 使用方式

### 開發模式
```bash
npm run dev:pure-csr
```

### 生產模式
```bash
npm run serve:pure-csr
```

## 檔案結構

```
src/
├── entry-client.jsx          # 客戶端入口（純 CSR）
├── entry-server.jsx          # 服務端 SEO Shell 生成
├── components/
│   └── common/
│       ├── LazyWrapper/      # 懶載入包裝器
│       └── ClientOnly/       # 客戶端專用組件包裝器
└── hooks/
    ├── useClientData.js      # 客戶端數據獲取
    └── useHydration.js       # 水合檢測（可選）
```

## SEO 處理

每個路由都有對應的 meta tags 配置：

```javascript
const routeMetaTags = {
  '/': {
    title: 'Go Yours：專業日本留學代辦...',
    description: '一群熱血的年輕人...',
    keywords: 'goyours,高優國際...'
  },
  // ... 其他路由
}
```

## 優勢

1. **無水合錯誤**：完全避免了 React hydration mismatch
2. **簡單部署**：不需要複雜的 SSR 設定
3. **更快的開發**：不需要考慮服務端/客戶端差異
4. **靈活性高**：可以使用任何客戶端專用的庫

## 注意事項

1. 首次載入會顯示載入畫面
2. SEO 內容只包含 meta tags，不包含實際內容
3. 需要確保客戶端 JavaScript 正常執行

## 遷移指南

從 SSR 遷移到純 CSR：

1. 將 `hydrateRoot` 改為 `createRoot`
2. 移除服務端渲染邏輯
3. 確保所有組件都能在客戶端運行
4. 測試 SEO meta tags 是否正確生成