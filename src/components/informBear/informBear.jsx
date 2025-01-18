/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { client } from '../../cms/sanityClient';
import { PortableText } from '@portabletext/react';
import { useLocation } from 'react-router-dom';

import './informBear.css';

// 定義 PortableText 的渲染組件
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
  const location = useLocation();
  const [inform, setInform] = useState([]);
  const [isHidden, setIsHidden] = useState(false);
  const [activeToasts, setActiveToasts] = useState([]);

  useEffect(() => {
    async function fetchInform() {
      const result = await client.fetch(`
        *[_type == "inform"] | order(publishedAt desc){
        _id, 
          title,
          content,
        }
      `);
      setInform(result);
    }
    fetchInform();
  }, []);

  const showInform = () => {
    const newToasts = inform.map((item) => {
      const toastId = toast(
        <div className="toast-content">
          <button
            onClick={() => {
              toast.dismiss(toastId);
              setActiveToasts((prev) => prev.filter((id) => id !== toastId));
            }}
          >
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
    setIsHidden(false);
  };

  const hideInform = () => {
    activeToasts.forEach((toastId) => {
      toast.dismiss(toastId);
    });
    setActiveToasts([]);
    setIsHidden(true);
  };

  const toggleInform = () => {
    if (isHidden || activeToasts.length === 0) {
      showInform();
    } else {
      hideInform();
    }
  };

  useEffect(() => {
    if (inform.length > 0 && !isHidden) {
      showInform();
    }
  }, [inform, location.pathname]);

  return (
    <>
      <div
        className="inform-bear"
        title="顯示通知"
        onClick={toggleInform}
      ></div>
      <Toaster />
    </>
  );
}
