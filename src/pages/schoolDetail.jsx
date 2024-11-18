/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react'; // 用來顯示富文本
import { useParams, useNavigate } from 'react-router-dom'; // 用來獲取 URL 中的 slug
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import Modal from 'react-modal'; // 引入 Modal 組件
Modal.setAppElement('#root');

import { urlFor, client } from '../cms/sanityClient'; // 导入 urlFor

import { FaLocationDot, FaEarthAmericas } from 'react-icons/fa6';
import { FaSchool } from 'react-icons/fa';
import { IoMdTrain } from 'react-icons/io';
import { ImCross } from 'react-icons/im';
import { TiArrowBackOutline } from 'react-icons/ti';

import BreadCrumb from '../components/breadCrumb/breadCrumb';
import ContactUs from '../components/contactUs/contactUs';
import GoyoursBearsSchoolCondition from '../components/goyoursBear/goyoursBear-schoolConditions';
import GoyoursBears from '../components/goyoursBear/goyoursBear';
import './schoolDetail.css';

const Features = ({ school }) => {
  return (
    <>
      <div className="schoolDetailInfo">
        <div className="schoolDetailH1">
          <h1 className="features">
            <span className="yellow">Feature</span>學校特色
            <GoyoursBears />
          </h1>
        </div>
        <div className="featurestxt">
          <ul>
            {school.character.map((character, index) => (
              <li key={index}>
                {/* <div>{index + 1}</div> */}
                <h2>{character.title}</h2>
                <p>{character.description}</p>
              </li>
            ))}
          </ul>
        </div>
        {school.video && (
          <div className="video">
            <div className="videoH1">
              <h1 className="features">
                <span className="yellow">Video</span>學校影片
                <GoyoursBears />
              </h1>
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
          <Link to="/studying">
            <TiArrowBackOutline />
            看更多學校
          </Link>
        </div>
      </div>
    </>
  );
};

const Conditions = ({ school }) => {
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return 'N/A'; // 確保金額有效
    return `¥${Number(amount).toLocaleString('ja-JP')}`; // 使用日本格式添加日圓符號和千位分隔
  };
  const renderTuition = (money) => {
    if (!money) return '學費資訊未提供';
    const [min, max] = money.split('~').map(Number); // 分割範圍並轉換為數字
    return `${formatCurrency(min)} ~ ${formatCurrency(max)}`;
  };

  return (
    <div className="schoolConditions">
      <div className="schoolDetailH1">
        <h1 className="features">
          <span className="yellow" lang="en">
            Conditions
          </span>
          學校性質
          <GoyoursBearsSchoolCondition />
        </h1>
      </div>
      <div className="schoolConditions-detail">
        <ul className="conditionsList">
          <li>
            <span className="conditionTitle">學校地區</span>
            {school.city}
          </li>
          <li>
            <span className="conditionTitle">學校費用</span>約
            {renderTuition(school.money)}
            （依照課程而異）
          </li>
          <li>
            <span className="conditionTitle">學習目的</span>
            {school.purpose.map((purpose, index) => (
              <span key={index}>
                {purpose}
                {index < school.purpose.length - 1 && '／'}
              </span>
            ))}
          </li>
          <li>
            <span className="conditionTitle">入學時間</span>
            {school.enrollTime.map((time, index) => (
              <span key={index}>
                {time}
                {index < school.enrollTime.length - 1 && '／'}
              </span>
            ))}
          </li>
          <li>
            <span className="conditionTitle">上課時段</span>
            {school.others.schoolTime.map((time, index) => (
              <span key={index}>
                {time}
                {index < school.others.schoolTime.length - 1 && '／'}
              </span>
            ))}
          </li>
          <li>
            <span className="conditionTitle">修業時間</span>
            {school.others.period.map((period, index) => (
              <span key={index}>
                {period}
                {index < school.others.period.length - 1 && '／'}
              </span>
            ))}
          </li>
          <li>
            <span className="conditionTitle">支援服務</span>
            {school.others.support.map((support, index) => (
              <span key={index}>
                {support}
                {index < school.others.support.length - 1 && '／'}
              </span>
            ))}
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
      setSchool(school);
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="postLoading loading">
        <p>學校資訊加載中⋯⋯</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="postLoading">
        <p>沒有文章</p>
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

  return (
    <div className="schoolDetailwrapper">
      <div className="schoolDetailPage">
        <div className="picSlider">
          <BreadCrumb
            paths={[
              { name: '日本留學', url: '/studying-in-jp' },
              {
                name: '日本語言學校',
                url: '/studying-in-jp-school',
              },
              { name: school.name },
            ]}
          />
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={true}
            thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined} // 避免 undefined 或 null 問題
            modules={[FreeMode, Navigation, Thumbs]}
            className="upperSlider"
          >
            {school.gallery.map((img, index) => {
              return (
                <SwiperSlide key={index}>
                  <img
                    src={urlFor(img.asset).url()}
                    alt={school.name}
                    onClick={() => openModal(urlFor(img.asset).url())}
                    style={{ cursor: 'pointer' }}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
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
        </div>
        <div className="schoolUnfoSection">
          <h1>{school.name}</h1>
          <ul className="schoolInfo">
            <li>
              <FaLocationDot className="schoolDetailicon" />
              {school.address}
            </li>
            <li>
              <IoMdTrain className="schoolDetailicon" />
              {school.transportation}
            </li>
            <li>
              <FaEarthAmericas className="schoolDetailicon" />
              <a href={school.officialSite} target="_blank">
                {school.officialSite}
              </a>
            </li>
            <li>
              <FaSchool className="schoolDetailicon" />
              <PortableText value={school.description} />
            </li>
          </ul>
          <img
            src={urlFor(school.logo).url()}
            alt={`${school.name} logo`}
            className="schoollogo"
          />
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
    </div>
  );
}
