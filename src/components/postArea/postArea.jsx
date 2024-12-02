/* eslint-disable react/prop-types */
import { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../../cms/sanityClient'; // 导入 urlFor
import { Link } from 'react-router-dom';
import Pagination from '../pagination/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css'; // 引入核心樣式
import 'swiper/css/navigation'; // 引入導航按鈕樣式

import './postArea.css'; // 导入样式表

// import { BiShow, BiCalendar, BiEditAlt, BiPurchaseTag } from 'react-icons/bi';

// PostArea 組件：渲染傳入的文章數據
// eslint-disable-next-line react/prop-types
export default function PostArea({ posts, handleCategoryClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 10;

  // 分頁邏輯
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const customComponents = {
    types: {
      image: ({ value }) => {
        // 直接确认 asset 是否存在，无需过多检查
        if (!value?.asset?._ref) {
          console.warn('未找到图片资源，跳过渲染:', value);
          return null;
        }

        return (
          <div className="post-image">
            <img src={urlFor(value).url()} alt={value.alt || 'Image'} />
          </div>
        );
      },
      gallery: ({ value }) => {
        console.log('Gallery Images:', value.images); // 確認圖片數據是否正確
        if (!value.images || value.images.length === 0) return null;
        return (
          <div className="gallery">
            <Swiper
              navigation={true}
              modules={[Navigation]}
              loop
              className="mySwiper"
            >
              {value.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={urlFor(image).url()}
                    alt={`Gallery Image ${index + 1}`}
                    className="gallery-image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );
      },

      span: ({ value, children }) => {
        console.log('覆蓋默認 span 處理:', value);
        return <span>{children}</span>;
      },
    },
    marks: {
      color: ({ children, value }) => {
        const color = value?.hex?.hex || '#FF0000';

        return (
          <span
            style={{
              color,
            }}
          >
            {children}
          </span>
        );
      },
      favoriteColor: ({ children, value }) => {
        const color = value?.hex?.hex || '#FF0000';

        return (
          <span
            style={{
              color,
            }}
          >
            {children}
          </span>
        );
      },
    },
  };

  return (
    <div className="postRight">
      {currentPosts.map((post, index) => (
        <div key={index} className="postarea">
          {post.mainImage && (
            <Link to={`/goyours-post/${post.slug.current}`} className="imgLink">
              <img src={urlFor(post.mainImage).url()} alt={post.title} />
            </Link>
          )}
          <div className="postListInfo">
            <h2>
              <Link to={`/goyours-post/${post.slug.current}`}>
                {post.title}
              </Link>{' '}
            </h2>
            <ul className="info">
              {post.categories && post.categories.length > 0 ? (
                <>
                  {/* <BiPurchaseTag className="icon" /> */}
                  {post.categories.map((category, index) => (
                    <li key={index} className="category">
                      <a onClick={() => handleCategoryClick(category.title)}>
                        #{category.title}
                      </a>
                    </li>
                  ))}
                </>
              ) : (
                <li className="category">無分類</li>
              )}
            </ul>
            <p className="date">
              <span>
                <img src="/圓形logo.png" alt="goyours logo" />
              </span>
              {new Date(post.publishedAt)
                .toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\//g, '.')}
            </p>
            <div className="textPart">
              <PortableText value={post.body} components={customComponents} />
            </div>
            {/* <Link to={`/post/${post.slug.current}`}>Read More</Link>{' '} */}
          </div>
        </div>
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
