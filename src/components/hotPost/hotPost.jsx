import { useEffect, useState } from 'react';
import { client } from '../../cms/sanityClient';
import { urlFor } from '../../cms/sanityClient';
import { PortableText } from '@portabletext/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import GoyoursBear from '../goyoursBear/goyoursBear';
import HomeBg from '../homeBg/homeBg';

import 'swiper/css';
import 'swiper/css/navigation';
import './hotPost.css';

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
          autoplay={{ delay: 3000, disableOnInteraction: false }}
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
                        marks: {
                          link: ({ children }) => <>{children}</>, // 不渲染 <a> 標籤
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
      <a className="formoreBtntoPage" href="./post">
        看所有文章
      </a>
    </>
  );
}
