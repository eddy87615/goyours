import { client, urlFor } from '../../cms/sanityClient'; // 导入 client 和 urlFor
import { useEffect, useState } from 'react'; // 导入 useEffect 和 useState
import { Link } from 'react-router-dom'; // 导入 Link 用于页面跳转
import { FaLocationDot } from 'react-icons/fa6';
import Pagination from '../../components/pagination/pagination'; // 导入 Pagination 组件

import './school.css'; // 导入样式表

export default function School({ selectedCategory }) {
  const [schools, setSchools] = useState([]); // 存储学校数据
  const [loading, setLoading] = useState(true); // 加载状态
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const schoolsPerPage = 15; // 每页显示的学校数量

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

  // 篩選符合 selectedCategory 的學校
  const filteredSchools = schools.filter((school) =>
    selectedCategory ? school.sort.includes(selectedCategory) : true
  );

  // 加载时显示的内容
  if (loading) {
    return (
      <div className="postLoading">
        <p>學校資訊加載中⋯⋯</p>
      </div>
    );
  }

  // 如果没有学校数据，显示提示信息
  if (!filteredSchools.length) {
    return (
      <div className="postLoading">
        <p>沒有學校資訊</p>
      </div>
    );
  }

  // 根据分页计算当前显示的学校
  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = filteredSchools.slice(
    indexOfFirstSchool,
    indexOfLastSchool
  );

  // 计算总页数
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage);

  // 处理页面更改
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="schoolPageschoolSection">
        <h1 className="tagnow">
          #{selectedCategory ? ` ${selectedCategory}` : '所有學校'}
        </h1>
        {currentSchools.map((school, index) => (
          <Link
            key={index}
            to={`/school/${school.slug.current}`}
            className="schoolCard"
          >
            <h2>
              <FaLocationDot />
              {school.location}
            </h2>
            <div className="schoollinkimg">
              <img
                src={urlFor(school.mainImage.asset).url()} // 使用 urlFor 函數生成圖片 URL
                alt={`${school.name} image`}
              />
            </div>
            <h4>{school.name}</h4>
          </Link>
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
