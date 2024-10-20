import { useEffect, useState, useRef } from 'react';
import { client } from '../cms/sanityClient';
import { urlFor } from '../cms/sanityClient'; // 导入 urlFor
import { FaLocationDot, FaArrowRightLong } from 'react-icons/fa6';
import { LiaHandPointer } from 'react-icons/lia';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import './home.css';

const News = () => {
  const [NewsPosts, setNewsPosts] = useState([]);

  // 從 Sanity 獲取最新消息標籤的文章
  useEffect(() => {
    async function fetchNewsPosts() {
      // 查詢 "最新消息" 標籤的文章
      //&& "最新消息" in categories[]->title
      const result = await client.fetch(`
          *[_type == "post"] | order(publishedAt desc)[0...6] {
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
      <h1>
        <span className="yellow">News</span>最新消息
      </h1>
      <div className="homeNewsDiv">
        <Swiper
          spaceBetween={100}
          slidesPerView={5}
          centeredSlides={true}
          navigation={true}
          // autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay, Navigation]}
          loop={true}
        >
          {NewsPosts.map((post, index) => (
            <SwiperSlide key={index} className="homeNewsprePost">
              <a href={`/post/${encodeURIComponent(post.slug.current)}`}>
                {post.mainImage && (
                  <div className="homeNewspostImg">
                    <img src={urlFor(post.mainImage).url()} alt={post.title} />
                  </div>
                )}
                <h3>{post.title}</h3>
                <p className="yellow">
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
      </div>
    </>
  );
};

const HomeschoolList = () => {
  const schoolListContent = [
    {
      name: '東京亞細亞學友會',
      location: '東京都',
      src: '/src/assets/東京亞細亞學友會教室.jpg',
      traffic: '東武伊勢崎線蒲生駅徒歩約3分',
      highlight: '獨創高水準的先進教學模式。',
      introtxt:
        '東京亞細亞學友會，日本語教育振興協會認定校，東京入管局指定百分之3優良校，駐日本中國大使館認定自費出國留學提攜校。日本為數不多只招收來自世界各地大學以上學歷留學生的一流日本語學校。',
    },
    {
      name: '宇都宮日建工科専門学校ー日本語学科',
      location: '栃木県',
      src: '/src/assets/日建宇都宮校舎外観.jpg',
      traffic: '宇都宮站徒歩約10分鐘',
      highlight: '在學期間住宿免費・課外體驗活動',
      introtxt:
        '面向來日本學習日本語的留學生設立的日本語學科。日本語學科以外的日本學生也在同一校園內共同學習及互相交流，給留學生提供良好的學習日語的環境。僅是語言，同時還可以學習日本的文化習俗和禮儀，培養立足世界的能力。',
    },
    {
      name: '雙葉外語學校',
      location: '千葉県',
      src: '/src/assets/雙葉外語學校バス旅行.jpg',
      traffic: 'JR千葉站東口徒步10分鐘・京成千葉中央站西口徒步1分鐘',
      highlight: '細緻的升學・就職指導',
      introtxt:
        '雙葉外語學校的活動不僅僅限於語言教育，還為能夠真正建立日本與其他各國之間的交流的紐帶，不同國籍的人之間能得以真心地相互理解對方的文化，人與人直接交流提供寶貴的機會。',
    },
    {
      name: '關西外語專門學校日本語學科',
      location: '大阪府',
      src: '/src/assets/関西外語専門学校日本語學科.jpg',
      traffic: '天王寺站步行10分鐘',
      highlight: '校內奬學金：①理事長特別獎學金 ②優秀成績者獎學金 ③升學獎金',
      introtxt:
        '關西外語專門學校是1967年所創立的商業語言專門學校。日本的外語教育普遍被認為偏重文法教育，本校以培育能擁有在世界各地運用自如之高水準外語能力的人才為目標。',
    },
    {
      name: 'ARC日本語學校-京都校',
      location: '京都市',
      src: '/src/assets/ARC日本語學校-京都校.png',
      traffic: '地下鐵丸太町站直走6分鐘',
      highlight: '校外學習，與日語互動',
      introtxt:
        'ARC日本語學校是於1986年創立的語言學校，ARC有通往世界橋梁的意思。京都校創立於2003年，並於2019年４月遷移到全新校舍。校區位於京都市區丸太町站，徒步６分鐘即可抵達，交通便利。',
    },
    {
      name: '赤門會日本語言學校',
      location: '東京都',
      src: '/src/assets/赤門會日本語言學校.JPG',
      traffic: '日暮里站步行10分・西日暮里站步行11分・三河島站步行5分',
      highlight: '職務體驗・就職支援班：以實現在日就業的目的。',
      introtxt:
        '赤門會日本語學校，於1985年創校于東京大學的赤門前，成功培養了超過80個國家，2萬多名的畢業生，教學成績有目共睹。<br />在 2005 年，學校被認證為學校法人。',
    },
  ];
  return (
    <>
      <div>
        <h1>
          <span className="yellow">School</span>學校一覽
        </h1>
        <div className="schoolListDiv">
          {schoolListContent.map((school, index) => {
            return (
              <div key={index} className="schoolListPre">
                <div className="schoolListCover">
                  <div className="schoolListBg">
                    <h4>{school.name}</h4>
                    <p>
                      <FaLocationDot /> {school.location}
                    </p>
                    <img src={school.src} alt={school.name} />
                  </div>
                  <button className="schoolListDetailBtn">了解學校詳情</button>
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
              </div>
            );
          })}
        </div>
      </div>
      <a className="formoreBtntoPage" href="./studying">
        看更多學校
      </a>
    </>
  );
};

const Wokringholiday = () => {
  return (
    <>
      <div>
        <h1>
          <span className="yellow">Working Holiday</span>打工度假職缺一覽
        </h1>
        <div className="workingholidayDiv"></div>
        <a className="formoreBtntoPage" href="./working">
          看更多職缺
        </a>
      </div>
    </>
  );
};

const Contactus = () => {
  const ArcText = ({ text }) => {
    return (
      <div className="arc-text">
        <svg width="800" height="800" viewBox="0 0 800 800">
          <defs>
            <path
              id="circlePath"
              d="
                 M 160, 640
                 A 320, 320, 0, 0, 1, 480, 320" // 使用320px (20rem)作為圓弧的半徑
            />
          </defs>
          <text fill="#ff8c00" fontSize="20" fontWeight="bold">
            <textPath href="#circlePath" startOffset="52%">
              {text}
            </textPath>
          </text>
        </svg>
      </div>
    );
  };
  return (
    <>
      <div className="homeContactusDiv">
        <h2>Contact us</h2>
        <div className="contactTxt01">
          <h3>聯絡GoYours</h3>
          <p>
            無論是短期進修、語言學校，還是打工度假體驗不同人生，
            <br />
            背上背包，跟我們一起冒險，留下無悔的足跡！
          </p>
        </div>
        <div className="contactTxt01">
          <h3>打工度假、留學免費諮詢</h3>
          <p>
            透過表單預約與我們一對一諮詢。
            <br />
            也歡迎Line或FB聯繫，GoYours將是您打工度假、留學的最佳夥伴！
          </p>
        </div>
        <a
          className="homecontactusBtn"
          href="./contact"
          alt="to Contact Us page"
        >
          <ArcText text="填寫表單，我們將聯絡您！" />
          <FaArrowRightLong className="homecontactusArrow" />
        </a>
      </div>
    </>
  );
};

export default function Home() {
  const HomeIntroimgList = [
    { src: '/src/assets/KV_fujisan06.jpg', alt: '' },
    { src: '/src/assets/KV_fujisan05.jpg', alt: '' },
    { src: '/src/assets/KV_fujisan04.jpg', alt: '' },
  ];

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

  return (
    <>
      <div className="kv">
        <div className="kvSlider">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            // modules={[Autoplay]}
          >
            <SwiperSlide>
              <img src="/src/assets/KV_fujisan03.jpg" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/src/assets/KV_fujisan04.jpg" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/src/assets/KV_fujisan05.jpg" />
            </SwiperSlide>
          </Swiper>
        </div>
        <img src="/src/assets/LOGO-09.png" alt="LOGO-09" className="kvlogo" />
        <div className="scrollDownArrow">
          <div className="scrollText">Scroll</div>
          <div className="arrowLine"></div>
          <div className="arrowDot"></div>
        </div>
      </div>
      <div className="homrintroSection">
        <p className="homeintrotxt">
          <span>國外打工度假、遊留學的好夥伴</span>
          <br />
          世界這麼大 你不該只留在原地 何年何月何日何時 你會在哪裡？ <br />
          去你自己的打工度假、留遊學吧！ <br />
          Go Yours 團隊幫你找出適合的路 去各個國家打工度假、留遊學 體驗各種生活
          感受世界各地 ～
        </p>
        {HomeIntroimgList.map((img, index) => {
          return (
            <div className={`homeintroImgDiv${index}`} key={index}>
              <img
                src={img.src}
                alt={img.alt}
                className={`homeintroImg${index}`}
              />
            </div>
          );
        })}
      </div>
      <div className="homeNewsSection">
        <News />
      </div>
      <div className="homeschoolList">
        <HomeschoolList />
      </div>
      <div className="workingholidaySection">
        <Wokringholiday />
      </div>
      <div className="homeContactusSection">
        <Contactus />
      </div>
    </>
  );
}
