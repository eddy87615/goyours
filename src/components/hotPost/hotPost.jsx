/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { client } from '../../cms/sanityClient';
import { urlFor } from '../../cms/sanityClient';
import { PortableText } from '@portabletext/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import { Autoplay, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

import GoyoursBear from '../goyoursBear/goyoursBear';
import HomeBg from '../homeBg/homeBg';
import AnimationSection from '../../pages/AnimationSection';

import 'swiper/css';
import 'swiper/css/navigation';
import './hotPost.css';

const customComponents = {
  types: {
    image: ({ value }) => {
      // 直接确认 asset 是否存在，无需过多检查
      if (!value?.asset?._ref) {
        return null;
      }

      return (
        <div className="post-image">
          <img src={urlFor(value).url()} alt={value.alt || 'Image'} />
        </div>
      );
    },
    gallery: ({ value }) => {
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
    table: ({ value }) => {
      if (
        !value?.rows ||
        !Array.isArray(value.rows) ||
        value.rows.length === 0
      ) {
        return <p>No table data available</p>;
      }

      // 提取 `cells` 以获得真正的数据
      const sanitizedRows = value.rows.map((row) => {
        if (row?.cells && Array.isArray(row.cells)) {
          return row.cells;
        }
        return []; // 如果没有 cells，返回空数组
      });

      if (sanitizedRows.length === 0) {
        return <p>Invalid table data</p>;
      }

      // 合并表头的逻辑
      const mergeTableHeaders = (headers) => {
        const mergedHeaders = [];
        let currentHeader = null;
        let spanCount = 0;

        headers.forEach((header, index) => {
          if (header === currentHeader) {
            // 如果当前 header 和前一个相同，增加 colspan
            spanCount++;
          } else {
            // 保存之前的 header
            if (currentHeader !== null) {
              mergedHeaders.push({
                content: currentHeader,
                colspan: spanCount,
              });
            }
            // 更新当前 header
            currentHeader = header;
            spanCount = 1;
          }
        });

        // 保存最后一个 header
        if (currentHeader !== null) {
          mergedHeaders.push({ content: currentHeader, colspan: spanCount });
        }

        return mergedHeaders;
      };

      const headers = sanitizedRows[0];
      const mergedHeaders = mergeTableHeaders(headers);

      return (
        <table border="1" style={{ borderCollapse: 'collapse', width: '90%' }}>
          <thead>
            <tr>
              {mergedHeaders.map((header, index) => (
                <th key={index} colSpan={header.colspan}>
                  {header.content || ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sanitizedRows.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell || ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
    span: ({ value, children }) => {
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
    link: ({ children }) => <span>{children}</span>, // 不渲染內層 <a>
  },
};

export default function Hotpost() {
  const [NewsPosts, setNewsPosts] = useState([]);

  // 從 Sanity 獲取最新消息標籤的文章
  useEffect(() => {
    async function fetchNewsPosts() {
      // 查詢 "最新消息" 標籤的文章
      //&& "最新消息" in categories[]->title
      const result = await client.fetch(`
            *[_type == "post"] | order(views desc)[0...6] {
              title,
              slug,
              publishedAt,
              mainImage,
              views,
              categories[]->{
              title,
              },
              body,
            }
          `);

      setNewsPosts(result);
    }
    fetchNewsPosts();
  }, []);

  return (
    <AnimationSection>
      <div className="homeHotpostH1">
        <h1 className="underLine">
          <span className="yellow">Hot</span>熱門文章
          {/* <GoyoursBear /> */}
        </h1>
      </div>
      <div className="homebg-hot-Wave">
        <HomeBg />
      </div>
      <div className="homehotpostDiv">
        {NewsPosts.length >= 3 && (
          <Swiper
            spaceBetween={50}
            slidesPerView="auto"
            slidesPerGroup={1}
            centeredSlides={true}
            navigation={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay, Navigation, Mousewheel]}
            loop={true}
            simulateTouch={true} // 支持觸控板模擬觸控
            touchStartPreventDefault={false} // 確保滑動事件可以正常觸發
            longSwipes={true} // 支持長滑動
            mousewheel={true} // 支持滾輪操作
          >
            {NewsPosts.map((post, index) => (
              <SwiperSlide key={index} className="homeperhotpost">
                <a
                  href={`/goyours-post/${encodeURIComponent(
                    post.slug.current
                  )}`}
                  className="homeprehotpost"
                >
                  {post.mainImage && (
                    <div className="homeHotpostImg">
                      <img
                        src={urlFor(post.mainImage).url()}
                        alt={post.title}
                      />
                    </div>
                  )}
                  <p className="homeHotPost-postTitle">{post.title}</p>
                  <ul>
                    {post.categories && post.categories.length > 0 ? (
                      post.categories.map((category, index) => (
                        <li key={index} className="category">
                          #{category.title}
                        </li>
                      ))
                    ) : (
                      <li>無分類</li>
                    )}
                  </ul>

                  <div className="homehotpostPreview">
                    {post.body ? (
                      <PortableText
                        value={post.body}
                        components={customComponents}
                      />
                    ) : (
                      <p>本文無內容</p>
                    )}
                  </div>
                  <div className="homehotpostDate">
                    <img src="/圓形logo.png" alt="goyours logo" />
                    <p>
                      {new Date(post.publishedAt)
                        .toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                        .replace(/\//g, '.')}
                    </p>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <AnimationSection className="more-school-button">
        <ul>
          <li>
            <Link to="/goyours-post">
              <span className="button-wrapper">
                <span className="upperP-wrapper">
                  <p>看所有文章</p>
                </span>
                <span className="downP-wrapper">
                  <p>看所有文章</p>
                </span>
              </span>
              <span className="more-school-icon">
                <img
                  src="/goyoursbear-icon-w.svg"
                  alt="goyours bear white icon"
                />
              </span>
            </Link>
          </li>
        </ul>
      </AnimationSection>
      <a className="formoreBtntoPage" href="/goyours-post">
        看所有文章
      </a>
    </AnimationSection>
  );
}
