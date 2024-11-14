/* eslint-disable react/prop-types */
import { urlFor } from '../../cms/sanityClient'; // 导入 client 和 urlFor
import { useState } from 'react'; // 导入 useEffect 和 useState
import { Link } from 'react-router-dom'; // 导入 Link 用于页面跳转
import { FaLocationDot } from 'react-icons/fa6';
import Pagination from '../../components/pagination/pagination'; // 导入 Pagination 组件

import './school.css'; // 导入样式表

export default function School({ selectedCategory, schools }) {
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const schoolsPerPage = 15; // 每页显示的学校数量
  console.log('Rendering Filtered Schools in School Component:', schools);

  // 篩選符合 selectedCategory 的學校
  const filteredSchools = schools.filter((school) =>
    selectedCategory ? school.sort.includes(selectedCategory) : true
  );

  // 如果没有学校数据，显示提示信息
  if (!filteredSchools.length) {
    return (
      <div className="postLoading">
        <p>沒有學校資訊ಥ∀ಥ</p>
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
            <h4>
              <span className="schoolListNameHover">{school.name}</span>
            </h4>
          </Link>
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        title="文章分類"
      />
    </div>
  );
}
