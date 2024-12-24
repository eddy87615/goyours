/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { client } from '../cms/sanityClient';
import { urlFor } from '../cms/sanityClient'; // 导入 urlFor
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

import { FaLocationDot } from 'react-icons/fa6';
import { LiaHandPointer } from 'react-icons/lia';

import ContactUs from '../components/contactUs/contactUs';
import Hotpost from '../components/hotPost/hotPost';
import HomeJobList from '../components/homeJobList/homeJobList';
import ScrollDown from '../components/scroolDown/scrollDown';
import GoyoursBear from '../components/goyoursBear/goyoursBear';
import HomeBg from '../components/homeBg/homeBg';
import ScrollDownSide from '../components/scroolDown/scrollDownSide';
import AnimationSection from './AnimationSection';
import useWindowSize from '../hook/useWindowSize';

import 'swiper/css/effect-fade';
import 'swiper/css';
import 'swiper/css/navigation';

import './home.css';
import './about-us.css';

const News = () => {
  const [NewsPosts, setNewsPosts] = useState([]);

  // 從 Sanity 獲取最新消息標籤的文章
  useEffect(() => {
    async function fetchNewsPosts() {
      // 查詢 "最新消息" 標籤的文章
      //&& "最新消息" in categories[]->title
      const result = await client.fetch(`
          *[_type == "post"] | order(publishedAt desc)[0...10] {
            title,
            slug,
            publishedAt,
            mainImage,
          }
        `);

      setNewsPosts(result);
    }
    fetchNewsPosts();
  }, []);
  return (
    <>
      <div className="homeNewsH1">
        <h1>
          <span className="yellow">News</span>最新消息
          <GoyoursBear />
        </h1>
      </div>
      <div className="homeNewsDiv">
        {NewsPosts.length >= 3 && (
          <Swiper
            spaceBetween={50}
            slidesPerView={4}
            slidesPerGroup={1}
            centeredSlides={true}
            navigation={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay, Navigation]}
            loop={true}
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
                      <img
                        src={urlFor(post.mainImage).url()}
                        alt={post.title}
                      />
                    </div>
                  )}
                  <h3>{post.title}</h3>
                  <p className="yellow">
                    <span className="homeNewsBear">
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
  const schoolListContent = [
    {
      name: '東京亞細亞學友會',
      location: '東京都',
      src: '/東京亞細亞學友會教室.jpg',
      traffic: '東武伊勢崎線蒲生駅徒歩約3分',
      highlight: '獨創高水準的先進教學模式。',
      href: '/studying-in-jp-school/tokyoasia',
      introtxt:
        '東京亞細亞學友會是日本語教育振興協會認定校，東京入管局指定百分之3優良校，駐日本中國大使館認定自費出國留學提攜校。日本為數不多只招收來自世界各地大學以上學歷留學生的一流日本語學校。',
    },
    {
      name: '宇都宮日建工科専門学校ー日本語学科',
      location: '栃木県',
      src: '/日建宇都宮校舎外観.jpg',
      traffic: '宇都宮站徒歩約10分鐘',
      highlight: '在學期間住宿免費',
      href: '/studying-in-jp-school/utsunimiyanikken',
      introtxt:
        '面向來日本學習日本語的留學生設立的日本語學科。日本語學科以外的日本學生也在同一校園內共同學習及互相交流，給留學生提供良好的學習日語的環境。僅是語言，同時還可以學習日本的文化習俗和禮儀，培養立足世界的能力。',
    },
    {
      name: '雙葉外語學校',
      location: '千葉県',
      src: '/雙葉外語學校校舍.png',
      traffic: '千葉站徒步10分鐘・京成千葉中央站徒步1分鐘',
      highlight: '細緻的升學・就職指導',
      href: '/studying-in-jp-school/utsunimiyanikken',
      introtxt:
        '雙葉外語學校的活動不僅僅限於語言教育，還為能夠真正建立日本與其他各國之間的交流的紐帶，不同國籍的人之間能得以真心地相互理解對方的文化，人與人直接交流提供寶貴的機會。',
    },
    {
      name: '關西外語專門學校日本語學科',
      location: '大阪府',
      src: '/関西外語専門学校日本語學科.jpg',
      traffic: '天王寺站步行10分鐘',
      highlight: '校內奬學金：①理事長特別獎學金 ②優秀成績者獎學金 ③升學獎金',
      href: '/studying-in-jp-school/utsunimiyanikken',
      introtxt:
        '關西外語專門學校是1967年所創立的商業語言專門學校。日本的外語教育普遍被認為偏重文法教育，本校以培育能擁有在世界各地運用自如之高水準外語能力的人才為目標。',
    },
    {
      name: 'ARC日本語學校-京都校',
      location: '京都市',
      src: '/ARC日本語學校-京都校.webp',
      traffic: '地下鐵丸太町站直走6分鐘',
      highlight: '校外學習，與日語互動',
      href: '/studying-in-jp-school/utsunimiyanikken',
      introtxt:
        'ARC有通往世界橋梁的意思，京都校創立於2003年，並於2019年４月遷移到全新校舍。校區位於京都市區丸太町站，徒步６分鐘即可抵達，交通便利。',
    },
    {
      name: '赤門會日本語言學校',
      location: '東京都',
      src: '/赤門會日本語言學校.jpg',
      traffic: '日暮里站步行10分・西日暮里站步行11分・三河島站步行5分',
      highlight: '職務體驗・就職支援班',
      href: '/studying-in-jp-school/akamonkai',
      introtxt:
        '赤門會日本語學校，於1985年創校于東京大學的赤門前，成功培養了超過80個國家，2萬多名的畢業生，教學成績有目共睹。<br />在 2005 年，學校被認證為學校法人。',
    },
  ];

  const windowSize = useWindowSize();

  return (
    <div className="homeschoolWrapper">
      <div className="homeschoolH1">
        <h1>
          <span className="yellow">School</span>學校一覽
          <GoyoursBear />
        </h1>
      </div>
      <div className="schoolListDiv">
        {schoolListContent.map((school, index) => {
          return (
            <AnimationSection key={index} className="schoolListPre">
              <div className="schoolListCover">
                <div className="schoolListBg">
                  <h4>{school.name}</h4>
                  <p>
                    <FaLocationDot /> {school.location}
                  </p>
                  <img src={school.src} alt={school.name} />
                </div>
                <Link className="schoolListDetailBtn" to={school.href}>
                  {windowSize < 1200 ? '學校詳情' : '了解學校詳情'}
                </Link>
              </div>
              <div className="schoolListBack">
                <h3>{school.name}</h3>
                <p dangerouslySetInnerHTML={{ __html: school.introtxt }}></p>
                <ul>
                  <li>
                    <span>特色</span>
                    {school.highlight}
                  </li>
                  <li>
                    <span>交通</span>
                    {school.traffic}
                  </li>
                </ul>
              </div>
              <LiaHandPointer className="schoolListPointer" />
              <Link className="home-schoolList-arrow" to={school.href}>
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
  const HomeIntroimgList = [
    { src: '/home-bubble01.jpg', alt: 'maple leaves' },
    { src: '/home-bubble02.JPG', alt: 'japanese temple and couple' },
    { src: '/home-bubble03.JPG', alt: 'japanese jinjya' },
  ];

  const windowSize = useWindowSize();

  //nav height get
  // eslint-disable-next-line no-unused-vars
  const [navHeight, setNavHeight] = useState(0);
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (nav) {
      setNavHeight(nav.offsetHeight);
    }
  }, []);
  //nav height get

  const homeslider = [
    {
      large: '/KV/KV_about_05-large.webp',
      medium: '/KV/KV_about_05-medium.webp',
      small: '/KV/KV_about_05-small.webp',
      src: '/KV/KV_about_05-large.webp',
    },
    {
      large: '/KV/KV_about_08-large.webp',
      medium: '/KV/KV_about_08-medium.webp',
      small: '/KV/KV_about_08-small.webp',
      src: '/KV/KV_about_08-large.webp',
    },
    {
      large: '/KV/KV_about_07-large.webp',
      medium: '/KV/KV_about_07-medium.webp',
      small: '/KV/KV_about_07-small.webp',
      src: '/KV/KV_about_07-large.webp',
    },
    {
      large: '/KV/KV_about_13-large.webp',
      medium: '/KV/KV_about_13-medium.webp',
      small: '/KV/KV_about_13-small.webp',
      src: '/KV/KV_about_13-large.webp',
    },
    {
      large: '/KV/KV_about_04-large.webp',
      medium: '/KV/KV_about_04-medium.webp',
      small: '/KV/KV_about_04-small.webp',
      src: '/KV/KV_about_04-large.webp',
    },
    {
      large: '/KV/KV_about_02-large.webp',
      medium: '/KV/KV_about_02-medium.webp',
      small: '/KV/KV_about_02-small.webp',
      src: '/KV/KV_about_02-large.webp',
    },
    {
      large: '/KV/KV_about_09-large.webp',
      medium: '/KV/KV_about_09-medium.webp',
      small: '/KV/KV_about_09-small.webp',
      src: '/KV/KV_about_09-large.webp',
    },
    {
      large: '/KV/KV_27-large.webp',
      medium: 'KV/KV_27-medium.webp',
      small: 'KV/KV_27-small.webp',
      src: '/KV/KV_27.webp',
    },
    {
      large: '/KV/KV_28-large.webp',
      medium: 'KV/KV_28-medium.webp',
      small: 'KV/KV_28-small.webp',
      src: '/KV/KV_28.webp',
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Go Yours：去你的打工度假</title>
        <meta
          name="description"
          content="讓Go Yours完成你的打工度假與留學的夢想"
        />
      </Helmet>
      <motion.div
        className="kv"
        style={
          windowSize <= 480 && {
            borderBottomLeftRadius: 'calc(300 * 1em / 16)',
            borderBottomRightRadius: 'calc(300 * 1em / 16)',
          }
        }
      >
        <motion.div
          className="kvSlider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          <Swiper
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 2000 }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            modules={[Autoplay, EffectFade]}
            simulateTouch={false} // 禁用滑鼠模拟触控
            allowTouchMove={false} // 禁用滑鼠拖动
            slidesPerView={1}
            slidesPerGroup={1}
          >
            {homeslider.map((slide, index) => (
              <SwiperSlide key={index}>
                {/* <img
                  src={slide.src}
                  srcSet={`${slide.large} 1024w, ${slide.medium} 640w, ${slide.small} 320w`}
                  sizes="(max-width: 768px) 600px, (max-width: 1200px) 1200px, 2000px"
                  alt={`{slider photo${index}`}
                /> */}
                <picture>
                  <source media="(min-width: 1024px)" srcSet={slide.large} />
                  <source media="(min-width: 640px)" srcSet={slide.medium} />
                  <source media="(max-width: 500px)" srcSet={slide.medium} />
                  <img src={slide.src} alt={`{slider photo${index}`} />
                </picture>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
        <img
          src="/LOGO-09.webp"
          alt="goyours logo"
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
          <h2>國外打工度假、遊留學的好夥伴</h2>
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
        <Hotpost />
      </AnimationSection>
      <AnimationSection className="homeContactusSection">
        <ContactUs />
      </AnimationSection>
    </HelmetProvider>
  );
}
