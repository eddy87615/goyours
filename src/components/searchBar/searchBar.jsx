/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './searchBar.css';
import { RxCross2 } from 'react-icons/rx';

import useWindowSize from '../../hook/useWindowSize';

export default function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [selectedJapanese, setSelectedJapanese] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // 用來追蹤被選擇的篩選選項
  const windowSize = useWindowSize();

  const japaneseOption = [
    { title: '日文程度', value: '' },
    { title: 'N1以上', value: 'N1以上' },
    { title: 'N2以上', value: 'N2以上' },
    { title: 'N3以上', value: 'N3以上' },
    { title: 'N4以上', value: 'N4以上' },
    { title: 'N5以上', value: 'N5以上' },
    { title: '日語會話程度', value: '日語會話程度' },
    { title: '無要求', value: '無要求' },
  ];
  const locationOption = [
    { title: '工作地點', value: '' },
    { title: '關東地區', value: '關東地區' },
    { title: '關西地區', value: '關西地區' },
    { title: '九州地區', value: '九州地區' },
    { title: '北海道', value: '北海道' },
    { title: '沖繩', value: '沖繩' },
  ];
  const jobOption = [
    { title: '工作類型', value: '' },
    { title: '服務業', value: '服務業' },
    { title: '製造業', value: '製造業' },
    { title: '農業', value: '農業' },
    { title: '觀光業', value: '觀光業' },
  ];
  const salaryOption = [
    { title: '工作時薪', value: '' },
    { title: '1000日幣以下', value: '~1000' },
    { title: '1000~1100日幣', value: '1000~1100' },
    { title: '1100~1200日幣', value: '1100~1200' },
    { title: '1200日幣以上', value: '1200~' },
  ];
  const dotOption = [
    {
      title: '我們的推薦',
      value: '我們的推薦',
    },
    {
      title: '高人氣職缺',
      value: '高人氣職缺',
    },
    {
      title: '職缺由新到舊',
      value: '職缺由新到舊',
    },
    {
      title: '時薪由高到低',
      value: '時薪由高到低',
    },
  ];
  const handleTagClick = (optionValue) => {
    setSelectedTags((prevTags) => {
      if (!Array.isArray(prevTags)) return []; // 確保狀態為陣列
      return prevTags.includes(optionValue)
        ? prevTags.filter((tag) => tag !== optionValue)
        : [...prevTags, optionValue];
    });
  };

  const handleSearch = () => {
    onSearch({
      keyword,
      selectedJapanese,
      selectedLocation,
      selectedJob,
      selectedSalary,
      selectedTags,
    });
    setIsSearchClicked(false);
  };

  const [isSearchClicked, setIsSearchClicked] = useState(false);

  useEffect(() => {
    if (isSearchClicked) {
      // 記錄當前滾動位置
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden'; // 禁止滾動
      document.body.dataset.scrollY = scrollY; // 保存滾動位置到自定義屬性
    } else {
      // 恢復滾動位置
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.dataset.scrollY = '';
      window.scrollTo(0, scrollY); // 回到正確滾動位置
    }
  }, [isSearchClicked]);

  const currentYear = new Date().getFullYear();

  return (
    <>
      {windowSize < 768 && (
        <>
          <div
            className={
              isSearchClicked
                ? 'sp-job-search-bg search-job-bg-visible'
                : 'sp-job-search-bg'
            }
            onClick={() => setIsSearchClicked(!isSearchClicked)}
          ></div>
          <div
            className={
              isSearchClicked
                ? 'sp-job-search-window search-job-window-visible'
                : 'sp-job-search-window'
            }
          >
            <span className="search-job-close-btn">
              <RxCross2 onClick={() => setIsSearchClicked(!isSearchClicked)} />
            </span>
            <div className="searchup">
              <input
                type="text"
                placeholder="輸入關鍵字"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <select onChange={(e) => setSelectedJapanese(e.target.value)}>
                {japaneseOption.map((japanese, index) => (
                  <option key={index} value={japanese.value}>
                    {japanese.title}
                  </option>
                ))}
              </select>
              <select onChange={(e) => setSelectedLocation(e.target.value)}>
                {locationOption.map((location, index) => (
                  <option key={index} value={location.value}>
                    {location.title}
                  </option>
                ))}
              </select>
              <select onChange={(e) => setSelectedJob(e.target.value)}>
                {jobOption.map((job, index) => (
                  <option key={index} value={job.value}>
                    {job.title}
                  </option>
                ))}
              </select>

              <select onChange={(e) => setSelectedSalary(e.target.value)}>
                {salaryOption.map((salary, index) => (
                  <option key={index} value={salary.value}>
                    {salary.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="searchdown">
              {dotOption.map((option, index) => (
                <label
                  key={index}
                  className={
                    selectedTags.includes(option.value)
                      ? 'customCheckBox-active'
                      : ''
                  }
                  onClick={() => handleTagClick(option.value)}
                >
                  <span className="custom-checkbox"></span>
                  <input
                    type="checkbox"
                    name="sortOption"
                    value={option.value}
                    checked={selectedTags.includes(option.value)}
                    onChange={() => handleTagClick(option.value)}
                  />
                  {option.title}
                </label>
              ))}
              <button onClick={handleSearch}>立即搜尋</button>
            </div>
          </div>
          <div className="searchbar sp-job-searchBar">
            <div className="jobsearchSearchBar sp-search-job">
              <div className="sp-job-search-filter-btn">
                <p>{currentYear}日本打工度假 職缺搜索</p>
                <button onClick={() => setIsSearchClicked(!isSearchClicked)}>
                  篩選條件
                  <span>
                    <img
                      src="goyoursbear-icon-w.svg"
                      alt="goyours white icon"
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="searchbar">
        <div className="searchup">
          <input
            type="text"
            placeholder="輸入關鍵字"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select onChange={(e) => setSelectedJapanese(e.target.value)}>
            {japaneseOption.map((japanese, index) => (
              <option key={index} value={japanese.value}>
                {japanese.title}
              </option>
            ))}
          </select>
          <select onChange={(e) => setSelectedLocation(e.target.value)}>
            {locationOption.map((location, index) => (
              <option key={index} value={location.value}>
                {location.title}
              </option>
            ))}
          </select>
          <select onChange={(e) => setSelectedJob(e.target.value)}>
            {jobOption.map((job, index) => (
              <option key={index} value={job.value}>
                {job.title}
              </option>
            ))}
          </select>

          <select onChange={(e) => setSelectedSalary(e.target.value)}>
            {salaryOption.map((salary, index) => (
              <option key={index} value={salary.value}>
                {salary.title}
              </option>
            ))}
          </select>
        </div>
        <div className="searchdown">
          {dotOption.map((option, index) => (
            <label
              key={index}
              className={
                selectedTags.includes(option.value)
                  ? 'customCheckBox-active'
                  : ''
              }
              onClick={() => handleTagClick(option.value)}
            >
              <span className="custom-checkbox"></span>
              <input
                type="checkbox"
                name="sortOption"
                value={option.value}
                checked={selectedTags.includes(option.value)}
                onChange={() => handleTagClick(option.value)}
              />
              {option.title}
            </label>
          ))}
          <button onClick={handleSearch}>立即搜尋</button>
        </div>
      </div>
    </>
  );
}
