/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { urlFor } from '../../../services/sanity/client';
import { Pagination } from '../../common';
import { FaLocationDot, FaMagnifyingGlass } from 'react-icons/fa6';
import { TbThumbUpFilled } from 'react-icons/tb';
import { FaFireAlt } from 'react-icons/fa';
import './school.css';

export default function School({
  schools,
  totalSchools,
  schoolsPerPage,
  currentPage,
  onPageChange,
  isSearchTriggered, // 是否觸發搜尋
}) {
  const totalPages = Math.ceil(totalSchools / schoolsPerPage); // 計算總頁數

  return (
    <div>
      <div className="schoolPageschoolSection">
        {/* 搜尋結果顯示 */}
        {isSearchTriggered && totalSchools > 0 && (
          <div className="searchResultArea">
            <h2 className="yellow">
              <FaMagnifyingGlass />
              搜尋結果
            </h2>
            <span className="yellow searchResult">
              您所搜尋的資料符合條件共有
              <span className="searchNumber">{totalSchools}</span>筆
            </span>
          </div>
        )}

        {/* 學校列表 */}
        {schools.length > 0 ? (
          schools.map((school, index) => (
            <Link
              key={index}
              to={`/studying-in-jp-school/${school.slug.current}`}
              className="schoolCard"
            >
              <h2>
                <FaLocationDot />
                {school.city}
              </h2>
              {school.tags && (
                <div className="school-tags">
                  <span
                    className={
                      school.tags.includes('我們的推薦')
                        ? 'tag-recommend'
                        : 'tag-hidden'
                    }
                  >
                    <TbThumbUpFilled />
                    推薦學校
                  </span>
                  <span
                    className={
                      school.tags.includes('高人氣學校')
                        ? 'tag-popular'
                        : 'tag-hidden'
                    }
                  >
                    <FaFireAlt />
                    高人氣
                  </span>
                </div>
              )}
              <div className="schoollinkimg">
                <img
                  src={
                    school.mainImage?.asset
                      ? urlFor(school.mainImage.asset).url()
                      : '/placeholder.jpg'
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
            無搜尋結果ಥ∀ಥ
          </div>
        )}
      </div>

      {/* 分頁 */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
