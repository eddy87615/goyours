import './loadingBear.css';

import { useRef, useEffect } from 'react';

export default function LoadingBear() {
  // 創建一個引用來存儲 SVG 路徑
  const pathRef = useRef(null);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      // console.log('路徑總長度:', length);
      pathRef.current.style.strokeDasharray = length;
      pathRef.current.style.strokeDashoffset = length;
    }
  }, []);

  return (
    <div className="loadingBearAnimation">
      <svg viewBox="0 0 284.2 345.4">
        <path
          ref={pathRef}
          className="loadingBear"
          d="M8.7,337.8c0,0-13.6-150.5,68.6-211.9c0,0-5.4-16.2-40.1-28c0,0-12.5-5.6-15.7-16.7c0,0-1.1-14.6,0.7-16.9
        c0,0,0.9-1.8,3-2.1c0,0,39.1-7.4,41.8-8.1c0,0,2.5-1.2,3.3-3.3c0,0-0.5-9.9,1.9-11.8c0,0,1.4-1.4,2.3-1.9c0,0,27.8-8.8,48.3-12.7
        h1.8c0,0,3.7-17.8,22.7-10.1c0,0,11.1,5.6,5.8,20.3c0,0,0.2,2.5,0,4.8c0,0,46.4,29.8,51.6,84.9c0,0,79.4,32.1,70.9,213.5H8.7z"
        />
      </svg>
    </div>
  );
}
