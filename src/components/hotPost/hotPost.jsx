import { useEffect, useState } from 'react';
import { client } from '../../cms/sanityClient';
import { urlFor } from '../../cms/sanityClient';
import { PortableText } from '@portabletext/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

import GoyoursBear from '../goyoursBear/goyoursBear';
import HomeBg from '../homeBg/homeBg';

import 'swiper/css';
import 'swiper/css/navigation';
import './hotPost.css';

const customComponents = {
  types: {
    image: ({ value }) => {
      if (!value.asset) return null;
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
          <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
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
    favoriteColor: ({ children, value }) => {
      console.log('favoriteColor 渲染器接收到的 value:', value);
      const color = value?.hex.hex || '#FF0000';

      if (!value || !value.hex.hex) {
        console.error('無法讀取到 hex，使用回退顏色');
        return <span>{children}</span>;
      }

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
    <>
      <div className="homeHotpostH1">
        <h1>
          <span className="yellow">Hot</span>熱門文章
          <GoyoursBear />
        </h1>
      </div>
      <div className="homebg-hot-Wave">
        <HomeBg />
      </div>
      <div className="homehotpostDiv">
        <Swiper
          spaceBetween={50}
          slidesPerView="auto"
          centeredSlides={true}
          navigation={true}
          // autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay, Navigation]}
          loop={true}
        >
          {NewsPosts.map((post, index) => (
            <SwiperSlide key={index} className="homeperhotpost">
              <a
                href={`/post/${encodeURIComponent(post.slug.current)}`}
                className="homeprehotpost"
              >
                {post.mainImage && (
                  <div className="homeHotpostImg">
                    <img src={urlFor(post.mainImage).url()} alt={post.title} />
                  </div>
                )}
                <h3>{post.title}</h3>
                <ul>
                  {post.categories.map((category, index) => (
                    <li key={index} className="category yellow">
                      #{category.title}
                    </li>
                  ))}
                </ul>
                <div className="homehotpostPreview">
                  {post.body ? (
                    <PortableText
                      value={post.body}
                      components={{
                        ...customComponents, // 展開 customComponents
                        marks: {
                          ...customComponents.marks, // 確保 customComponents.marks 被包含
                          link: ({ children }) => <>{children}</>, // 覆蓋或新增特定的渲染器
                        },
                      }}
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
      </div>
      <div className="more-school-button">
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
                <img src="/goyoursbear-icon-w.svg" />
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <a className="formoreBtntoPage" href="/goyours-post">
        看所有文章
      </a>
    </>
  );
}
