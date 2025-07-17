import { useState, useEffect } from 'react'

// 純客戶端數據獲取 Hook
export const useClientData = (fetchFn, deps = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 檢查是否有預取數據
    const preloadedData = typeof window !== 'undefined' ? window.__PRELOADED_DATA__ : null
    
    if (preloadedData) {
      setData(preloadedData)
      setLoading(false)
      // 清理預取數據
      if (typeof window !== 'undefined') {
        delete window.__PRELOADED_DATA__
      }
      return
    }

    // 客戶端獲取數據
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchFn()
        setData(result)
      } catch (err) {
        setError(err)
        console.error('Client data fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, deps)

  return { data, loading, error }
}

// 檢查是否為純客戶端渲染模式
export const useIsClientRender = () => {
  const [isClientRender, setIsClientRender] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClientRender(!!window.__USE_CLIENT_RENDER__)
    }
  }, [])

  return isClientRender
}