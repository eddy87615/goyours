import { client } from '../services/sanity/client'

// 路由對應的數據預取函數
export const prefetchRouteData = async (pathname) => {
  try {
    switch (true) {
      case pathname === '/' || pathname === '/home':
        return await Promise.all([
          client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...6] {
            _id, title, slug, publishedAt, excerpt, mainImage
          }`),
          client.fetch(`*[_type == "job"] | order(_createdAt desc)[0...6] {
            _id, title, company, location, salary, jobType
          }`)
        ])

      case pathname === '/goyours-post':
        return await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
          _id, title, slug, publishedAt, excerpt, mainImage, author->{name, image}
        }`)

      case pathname.startsWith('/goyours-post/'):
        const postSlug = pathname.split('/').pop()
        return await client.fetch(`
          *[_type == "post" && slug.current == $slug][0] {
            _id, title, slug, body, mainImage, publishedAt, excerpt, author->{name, image}
          }
        `, { slug: postSlug })

      case pathname === '/studying-in-jp-school':
        return await client.fetch(`*[_type == "school"] | order(schoolRank asc) {
          _id, title, slug, excerpt, mainImage, location, tuitionFee, schoolRank
        }`)

      case pathname.startsWith('/studying-in-jp-school/'):
        const schoolSlug = pathname.split('/').pop()
        return await client.fetch(`
          *[_type == "school" && slug.current == $slug][0] {
            _id, title, slug, body, mainImage, location, tuitionFee, schoolRank
          }
        `, { slug: schoolSlug })

      case pathname === '/jp-jobs':
        return await client.fetch(`*[_type == "job"] | order(_createdAt desc) {
          _id, title, company, location, salary, jobType, tags
        }`)

      case pathname.startsWith('/jp-jobs/'):
        const jobSlug = pathname.split('/').pop()
        return await client.fetch(`
          *[_type == "job" && slug.current == $slug][0] {
            _id, title, company, location, salary, jobType, description, requirements
          }
        `, { slug: jobSlug })

      default:
        return null
    }
  } catch (error) {
    console.error('Data fetching error:', error)
    return null
  }
}

// 用於注入預取數據到 HTML
export const injectPreloadedData = (html, data) => {
  if (!data) return html
  
  const script = `<script>window.__PRELOADED_DATA__ = ${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
  return html.replace('</head>', `${script}</head>`)
}

// 客戶端獲取預取數據
export const getPreloadedData = () => {
  if (typeof window !== 'undefined' && window.__PRELOADED_DATA__) {
    const data = window.__PRELOADED_DATA__
    delete window.__PRELOADED_DATA__ // 清理
    return data
  }
  return null
}