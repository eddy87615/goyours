import { useState } from 'react';
import './postCategory.css';
import { FaMagnifyingGlass } from 'react-icons/fa6';

// eslint-disable-next-line react/prop-types
export default function PostCategary({ handleCategoryClick, handleSearch }) {
  const categories = [
    { label: '所有文章', value: null },
    { label: '最新消息', value: '最新消息' },
    { label: '日本SGU項目', value: '日本SGU項目' },
    { label: '日本EJU', value: '日本EJU' },
    { label: '日本介護・護理相關', value: '日本介護・護理相關' },
    { label: '日本特定技能一號簽證', value: '日本特定技能一號簽證' },
    { label: '日本相關', value: '日本相關' },
    { label: '日本留學', value: '日本留學' },
    { label: '打工度假', value: '打工度假' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // handleSearch(e.target.value);
    console.log('Search term:', e.target.value); // 確認輸入的值是否正確
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm); // 按下 Enter 鍵後觸發搜尋功能
      setSearchTerm(''); // 清空搜尋欄
    }
  };
  return (
    <div className="postcategory">
      <div className="search">
        <FaMagnifyingGlass className="magnify" />
        <input
          type="text"
          placeholder="搜尋文章..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown} // 監聽鍵盤事件
        />
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
  );
}
