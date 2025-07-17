import { prefetchRouteData } from './lib/data-fetching'
import { getDynamicMetaTags, getStaticMetaTags } from './utils/seoUtils'

// SEO Shell 渲染 - 只生成 meta tags，不渲染 React 組件
const generateSEOShell = (seoMeta) => {
  return `
    <div id="root">
      <div class="seo-loading">
        <div class="loading-spinner"></div>
        <p>載入中...</p>
      </div>
    </div>
    <style>
      .seo-loading {
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
}

export async function render(url, context = {}) {
  // ✅ 預取數據並生成 SEO meta tags
  let preloadedData = null
  let seoMeta = getStaticMetaTags(url)
  
  try {
    preloadedData = await prefetchRouteData(url)
    
    // 根據數據類型生成動態 meta tags
    if (preloadedData) {
      if (url.startsWith('/goyours-post/')) {
        seoMeta = getDynamicMetaTags('post', preloadedData)
      } else if (url.startsWith('/studying-in-jp-school/')) {
        seoMeta = getDynamicMetaTags('school', preloadedData)
      } else if (url.startsWith('/jp-jobs/')) {
        seoMeta = getDynamicMetaTags('job', preloadedData)
      }
    }
  } catch (error) {
    console.warn('Data prefetching failed:', error)
  }
  
  // 生成 SEO Shell（載入畫面 + meta tags）
  const html = generateSEOShell(seoMeta)
  
  // 生成完整的 meta tags HTML
  const metaHTML = `
    <title>${seoMeta.title}</title>
    <meta name="description" content="${seoMeta.description}" />
    <meta name="keywords" content="${seoMeta.keywords}" />
    <meta property="og:title" content="${seoMeta.ogTitle}" />
    <meta property="og:description" content="${seoMeta.ogDescription}" />
    <meta property="og:url" content="${seoMeta.ogUrl}" />
    <meta property="og:image" content="${seoMeta.ogImage}" />
    <meta property="og:type" content="website" />
    <link rel="canonical" href="${seoMeta.canonical}" />
  `
  
  return { 
    html, 
    helmet: {
      htmlAttributes: '',
      title: '',
      meta: metaHTML,
      link: '',
      script: '',
      style: ''
    },
    preloadedData
  }
}