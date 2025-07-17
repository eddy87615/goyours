import { useState, useEffect } from 'react'

// 使用 SEO SSR 預取數據的 Hook
export const useSEOData = (fallbackFetch = null) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 檢查是否有服務端預取的路由數據
    if (typeof window !== 'undefined' && window.__ROUTE_DATA__) {
      const routeData = window.__ROUTE_DATA__
      setData(routeData)
      setLoading(false)
      
      // 清理預取數據
      delete window.__ROUTE_DATA__
      return
    }

    // 如果沒有預取數據且提供了 fallback，則客戶端獲取
    if (fallbackFetch) {
      const fetchData = async () => {
        try {
          setLoading(true)
          setError(null)
          const result = await fallbackFetch()
          setData(result)
        } catch (err) {
          setError(err)
          console.error('SEO data fetch error:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    } else {
      setLoading(false)
    }
  }, [])

  return { data, loading, error }
}

// 專門用於文章詳情頁的 Hook
export const usePostSEO = (slug) => {
  return useSEOData(async () => {
    if (!slug) return null
    // 這裡可以添加客戶端的 Sanity 查詢作為 fallback
    return null
  })
}

// 專門用於學校詳情頁的 Hook
export const useSchoolSEO = (slug) => {
  return useSEOData(async () => {
    if (!slug) return null
    return null
  })
}

// 專門用於工作詳情頁的 Hook
export const useJobSEO = (slug) => {
  return useSEOData(async () => {
    if (!slug) return null
    return null
  })
}

// 獲取當前路由路徑的 Hook
export const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState('/')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 優先使用服務端設置的路徑
      if (window.__CURRENT_PATH__) {
        setCurrentPath(window.__CURRENT_PATH__)
        delete window.__CURRENT_PATH__
      } else {
        // fallback 到當前 location
        setCurrentPath(window.location.pathname)
      }
    }
  }, [])

  return currentPath
}