import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
// import { render } from './src/entry-server.jsx'  // 暫時註解掉

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 3003

// 靜態檔案服務
app.use(express.static(resolve(__dirname, 'dist')))
app.use('/src', express.static(resolve(__dirname, 'src')))
app.use('/api', express.static(resolve(__dirname, 'api')))

// 處理所有路由 - 純 CSR 模式
app.get('*', async (req, res) => {
  try {
    // 獲取 SEO Shell 和預取數據
    const { html, helmet, preloadedData } = await render(req.path, {})
    
    // 讀取 HTML 模板
    const template = fs.readFileSync(resolve(__dirname, 'index.html'), 'utf-8')
    
    // 生成最終 HTML
    let finalHtml = template
      .replace('<!--app-html-->', html)
      .replace('<!--app-head-->', helmet.meta)
    
    // 注入預取數據和客戶端渲染標記
    const clientScript = `
      <script>
        window.__PRELOADED_DATA__ = ${JSON.stringify(preloadedData || {}).replace(/</g, '\\u003c')};
        window.__USE_CLIENT_RENDER__ = true;
      </script>
    `
    finalHtml = finalHtml.replace('</head>', `${clientScript}</head>`)
    
    // 替換 main.jsx 為 entry-client.jsx（純客戶端渲染）
    finalHtml = finalHtml.replace('/src/main.jsx', '/src/entry-client.jsx')

    res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml)
  } catch (error) {
    console.error('Pure CSR Error:', error)
    
    // 錯誤時返回基本 HTML
    const template = fs.readFileSync(resolve(__dirname, 'index.html'), 'utf-8')
    const basicHtml = template
      .replace('<!--app-html-->', '<div id="root"><div class="error-loading">載入中...</div></div>')
      .replace('<!--app-head-->', '')
      .replace('/src/main.jsx', '/src/entry-client.jsx')
    
    res.status(200).set({ 'Content-Type': 'text/html' }).end(basicHtml)
  }
})

app.listen(port, () => {
  console.log(`🚀 Pure CSR server running on http://localhost:${port}`)
  console.log('✅ Hydration disabled - Using pure client-side rendering')
  console.log('🔍 SEO optimized with server-generated meta tags')
})