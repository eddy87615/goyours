# Vite SSR 實現計劃

## 1. 設置 Vite SSR

### 安裝依賴
```bash
npm install @vitejs/plugin-react express sirv
```

### Vite 配置調整
```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        ssr: './src/entry-server.jsx'
      }
    }
  },
  ssr: {
    noExternal: ['@sanity/client', '@portabletext/react']
  }
})
```

### 服務端入口
```jsx
// src/entry-server.jsx
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './app/App'

export function render(url, context) {
  const helmetContext = {}
  
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  )
  
  const { helmet } = helmetContext
  
  return { html, helmet }
}
```

### Express 服務器
```js
// server.js
import express from 'express'
import { createServer as createViteServer } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  app.use(vite.ssrLoadModule)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      
      // 載入 HTML 模板
      let template = await vite.transformIndexHtml(url, `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!--ssr-head-->
          </head>
          <body>
            <div id="root"><!--ssr-html--></div>
            <script type="module" src="/src/main.jsx"></script>
          </body>
        </html>
      `)

      // 載入服務端入口
      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
      const { html, helmet } = render(url)

      // 插入渲染結果
      const finalHtml = template
        .replace('<!--ssr-html-->', html)
        .replace('<!--ssr-head-->', 
          helmet.title.toString() + 
          helmet.meta.toString() + 
          helmet.link.toString()
        )

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  return { app, vite }
}

createServer().then(({ app }) => 
  app.listen(3000, () => console.log('Server running on http://localhost:3000'))
)
```

## 2. 調整現有代碼

### 客戶端水合
```jsx
// src/entry-client.jsx
import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './app/App'

hydrateRoot(
  document.getElementById('root'),
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
)
```

### 數據預取
```jsx
// src/lib/data-fetching.js
import { client } from '../services/sanity/client'

export const prefetchRouteData = async (pathname) => {
  switch (pathname) {
    case '/goyours-post':
      return await client.fetch(`*[_type == "post"] | order(publishedAt desc)`)
    
    case '/studying-in-jp-school':
      return await client.fetch(`*[_type == "school"] | order(schoolRank asc)`)
    
    default:
      return null
  }
}
```

## 3. 優點
- 保持現有代碼結構
- 繼續使用 React Router  
- 較小的學習曲線
- 靈活的 SSR 控制

## 4. 缺點
- 需要自行管理服務器
- 較複雜的部署配置
- 沒有 Next.js 的內建優化
- 需要手動處理數據預取