import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useSearchHandler() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (query) => {
    const trimmedQuery = query?.trim() || '';
    setSearchQuery(trimmedQuery);

    // 當執行新搜尋時，確保清除所有其他狀態
    navigate('/goyours-post', {
      state: {
        searchQuery: trimmedQuery,
        selectedCategory: null, // 確保清除分類
      },
      replace: true, // 使用 replace 而不是 push，這樣能避免在瀏覽器歷史中建立多餘的記錄
    });
  };

  return { searchQuery, setSearchQuery, handleSearch };
}
