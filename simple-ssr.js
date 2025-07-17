import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

// 簡單的 SSR - 只處理基本的 SEO meta tags
const routes = {
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
  },
  '/contact-us': {
    title: '聯絡我們 | Go Yours',
    description: '有任何問題嗎？歡迎聯絡 Go Yours 團隊',
    keywords: '聯絡我們,諮詢,Go Yours,客服'
  }
}

// 靜態檔案
app.use(express.static(resolve(__dirname, 'dist')))
app.use('/src', express.static(resolve(__dirname, 'src')))
app.use('/api', express.static(resolve(__dirname, 'api')))

app.get('*', (req, res) => {
  try {
    const route = routes[req.path] || routes['/']
    
    const html = `
<!DOCTYPE html>
<html lang="zh-tw" prefix="og: http://ogp.me/ns#">
  <head>
    <meta charset="UTF-8" />
    <title>${route.title}</title>
    <link rel="icon" type="image" href="/LOGO-02.png" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="keywords" content="${route.keywords}" />
    <meta name="description" content="${route.description}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="https://www.goyours.tw/open_graph.png" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.goyours.tw${req.path}" />
    <meta name="robots" content="all" />
    <link rel="canonical" href="https://www.goyours.tw${req.path}" />
  </head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-2EVGMF6FD8"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-2EVGMF6FD8');
  </script>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (error) {
    console.error('Simple SSR Error:', error)
    res.status(500).end('Internal Server Error')
  }
})

const port = process.env.PORT || 3002
app.listen(port, () => {
  console.log(`🚀 Simple SSR server running on http://localhost:${port}`)
})