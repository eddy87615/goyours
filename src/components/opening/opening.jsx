import { useEffect } from 'react';

import './opening.css';

export default function Opening() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const logoPath = document.getElementById('#logo');
    if (logoPath) {
      logoPath.getTotalLength(); // 獲取路徑長度
    }
  }, []); // 空依賴陣列確保此操作只在初始渲染後執行一次

  return <div className="openingPage"></div>;
}
