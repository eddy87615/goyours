/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import useWindowSize from '../../hook/useWindowSize';

import './postCategory.css';

const SpSearch = ({
  placeholder,
  placeholdertxt,
  searchTerm,
  handleSearchChange,
  handleKeyDown,
  setPlaceholdertxt,
  categories,
  handleCategoryClick,
  isSpSearchClicked,
  setIsSpSearchClicked,
}) => {
  return (
    <div
      className={
        isSpSearchClicked ? 'sp-search-bg search-clicked-bg' : ' sp-search-bg'
      }
      onClick={(e) => {
        // 如果目标是 input，不关闭状态
        if (e.target.tagName !== 'INPUT') {
          setIsSpSearchClicked(false);
        }
      }}
    >
      <div
        className={
          isSpSearchClicked
            ? 'sp-search-window search-clicked-window'
            : ' sp-search-window'
        }
        onClick={(e) => e.stopPropagation()} // 阻止冒泡，避免触发背景关闭
      >
        <span
          className="close-window-btn"
          onClick={() => setIsSpSearchClicked(!isSpSearchClicked)}
        >
          <RxCross2 />
        </span>
        <div className="sp-search">
          <div className="search">
            <FaMagnifyingGlass className="magnify" />
            <input
              type="text"
              placeholder={placeholdertxt}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // 監聽鍵盤事件
              onFocus={() => setPlaceholdertxt('')}
              onBlur={() => setPlaceholdertxt(placeholder)}
              className="placeholder"
            />
            <span>
              <img src="/goyoursbear-line-G.svg" alt="goyours bear gray line" />
            </span>
          </div>
          <ul>
            <p className="postcategoryTitle">請點選下列文章分類</p>
            {categories.map((category, index) => (
              <li
                key={index}
                onClick={() => handleCategoryClick(category.value)}
                className="postCategoryList"
              >
                <a className="categoryLabel">{category.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
export default function PostCategary({
  categories,
  handleCategoryClick,
  handleSearch,
  placeholder,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [placeholdertxt, setPlaceholdertxt] = useState(placeholder);
  const [isSpSearchClicked, setIsSpSearchClicked] = useState(false);
  const [isFirstEnter, setIsFirstEnter] = useState(true);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isFirstEnter) {
        // 第一次按 Enter，只是確定輸入
        setIsFirstEnter(false);
      } else {
        // 第二次按 Enter，執行搜尋
        handleSearch(searchTerm);
        setIsSpSearchClicked(!isSpSearchClicked);
        setIsFirstEnter(true); // 重置狀態
      }
    }
  };

  const windowSize = useWindowSize();

  return (
    <>
      <SpSearch
        categories={categories}
        placeholder={placeholder}
        placeholdertxt={placeholdertxt}
        setPlaceholdertxt={setPlaceholdertxt} // 傳遞 setPlaceholdertxt
        isSpSearchClicked={isSpSearchClicked}
        setIsSpSearchClicked={setIsSpSearchClicked}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleKeyDown={handleKeyDown}
        handleCategoryClick={handleCategoryClick}
      />

      <div className="postcategory">
        <div className="search">
          <FaMagnifyingGlass className="magnify" />
          <input
            type="text"
            placeholder={placeholdertxt}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown} // 監聽鍵盤事件
            onFocus={() => setPlaceholdertxt('')}
            onBlur={() => setPlaceholdertxt(placeholder)}
            className="placeholder"
            onClick={() => {
              if (windowSize < 480) setIsSpSearchClicked(true); // 小螢幕時啟用
            }}
            // {...console.log('isSpSearchClicked:', isSpSearchClicked)}
            readOnly={windowSize < 480} // 小螢幕時只讀
          />
          <span>
            <img src="/goyoursbear-line-G.svg" />
          </span>
        </div>
        <ul>
          <p className="postcategoryTitle">文章分類</p>
          {categories.map((category, index) => (
            <li
              key={index}
              onClick={() => handleCategoryClick(category.value)}
              className="postCategoryList"
            >
              <a className="categoryLabel">{category.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
