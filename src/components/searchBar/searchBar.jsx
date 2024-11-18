/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import './searchBar.css';

export default function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [selectedJapanese, setSelectedJapanese] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // 用來追蹤被選擇的篩選選項

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
    // 檢查是否已選中：如果已選中，從陣列移除；否則，添加到陣列
    setSelectedTags((prevTags) =>
      prevTags.includes(optionValue)
        ? prevTags.filter((tag) => tag !== optionValue)
        : [...prevTags, optionValue]
    );
  };

  const handleSearch = () => {
    console.log('Search keyword:', keyword); // 查看關鍵字輸入
    onSearch({
      keyword,
      selectedJapanese,
      selectedLocation,
      selectedJob,
      selectedSalary,
      selectedTags,
    });
  };

  return (
    <>
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
