/* eslint-disable react/prop-types */
import { urlFor } from '../../cms/sanityClient'; // 导入 client 和 urlFor
import { useState } from 'react'; // 导入 useEffect 和 useState
import { Link } from 'react-router-dom'; // 导入 Link 用于页面跳转
import { FaLocationDot } from 'react-icons/fa6';
import Pagination from '../../components/pagination/pagination'; // 导入 Pagination 组件

import './school.css'; // 导入样式表
import { FaMagnifyingGlass } from 'react-icons/fa6';

export default function School({ schools, isSearchTriggered }) {
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const schoolsPerPage = 24; // 每页显示的学校数量
  // console.log('Rendering Filtered Schools in School Component:', schools);

  // 篩選符合 selectedCategory 的學校
  // const filteredSchools = schools.filter((school) =>
  //   selectedCategory ? school.sort.includes(selectedCategory) : true
  // );

  // 如果没有学校数据，显示提示信息
  // if (!schools.length) {
  //   return (
  //     <div className="postLoading postLoadingP">
  //       <p>沒有學校資訊ಥ∀ಥ</p>
  //     </div>
  //   );
  // }

  // 根据分页计算当前显示的学校
  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = schools.slice(indexOfFirstSchool, indexOfLastSchool);

  // 计算总页数
  const totalPages = Math.ceil(schools.length / schoolsPerPage);

  // 处理页面更改
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="schoolPageschoolSection">
        {isSearchTriggered && currentSchools.length > 0 ? (
          <div className="searchResultArea">
            <h2 className="yellow">
              <FaMagnifyingGlass />
              搜尋結果
            </h2>
            <span className="yellow searchResult">
              您所搜尋的資料符合條件共有
              <span className="searchNumber">{schools.length}</span>筆
            </span>
          </div>
        ) : (
          <></>
        )}
        {schools.length > 0 ? (
          currentSchools.map((school, index) => (
            <Link
              key={index}
              to={`/studying-in-jp-school/${school.slug.current}`}
              className="schoolCard"
            >
              <h2>
                <FaLocationDot />
                {school.city}
              </h2>
              <div className="schoollinkimg">
                <img
                  src={
                    school.mainImage?.asset
                      ? urlFor(school.mainImage.asset).url()
                      : '/placeholder.jpg' // 使用佔位圖像作為備用
                  }
                  alt={`${school.name || '學校'} image`}
                />
              </div>
              <h4>
                <span className="schoolListNameHover">{school.name}</span>
              </h4>
            </Link>
          ))
        ) : (
          <div className="postLoading postLoadingP schoolResultText">
            無搜尋結果
          </div>
        )}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
