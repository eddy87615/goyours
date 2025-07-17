/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./searchBar.css";
import { RxCross2 } from "react-icons/rx";

import { useWindowSize } from "../../../hooks";

const MOBILE_BREAKPOINT = 768;

const SEARCH_OPTIONS = {
  location: [
    { title: "工作地點", value: "" },
    { title: "關東地區", value: "關東地區" },
    { title: "關西地區", value: "關西地區" },
    { title: "九州地區", value: "九州地區" },
    { title: "北海道", value: "北海道" },
    { title: "沖繩", value: "沖繩" },
  ],
  job: [
    { title: "雇用型態", value: "" },
    { title: "契約社員", value: "契約社員（正社員登用あり）" },
    { title: "正社員", value: "正社員" },
    { title: "アルバイト", value: "アルバイト" },
  ],
  salary: [
    { title: "年薪", value: "" },
    { title: "400萬日幣以下", value: "~400" },
    { title: "400~500萬日幣", value: "400~500" },
    { title: "500~600萬日幣", value: "500~600" },
    { title: "600萬日幣以上", value: "600~" },
  ],
  gyousyu: [
    { title: "業種", value: "" },
    { title: "流通・零售・餐飲", value: "流通・零售・餐飲" },
    { title: "不動產・建設・設備", value: "不動產・建設・設備" },
    { title: "IT・通信・網路", value: "IT・通信・網路" },
    { title: "服務・休閒", value: "服務・休閒" },
    { title: "環境・能源", value: "環境・能源" },
    { title: "製造業・機械", value: "製造業・機械" },
    { title: "金融・保險", value: "金融・保險" },
    { title: "醫療・護理・福祉", value: "醫療・護理・福祉" },
    { title: "教育・人才服務", value: "教育・人才服務" },
    { title: "運輸・物流", value: "運輸・物流" },
    { title: "媒體・廣告・設計", value: "媒體・廣告・設計" },
    { title: "商社・貿易", value: "商社・貿易" },
    { title: "化學・製藥", value: "化學・製藥" },
    { title: "農業・水產・食品", value: "農業・水產・食品" },
    { title: "娛樂・遊戲", value: "娛樂・遊戲" },
    { title: "公共機關・非營利組織", value: "公共機關・非營利組織" },
    { title: "其他", value: "其他" },
  ],
  syokusyu: [
    { title: "職種", value: "" },
    { title: "銷售・服務職", value: "銷售・服務職" },
    { title: "營業", value: "營業" },
    { title: "技術職（IT系工程師）", value: "技術職（IT系工程師）" },
    { title: "事務・管理職", value: "事務・管理職" },
    { title: "製造・技術職", value: "製造・技術職" },
    {
      title: "專門職（醫療・護理・福祉）",
      value: "專門職（醫療・護理・福祉）",
    },
    { title: "專門職（金融・保險）", value: "專門職（金融・保險）" },
    { title: "專門職（法律・會計）", value: "專門職（法律・會計）" },
    { title: "創意職（設計・企劃）", value: "創意職（設計・企劃）" },
    { title: "教育・研究職", value: "教育・研究職" },
    { title: "建築・土木・設備", value: "建築・土木・設備" },
    { title: "運輸・物流", value: "運輸・物流" },
    { title: "飲食・住宿", value: "飲食・住宿" },
    { title: "保安・清潔・設施管理", value: "保安・清潔・設施管理" },
    { title: "農林水產", value: "農林水產" },
    { title: "公務員", value: "公務員" },
    { title: "其他", value: "其他" },
  ],
  tags: [
    { title: "我們的推薦", value: "我們的推薦" },
    { title: "高人氣職缺", value: "高人氣職缺" },
    { title: "職缺由新到舊", value: "職缺由新到舊" },
    { title: "年薪由高到低", value: "年薪由高到低" },
  ],
};

const CustomSelect = ({ options, onChange, value }) => (
  <select onChange={onChange} value={value}>
    {options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.title}
      </option>
    ))}
  </select>
);

const CustomCheckbox = ({ option, isChecked, onClick }) => (
  <label
    className={isChecked ? "customCheckBox-active" : ""}
    onClick={() => onClick(option.value)}
  >
    <span className="custom-checkbox"></span>
    <input
      type="checkbox"
      name="sortOption"
      value={option.value}
      checked={isChecked}
      onChange={() => onClick(option.value)}
    />
    {option.title}
  </label>
);

const SearchForm = ({
  keyword,
  setKeyword,
  selectedLocation,
  setSelectedLocation,
  selectedJob,
  setSelectedJob,
  selectedSalary,
  setSelectedSalary,
  selectedGyousyu,
  setSelectedGyousyu,
  selectedSyokusyu,
  setSelectedSyokusyu,
  selectedTags,
  handleTagClick,
  handleSearch,
  handleClearAll,
}) => (
  <>
    <div className="searchup">
      <input
        type="text"
        placeholder="輸入關鍵字"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <CustomSelect
        options={SEARCH_OPTIONS.location}
        onChange={(e) => setSelectedLocation(e.target.value)}
        value={selectedLocation}
      />
      <CustomSelect
        options={SEARCH_OPTIONS.job}
        onChange={(e) => setSelectedJob(e.target.value)}
        value={selectedJob}
      />
      <CustomSelect
        options={SEARCH_OPTIONS.salary}
        onChange={(e) => setSelectedSalary(e.target.value)}
        value={selectedSalary}
      />
      <CustomSelect
        options={SEARCH_OPTIONS.gyousyu}
        onChange={(e) => setSelectedGyousyu(e.target.value)}
        value={selectedGyousyu}
      />
      <CustomSelect
        options={SEARCH_OPTIONS.syokusyu}
        onChange={(e) => setSelectedSyokusyu(e.target.value)}
        value={selectedSyokusyu}
      />
    </div>
    <div className="searchdown">
      {SEARCH_OPTIONS.tags.map((option, index) => (
        <CustomCheckbox
          key={index}
          option={option}
          isChecked={selectedTags.includes(option.value)}
          onClick={handleTagClick}
        />
      ))}
      <div className="search-btn-section">
        <button onClick={handleSearch}>立即搜尋</button>
        <button className="clear-all-btn" onClick={handleClearAll}>
          清除篩選
        </button>
      </div>
    </div>
  </>
);

const MobileSearchModal = ({
  isSearchClicked,
  setIsSearchClicked,
  searchFormProps,
}) => (
  <>
    <div
      className={`sp-job-search-bg ${
        isSearchClicked ? "search-job-bg-visible" : ""
      }`}
      onClick={() => setIsSearchClicked(false)}
    />
    <div
      className={`sp-job-search-window ${
        isSearchClicked ? "search-job-window-visible" : ""
      }`}
    >
      <span className="search-job-close-btn">
        <RxCross2 onClick={() => setIsSearchClicked(false)} />
      </span>
      <SearchForm {...searchFormProps} />
    </div>
  </>
);

const MobileSearchTrigger = ({
  isSearchClicked,
  setIsSearchClicked,
  currentYear,
}) => (
  <div className="searchbar sp-job-searchBar">
    <div className="jobsearchSearchBar sp-search-job">
      <div className="sp-job-search-filter-btn">
        <p>{currentYear}日本打工度假 職缺搜索</p>
        <button onClick={() => setIsSearchClicked(!isSearchClicked)}>
          篩選條件
          <span>
            <img src="goyoursbear-icon-w.svg" alt="goyours white icon" />
          </span>
        </button>
      </div>
    </div>
  </div>
);

export default function SearchBar({ onSearch, initialFilters }) {
  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedGyousyu, setSelectedGyousyu] = useState("");
  const [selectedSyokusyu, setSelectedSyokusyu] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const windowSize = useWindowSize();
  const isMobile = windowSize < MOBILE_BREAKPOINT;
  const currentYear = new Date().getFullYear();

  // Update state when initialFilters change (from URL)
  useEffect(() => {
    if (initialFilters) {
      setKeyword(initialFilters.keyword || "");
      setSelectedLocation(initialFilters.selectedLocation || "");
      setSelectedJob(initialFilters.selectedJob || "");
      setSelectedSalary(initialFilters.selectedSalary || "");
      setSelectedGyousyu(initialFilters.selectedGyousyu || "");
      setSelectedSyokusyu(initialFilters.selectedSyokusyu || "");
      setSelectedTags(initialFilters.selectedTags || []);
    }
  }, [initialFilters]);

  const handleTagClick = (optionValue) => {
    setSelectedTags((prevTags) => {
      if (!Array.isArray(prevTags)) return [];
      return prevTags.includes(optionValue)
        ? prevTags.filter((tag) => tag !== optionValue)
        : [...prevTags, optionValue];
    });
  };

  const handleClearAll = () => {
    setKeyword("");
    setSelectedLocation("");
    setSelectedJob("");
    setSelectedSalary("");
    setSelectedGyousyu("");
    setSelectedSyokusyu("");
    setSelectedTags([]);
    
    // Clear search by calling onSearch with empty parameters
    onSearch({
      keyword: "",
      selectedLocation: "",
      selectedJob: "",
      selectedSalary: "",
      selectedGyousyu: "",
      selectedSyokusyu: "",
      selectedTags: []
    });
  };

  const handleSearch = () => {
    onSearch({
      keyword,
      selectedLocation,
      selectedJob,
      selectedSalary,
      selectedGyousyu,
      selectedSyokusyu,
      selectedTags,
    });
    setIsSearchClicked(false);
  };

  // Handle body scroll lock for mobile modal
  useEffect(() => {
    if (isSearchClicked) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY;
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.dataset.scrollY = "";
      window.scrollTo(0, scrollY);
    }
  }, [isSearchClicked]);

  const searchFormProps = {
    keyword,
    setKeyword,
    selectedLocation,
    setSelectedLocation,
    selectedJob,
    setSelectedJob,
    selectedSalary,
    setSelectedSalary,
    selectedGyousyu,
    setSelectedGyousyu,
    selectedSyokusyu,
    setSelectedSyokusyu,
    selectedTags,
    handleTagClick,
    handleSearch,
    handleClearAll,
  };

  return (
    <>
      {isMobile && (
        <>
          <MobileSearchModal
            isSearchClicked={isSearchClicked}
            setIsSearchClicked={setIsSearchClicked}
            searchFormProps={searchFormProps}
          />
          <MobileSearchTrigger
            isSearchClicked={isSearchClicked}
            setIsSearchClicked={setIsSearchClicked}
            currentYear={currentYear}
          />
        </>
      )}
      <div className="searchbar">
        <SearchForm {...searchFormProps} />
      </div>
    </>
  );
}
