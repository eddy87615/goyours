// SEO 和 Meta tags 工具函數

// 動態路由的 Meta tags 配置
export const getDynamicMetaTags = (type, data) => {
  const baseUrl = 'https://www.goyours.tw'
  
  switch (type) {
    case 'post':
      return {
        title: `${data.title} | Go Yours 日本留學資訊`,
        description: data.excerpt || `閱讀更多關於 ${data.title} 的日本留學相關資訊`,
        keywords: `${data.title}, 日本留學, 留學資訊, Go Yours`,
        ogTitle: data.title,
        ogDescription: data.excerpt || `閱讀更多關於 ${data.title} 的日本留學相關資訊`,
        ogUrl: `${baseUrl}/goyours-post/${data.slug?.current}`,
        ogImage: data.mainImage ? `${baseUrl}${data.mainImage}` : `${baseUrl}/open_graph.png`,
        canonical: `${baseUrl}/goyours-post/${data.slug?.current}`
      }
      
    case 'school':
      return {
        title: `${data.title} | 日本語言學校推薦 | Go Yours`,
        description: data.excerpt || `了解 ${data.title} 的詳細資訊，學費、地點等完整介紹`,
        keywords: `${data.title}, 日本語言學校, 日語學習, 留學日本`,
        ogTitle: `${data.title} - 日本語言學校推薦`,
        ogDescription: data.excerpt || `了解 ${data.title} 的詳細資訊`,
        ogUrl: `${baseUrl}/studying-in-jp-school/${data.slug?.current}`,
        ogImage: data.mainImage ? `${baseUrl}${data.mainImage}` : `${baseUrl}/open_graph.png`,
        canonical: `${baseUrl}/studying-in-jp-school/${data.slug?.current}`
      }
      
    case 'job':
      return {
        title: `${data.title} - ${data.company} | 日本工作機會 | Go Yours`,
        description: `${data.company} 招聘 ${data.title}，地點：${data.location}，薪資：${data.salary}`,
        keywords: `${data.title}, ${data.company}, 日本工作, 海外工作, 打工度假`,
        ogTitle: `${data.title} - ${data.company}`,
        ogDescription: `${data.company} 招聘 ${data.title}`,
        ogUrl: `${baseUrl}/jp-jobs/${data.slug?.current}`,
        ogImage: `${baseUrl}/open_graph.png`,
        canonical: `${baseUrl}/jp-jobs/${data.slug?.current}`
      }
      
    default:
      return {
        title: 'Go Yours：專業日本留學代辦｜打工度假｜高優國際｜實現你的日本生活夢！',
        description: '一群熱血的年輕人，用盡一生的愛告訴大家出國打工度假/遊學的小撇步。讓Go Yours完成你的打工度假與留學的夢想！',
        keywords: 'goyours,高優國際,高優,Go Yours,日本留學,日本留學代辦',
        ogTitle: 'Go Yours - 專業日本留學代辦服務',
        ogDescription: '一群熱血的年輕人，用盡一生的愛告訴大家出國打工度假/遊學的小撇步',
        ogUrl: baseUrl,
        ogImage: `${baseUrl}/open_graph.png`,
        canonical: baseUrl
      }
  }
}

// 靜態頁面的 Meta tags 配置
export const getStaticMetaTags = (route) => {
  const baseUrl = 'https://www.goyours.tw'
  
  const metaConfigs = {
    '/': {
      title: 'Go Yours：專業日本留學代辦｜打工度假｜高優國際｜實現你的日本生活夢！',
      description: '一群熱血的年輕人，用盡一生的愛告訴大家出國打工度假/遊學的小撇步。讓Go Yours完成你的打工度假與留學的夢想！',
      keywords: 'goyours,高優國際,高優,Go Yours,日本留學,日本留學代辦'
    },
    '/about-us': {
      title: '關於我們 | Go Yours',
      description: '了解 Go Yours 高優國際的團隊和理念，我們致力於為每位學生提供最專業的日本留學代辦服務',
      keywords: '關於我們,Go Yours,高優國際,團隊介紹,日本留學代辦'
    },
    '/goyours-post': {
      title: '日本留學資訊 | Go Yours',
      description: '最新的日本留學相關文章與資訊，包含學校介紹、生活經驗分享、申請流程等實用內容',
      keywords: '日本留學,留學資訊,日本生活,留學經驗,語言學校'
    },
    '/studying-in-jp-school': {
      title: '日本語言學校推薦 | Go Yours',
      description: '探索日本頂尖語言學校，Go Yours 為您精選優質日語教育機構，提供完整的學校資訊和申請協助',
      keywords: '日本語言學校,日語學習,留學日本,語言學校推薦,日語教育'
    },
    '/jp-jobs': {
      title: '日本工作機會 | Go Yours',
      description: '尋找在日本的工作機會，包含正職和打工度假職缺，讓您的日本夢想成真',
      keywords: '日本工作,打工度假,日本就業,海外工作,工作簽證'
    },
    '/studying-in-jp': {
      title: '日本留學完整指南 | Go Yours',
      description: '完整的日本留學資訊，從申請流程到生活準備，一站式解決您的留學需求',
      keywords: '日本留學,留學申請,留學流程,日本生活,留學準備'
    },
    '/working-in-jp': {
      title: '日本工作資訊 | Go Yours',
      description: '提供在日本工作的完整資訊，包含工作簽證、求職技巧、職場文化等實用內容',
      keywords: '日本工作,工作簽證,日本就業,職場文化,求職'
    },
    '/workingholiday-in-jp': {
      title: '日本打工度假完整指南 | Go Yours',
      description: '日本打工度假的完整資訊，從申請到在日生活的所有細節，讓您的打工度假之旅更順利',
      keywords: '日本打工度假,working holiday,打工度假申請,日本生活'
    }
  }
  
  const config = metaConfigs[route] || metaConfigs['/']
  
  return {
    ...config,
    ogTitle: config.title,
    ogDescription: config.description,
    ogUrl: `${baseUrl}${route}`,
    ogImage: `${baseUrl}/open_graph.png`,
    canonical: `${baseUrl}${route}`
  }
}