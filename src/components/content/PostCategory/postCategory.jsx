/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import { useWindowSize } from '../../../hooks';

import './postCategory.css';

const SpSearch = ({
  placeholder,
  placeholdertxt,
  searchTerm,
  handleSearchChange,
  setPlaceholdertxt,
  categories,
  handleCategoryClick,
  isSpSearchClicked,
  setIsSpSearchClicked,
  handleSearch,
  isComposing,
  setIsComposing,
  setSearchTerm,
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isComposing) {
                  handleSearch(searchTerm); // 確保非選字狀態才觸發搜尋
                  setIsSpSearchClicked(false);
                }
              }}
              onCompositionStart={() => setIsComposing(true)} // 開始選字
              onCompositionEnd={() => setIsComposing(false)} // 結束選字
              onFocus={() => setPlaceholdertxt('')}
              onBlur={() => setPlaceholdertxt(placeholder)}
              className="placeholder"
            />
            <span>
              <img src="/goyoursbear-line-G.svg" alt="goyours bear gray line" />
            </span>
          </div>
          <ul>
            <button
              className="postcategoryTitle"
              onClick={() => {
                handleSearch(searchTerm); // 執行搜尋功能
                setSearchTerm(''); // 清空輸入框
              }}
            >
              搜尋
            </button>
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
  const [isComposing, setIsComposing] = useState(false); // 用於判斷是否在輸入法選字中

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
        handleSearch={handleSearch}
        handleCategoryClick={handleCategoryClick}
        isComposing={isComposing}
        setIsComposing={setIsComposing}
      />

      <div className="postcategory">
        <div className="search">
          <FaMagnifyingGlass className="magnify" />
          <input
            type="text"
            placeholder={placeholdertxt}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isComposing) {
                handleSearch(searchTerm);
                setIsSpSearchClicked(false);
              }
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onFocus={() => setPlaceholdertxt('')}
            onBlur={() => setPlaceholdertxt(placeholder)}
            className="placeholder"
            onClick={() => {
              if (windowSize < 480) setIsSpSearchClicked(true);
            }}
            readOnly={windowSize < 480}
          />
          <span>
            <img src="/goyoursbear-line-G.svg" />
          </span>
        </div>
        <ul>
          <button
            className="postcategoryTitle"
            onClick={() => {
              handleSearch(searchTerm);
              setSearchTerm('');
            }}
          >
            搜尋
          </button>
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
