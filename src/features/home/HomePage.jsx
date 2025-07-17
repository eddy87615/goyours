import { useEffect, useState, useRef } from "react";
import { urlFor } from "../../services/sanity/client";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import { Autoplay, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import { useLoading, useSanityData, SEOHelmet, useResponsive } from "../../contexts";

import { FaLocationDot } from "react-icons/fa6";
import { LiaHandPointer } from "react-icons/lia";

import { HotPost } from "../../components/content";
import { HomeJobList } from "../../components/jobs";
import ContactUs from "../../components/contactUs/contactUs";
import ScrollDown from "../../components/scroolDown/scrollDown";
import HomeBg from "../../components/homeBg/homeBg";
import ScrollDownSide from "../../components/scroolDown/scrollDownSide";
import AnimationSection from "./components/AnimationSection";

import "swiper/css/effect-fade";
import "swiper/css";
import "swiper/css/navigation";

import "./home.css";
import "../about/about.css";

const News = () => {
  const [NewsPosts, setNewsPosts] = useState([]);
  const { windowSize } = useResponsive();
  const { withLoading } = useLoading();
  const { fetchData } = useSanityData();

  // 從 Sanity 獲取最新消息標籤的文章
  useEffect(() => {
    const fetchNewsPosts = async () => {
      await withLoading('news', async () => {
        try {
          const result = await fetchData(`
            *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...10] {
              title,
              slug,
              publishedAt,
              mainImage,
            }
          `);
          setNewsPosts(result);
        } catch (error) {
          console.error('Error fetching news:', error);
        }
      });
    };
    fetchNewsPosts();
  }, [withLoading, fetchData]);
  return (
    <>
      <div className="homeNewsH2">
        <h2 className="underLine">
          <span className="yellow">News</span>日本最新消息
        </h2>
      </div>
      <div className="homeNewsDiv sp-scollNews">
        {NewsPosts.length >= 3 && (
          <Swiper
            spaceBetween={30}
            slidesPerView={windowSize < 500 ? "1.5" : "auto"}
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
              <SwiperSlide key={index} className="homeNewsprePost">
                <a
                  href={`/goyours-post/${encodeURIComponent(
                    post.slug.current
                  )}`}
                >
                  {post.mainImage && (
                    <div className="homeNewspostImg">
                      {post.mainImage?.asset ? (
                        <img
                          src={urlFor(post.mainImage).url()}
                          alt={post.title}
                        />
                      ) : (
                        <p></p>
                      )}
                    </div>
                  )}
                  <p className="homeNews-postTitle">{post.title}</p>
                  <p className="yellow homeNews-postDate">
                    <span className="homeNewsBear">
                      <img src="/圓形logo.png" alt="goyours logo" />
                    </span>
                    {new Date(post.publishedAt)
                      .toLocaleDateString("zh-TW", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\//g, ".")}
                  </p>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

const HomeschoolList = () => {
  const [schools, setSchools] = useState([]);
  const { windowSize } = useResponsive();
  const { withLoading } = useLoading();
  const { fetchData } = useSanityData();

  useEffect(() => {
    const fetchSchools = async () => {
      await withLoading('homeSchools', async () => {
        try {
          const query = `*[_type == "homeSchool"] {
            name,
            mainImage {
              asset->,
              alt
            },
            city,
            transportation,
            character,
            description,
            slug {
              current
            }
          }`;

          const result = await fetchData(query);
          setSchools(result);
        } catch (error) {
          console.error('Error fetching home schools:', error);
        }
      });
    };

    fetchSchools();
  }, [withLoading, fetchData]);

  return (
    <div className="homeschoolWrapper">
      <div className="homeschoolH2">
        <h2 className="underLine">
          <span className="yellow">School</span>日本學校一覽
        </h2>
      </div>
      <div className="schoolListDiv">
        {schools.map((school, index) => {
          return (
            <AnimationSection key={index} className="schoolListPre">
              <div className="schoolListCover">
                <div className="schoolListBg">
                  <h3 className="homeSchool-schoolName">{school.name}</h3>
                  <p className="homeSchool-schoolLocation">
                    <FaLocationDot /> {school.city}
                  </p>
                  <img
                    src={urlFor(school.mainImage).url()}
                    alt={school.mainImage.alt || school.name}
                  />
                </div>
                <Link
                  className="schoolListDetailBtn"
                  to={`/studying-in-jp-school/${school.slug.current}`}
                >
                  {windowSize < 1200 ? "學校詳情" : "了解學校詳情"}
                </Link>
              </div>
              <div className="schoolListBack">
                <h4 className="homeSchool-back-schoolName">{school.name}</h4>
                <p className="homeSchool-back-schoolIntro">
                  {school.description}
                </p>
                <ul>
                  <li>
                    <span>特色</span>
                    {school.character}
                  </li>
                  <li>
                    <span>交通</span>
                    {school.transportation}
                  </li>
                </ul>
              </div>
              <LiaHandPointer className="schoolListPointer" />
              <Link
                className="home-schoolList-arrow"
                to={`/studying-in-jp-school/${school.slug.current}`}
              >
                <img src="/submit-arrow.svg" alt="submit button arrow" />
              </Link>
            </AnimationSection>
          );
        })}
      </div>
      <AnimationSection className="more-school-button">
        <ul>
          <li>
            <Link to="/studying-in-jp-school">
              <span className="button-wrapper">
                <span className="upperP-wrapper">
                  <p>看更多學校</p>
                </span>
                <span className="downP-wrapper">
                  <p>看更多學校</p>
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
      <a className="formoreBtntoPage" href="./studying-in-jp-school">
        看更多學校
      </a>
    </div>
  );
};

export default function Home() {
  const swiperRef = useRef(null);
  const [isAutoplayStarted, setIsAutoplayStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = typeof window !== 'undefined' ? window.location : { pathname: '', origin: '' };

  useEffect(() => {
    setMounted(true);
  }, []);

  const HomeIntroimgList = [
    { src: "/home-bubble01.jpg", alt: "japanese temple picture,日本神社照片" },
    {
      src: "/home-bubble02.JPG",
      alt: "japanese shops street in sunny day,日本晴天的商店街景",
    },
    { src: "/home-bubble03.JPG", alt: "japanese moutain view,日本翠綠山景" },
  ];

  const { windowSize } = useResponsive();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.autoplay.stop();
        swiperRef.current.swiper.autoplay.start();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial autoplay setup
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper && !isAutoplayStarted) {
      swiperRef.current.swiper.autoplay.start();
      setIsAutoplayStarted(true);
    }
  }, [swiperRef, isAutoplayStarted]);


  const homeslider = [
    {
      large: "/KV/KV_about_05-large.webp",
      medium: "/KV/KV_about_05-medium.webp",
      small: "/KV/KV_about_05-small.webp",
      src: "/KV/KV_about_05-large.webp",
    },
    {
      large: "/KV/KV_about_08-large.webp",
      medium: "/KV/KV_about_08-medium.webp",
      small: "/KV/KV_about_08-small.webp",
      src: "/KV/KV_about_08-large.webp",
    },
    {
      large: "/KV/KV_about_07-large.webp",
      medium: "/KV/KV_about_07-medium.webp",
      small: "/KV/KV_about_07-small.webp",
      src: "/KV/KV_about_07-large.webp",
    },
    {
      large: "/KV/KV_about_13-large.webp",
      medium: "/KV/KV_about_13-medium.webp",
      small: "/KV/KV_about_13-small.webp",
      src: "/KV/KV_about_13-large.webp",
    },
    {
      large: "/KV/KV_about_04-large.webp",
      medium: "/KV/KV_about_04-medium.webp",
      small: "/KV/KV_about_04-small.webp",
      src: "/KV/KV_about_04-large.webp",
    },
    {
      large: "/KV/KV_about_02-large.webp",
      medium: "/KV/KV_about_02-medium.webp",
      small: "/KV/KV_about_02-small.webp",
      src: "/KV/KV_about_02-large.webp",
    },
    {
      large: "/KV/KV_about_09-large.webp",
      medium: "/KV/KV_about_09-medium.webp",
      small: "/KV/KV_about_09-small.webp",
      src: "/KV/KV_about_09-large.webp",
    },
    {
      large: "/KV/KV_27-large.webp",
      medium: "KV/KV_27-medium.webp",
      small: "KV/KV_27-small.webp",
      src: "/KV/KV_27.webp",
    },
    {
      large: "/KV/KV_28-large.webp",
      medium: "KV/KV_28-medium.webp",
      small: "KV/KV_28-small.webp",
      src: "/KV/KV_28.webp",
    },
  ];

  return (
    <>
      <SEOHelmet
        title="Go Yours：首頁｜專業留學代辦｜高優國際留學｜幫你實現你的留學夢想！"
        description="GoYours專業代辦，關於台灣人日本留學申請，最懂你煩惱的高優國際，幫助你一步一步跟著你實現留日夢想！"
        keywords="goyours、高優國際、日本留學、日本打工度假、留學代辦、海外工作、語言學校"
        url={typeof window !== 'undefined' ? `${window.location.origin}${location.pathname}` : ''}
        image={typeof window !== 'undefined' ? `${window.location.origin}/LOGO-02-text.png` : ''}
      />
      <motion.div
        className="kv"
        style={{
          borderBottomLeftRadius: windowSize <= 480 ? "calc(300 * 1em / 16)" : undefined,
          borderBottomRightRadius: windowSize <= 480 ? "calc(300 * 1em / 16)" : undefined,
        }}
        suppressHydrationWarning
      >
        <motion.div
          className="kvSlider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {mounted ? (
            <Swiper
              ref={swiperRef}
              key="fixed-key"
              centeredSlides={true}
              loop={true}
              slidesPerView={1}
              slidesPerGroup={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              effect="fade"
              fadeEffect={{ crossFade: true }} // 啟用交叉淡入淡出
              modules={[Autoplay, EffectFade]}
              simulateTouch={false}
              allowTouchMove={false}
              observer={true}
              observeParents={true}
            >
              {homeslider.map((slide, index) => (
                <SwiperSlide key={index}>
                  <picture>
                    <source media="(min-width: 1024px)" srcSet={slide.large} />
                    <source media="(min-width: 640px)" srcSet={slide.large} />
                    <source media="(max-width: 500px)" srcSet={slide.medium} />
                    <img src={slide.src} alt={`{slider photo${index}`} />
                  </picture>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
        </motion.div>
        <img
          src="/LOGO-13.png"
          alt="GoYours LOGO"
          className="kvlogo"
          rel="preload"
          width="400"
          height="200"
        />

        <ScrollDown />
        <div className="sp-home-scrollDown">
          <ScrollDownSide />
        </div>
      </motion.div>
      <AnimationSection className="homeintroSection">
        <div className="homebg-intro-Wave">
          <HomeBg />
        </div>
        <div className="homeintrotxt">
          <h1>國外打工度假、遊留學的好夥伴</h1>
          <p>
            世界這麼大 你不該只留在原地
            <br />
            何年何月何日何時 你會在哪裡？ <br className="sp-br" />
            去你自己的打工度假、留遊學吧！ <br />
            Go Yours 團隊幫你找出適合的路
            <br className="sp-br" />
            去各個國家打工度假、留遊學
            <br />
            體驗各種生活感受世界各地 ～
          </p>
        </div>
        {HomeIntroimgList.map((img, index) => {
          return (
            <div key={index} className={`homeintroImgWrapper${index}`}>
              <div className={`homeintroImgDiv${index}`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className={`homeintroImg${index}`}
                />
              </div>
            </div>
          );
        })}
      </AnimationSection>
      <AnimationSection className="homeNewsSection">
        <News />
      </AnimationSection>
      <AnimationSection className="homeschoolList">
        <HomeschoolList windowSize={windowSize} />
        <div className="homebg-school-Wave">
          <HomeBg />
        </div>
      </AnimationSection>
      <AnimationSection className="workingholidaySection">
        <HomeJobList />
      </AnimationSection>
      <AnimationSection className="homeHotpostSection">
        <HotPost />
      </AnimationSection>
      <AnimationSection className="homeContactusSection">
        <ContactUs />
      </AnimationSection>
    </>
  );
}
