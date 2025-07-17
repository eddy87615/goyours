# SEO 專用 SSR 實現指南

## 概覽

這個實現專門針對 SEO 優化，在保持客戶端渲染優勢的同時，確保搜索引擎能夠獲取完整的 meta tags 和結構化數據。

## 架構特點

### ✅ SEO 友好功能
- **動態 meta tags** - 從 Sanity CMS 獲取真實數據生成
- **結構化數據 (Schema.org)** - 支援 Article、JobPosting、EducationalOrganization
- **Open Graph 和 Twitter Cards** - 完整的社交媒體分享支援
- **爬蟲友好內容** - 為搜索引擎提供基本內容結構

### ⚡ 性能優勢
- **客戶端渲染** - 保持 React 應用的互動性
- **數據預取** - 服務端獲取的數據傳遞給客戶端使用
- **無水合問題** - 避免 SSR 的複雜性

## 使用方式

### 1. 開發模式
```bash
npm run dev:seo-ssr
```
訪問 http://localhost:3004

### 2. 生產模式
```bash
npm run serve:seo-ssr
```

## 支援的路由

### 動態路由（從 Sanity 獲取數據）
- `/goyours-post/:slug` - 文章詳情頁
- `/studying-in-jp-school/:slug` - 學校詳情頁
- `/jp-jobs/:slug` - 工作詳情頁

### 列表頁（包含前幾筆資料）
- `/goyours-post` - 文章列表
- `/studying-in-jp-school` - 學校列表
- `/jp-jobs` - 工作列表

### 靜態頁面
- `/` - 首頁
- `/about-us` - 關於我們
- `/studying-in-jp` - 留學指南
- `/working-in-jp` - 工作資訊
- `/workingholiday-in-jp` - 打工度假

## 技術實現

### 服務端 (seo-ssr-server.js)
```javascript
// 從 Sanity 獲取數據
const routeData = await fetchRouteData(req.path)

// 生成 meta tags
const meta = generateMetaTags(req.path, routeData)

// 生成結構化數據
const structuredData = generateStructuredData(req.path, routeData)
```

### 客戶端整合
```jsx
import { useSEOData } from '../hooks/useSEOData'
import SEOWrapper from '../components/seo/SEOWrapper'

function MyPage() {
  const { data, loading } = useSEOData()
  
  return (
    <SEOWrapper fallbackTitle="我的頁面">
      {/* 頁面內容 */}
    </SEOWrapper>
  )
}
```

## SEO 優化範例

### 文章頁面 meta tags
```html
<title>如何申請日本留學簽證 | Go Yours 日本留學資訊</title>
<meta name="description" content="詳細介紹日本留學簽證的申請流程、所需文件和注意事項" />
<meta property="og:title" content="如何申請日本留學簽證" />
<meta property="og:image" content="https://cdn.sanity.io/images/..." />
```

### 結構化數據
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "如何申請日本留學簽證",
  "description": "詳細介紹日本留學簽證的申請流程",
  "image": "https://cdn.sanity.io/images/...",
  "author": {
    "@type": "Person",
    "name": "Go Yours"
  }
}
```

## Hook 使用指南

### useSEOData - 通用 SEO 數據
```jsx
const { data, loading, error } = useSEOData()
```

### usePostSEO - 文章專用
```jsx
const { data } = usePostSEO(slug)
```

### useCurrentPath - 當前路徑
```jsx
const currentPath = useCurrentPath()
```

## 環境變數

確保設置以下環境變數：
```env
VITE_SANITY_API_SANITY_PROJECT_ID=your_project_id
```

## 測試 SEO 效果

### 1. 檢查 meta tags
在瀏覽器開發者工具中查看 `<head>` 部分

### 2. 測試社交分享
使用 Facebook Sharing Debugger 或 Twitter Card Validator

### 3. 結構化數據測試
使用 Google Rich Results Test

### 4. 爬蟲測試
```bash
curl -A "Googlebot" http://localhost:3004/goyours-post/your-slug
```

## 部署注意事項

1. 確保 Sanity 專案 ID 正確設置
2. 圖片 URL 使用完整的 HTTPS 路徑
3. 設置正確的 CORS 政策
4. 監控服務端數據獲取的性能

## 優勢總結

- 🔍 **SEO 優化**：完整的 meta tags 和結構化數據
- ⚡ **性能良好**：客戶端渲染 + 數據預取
- 🚫 **無水合問題**：避免 SSR 複雜性
- 📱 **社交友好**：支援 Open Graph 和 Twitter Cards
- 🤖 **爬蟲友好**：為搜索引擎提供結構化內容