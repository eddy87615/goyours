import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 3003

// 靜態檔案服務
app.use(express.static(resolve(__dirname, 'dist')))
app.use('/src', express.static(resolve(__dirname, 'src')))
app.use('/api', express.static(resolve(__dirname, 'api')))

// 簡化的路由 Meta tags 配置
const routeMetaTags = {
  '/': {
    title: 'Go Yours：專業日本留學代辦｜打工度假｜高優國際｜實現你的日本生活夢！',
    description: '一群熱血的年輕人，用盡一生的愛告訴大家出國打工度假/遊學的小撇步。讓Go Yours完成你的打工度假與留學的夢想！',
    keywords: 'goyours,高優國際,高優,Go Yours,日本留學,日本留學代辦'
  },
  '/about-us': {
    title: '關於我們 | Go Yours',
    description: '了解 Go Yours 高優國際的團隊和理念',
    keywords: '關於我們,Go Yours,高優國際,團隊介紹'
  },
  '/goyours-post': {
    title: '日本留學資訊 | Go Yours',
    description: '最新的日本留學相關文章與資訊',
    keywords: '日本留學,留學資訊,日本生活,留學經驗'
  },
  '/studying-in-jp-school': {
    title: '日本語言學校推薦 | Go Yours',
    description: '探索日本頂尖語言學校，Go Yours 為您精選優質日語教育機構',
    keywords: '日本語言學校,日語學習,留學日本,語言學校推薦'
  },
  '/jp-jobs': {
    title: '日本工作機會 | Go Yours',
    description: '尋找在日本的工作機會，包含正職和打工度假職缺',
    keywords: '日本工作,打工度假,日本就業,海外工作'
  }
}

// 處理所有路由 - 純 CSR 模式
app.get('*', async (req, res) => {
  try {
    // 獲取路由的 meta tags
    const meta = routeMetaTags[req.path] || routeMetaTags['/']
    
    // 讀取 HTML 模板
    const template = fs.readFileSync(resolve(__dirname, 'index.html'), 'utf-8')
    
    // 生成 SEO meta tags HTML
    const metaHTML = `
      <title>${meta.title}</title>
      <meta name="description" content="${meta.description}" />
      <meta name="keywords" content="${meta.keywords}" />
      <meta property="og:title" content="${meta.title}" />
      <meta property="og:description" content="${meta.description}" />
      <meta property="og:url" content="https://www.goyours.tw${req.path}" />
      <meta property="og:image" content="https://www.goyours.tw/open_graph.png" />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://www.goyours.tw${req.path}" />
    `
    
    // 生成載入中的 HTML
    const loadingHTML = `
      <div id="root">
        <div class="pure-csr-loading">
          <div class="loading-spinner"></div>
          <p>載入中...</p>
        </div>
      </div>
      <style>
        .pure-csr-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: Arial, sans-serif;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `
    
    // 生成最終 HTML
    let finalHtml = template
      .replace('<!--app-html-->', loadingHTML)
      .replace('<!--app-head-->', metaHTML)
    
    // 注入客戶端渲染標記
    const clientScript = `
      <script>
        window.__USE_CLIENT_RENDER__ = true;
        window.__CURRENT_ROUTE__ = '${req.path}';
        console.log('🚀 Pure CSR Mode Activated');
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
  console.log('⚡ No React SSR - Maximum performance')
})