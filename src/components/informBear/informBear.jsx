import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { client } from '../../cms/sanityClient';
import { PortableText } from '@portabletext/react';

import './informBear.css';

const components = {
  marks: {
    link: ({ value, children }) => {
      const { blank, href } = value;
      return blank ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      );
    },
  },
};

export default function InformBear() {
  const [inform, setInform] = useState([]);
  const [activeToasts, setActiveToasts] = useState([]);
  const [isBearVisible, setIsBearVisible] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 新增狀態追踪是否為首次載入

  const showInform = (informData = inform) => {
    console.log('顯示通知'); // 調試

    // 只在首次載入時隱藏 bear
    if (isInitialLoad) {
      setIsBearVisible(false);
      setIsInitialLoad(false);
      console.log('首次載入 - Bear 狀態:', false); // 調試
    }

    const newToasts = informData.map((item) => {
      const toastId = toast(
        <div className="toast-content">
          <button onClick={() => dismissSingleToast(toastId)}>
            {/* <RxCross2 /> */}
          </button>
          <h4>{item.title}</h4>
          <PortableText value={item.content} components={components} />
        </div>,
        {
          duration: 5000000,
          position: 'bottom-left',
          id: item._id,
          dismissible: true,
        }
      );
      return toastId;
    });

    setActiveToasts(newToasts);
  };

  const dismissSingleToast = (toastId) => {
    toast.dismiss(toastId);
    setActiveToasts((prev) => {
      const newToasts = prev.filter((id) => id !== toastId);
      if (newToasts.length === 0) {
        handleAllToastsDismissed();
      }
      return newToasts;
    });
  };

  const handleAllToastsDismissed = () => {
    setIsBearVisible(true);
    localStorage.setItem('informDismissed', 'true');
    console.log('通知已關閉，儲存到 localStorage'); // 調試
    console.log('LocalStorage 狀態:', localStorage.getItem('informDismissed')); // 調試
  };

  const hideAllToasts = () => {
    console.log('關閉所有通知'); // 調試
    activeToasts.forEach((toastId) => {
      toast.dismiss(toastId);
    });
    setActiveToasts([]);
    handleAllToastsDismissed();
  };

  const toggleInform = () => {
    if (activeToasts.length === 0) {
      console.log('切換顯示通知'); // 調試
      localStorage.removeItem('informDismissed');
      console.log('清除 localStorage'); // 調試
      showInform();
    } else {
      hideAllToasts();
    }
  };

  useEffect(() => {
    async function fetchInform() {
      try {
        const result = await client.fetch(`
          *[_type == "inform"] | order(publishedAt desc){
            _id, 
            title,
            content,
          }
        `);
        console.log('獲取通知資料:', result); // 調試
        setInform(result);

        // 如果有通知內容，直接顯示通知
        if (result.length > 0) {
          showInform(result);
          console.log('初始顯示通知'); // 調試
        }
      } catch (error) {
        console.error('獲取通知錯誤:', error);
        setIsBearVisible(true);
      }
    }

    // 清除 localStorage，確保每次進入都顯示通知
    localStorage.removeItem('informDismissed');
    console.log('初始化時清除 localStorage'); // 調試

    fetchInform();
  }, []); // 只在組件掛載時執行一次

  return (
    <>
      {isBearVisible && inform.length > 0 && (
        <div
          className="inform-bear"
          title="顯示通知"
          onClick={toggleInform}
        ></div>
      )}
      <Toaster />
    </>
  );
}
