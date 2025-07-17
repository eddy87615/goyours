import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 3004

// Sanity 客戶端配置
const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_API_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01'
})

const builder = imageUrlBuilder(sanityClient)
const urlFor = (source) => builder.image(source)

// 靜態檔案服務
app.use(express.static(resolve(__dirname, 'dist')))
app.use('/src', express.static(resolve(__dirname, 'src')))
app.use('/api', express.static(resolve(__dirname, 'api')))

// 獲取動態路由數據的函數
async function fetchRouteData(pathname) {
  try {
    // 文章詳情頁
    if (pathname.startsWith('/goyours-post/')) {
      const slug = pathname.split('/').pop()
      const post = await sanityClient.fetch(`
        *[_type == "post" && slug.current == $slug][0] {
          title, excerpt, mainImage, author->{name}, publishedAt, body
        }
      `, { slug })
      return { type: 'post', data: post }
    }
    
    // 學校詳情頁
    if (pathname.startsWith('/studying-in-jp-school/')) {
      const slug = pathname.split('/').pop()
      const school = await sanityClient.fetch(`
        *[_type == "school" && slug.current == $slug][0] {
          title, excerpt, mainImage, location, tuitionFee, body
        }
      `, { slug })
      return { type: 'school', data: school }
    }
    
    // 工作詳情頁
    if (pathname.startsWith('/jp-jobs/')) {
      const slug = pathname.split('/').pop()
      const job = await sanityClient.fetch(`
        *[_type == "job" && slug.current == $slug][0] {
          title, company, location, salary, jobType, description
        }
      `, { slug })
      return { type: 'job', data: job }
    }
    
    // 列表頁 - 獲取前幾筆資料用於 SEO
    if (pathname === '/goyours-post') {
      const posts = await sanityClient.fetch(`
        *[_type == "post"] | order(publishedAt desc)[0...3] {
          title, excerpt
        }
      `)
      return { type: 'posts', data: posts }
    }
    
    if (pathname === '/studying-in-jp-school') {
      const schools = await sanityClient.fetch(`
        *[_type == "school"] | order(schoolRank asc)[0...3] {
          title, location
        }
      `)
      return { type: 'schools', data: schools }
    }
    
    if (pathname === '/jp-jobs') {
      const jobs = await sanityClient.fetch(`
        *[_type == "job"] | order(_createdAt desc)[0...3] {
          title, company, location
        }
      `)
      return { type: 'jobs', data: jobs }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching route data:', error)
    return null
  }
}

// 生成 SEO meta tags
function generateMetaTags(pathname, routeData) {
  const baseUrl = 'https://www.goyours.tw'
  let meta = {
    title: 'Go Yours：專業日本留學代辦｜打工度假｜高優國際｜實現你的日本生活夢！',
    description: '一群熱血的年輕人，用盡一生的愛告訴大家出國打工度假/遊學的小撇步。讓Go Yours完成你的打工度假與留學的夢想！',
    keywords: 'goyours,高優國際,高優,Go Yours,日本留學,日本留學代辦',
    ogImage: `${baseUrl}/open_graph.png`,
    ogUrl: `${baseUrl}${pathname}`
  }
  
  // 根據路由數據生成動態 meta tags
  if (routeData) {
    const { type, data } = routeData
    
    if (type === 'post' && data) {
      meta.title = `${data.title} | Go Yours 日本留學資訊`
      meta.description = data.excerpt || `閱讀更多關於 ${data.title} 的日本留學相關資訊`
      meta.keywords = `${data.title}, 日本留學, 留學資訊, Go Yours`
      if (data.mainImage) {
        meta.ogImage = urlFor(data.mainImage).width(1200).height(630).url()
      }
    } else if (type === 'school' && data) {
      meta.title = `${data.title} | 日本語言學校推薦 | Go Yours`
      meta.description = data.excerpt || `了解 ${data.title} 的詳細資訊，學費、地點等完整介紹`
      meta.keywords = `${data.title}, 日本語言學校, 日語學習, 留學日本`
      if (data.mainImage) {
        meta.ogImage = urlFor(data.mainImage).width(1200).height(630).url()
      }
    } else if (type === 'job' && data) {
      meta.title = `${data.title} - ${data.company} | 日本工作機會 | Go Yours`
      meta.description = `${data.company} 招聘 ${data.title}，地點：${data.location}，薪資：${data.salary}`
      meta.keywords = `${data.title}, ${data.company}, 日本工作, 海外工作`
    } else if (type === 'posts' && data) {
      meta.description = '最新日本留學文章：' + data.map(p => p.title).join('、')
    } else if (type === 'schools' && data) {
      meta.description = '推薦語言學校：' + data.map(s => `${s.title} (${s.location})`).join('、')
    } else if (type === 'jobs' && data) {
      meta.description = '最新工作機會：' + data.map(j => `${j.title} - ${j.company}`).join('、')
    }
  }
  
  // 靜態路由的 meta tags
  const staticMeta = {
    '/about-us': {
      title: '關於我們 | Go Yours',
      description: '了解 Go Yours 高優國際的團隊和理念，我們致力於為每位學生提供最專業的日本留學代辦服務',
      keywords: '關於我們,Go Yours,高優國際,團隊介紹'
    },
    '/studying-in-jp': {
      title: '日本留學完整指南 | Go Yours',
      description: '完整的日本留學資訊，從申請流程到生活準備，一站式解決您的留學需求',
      keywords: '日本留學,留學申請,留學流程,日本生活'
    },
    '/working-in-jp': {
      title: '日本工作資訊 | Go Yours',
      description: '提供在日本工作的完整資訊，包含工作簽證、求職技巧、職場文化等實用內容',
      keywords: '日本工作,工作簽證,日本就業,職場文化'
    },
    '/workingholiday-in-jp': {
      title: '日本打工度假完整指南 | Go Yours',
      description: '日本打工度假的完整資訊，從申請到在日生活的所有細節',
      keywords: '日本打工度假,working holiday,打工度假申請'
    }
  }
  
  if (staticMeta[pathname]) {
    meta = { ...meta, ...staticMeta[pathname], ogUrl: `${baseUrl}${pathname}` }
  }
  
  return meta
}

// 生成結構化數據 (Schema.org)
function generateStructuredData(pathname, routeData) {
  const baseUrl = 'https://www.goyours.tw'
  let structuredData = null
  
  if (routeData) {
    const { type, data } = routeData
    
    if (type === 'post' && data) {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.excerpt,
        image: data.mainImage ? urlFor(data.mainImage).width(1200).height(630).url() : `${baseUrl}/open_graph.png`,
        datePublished: data.publishedAt,
        author: {
          '@type': 'Person',
          name: data.author?.name || 'Go Yours'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Go Yours',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/LOGO-02.png`
          }
        }
      }
    } else if (type === 'school' && data) {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: data.title,
        description: data.excerpt,
        address: {
          '@type': 'PostalAddress',
          addressLocality: data.location
        }
      }
    } else if (type === 'job' && data) {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: data.title,
        description: data.description,
        hiringOrganization: {
          '@type': 'Organization',
          name: data.company
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: data.location
          }
        },
        baseSalary: {
          '@type': 'MonetaryAmount',
          value: data.salary
        }
      }
    }
  }
  
  return structuredData
}

// 處理所有路由
app.get('*', async (req, res) => {
  try {
    // 獲取路由數據
    const routeData = await fetchRouteData(req.path)
    
    // 生成 meta tags
    const meta = generateMetaTags(req.path, routeData)
    
    // 生成結構化數據
    const structuredData = generateStructuredData(req.path, routeData)
    
    // 讀取 HTML 模板
    const template = fs.readFileSync(resolve(__dirname, 'index.html'), 'utf-8')
    
    // 生成完整的 head 內容
    const headContent = `
      <title>${meta.title}</title>
      <meta name="description" content="${meta.description}" />
      <meta name="keywords" content="${meta.keywords}" />
      <meta property="og:title" content="${meta.title}" />
      <meta property="og:description" content="${meta.description}" />
      <meta property="og:url" content="${meta.ogUrl}" />
      <meta property="og:image" content="${meta.ogImage}" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Go Yours" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${meta.title}" />
      <meta name="twitter:description" content="${meta.description}" />
      <meta name="twitter:image" content="${meta.ogImage}" />
      <link rel="canonical" href="${meta.ogUrl}" />
      ${structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>` : ''}
    `
    
    // 生成 SEO 友好的內容骨架
    let seoContent = `<div id="root">`
    
    if (routeData && routeData.data) {
      const { type, data } = routeData
      
      // 為爬蟲生成基本內容結構
      if (type === 'post' && data) {
        seoContent += `
          <article style="display:none;">
            <h1>${data.title}</h1>
            <p>${data.excerpt || ''}</p>
          </article>
        `
      } else if (type === 'school' && data) {
        seoContent += `
          <div style="display:none;">
            <h1>${data.title}</h1>
            <p>${data.excerpt || ''}</p>
            <p>地點：${data.location}</p>
            <p>學費：${data.tuitionFee || '請洽詢'}</p>
          </div>
        `
      } else if (type === 'job' && data) {
        seoContent += `
          <div style="display:none;">
            <h1>${data.title}</h1>
            <p>公司：${data.company}</p>
            <p>地點：${data.location}</p>
            <p>薪資：${data.salary}</p>
          </div>
        `
      }
    }
    
    seoContent += `</div>`
    
    // 生成最終 HTML
    let finalHtml = template
      .replace('<!--app-html-->', seoContent)
      .replace('<!--app-head-->', headContent)
    
    // 注入路由數據供客戶端使用
    const clientScript = `
      <script>
        window.__ROUTE_DATA__ = ${JSON.stringify(routeData || {}).replace(/</g, '\\u003c')};
        window.__CURRENT_PATH__ = '${req.path}';
      </script>
    `
    finalHtml = finalHtml.replace('</head>', `${clientScript}</head>`)

    res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml)
  } catch (error) {
    console.error('SEO SSR Error:', error)
    
    // 錯誤時返回基本 HTML
    const template = fs.readFileSync(resolve(__dirname, 'index.html'), 'utf-8')
    res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
  }
})

app.listen(port, () => {
  console.log(`🚀 SEO SSR server running on http://localhost:${port}`)
  console.log('🔍 Dynamic meta tags and structured data enabled')
  console.log('⚡ Optimized for search engines while keeping client-side rendering')
})