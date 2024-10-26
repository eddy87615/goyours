import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual'; // 禁用瀏覽器的自動滾動還原功能
    window.scrollTo(0, 0); // 強制滾動到頂端
  }, [pathname]); // 每次路徑變更時觸發

  return null;
}

export default ScrollToTop;
