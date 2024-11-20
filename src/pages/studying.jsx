import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
import { client } from '../cms/sanityClient';
import School from '../components/school/school'; // 导入 School 组件
import './studying.css';
// import PostCategary from '../components/postCategory/postCategory';
import SchoolSearch from '../components/schoolSearch/schoolSearch';

export default function Studying() {
  // const location = useLocation(); // 获取路由传递的状态
  // const initialCategory = location.state?.selectedCategory || null; // 获取传递的分类
  // const [selectedCategory, setSelectedCategory] = useState(initialCategory); // 将 initialCategory 设置为初始值

  // const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState([]); // 存储学校数据
  const [loading, setLoading] = useState(true); // 加载状态
  const [filteredSchools, setFilteredSchools] = useState([]); // 篩選後的學校數據
  const [isSearchTriggered, setIsSearchTriggered] = useState(false); // 搜尋是否觸發

  // const handleCategoryClick = (category) => {
  //   window.scrollTo({ top: 0, behavior: 'smooth' }); // 返回到頁面的最頂端
  //   setSelectedCategory(category);
  // };

  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  // };

  // const categories = [
  //   { label: '所有學校', value: null },
  //   { label: '關東地區：東京', value: '關東地區：東京' },
  //   { label: '關東地區：其他', value: '關東地區：其他' },
  //   { label: '關西地區', value: '關西地區' },
  //   { label: '北海道・東北地區', value: '北海道・東北地區' },
  //   { label: '九州・沖繩地區', value: '九州・沖繩地區' },
  //   { label: '中部地區', value: '中部地區' },
  //   { label: '私塾教育', value: '私塾教育' },
  // ];

  // 使用 useEffect 來處理異步數據加載
  useEffect(() => {
    async function fetchSchools() {
      try {
        const result = await client.fetch(`
          *[_type == "school" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
            mainImage,
            name,
            slug,
            city,
            enrollTime,
            purpose,
            others,
            money,
            publishedAt,
            tags,
          }
        `);
        // 保證所有字段數據的格式一致
        const processedResult = result.map((school) => ({
          ...school,
          tags: Array.isArray(school.tags) ? school.tags : [],
          enrollTime: Array.isArray(school.enrollTime) ? school.enrollTime : [],
          purpose: Array.isArray(school.purpose) ? school.purpose : [],
          others: school.others || {},
        }));
        setSchools(processedResult);
        setFilteredSchools(processedResult);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch schools:', error);
        setLoading(false);
      }
    }

    fetchSchools();
  }, []);

  // const filteredSchools = schools.filter((school) => {
  //   const matchesCategory = selectedCategory
  //     ? Array.isArray(school.sort) &&
  //       school.sort.some((category) => category === selectedCategory)
  //     : true;

  //   const matchesSearchQuery = searchQuery
  //     ? school.name.toLowerCase().includes(searchQuery.toLowerCase())
  //     : true;

  //   return matchesCategory && matchesSearchQuery;
  // });

  // console.log('Filtered Schools:', filteredSchools); // 確認篩選結果

  // 监听 location.state 的变化
  // useEffect(() => {
  //   if (location.state?.category) {
  //     setSelectedCategory(location.state.category); // 如果有新的分类传入，更新 selectedCategory
  //   }
  // }, [location.state]);

  const handleSearchFilters = (filters = {}) => {
    const {
      keyword = '',
      regions = {},
      enrollTime = [],
      purpose = [],
      others = {},
      selectedTags = [],
    } = filters;

    console.log('Received Filters:', filters);

    const processedSchools = schools.map((school) => ({
      ...school,
      others: Object.fromEntries(
        Object.entries(school.others || {}).map(([key, values]) => [
          key,
          Array.isArray(values)
            ? values.map((value) => value.trim().toLowerCase())
            : [],
        ])
      ),
    }));

    const keyMapping = {
      修業期間: 'period',
      上課時段: 'schoolTime',
      支援服務: 'support',
    };

    // 清理篩選條件
    const formattedPurpose = purpose.map((item) => item.trim().toLowerCase());
    // 修正 others 條件的鍵
    const formattedOthers = Object.fromEntries(
      Object.entries(others).map(([key, values]) => [
        keyMapping[key] || key, // 使用映射表轉換鍵
        values,
      ])
    );

    console.log('Processed Schools:', processedSchools); // 確認學校資料的清理結果
    console.log('Formatted Purpose:', formattedPurpose); // 確認學習目的的清理結果
    console.log('Formatted Others:', formattedOthers); // 確認其他條件的清理結果

    const tagFilters = ['我們的推薦', '高人氣學校'];
    const sortOptions = ['學校更新時間', '學費由高到低'];

    // 獲取選中的標籤和排序條件
    const activeTags = selectedTags.filter((tag) => tagFilters.includes(tag));
    const activeSort = selectedTags.find((tag) => sortOptions.includes(tag));

    const selectedCities = Object.values(regions).flat();

    // 濾除不符合條件的學校
    let filtered = processedSchools.filter((school) => {
      console.log('檢查學校資料:', school.purpose, school.others);

      const matchesKeyword = keyword
        ? school.name?.toLowerCase().includes(keyword.toLowerCase())
        : true;

      const matchesRegion = selectedCities.length
        ? selectedCities.includes(school.city)
        : true;

      const matchesEnrollTime = enrollTime.length
        ? enrollTime.some((time) => school.enrollTime?.includes(time))
        : true;

      const matchesPurpose = formattedPurpose.length
        ? formattedPurpose.some((p) =>
            school.purpose?.some((item) => item.trim().toLowerCase() === p)
          )
        : true;

      const matchesOthers = Object.entries(formattedOthers).every(
        ([key, values]) =>
          values.length
            ? (school.others?.[key] || []).some((item) => values.includes(item))
            : true
      );

      const matchesTags =
        activeTags.length > 0
          ? activeTags.some((tag) => school.tags?.includes(tag))
          : true;

      console.log('matchesKeyword:', matchesKeyword);
      console.log('matchesRegion:', matchesRegion);
      console.log('matchesEnrollTime:', matchesEnrollTime);
      console.log('matchesPurpose:', matchesPurpose);
      console.log('matchesOthers:', matchesOthers);

      return (
        matchesKeyword &&
        matchesRegion &&
        matchesEnrollTime &&
        matchesPurpose &&
        matchesOthers &&
        matchesTags
      );
    });

    // 排序邏輯
    if (activeSort === '學校更新時間') {
      filtered = filtered.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );
    } else if (activeSort === '學費由高到低') {
      filtered = filtered.sort((a, b) => {
        const [minA] = (a.money || '').split('~').map(Number); // 取得最小值
        const [minB] = (b.money || '').split('~').map(Number);
        return minA - minB; // 由低到高
      });
    }

    console.log('Filtered Schools:', filtered); // 調試篩選結果
    setFilteredSchools(filtered);
    setIsSearchTriggered(true);
  };

  if (loading) {
    return (
      <div className="postLoading loading">
        <p>學校加載中⋯⋯</p>
      </div>
    );
  }

  return (
    <>
      <div className="schoolPage">
        <SchoolSearch onSearchFilters={handleSearchFilters} schools={schools} />
        {/* <PostCategary
          categories={categories}
          handleCategoryClick={handleCategoryClick}
          handleSearch={handleSearch}
          placeholder="搜尋學校⋯"
          title="學校分類"
        /> */}
        {/* {filteredSchools.length === 0 ? (
          <div className="postLoading post-empty">
            <p>這個標籤裡沒有學校ಥ∀ಥ</p>
          </div>
        ) : ( */}
        <School
          schools={filteredSchools}
          isSearchTriggered={isSearchTriggered}
        />
        {/* )} */}
      </div>
    </>
  );
}
