/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react"; // 用來顯示富文本
import { useParams } from "react-router-dom"; // 用來獲取 URL 中的 slug
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Link } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import Modal from "react-modal"; // 引入 Modal 組件
Modal.setAppElement("#root");

import { urlFor, client } from "../../services/sanity/client"; // 导入 urlFor

import { FaLocationDot, FaEarthAmericas } from "react-icons/fa6";
import { FaSchool } from "react-icons/fa";
import { FaTrainSubway } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { TiArrowBackOutline } from "react-icons/ti";

import { BreadCrumb, LoadingBear } from "../../components/common";
import ContactUs from "../../components/contactUs/contactUs";
import "./schoolDetail.css";

const cache = new Map();
const CACHE_LIFETIME = 5 * 60 * 1000;

// 儲存快取時加入時間戳記
function setCache(key, data) {
  const expiryTime = Date.now() + CACHE_LIFETIME;
  cache.set(key, { data, expiryTime });
}

// 取得快取時檢查是否過期
function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expiryTime) {
    // 如果過期，從快取中移除
    cache.delete(key);
    return null;
  }

  return cached.data;
}

const Features = ({ school }) => {
  return (
    <>
      <div className="schoolDetailInfo">
        <div className="schoolDetailH2">
          <h2 className="features underLine">
            <span className="yellow">Feature</span>學校特色
          </h2>
        </div>
        <div className="featurestxt">
          <ul>
            {school.character && school.character.length > 0 ? (
              school.character.map((character, index) => (
                <li key={index}>
                  {/* <div>{index + 1}</div> */}
                  <h3>{character.title}</h3>
                  <p>{character.description}</p>
                </li>
              ))
            ) : (
              <li className="noInfo-warn">學校特色資訊未提供ಥ∀ಥ</li>
            )}
          </ul>
        </div>
        {school.video && (
          <div className="video">
            <div className="videoH2">
              <h2 className="features underLine">
                <span className="yellow">Video</span>學校影片
              </h2>
            </div>
            <div className="videoItself">
              <iframe
                width="800"
                height="500"
                src={school.video}
                title="學校介紹影片"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <img
              src="/goyoursBear-bg-schooldetail.svg"
              alt="background pics"
              className="videoBg"
            />
          </div>
        )}
        <div className="backToschoolList">
          {/* <Link to="/studying-in-jp-school">
            <TiArrowBackOutline />
            看更多學校
          </Link> */}
          <div className="more-school-button">
            <ul>
              <li>
                <Link to="/studying-in-jp-school">
                  <span className="button-wrapper">
                    <span className="upperP-wrapper">
                      <p>
                        <TiArrowBackOutline />
                        看更多學校
                      </p>
                    </span>
                    <span className="downP-wrapper">
                      <p>
                        <TiArrowBackOutline />
                        看更多學校
                      </p>
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const Conditions = ({ school }) => {
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "N/A"; // 確保金額有效
    return `¥${Number(amount).toLocaleString("ja-JP")}`; // 使用日本格式添加日圓符號和千位分隔
  };
  const renderTuition = (money) => {
    if (!money) return "學費資訊未提供ಥ_ಥ";
    const moneyStr = String(money);
    if (moneyStr.includes("~")) {
      const [min, max] = moneyStr.split("~").map(Number);
      return `${formatCurrency(min)} ~ ${formatCurrency(max)}`;
    } else {
      const amount = Number(money);
      if (isNaN(amount)) return "學費資訊格式錯誤";
      return formatCurrency(amount);
    }
  };

  return (
    <div className="schoolConditions">
      <div className="schoolDetailH2">
        <h2 className="features underLine">
          <span className="yellow" lang="en">
            Conditions
          </span>
          學校性質
        </h2>
      </div>
      <div className="schoolConditions-detail">
        <ul className="conditionsList">
          <li>
            <span className="conditionTitle">學校地區</span>
            {school.city || "地區資訊未提供ಥ_ಥ"}
          </li>
          <li>
            <span className="conditionTitle">學校費用</span>
            {school.money ? (
              <>約 {renderTuition(school.money)} （依照課程而異）</>
            ) : (
              <span className="noInfo-warn">學校費用資訊未提供ಥ∀ಥ</span>
            )}
          </li>

          <li>
            <span className="conditionTitle">學習目的</span>
            <div className="condition-wrapper">
              {school.purpose ? (
                school.purpose.map((purpose, index) => (
                  <span key={index}>
                    {purpose}
                    {index < school.purpose.length - 1 && "／"}
                  </span>
                ))
              ) : (
                <span className="noInfo-warn">學習目的資訊未提供ಥ∀ಥ</span>
              )}
            </div>
          </li>
          <li>
            <span className="conditionTitle">入學時間</span>
            <div className="condition-wrapper">
              {school.enrollTime ? (
                school.enrollTime.map((time, index) => (
                  <span key={index}>
                    {time}
                    {index < school.enrollTime.length - 1 && "／"}
                  </span>
                ))
              ) : (
                <span className="noInfo-warn">入學時間資訊未提供ಥ∀ಥ</span>
              )}
            </div>
          </li>
          <li>
            <span className="conditionTitle">上課時段</span>
            {school.others?.schoolTime?.length > 0 ? (
              school.others.schoolTime.map((time, index) => (
                <span key={index}>
                  {time}
                  {index < school.others.schoolTime.length - 1 && "／"}
                </span>
              ))
            ) : (
              <span className="noInfo-warn">上課時段資訊未提供ಥ∀ಥ</span>
            )}
          </li>
          <li>
            <span className="conditionTitle">修業時間</span>
            <div className="condition-wrapper">
              {school.others?.period?.length > 0 ? (
                school.others.period.map((period, index) => (
                  <span key={index}>
                    {period}
                    {index < school.others.period.length - 1 && "／"}
                  </span>
                ))
              ) : (
                <span className="noInfo-warn">修業時間資訊未提供ಥ∀ಥ</span>
              )}
            </div>
          </li>
          <li>
            <span className="conditionTitle">支援服務</span>
            <div className="condition-wrapper">
              {school.others?.support?.length > 0 ? (
                school.others.support.map((support, index) => (
                  <span key={index}>
                    {support}
                    {index < school.others.support.length - 1 && "／"}
                  </span>
                ))
              ) : (
                <span className="noInfo-warn">支援服務資訊未提供ಥ∀ಥ</span>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

// 文章詳情頁
export default function SchoolDetail() {
  const { slug } = useParams(); // 從 URL 獲取文章 slug
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      const cacheKey = `school-${slug}`;

      const cachedSchool = getCache(cacheKey);

      if (cachedSchool) {
        setSchool(cachedSchool);
        setLoading(false);
        return;
      }

      const school = await client.fetch(
        `
        *[_type == "school" && slug.current == $slug][0] {
          mainImage,
          logo,
          name,
          slug,
          address,
          city,
          transportation,
          phone,
          enrollTime,
          purpose,
          others {
            schoolTime,
            period,
            support
          },
          support,
          officialSite,
          video,
          description,
          character,
          gallery,
          money,
        }
      `,
        { slug }
      );
      if (school) {
        setCache(cacheKey, school);
        setSchool(school);
      }
      // setSchool(school);
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="postLoading pageLoading">
        <LoadingBear />
      </div>
    );
  }

  if (!school) {
    return (
      <div>
        <p className="postLoading nopost-warning">
          沒有學校
          <span className="nopost">
            <img src="/goyoursbear-B.svg" alt="goyours bear gray" />
          </span>
        </p>
      </div>
    );
  }

  // const handleSortClick = (sort) => {
  //   navigate('/studying-in-jp', { state: { category: sort } });
  // };

  const openModal = (image) => {
    setCurrentImage(image);
    setIsModalOpen(true); // 打開模態框
  };

  const closeModal = () => {
    setIsModalOpen(false); // 關閉模態框
  };

  const currentURL = `${window.location.origin}${location.pathname}`;
  const imageURL = `${window.location.origin}/LOGO-02-text.png`;

  return (
    <HelmetProvider className="schoolDetailwrapper">
      <Helmet>
        <title>Go Yours語言學校介紹：{school.name}</title>
        <meta name="description" content={`Go Yours介紹給你：${school.name}`} />
        <meta
          name="keywords"
          content="日本留學、留學申請、語言學校、大學申請、獎學金"
        />
        <link rel="canonical" href={currentURL} />

        <meta property="og:site_name" content="Go Yours：高優國際" />
        <meta
          property="og:title"
          content={`Go Yours語言學校介紹：${school.name}`}
        />
        <meta
          property="og:description"
          content={`Go Yours介紹給你：${school.name}`}
        />
        <meta property="og:url" content={currentURL} />
        <meta property="og:image" content={imageURL} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:image:secure_url"
          content="https://www.goyours.tw/open_graph.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Go Yours Logo" />
        <meta
          name="twitter:title"
          content={`Go Yours語言學校介紹：${school.name}`}
        />
        <meta
          name="twitter:description"
          content={`Go Yours介紹給你：${school.name}`}
        />
        <meta name="twitter:image" content={imageURL} />
      </Helmet>
      <div className="schoolDetailPage">
        <div
          className="picSlider"
          style={{
            width:
              school.gallery && school.gallery.length > 0 ? "50%" : "unset",
          }}
        >
          <BreadCrumb
            paths={[
              { name: "日本留學", url: "/studying-in-jp" },
              {
                name: "日本語言學校",
                url: "/studying-in-jp-school",
              },
              { name: school.name },
            ]}
          />
          <Swiper
            loop={school.gallery && school.gallery.length > 0}
            spaceBetween={10}
            navigation={true}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }} // 修改這裡
            modules={[FreeMode, Navigation, Thumbs]}
            className="upperSlider"
            style={{
              display:
                school.gallery && school.gallery.length > 0 ? "block" : "none",
            }}
          >
            {school.gallery && school.gallery.length > 0 ? (
              school.gallery.map((img, index) => {
                return (
                  <SwiperSlide key={index}>
                    <img
                      src={urlFor(img.asset).url()}
                      alt={school.name}
                      onClick={() => openModal(urlFor(img.asset).url())}
                      style={{ cursor: "pointer" }}
                    />
                  </SwiperSlide>
                );
              })
            ) : (
              <SwiperSlide>
                <div className="no-photo-note noImg-notice">未提供照片 ಥ_ಥ</div>
              </SwiperSlide>
            )}
          </Swiper>
          {school.gallery && school.gallery.length > 0 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              loop={true}
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="downSlider"
            >
              {school.gallery.map((img, index) => {
                return (
                  <SwiperSlide key={index}>
                    <img
                      src={urlFor(img.asset).url()}
                      alt={school.name}
                      className="sliderPicnav"
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
        <div className="schoolUnfoSection">
          <h1>{school.name}</h1>
          <ul className="schoolInfo">
            <li>
              <FaLocationDot className="schoolDetailicon" />
              {school.address || "地址資訊未提供ಥ_ಥ"}
            </li>
            <li>
              <FaTrainSubway className="schoolDetailicon" />
              {school.transportation || "交通資訊未提供"}
            </li>
            {school.officialSite && (
              <li>
                <FaEarthAmericas className="schoolDetailicon" />
                <a href={school.officialSite} target="_blank">
                  學校官方網站
                </a>
              </li>
            )}
            {school.description && (
              <li>
                <FaSchool className="schoolDetailicon" />
                <PortableText value={school.description} />
              </li>
            )}
          </ul>
          {school.logo && (
            <img
              src={urlFor(school.logo).url()}
              alt={`${school.name} logo`}
              className="schoollogo"
            />
          )}
        </div>
      </div>
      <Conditions school={school} />
      <Features school={school} />
      <div className="schooldetailContactus">
        <ContactUs />
      </div>

      {/* 放大圖片的模態框 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <div className="modalimgWrapper">
          <img src={currentImage} alt="Enlarged pics" className="modalImage" />
        </div>
        <button onClick={closeModal} className="closeModalBtn">
          <ImCross />
        </button>
      </Modal>
    </HelmetProvider>
  );
}
