import { useState, useEffect } from 'react';
import { client } from '../cms/sanityClient';

export default function useGetKeyWords() {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchKeywords() {
      try {
        setLoading(true);
        const result = await client.fetch(`
          *[_type == 'keywordSetting']{
            keyword,
            page,
            description,
            title
          }
        `);
        setKeywords(result);
      } catch (err) {
        setError(err);
        // console.error('Failed to fetch keywords:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchKeywords();
  }, []);

  // 實用的輔助函數
  const getKeywordsByPage = (pageName) => {
    return keywords
      .filter((item) => item.page === pageName)
      .map((item) => item.keyword)
      .join(', ');
  };

  const getAllPages = () => {
    return keywords.map((item) => item.page);
  };

  const hasKeywords = (pageName) => {
    return keywords.some((item) => item.page === pageName);
  };

  const getDescriptionByPage = (pageName) => {
    // console.log('Finding description for page:', pageName);
    // console.log('All keywords data:', keywords);
    const page = keywords.find((item) => item.page === pageName);
    // console.log('Found page:', page);
    const description = page?.description;
    // console.log('Description:', description);
    return description || '';
  };

  const getTitleByPage = (pageName) => {
    const page = keywords.find((item) => item.page === pageName);
    return page?.title || '';
  };

  return {
    keywords, // 原始關鍵字資料
    loading, // 載入狀態
    error, // 錯誤狀態
    getKeywordsByPage, // 根據頁面名稱獲取關鍵字
    getAllPages, // 獲取所有設定過的頁面
    hasKeywords, // 檢查特定頁面是否有關鍵字
    getDescriptionByPage,
    getTitleByPage,
  };
}
