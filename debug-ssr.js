import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })
  
  app.use(vite.ssrLoadModule)

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl
    console.log('📍 Request URL:', url)

    try {
      // 載入 HTML 模板
      let template = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Go Yours Debug</title>
          </head>
          <body>
            <div id="root"><!--app-html--></div>
            <script type="module" src="/src/main.jsx"></script>
          </body>
        </html>
      `
      
      template = await vite.transformIndexHtml(url, template)
      console.log('✅ Template transformed')

      // 載入服務端模組
      console.log('🔄 Loading SSR module...')
      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
      console.log('✅ SSR module loaded')

      // 渲染應用
      console.log('🎨 Rendering app...')
      const { html, helmet } = render(url, {})
      console.log('✅ App rendered, HTML length:', html.length)
      console.log('📝 HTML preview:', html.substring(0, 200) + '...')

      // 插入渲染結果
      const finalHtml = template
        .replace('<!--app-html-->', html)
        .replace('<title>Go Yours Debug</title>', helmet.title || '<title>Go Yours Debug</title>')

      console.log('✅ Final HTML length:', finalHtml.length)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml)
      
    } catch (e) {
      console.error('❌ SSR Error:', e)
      vite.ssrFixStacktrace(e)
      res.status(500).end(`Error: ${e.message}`)
    }
  })

  return { app }
}

createServer().then(({ app }) => {
  app.listen(3001, () => {
    console.log('🐛 Debug server running on http://localhost:3001')
  })
})