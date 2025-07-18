import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { client } from "../../../services/sanity/client";
import { PortableText } from "@portabletext/react";

import "./informBear.css";

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
  const [mounted, setMounted] = useState(false);

  const showInform = (informData = inform) => {
    // 只在首次載入時隱藏 bear
    if (isInitialLoad) {
      setIsBearVisible(false);
      setIsInitialLoad(false);
    }

    const newToasts = informData.map((item) => {
      const toastId = toast(
        <div className="toast-content">
          <button onClick={() => dismissSingleToast(toastId)}>
            {/* <RxCross2 /> */}
          </button>
          <span className="inform-title">{item.title}</span>
          <PortableText value={item.content} components={components} />
        </div>,
        {
          duration: 5000000,
          position: "bottom-left",
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
    if (typeof window !== 'undefined') {
      localStorage.setItem("informDismissed", "true");
    }
  };

  const hideAllToasts = () => {
    activeToasts.forEach((toastId) => {
      toast.dismiss(toastId);
    });
    setActiveToasts([]);
    handleAllToastsDismissed();
  };

  const toggleInform = () => {
    if (activeToasts.length === 0) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("informDismissed");
      }
      showInform();
    } else {
      hideAllToasts();
    }
  };

  useEffect(() => {
    setMounted(true);
    
    async function fetchInform() {
      try {
        const result = await client.fetch(`
          *[_type == "inform"] | order(publishedAt desc){
            _id, 
            title,
            content,
          }
        `);
        setInform(result);

        // 如果有通知內容，直接顯示通知
        if (result.length > 0) {
          showInform(result);
        }
      } catch (error) {
        setIsBearVisible(true);
      }
    }

    // 清除 localStorage，確保每次進入都顯示通知
    if (typeof window !== 'undefined') {
      localStorage.removeItem("informDismissed");
    }

    fetchInform();
  }, []); // 只在組件掛載時執行一次

  // 禁用 SSR，只在客戶端渲染
  if (!mounted) {
    return null;
  }

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
