/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { client } from '../../cms/sanityClient';
import { urlFor } from '../../cms/sanityClient';
import { PortableText } from '@portabletext/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import { Autoplay, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

import HomeBg from '../homeBg/homeBg';
import AnimationSection from '../../pages/AnimationSection';
import useWindowSize from '../../hook/useWindowSize';

import 'swiper/css';
import 'swiper/css/navigation';
import './hotPost.css';

const customComponents = {
  types: {},
  block: {
    normal: ({ children }) => <p>{children}</p>, // 普通文本渲染為 <p>
    h1: ({ children }) => <p>{children}</p>, // 將 h1 渲染為 <p>
    h2: ({ children }) => <p>{children}</p>, // 將 h2 渲染為 <p>
    h3: ({ children }) => <p>{children}</p>, // 將 h3 渲染為 <p>
    h4: ({ children }) => <p>{children}</p>, // 同理處理其他標題
    h5: ({ children }) => <p>{children}</p>,
    h6: ({ children }) => <p>{children}</p>,
  },
  marks: {
    link: ({ children }) => <p>{children}</p>, // 避免渲染內層 <a>
  },
  // 默認對於未定義的類型不進行渲染
  default: () => null,
};

export default function Hotpost() {
  const [NewsPosts, setNewsPosts] = useState([]);
  const windowSize = useWindowSize();

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
              body[0...3],
            }
          `);

      setNewsPosts(result);
    }
    fetchNewsPosts();
  }, []);

  return (
    <AnimationSection>
      <div className="homeHotpostH2">
        <h2 className="underLine">
          <span className="yellow">Hot</span>熱門文章
          {/* <GoyoursBear /> */}
        </h2>
      </div>
      <div className="homebg-hot-Wave">
        <HomeBg />
      </div>
      <div className="homehotpostDiv">
        {NewsPosts.length >= 3 && (
          <Swiper
            spaceBetween={30}
            slidesPerView="auto"
            slidesPerGroup={1}
            centeredSlides={true}
            freeMode={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Autoplay, Mousewheel]}
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
                  <h3 className="homeHotPost-postTitle">{post.title}</h3>
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
