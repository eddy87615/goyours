import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { client } from '../cms/sanityClient';

import School from '../components/school/school';
import SchoolSearch from '../components/schoolSearch/schoolSearch';
import LoadingBear from '../components/loadingBear/loadingBear';

import useWindowSize from '../hook/useWindowSize';
import './studying.css';

export default function Studying() {
  const [schools, setSchools] = useState([]);
  const [totalSchools, setTotalSchools] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

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
  });

  const [currentPage, setCurrentPage] = useState(1);
  const schoolsPerPage = windowSize <= 500 ? 12 : 24;

  // 獲取當前頁的學校數據
  const getPaginatedSchools = () => {
    const startIndex = (currentPage - 1) * schoolsPerPage;
    const endIndex = startIndex + schoolsPerPage;
    return schools.slice(startIndex, endIndex);
  };

  const { selectedTags } = filters;
  const SPECIAL_FILTERS = ['我們的推薦', '高人氣學校'];

  // 取得特殊標籤的查詢條件
  const getSpecialTagFilter = () => {
    const specialTags = selectedTags.filter((tag) =>
      SPECIAL_FILTERS.includes(tag)
    );
    if (specialTags.length > 0) {
      const tagConditions = specialTags
        .map((tag) => `"${tag}" in tags`)
        .join(' || ');
      return `&& (${tagConditions})`;
    }

    const normalTags = selectedTags.filter(
      (tag) =>
        !SPECIAL_FILTERS.includes(tag) &&
        tag !== '學費由低到高' &&
        tag !== '學校更新時間'
    );

    return normalTags.length > 0 ? `&& "${normalTags[0]}" in tags` : '';
  };

  // 排序學校數據
  const sortSchools = (schools) => {
    let sortedSchools = [...schools];

    if (selectedTags.includes('學費由低到高')) {
      sortedSchools.sort((a, b) => {
        const parseTuition = (money) => {
          if (!money) return Infinity;
          const [min] = money
            .split('~')
            .map((num) => parseInt(num.replace(/[^0-9]/g, '')));
          return isNaN(min) ? Infinity : min;
        };
        return parseTuition(a.money) - parseTuition(b.money);
      });
    } else if (selectedTags.includes('學校更新時間')) {
      sortedSchools.sort((a, b) => {
        const dateA = new Date(a.publishedAt || 0);
        const dateB = new Date(b.publishedAt || 0);
        return dateB - dateA;
      });
    }

    return sortedSchools;
  };

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

  // 獲取和處理學校數據
  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const { keyword, regions, enrollTime, purpose } = filters;

        const regionFilter =
          Object.values(regions).flat().length > 0
            ? `&& city in ${JSON.stringify(Object.values(regions).flat())}`
            : '';
        const enrollTimeFilter =
          enrollTime.length > 0
            ? `&& enrollTime match ${JSON.stringify(enrollTime)}`
            : '';
        const purposeFilter =
          purpose.length > 0
            ? `&& purpose match ${JSON.stringify(purpose)}`
            : '';
        const keywordFilter = keyword ? `&& name match "${keyword}"` : '';
        const specialTagFilter = getSpecialTagFilter();

        const query = `
          *[_type == "school" && !(_id in path("drafts.**")) 
            ${regionFilter} ${enrollTimeFilter} ${purposeFilter} ${keywordFilter} ${specialTagFilter}
          ] {
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

        const fetchedSchools = await client.fetch(query);
        const sortedSchools = sortSchools(fetchedSchools);

        setSchools(sortedSchools);
        setTotalSchools(sortedSchools.length);
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [filters]); // 移除 currentPage 依賴，因為它只影響顯示，不影響數據獲取

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

    navigate(`?${params.toString()}`);
    setFilters(newFilters);
    setCurrentPage(1);
    setIsSearchTriggered(true);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate(`?${params.toString()}`);
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="postLoading pageLoading">
        <LoadingBear />
      </div>
    );
  }

  // 獲取當前頁的學校數據
  const paginatedSchools = getPaginatedSchools();

  return (
    <>
      <div className="schoolPage">
        <SchoolSearch
          onSearchFilters={handleSearchFilters}
          initialFilters={filters}
        />
        <School
          schools={paginatedSchools}
          totalSchools={schools.length}
          schoolsPerPage={schoolsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isSearchTriggered={isSearchTriggered}
        />
      </div>
    </>
  );
}
