import express from 'express'
import { createServer as createViteServer } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve, join } from 'path'
import fs from 'fs'
import compression from 'compression'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000

async function createServer() {
  const app = express()
  
  // 啟用 gzip 壓縮
  app.use(compression())

  let vite
  if (!isProduction) {
    // 開發模式
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })
    app.use(vite.ssrLoadModule)
  } else {
    // 生產模式
    app.use(express.static(resolve(__dirname, 'dist/client')))
  }

  // 服務 API 路由
  app.use('/api', express.static(resolve(__dirname, 'api')))

  // SSR 處理
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      let template
      let render
      
      if (!isProduction) {
        // 開發模式 - 從 index.html 讀取模板
        template = fs.readFileSync(resolve(__dirname, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        
        // 載入服務端模組
        render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
      } else {
        // 生產模式
        template = fs.readFileSync(resolve(__dirname, 'dist/client/index.html'), 'utf-8')
        render = (await import('./dist/server/entry-server.js')).render
      }

      // 預取路由數據
      let preloadedData = null
      let injectPreloadedData = null
      try {
        const dataFetching = await import('./src/lib/data-fetching.js')
        preloadedData = await dataFetching.prefetchRouteData(url)
        injectPreloadedData = dataFetching.injectPreloadedData
      } catch (error) {
        console.warn('Data prefetching failed:', error)
      }

      // 渲染應用
      const { html, helmet } = render(url, {})
      
      // 插入渲染結果到模板
      let finalHtml = template
        .replace('<!--app-html-->', html)
        .replace('<!--app-head-->', 
          helmet.title + 
          helmet.meta + 
          helmet.link + 
          helmet.style
        )
      
      // 注入預取數據
      if (preloadedData && injectPreloadedData) {
        finalHtml = injectPreloadedData(finalHtml, preloadedData)
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml)
    } catch (e) {
      if (!isProduction) {
        vite?.ssrFixStacktrace(e)
      }
      console.error('SSR Error:', e)
      res.status(500).end('Internal Server Error')
    }
  })

  return { app, vite }
}

createServer().then(({ app }) => {
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`)
  })
})