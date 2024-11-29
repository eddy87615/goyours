/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import './postCategory.css';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';

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
            <h4 className="postcategoryh4">請點選下列文章分類</h4>
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
  isSpSearchClicked,
  setIsSpSearchClicked,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [placeholdertxt, setPlaceholdertxt] = useState(placeholder);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm); // 按下 Enter 鍵後觸發搜尋功能
      setIsSpSearchClicked(!isSpSearchClicked); // 關閉搜尋視窗
    }
  };

  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <SpSearch
        categories={categories}
        placeholdertxt="輸入文章關鍵字"
        isSpSearchClicked={isSpSearchClicked}
        setIsSpSearchClicked={setIsSpSearchClicked}
        searchTerm={searchTerm} // 传递搜索关键字
        handleSearchChange={handleSearchChange} // 传递搜索事件处理
        handleKeyDown={handleKeyDown} // 传递键盘事件处理
        handleCategoryClick={handleCategoryClick} // 確保傳遞父組件的函數
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
            readOnly={windowSize < 480} // 小螢幕時只讀
          />
          <span>
            <img src="/goyoursbear-line-G.svg" />
          </span>
        </div>
        <ul>
          <h4 className="postcategoryh4">文章分類</h4>
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
