import { useEffect, useState, useRef } from 'react';
import { client } from '../../cms/sanityClient';
import './schoolSearch.css';

import { IoIosArrowDown } from 'react-icons/io';

const Region = ({ isActive }) => {
  return (
    <div className={isActive ? 'schoolsearch visible' : 'schoolsearch'}>
      <p>地區選單內容</p>
    </div>
  );
};

const SchoolTime = ({ isActive }) => {
  return (
    <div className={isActive ? 'enrollTime visible' : 'enrollTime'}>
      <p>入學時間選單內容</p>
    </div>
  );
};

const Purpose = ({ isActive }) => {
  return (
    <div className={isActive ? 'purpose visible' : 'purpose'}>
      <p>學習目的選單內容</p>
    </div>
  );
};

const OtherCondition = ({ isActive }) => {
  return (
    <div className={isActive ? 'otherCondition visible' : 'otherCondition'}>
      <p>其他條件選單內容</p>
    </div>
  );
};

export default function SchoolSearch() {
  const [schoolInfo, setSchoolInfo] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null); // 用於追踪當前開啟的選單
  const wrapperRef = useRef(null); // 用於引用選單容器

  useEffect(() => {
    async function fetchSchools() {
      try {
        const schoolinfo = await client.fetch(`
          *[_type == "school"] | order(publishedAt desc) {
            time,
            purpose,
            others,
            city[]->{
              title
            }
          }
        `);
        setSchoolInfo(schoolinfo);
      } catch (error) {
        console.error('Failed to fetch schools:', error);
      }
    }

    fetchSchools();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 如果點擊發生在選單外部，關閉選單
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    // 添加全局點擊事件監聽
    window.addEventListener('click', handleClickOutside);

    return () => {
      // 組件卸載時移除監聽
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="schoolsearchWrapper" ref={wrapperRef}>
      <div className="schoolsearchSearchBar">
        <li>
          <label>
            <input type="text" />
          </label>
        </li>
        <li className="regionSection">
          <button
            onClick={(e) => {
              e.stopPropagation(); // 防止冒泡到 window 的點擊事件
              setActiveMenu((prev) => (prev === 'region' ? null : 'region'));
            }}
          >
            地區
            <IoIosArrowDown />
          </button>
          <Region isActive={activeMenu === 'region'} />
        </li>
        <li className="enrollTimeSection">
          <button
            onClick={(e) => {
              e.stopPropagation(); // 防止冒泡到 window 的點擊事件
              setActiveMenu((prev) =>
                prev === 'enrollTime' ? null : 'enrollTime'
              );
            }}
          >
            入學時間
            <IoIosArrowDown />
          </button>
          <SchoolTime isActive={activeMenu === 'enrollTime'} />
        </li>
        <li className="purposeSection">
          <button
            onClick={(e) => {
              e.stopPropagation(); // 防止冒泡到 window 的點擊事件
              setActiveMenu((prev) => (prev === 'purpose' ? null : 'purpose'));
            }}
          >
            學習目的
            <IoIosArrowDown />
          </button>
          <Purpose isActive={activeMenu === 'purpose'} />
        </li>
        <li className="otherConditionSection">
          <button
            onClick={(e) => {
              e.stopPropagation(); // 防止冒泡到 window 的點擊事件
              setActiveMenu((prev) =>
                prev === 'otherCondition' ? null : 'otherCondition'
              );
            }}
          >
            其他條件
            <IoIosArrowDown />
          </button>
          <OtherCondition isActive={activeMenu === 'otherCondition'} />
        </li>
        <li>
          <button>搜尋</button>
        </li>
      </div>
    </div>
  );
}
