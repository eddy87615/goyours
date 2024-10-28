/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { client } from '../cms/sanityClient';
import School from '../components/school/school'; // 导入 School 组件
import './studying.css';
import PostCategary from '../components/postCategory/postCategory';

export default function Studying() {
  const location = useLocation(); // 获取路由传递的状态
  const initialCategory = location.state?.selectedCategory || null; // 获取传递的分类
  const [selectedCategory, setSelectedCategory] = useState(initialCategory); // 将 initialCategory 设置为初始值

  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState([]); // 存储学校数据
  const [loading, setLoading] = useState(true); // 加载状态

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const categories = [
    { label: '所有學校', value: null },
    { label: '關東地區：東京', value: '關東地區：東京' },
    { label: '關東地區：其他', value: '關東地區：其他' },
    { label: '關西地區', value: '關西地區' },
    { label: '北海道・東北地區', value: '北海道・東北地區' },
    { label: '九州・沖繩地區', value: '九州・沖繩地區' },
    { label: '中部地區', value: '中部地區' },
    { label: '私塾教育', value: '私塾教育' },
  ];

  // 使用 useEffect 來處理異步數據加載
  useEffect(() => {
    async function fetchSchools() {
      try {
        const result = await client.fetch(`
          *[_type == "school"] | order(publishedAt desc) {
            name,
            address,
            transportation,
            phone,
            website,
            description,
            slideshow,
            mainImage,
            location,
            slug,
            sort
          }
        `);
        setSchools(result); // 将返回的数据存储在状态中
        setLoading(false); // 加载完成
      } catch (error) {
        console.error('Failed to fetch schools:', error);
        setLoading(false); // 即使加载失败也要关闭加载状态
      }
    }

    fetchSchools(); // 调用异步函数
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  const filteredSchools = schools.filter((school) => {
    const matchesCategory = selectedCategory
      ? Array.isArray(school.sort) &&
        school.sort.some((category) => category === selectedCategory)
      : true;

    const matchesSearchQuery = searchQuery
      ? school.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // console.log(
    //   `Checking school: ${school.name}, sort: ${school.sort}, selectedCategory: ${selectedCategory}, matchesCategory: ${matchesCategory}`
    // );

    return matchesCategory && matchesSearchQuery;
  });

  // 监听 location.state 的变化
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category); // 如果有新的分类传入，更新 selectedCategory
    }
  }, [location.state]);

  return (
    <div className="schoolPage">
      <PostCategary
        categories={categories}
        handleCategoryClick={handleCategoryClick}
        handleSearch={handleSearch}
      />
      {filteredSchools.length === 0 ? (
        <div className="postLoading">
          <p>這個標籤裡沒有學校ಥ∀ಥ</p>
        </div>
      ) : (
        <School
          schools={filteredSchools}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}
