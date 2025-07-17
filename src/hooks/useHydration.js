import { useState, useEffect } from 'react'
import { getPreloadedData } from '../lib/data-fetching'

// 水合優化 Hook
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false)
  const [preloadedData, setPreloadedData] = useState(null)

  useEffect(() => {
    // 獲取服務端預取的數據
    const data = getPreloadedData()
    if (data) {
      setPreloadedData(data)
    }
    
    // 標記水合完成
    setIsHydrated(true)
    
    // 清理 CSR 路由標記
    if (typeof window !== 'undefined' && window.__IS_CSR_ROUTE__) {
      delete window.__IS_CSR_ROUTE__
    }
  }, [])

  return { isHydrated, preloadedData }
}

// 專用於檢查是否為 CSR 路由的 Hook
export const useCSRRoute = () => {
  const [isCSRRoute, setIsCSRRoute] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsCSRRoute(!!window.__IS_CSR_ROUTE__)
    }
  }, [])

  return isCSRRoute
}

// 智能數據獲取 Hook - 優先使用預取數據，否則客戶端獲取
export const useSmartData = (fetchFn, deps = []) => {
  const { preloadedData } = useHydration()
  const [data, setData] = useState(preloadedData)
  const [loading, setLoading] = useState(!preloadedData)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (preloadedData) {
      setData(preloadedData)
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchFn()
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, deps)

  return { data, loading, error }
}