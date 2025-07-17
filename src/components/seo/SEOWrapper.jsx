import { Helmet } from 'react-helmet-async'
import { useSEOData, useCurrentPath } from '../../hooks/useSEOData'

// SEO 包裝器組件 - 用於動態更新頁面 meta tags
const SEOWrapper = ({ children, fallbackTitle, fallbackDescription }) => {
  const { data } = useSEOData()
  const currentPath = useCurrentPath()

  // 根據 SSR 預取的數據生成客戶端 meta tags
  const generateClientMeta = () => {
    const baseUrl = 'https://www.goyours.tw'
    let meta = {
      title: fallbackTitle || 'Go Yours：專業日本留學代辦｜打工度假｜高優國際',
      description: fallbackDescription || '一群熱血的年輕人，用盡一生的愛告訴大家出國打工度假/遊學的小撇步。',
      ogImage: `${baseUrl}/open_graph.png`,
      ogUrl: `${baseUrl}${currentPath}`
    }

    if (data && data.data) {
      const { type, data: routeData } = data
      
      if (type === 'post' && routeData) {
        meta.title = `${routeData.title} | Go Yours 日本留學資訊`
        meta.description = routeData.excerpt || `閱讀更多關於 ${routeData.title} 的日本留學相關資訊`
      } else if (type === 'school' && routeData) {
        meta.title = `${routeData.title} | 日本語言學校推薦 | Go Yours`
        meta.description = routeData.excerpt || `了解 ${routeData.title} 的詳細資訊`
      } else if (type === 'job' && routeData) {
        meta.title = `${routeData.title} - ${routeData.company} | 日本工作機會 | Go Yours`
        meta.description = `${routeData.company} 招聘 ${routeData.title}，地點：${routeData.location}`
      }
    }

    return meta
  }

  const meta = generateClientMeta()

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.ogUrl} />
        <meta property="og:image" content={meta.ogImage} />
        <link rel="canonical" href={meta.ogUrl} />
      </Helmet>
      {children}
    </>
  )
}

export default SEOWrapper