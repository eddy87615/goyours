/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { client } from '../../cms/sanityClient';
import './schoolSearch.css';
import '../searchBar/searchBar.css';

import { IoIosArrowDown } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';

import useWindowSize from '../../hook/useWindowSize';

const useSelection = (initialState = {}) => {
  const [selected, setSelected] = useState(initialState);

  const toggleSelection = (category, option) => {
    setSelected((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(option)
        ? prev[category].filter((item) => item !== option)
        : [...(prev[category] || []), option],
    }));
  };

  const clearSelection = (category) => {
    setSelected((prev) => {
      if (category) {
        const updated = { ...prev };
        updated[category] = [];
        return updated;
      }
      return {};
    });
  };

  const selectAll = (category, options) => {
    setSelected((prev) => ({
      ...prev,
      [category]: options,
    }));
  };

  return {
    selected,
    setSelected, // 用於直接設置狀態
    toggleSelection,
    clearSelection,
    selectAll,
    countSelected: Object.values(selected).flat().length,
  };
};

const useArraySelection = (initialState = []) => {
  const [selected, setSelected] = useState(initialState);

  const toggleSelection = (option) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const clearSelection = () => setSelected([]);

  return {
    selected,
    setSelected, // 用於直接設置狀態
    toggleSelection,
    clearSelection,
    countSelected: selected.length,
  };
};

const DropdownMenu = ({
  className,
  title,
  isActive,
  children,
  onClick,
  count,
}) => (
  <li className={className}>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={isActive ? { backgroundColor: '#dddddd' } : {}}
    >
      {title}
      {count > 0 && <span className="selectedCount">{count}</span>}
      <IoIosArrowDown />
    </button>
    <div className={isActive ? `${className} visible` : `${className}`}>
      {children}
    </div>
  </li>
);

const Region = ({
  regions,
  selectedCities,
  toggleCitySelection,
  clearSelection,
  selectAllCities,
  isActive,
}) => {
  return (
    <div className={isActive ? 'schoolsearch visible' : 'schoolsearch'}>
      {regions.map((region) => (
        <div key={region.value} className="region">
          <div className="regionName">
            <h3>{region.title}</h3>
            <div className="selectBtn">
              <button
                onClick={() =>
                  selectAllCities(
                    region.value,
                    region.cities.map((city) => city.value)
                  )
                }
              >
                全選
              </button>
              <button onClick={() => clearSelection(region.value)}>
                清除選擇
              </button>
            </div>
          </div>
          <ul className="cities">
            {region.cities.map((city) => (
              <li
                key={city.value}
                className={`city-button ${
                  (selectedCities[region.value] || []).includes(city.value)
                    ? 'selected'
                    : ''
                }`}
                onClick={() => toggleCitySelection(region.value, city.value)}
              >
                {city.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const EnrollTime = ({ isActive, enrollTime, selected, toggleSelection }) => {
  return (
    <div className={isActive ? 'enrollTime visible' : 'enrollTime'}>
      <ul className="enrollTime-List">
        <li>
          <h3>入學時間</h3>
        </li>
        {enrollTime.map((time, index) => (
          <li
            key={index}
            className={`enrollTime-button ${
              selected.includes(time.value) ? 'selected' : ''
            }`}
            onClick={() => toggleSelection(time.value)}
          >
            {time.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Purpose = ({ isActive, purpose, selected, toggleSelection }) => {
  return (
    <div className={isActive ? 'purpose visible' : 'purpose'}>
      <ul className="purpose-List">
        <li>
          <h3>學習目的</h3>
        </li>
        {purpose.map((purpose, index) => (
          <li
            key={index}
            className={`purpose-button ${
              selected.includes(purpose.value) ? 'selected' : ''
            }`}
            onClick={() => toggleSelection(purpose.value)}
          >
            {purpose.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const OtherCondition = ({ isActive, others, selected, toggleSelection }) => {
  return (
    <div className={isActive ? 'otherCondition visible' : 'otherCondition'}>
      {others.map((items) => (
        <div key={items.title} className="others">
          <div className="othersName">
            <h3>{items.title}</h3>
          </div>
          <ul className="othersOptions">
            {items.options.map((options) => (
              <li
                key={options.value}
                className={`others-button ${
                  (selected[items.value] || []).includes(options.value)
                    ? 'selected'
                    : ''
                }`}
                onClick={() => toggleSelection(items.value, options.value)}
              >
                {options.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default function SchoolSearch({ onSearchFilters, initialFilters }) {
  const [selectedTags, setSelectedTags] = useState([]); // 用來追蹤被選擇的篩選選項
  const windowSize = useWindowSize();

  const [filters, setFilters] = useState({
    keyword: '',
    regions: {}, // 地區篩選條件
    enrollTime: [], // 入學時間
    purpose: [], // 學習目的
    others: {}, // 其他條件
    selectedTags, // 新增標籤選項
  });

  const wrapperRef = useRef(null); // 用於引用選單容器

  const [activeMenu, setActiveMenu] = useState(null); // 用於追踪當前開啟的選單

  const [keyword, setKeyword] = useState('');

  const regionsState = useSelection({}); // 使用物件
  const enrollTimeState = useArraySelection([]); // 使用陣列
  const purposeState = useArraySelection([]); // 使用陣列
  const othersState = useSelection({}); // 使用物件

  const dotOption = [
    {
      title: '我們的推薦',
      value: '我們的推薦',
    },
    {
      title: '高人氣學校',
      value: '高人氣學校',
    },
    {
      title: '學校更新時間',
      value: '學校更新時間',
    },
    {
      title: '學費由低到高',
      value: '學費由低到高',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const regions = [
    {
      title: '關東',
      value: '關東',
      cities: [
        { title: '茨城縣', value: '茨城縣' },
        { title: '栃木縣', value: '栃木縣' },
        { title: '群馬縣', value: '群馬縣' },
        { title: '埼玉縣', value: '埼玉縣' },
        { title: '千葉縣', value: '千葉縣' },
        { title: '東京都', value: '東京都' },
        { title: '神奈川縣', value: '神奈川縣' },
      ],
    },
    {
      title: '中部',
      value: '中部',
      cities: [
        { title: '新潟縣', value: '新潟縣' },
        { title: '富山縣', value: '富山縣' },
        { title: '石川縣', value: '石川縣' },
        { title: '福井縣', value: '福井縣' },
        { title: '山梨縣', value: '山梨縣' },
        { title: '長野縣', value: '長野縣' },
        { title: '岐阜縣', value: '岐阜縣' },
        { title: '靜岡縣', value: '靜岡縣' },
        { title: '愛知縣', value: '愛知縣' },
      ],
    },
    {
      title: '近畿',
      value: '近畿',
      cities: [
        { title: '三重縣', value: '三重縣' },
        { title: '滋賀縣', value: '滋賀縣' },
        { title: '京都府', value: '京都府' },
        { title: '大阪府', value: '大阪府' },
        { title: '兵庫縣', value: '兵庫縣' },
        { title: '奈良縣', value: '奈良縣' },
        { title: '和歌山縣', value: '和歌山縣' },
      ],
    },
    {
      title: '中國 ･ 四國',
      value: '中國 ･ 四國',
      cities: [
        { title: '鳥取縣', value: '鳥取縣' },
        { title: '島根縣', value: '島根縣' },
        { title: '岡山縣', value: '岡山縣' },
        { title: '廣島縣', value: '廣島縣' },
        { title: '山口縣', value: '山口縣' },
        { title: '德島縣', value: '德島縣' },
        { title: '香川縣', value: '香川縣' },
        { title: '愛媛縣', value: '愛媛縣' },
        { title: '高知縣', value: '高知縣' },
      ],
    },
    {
      title: '北海道 ･ 東北',
      value: '北海道 ･ 東北',
      cities: [
        { title: '北海道', value: '北海道' },
        { title: '青森縣', value: '青森縣' },
        { title: '岩手縣', value: '岩手縣' },
        { title: '宮城縣', value: '宮城縣' },
        { title: '秋田縣', value: '秋田縣' },
        { title: '山形縣', value: '山形縣' },
        { title: '福島縣', value: '福島縣' },
      ],
    },
    {
      title: '九州 ･ 沖繩',
      value: '九州 ･ 沖繩',
      cities: [
        { title: '福岡縣', value: '福岡縣' },
        { title: '佐賀縣', value: '佐賀縣' },
        { title: '長崎縣', value: '長崎縣' },
        { title: '熊本縣', value: '熊本縣' },
        { title: '大分縣', value: '大分縣' },
        { title: '宮崎縣', value: '宮崎縣' },
        { title: '沖繩縣', value: '沖繩縣' },
        { title: '鹿兒島縣', value: '鹿兒島縣' },
      ],
    },
  ];

  const purpose = [
    { title: '就職', value: '就職' },
    { title: '語言學習', value: '語言學習' },
    { title: '大學 ･ 研究所升學', value: '大學 ･ 研究所升學' },
    { title: '專門學校升學', value: '專門學校升學' },
  ];

  const others = [
    {
      title: '上課時段',
      value: '上課時段',
      options: [
        { title: '半日制', value: '半日制' },
        { title: '全日制', value: '全日制' },
        { title: '夜間制', value: '夜間制' },
        { title: '週末班', value: '週末班' },
      ],
    },
    {
      title: '修業期間',
      value: '修業期間',
      options: [
        { title: '短期（三個月以下）', value: '短期（三個月以下）' },
        { title: '長期（半年以上）', value: '長期（半年以上）' },
      ],
    },
    {
      title: '支援服務',
      value: '支援服務',
      options: [
        { title: '就職輔導', value: '就職輔導' },
        { title: '升學輔導', value: '升學輔導' },
        { title: '打工介紹', value: '打工介紹' },
        { title: '正職介紹', value: '正職介紹' },
        { title: '學校宿舍', value: '學校宿舍' },
        { title: '生活支援', value: '生活支援' },
      ],
    },
  ];

  const enrollTime = [
    { title: '一月', value: '一月' },
    { title: '四月', value: '四月' },
    { title: '七月', value: '七月' },
    { title: '九月', value: '九月' },
    { title: '十月', value: '十月' },
    { title: '隨時入學', value: '隨時入學' },
  ];

  const [selectedCities, setSelectedCities] = useState(
    Object.fromEntries(Object.keys(regions).map((region) => [region, []]))
  );

  const toggleCitySelection = (region, city) => {
    regionsState.toggleSelection(region, city);
  };

  const clearSelectionInRegion = (region) => {
    regionsState.clearSelection(region);
  };

  const selectAllCitiesInRegion = (region, cities) => {
    regionsState.selectAll(region, cities);
  };

  const countSelected = Object.values(selectedCities).flat().length;

  useEffect(() => {
    async function fetchSchools() {
      try {
        const schoolinfo = await client.fetch(`
          *[_type == "school"&& !(_id in path("drafts.**"))] | order(publishedAt desc) {
            enrollTime,
            purpose,
            city,
          others,
          }
        `);
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

  const handleTagClick = (optionValue) => {
    // 檢查是否已選中：如果已選中，從陣列移除；否則，添加到陣列
    setSelectedTags((prevTags) =>
      prevTags.includes(optionValue)
        ? prevTags.filter((tag) => tag !== optionValue)
        : [...prevTags, optionValue]
    );
  };

  const handleSearch = () => {
    const newFilters = {
      keyword,
      regions: regionsState.selected,
      enrollTime: enrollTimeState.selected,
      purpose: purposeState.selected,
      others: othersState.selected,
      selectedTags,
      sortBy: selectedTags.includes('學校更新時間')
        ? 'updatedAt'
        : selectedTags.includes('學費由低到高')
        ? 'tuitionAsc'
        : null,
    };
    window.scrollTo(0, 0);
    onSearchFilters(newFilters); // 傳遞篩選條件給父組件
    setIsSearchClicked(false);
    setActiveMenu(null);
  };

  useEffect(() => {
    if (initialFilters) {
      setKeyword(initialFilters.keyword || '');
      regionsState.setSelected(initialFilters.regions || {}); // 設置地區
      enrollTimeState.setSelected(initialFilters.enrollTime || []); // 設置入學時間
      purposeState.setSelected(initialFilters.purpose || []); // 設置學習目的
      othersState.setSelected(initialFilters.others || {}); // 設置其他條件
      setSelectedTags(initialFilters.selectedTags || []); // 設置選中的標籤
    }
  }, [initialFilters]);

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
    <div className="schoolsearchWrapper" ref={wrapperRef}>
      {windowSize < 501 && (
        <>
          <div
            className={
              isSearchClicked
                ? 'sp-school-search-bg search-school-bg-visible'
                : 'sp-school-search-bg'
            }
            onClick={() => setIsSearchClicked(!isSearchClicked)}
          ></div>
          <div
            className={
              isSearchClicked
                ? 'sp-school-search-window search-school-window-visible'
                : 'sp-school-search-window'
            }
          >
            <span className="search-school-close-btn">
              <RxCross2 onClick={() => setIsSearchClicked(!isSearchClicked)} />
            </span>
            <div className="schoolSearchBar-upper">
              <li>
                <label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="輸入關鍵字"
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = '輸入關鍵字搜尋')}
                  />
                </label>
              </li>
              <DropdownMenu
                title="地區"
                className="regionSection"
                isActive={activeMenu === 'region'}
                onClick={() =>
                  setActiveMenu((prev) => (prev === 'region' ? null : 'region'))
                }
                count={regionsState.countSelected}
              >
                <Region
                  isActive={activeMenu === 'region'}
                  regions={regions}
                  selectedCities={regionsState.selected}
                  toggleCitySelection={toggleCitySelection}
                  clearSelection={clearSelectionInRegion}
                  selectAllCities={selectAllCitiesInRegion}
                />
              </DropdownMenu>

              <DropdownMenu
                title="入學時間"
                className="enrollTimeSection"
                isActive={activeMenu === 'enrollTime'}
                onClick={() =>
                  setActiveMenu((prev) =>
                    prev === 'enrollTime' ? null : 'enrollTime'
                  )
                }
                count={enrollTimeState.countSelected}
              >
                <EnrollTime
                  enrollTime={enrollTime}
                  isActive={activeMenu === 'enrollTime'}
                  selected={enrollTimeState.selected}
                  toggleSelection={enrollTimeState.toggleSelection}
                />
              </DropdownMenu>
              <DropdownMenu
                title="學習目的"
                className="purposeSection"
                isActive={activeMenu === 'purpose'}
                onClick={() =>
                  setActiveMenu((prev) =>
                    prev === 'purpose' ? null : 'purpose'
                  )
                }
                count={purposeState.countSelected}
              >
                <Purpose
                  isActive={activeMenu === 'purpose'}
                  purpose={purpose}
                  selected={purposeState.selected}
                  toggleSelection={purposeState.toggleSelection}
                />
              </DropdownMenu>

              <DropdownMenu
                title="其他條件"
                className="otherConditionSection"
                isActive={activeMenu === 'otherCondition'}
                onClick={() =>
                  setActiveMenu((prev) =>
                    prev === 'otherCondition' ? null : 'otherCondition'
                  )
                }
                count={othersState.countSelected}
              >
                <OtherCondition
                  isActive={activeMenu === 'otherCondition'}
                  others={others}
                  selected={othersState.selected}
                  toggleSelection={othersState.toggleSelection}
                />
              </DropdownMenu>
            </div>
            <div className="schoolSearchBar-down">
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
          <div className="schoolsearchSearchBar sp-search-school">
            <div className="sp-school-search-filter-btn">
              <p>{currentYear}日本語學校 學校搜索</p>
              <button onClick={() => setIsSearchClicked(!isSearchClicked)}>
                篩選條件
                <span>
                  <img src="goyoursbear-icon-w.svg" alt="goyours white icon" />
                </span>
              </button>
            </div>
          </div>
        </>
      )}
      <div className="schoolsearchSearchBar">
        <div className="schoolSearchBar-upper">
          <li>
            <label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="輸入關鍵字"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = '輸入關鍵字搜尋')}
              />
            </label>
          </li>
          <DropdownMenu
            title="地區"
            className="regionSection"
            isActive={activeMenu === 'region'}
            onClick={() =>
              setActiveMenu((prev) => (prev === 'region' ? null : 'region'))
            }
            count={regionsState.countSelected}
          >
            <Region
              isActive={activeMenu === 'region'}
              regions={regions}
              selectedCities={regionsState.selected}
              toggleCitySelection={toggleCitySelection}
              clearSelection={clearSelectionInRegion}
              selectAllCities={selectAllCitiesInRegion}
            />
          </DropdownMenu>

          <DropdownMenu
            title="入學時間"
            className="enrollTimeSection"
            isActive={activeMenu === 'enrollTime'}
            onClick={() =>
              setActiveMenu((prev) =>
                prev === 'enrollTime' ? null : 'enrollTime'
              )
            }
            count={enrollTimeState.countSelected}
          >
            <EnrollTime
              enrollTime={enrollTime}
              isActive={activeMenu === 'enrollTime'}
              selected={enrollTimeState.selected}
              toggleSelection={enrollTimeState.toggleSelection}
            />
          </DropdownMenu>
          <DropdownMenu
            title="學習目的"
            className="purposeSection"
            isActive={activeMenu === 'purpose'}
            onClick={() =>
              setActiveMenu((prev) => (prev === 'purpose' ? null : 'purpose'))
            }
            count={purposeState.countSelected}
          >
            <Purpose
              isActive={activeMenu === 'purpose'}
              purpose={purpose}
              selected={purposeState.selected}
              toggleSelection={purposeState.toggleSelection}
            />
          </DropdownMenu>

          <DropdownMenu
            title="其他條件"
            className="otherConditionSection"
            isActive={activeMenu === 'otherCondition'}
            onClick={() =>
              setActiveMenu((prev) =>
                prev === 'otherCondition' ? null : 'otherCondition'
              )
            }
            count={othersState.countSelected}
          >
            <OtherCondition
              isActive={activeMenu === 'otherCondition'}
              others={others}
              selected={othersState.selected}
              toggleSelection={othersState.toggleSelection}
            />
          </DropdownMenu>
        </div>
        <div className="schoolSearchBar-down">
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
    </div>
  );
}
