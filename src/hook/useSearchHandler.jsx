import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useSearchHandler() {
  const [searchQuery, setSearchQuery] = useState(''); // 搜索關鍵字狀態
  const navigate = useNavigate(); // 用於導航

  // 處理搜索功能
  const handleSearch = (query) => {
    setSearchQuery(query || ''); // 更新本地狀態
    navigate('/goyours-post', { state: { searchQuery: query || '' } }); // 導航到目標頁面，並傳遞搜索查詢
  };

  return { searchQuery, setSearchQuery, handleSearch };
}
