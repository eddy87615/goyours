import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { client } from '../cms/sanityClient';

import School from '../components/school/school';
import SchoolSearch from '../components/schoolSearch/schoolSearch';
import LoadingBear from '../components/loadingBear/loadingBear';

import useWindowSize from '../hook/useWindowSize';
import './studying.css';

export default function Studying() {
  const [schools, setSchools] = useState([]); // 當前頁學校數據
  const [totalSchools, setTotalSchools] = useState(0); // 符合條件的總學校數
  const [loading, setLoading] = useState(true); // 加載狀態
  const [isSearchTriggered, setIsSearchTriggered] = useState(false); // 是否觸發搜尋

  const windowSize = useWindowSize();

  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: '',
    regions: {},
    enrollTime: [],
    purpose: [],
    others: {},
    selectedTags: [],
  }); // 搜尋條件
  const [currentPage, setCurrentPage] = useState(1); // 當前頁碼
  const schoolsPerPage = windowSize <= 500 ? 12 : 24; // 每頁顯示學校數

  // 特殊篩選標籤
  const SPECIAL_FILTERS = ['我們的推薦', '高人氣學校'];

  // 初始化篩選條件
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setFilters({
      keyword: params.get('keyword') || '',
      regions: params.get('regions') ? JSON.parse(params.get('regions')) : {},
      enrollTime: params.get('enrollTime')
        ? JSON.parse(params.get('enrollTime'))
        : [],
      purpose: params.get('purpose') ? JSON.parse(params.get('purpose')) : [],
      others: params.get('others') ? JSON.parse(params.get('others')) : {},
      selectedTags: params.get('tags') ? JSON.parse(params.get('tags')) : [],
    });
    setCurrentPage(Number(params.get('page')) || 1);
  }, [location.search]);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      const start = (currentPage - 1) * schoolsPerPage;
      const end = start + schoolsPerPage;

      const { keyword, regions, enrollTime, purpose, selectedTags } = filters;

      // 基本篩選條件
      const regionFilter =
        Object.values(regions).flat().length > 0
          ? `&& city in ${JSON.stringify(Object.values(regions).flat())}`
          : '';
      const enrollTimeFilter =
        enrollTime.length > 0
          ? `&& enrollTime match ${JSON.stringify(enrollTime)}`
          : '';
      const purposeFilter =
        purpose.length > 0 ? `&& purpose match ${JSON.stringify(purpose)}` : '';
      const keywordFilter = keyword ? `&& name match "${keyword}"` : '';

      // 特殊標籤篩選條件
      let specialTagFilter = '';
      const specialTags = selectedTags.filter((tag) =>
        SPECIAL_FILTERS.includes(tag)
      );

      if (specialTags.length > 0) {
        // 如果選擇了特殊標籤，創建一個 OR 條件
        const tagConditions = specialTags
          .map((tag) => `"${tag}" in tags`)
          .join(' || ');
        specialTagFilter = `&& (${tagConditions})`;
      } else {
        // 處理非特殊標籤
        const normalTags = selectedTags.filter(
          (tag) => !SPECIAL_FILTERS.includes(tag)
        );
        if (normalTags.length > 0) {
          specialTagFilter = `&& "${normalTags[0]}" in tags`;
        }
      }

      const query = `
        *[_type == "school" && !(_id in path("drafts.**")) 
          ${regionFilter} ${enrollTimeFilter} ${purposeFilter} ${keywordFilter} ${specialTagFilter}
        ] | order(name desc) [${start}...${end}] {
          mainImage,
          name,
          slug,
          city,
          enrollTime,
          purpose,
          others,
          money,
          publishedAt,
          tags
        }
      `;

      const totalQuery = `
        count(*[_type == "school" && !(_id in path("drafts.**")) 
          ${regionFilter} ${enrollTimeFilter} ${purposeFilter} ${keywordFilter} ${specialTagFilter}
        ])
      `;

      try {
        const [fetchedSchools, total] = await Promise.all([
          client.fetch(query),
          client.fetch(totalQuery),
        ]);
        setSchools(fetchedSchools);
        setTotalSchools(total);
      } catch (error) {
        console.error('Failed to fetch schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [currentPage, filters]);

  const handleSearchFilters = (newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.keyword) params.set('keyword', newFilters.keyword);
    if (Object.values(newFilters.regions).flat().length)
      params.set('regions', JSON.stringify(newFilters.regions));
    if (newFilters.enrollTime.length)
      params.set('enrollTime', JSON.stringify(newFilters.enrollTime));
    if (newFilters.purpose.length)
      params.set('purpose', JSON.stringify(newFilters.purpose));
    if (Object.keys(newFilters.others).length)
      params.set('others', JSON.stringify(newFilters.others));
    if (newFilters.selectedTags.length)
      params.set('tags', JSON.stringify(newFilters.selectedTags));
    params.set('page', '1');

    navigate(`?${params.toString()}`); // 更新 URL
    setFilters(newFilters); // 更新篩選條件
    setCurrentPage(1); // 重置頁碼
    setIsSearchTriggered(true);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    // navigate(`?${params.toString()}`);
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="postLoading pageLoading">
        <LoadingBear />
      </div>
    );
  }

  return (
    <>
      <div className="schoolPage">
        <SchoolSearch
          onSearchFilters={handleSearchFilters}
          initialFilters={filters}
        />
        <School
          schools={schools}
          totalSchools={totalSchools}
          schoolsPerPage={schoolsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isSearchTriggered={isSearchTriggered}
        />
      </div>
    </>
  );
}
