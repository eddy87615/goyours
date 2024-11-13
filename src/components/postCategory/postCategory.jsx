/* eslint-disable react/prop-types */
import { useState } from 'react';
import './postCategory.css';
import { FaMagnifyingGlass } from 'react-icons/fa6';

// eslint-disable-next-line react/prop-types
export default function PostCategary({
  categories,
  handleCategoryClick,
  handleSearch,
  title,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [placeholdertxt, setPlaceholdertxt] = useState('搜尋文章...');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm); // 按下 Enter 鍵後觸發搜尋功能
    }
  };
  return (
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
          onBlur={() => setPlaceholdertxt('搜尋文章...')}
          className="placeholder"
        />
      </div>
      <ul>
        <h4 className="postcategoryh4">{title}</h4>
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
  );
}
