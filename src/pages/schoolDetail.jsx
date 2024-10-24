/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react'; // 用來顯示富文本
import { useParams, useNavigate } from 'react-router-dom'; // 用來獲取 URL 中的 slug
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

import Modal from 'react-modal'; // 引入 Modal 組件
Modal.setAppElement('#root');

import { urlFor, client } from '../cms/sanityClient'; // 导入 urlFor

import { FaLocationDot, FaEarthAmericas } from 'react-icons/fa6';
import { FaSchool } from 'react-icons/fa';
import { IoMdTrain } from 'react-icons/io';
import { ImCross } from 'react-icons/im';

import BreadCrumb from '../components/breadCrumb/breadCrumb';
import ContactUs from '../components/contactUs/contactUs';
import './schoolDetail.css';

const Features = ({ school }) => {
  return (
    <>
      <div>
        <h1 className="features">
          <span className="yellow">Feature</span>學校特色
        </h1>
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
      </div>
    </>
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

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      const school = await client.fetch(
        `
        *[_type == "school" && slug.current == $slug][0] {
          name,address,transportation,phone,website,description,gallery,slug,logo,officialSite,sort,character
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
      <div className="postLoading">
        <p>文章加載中⋯⋯</p>
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

  const handleSortClick = (sort) => {
    navigate('/studying', { state: { category: sort } });
  };

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
              { name: '日本留學', url: '/studying' },
              {
                name: `#${school.sort?.[0]}`,
                onClick: () => handleSortClick(school.sort?.[0]),
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
              <a href={school.officialSite} target="blank">
                {school.officialSite}
              </a>
            </li>
            <li>
              <FaSchool className="schoolDetailicon" />
              <PortableText value={school.description} />
            </li>
          </ul>
          <img src={urlFor(school.logo).url()} className="schoollogo" />
        </div>
      </div>
      <Features school={school} />
      <ContactUs />

      {/* 放大圖片的模態框 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <img src={currentImage} alt="Enlarged" className="modalImage" />
        <button onClick={closeModal} className="closeModalBtn">
          <ImCross />
        </button>
      </Modal>
    </div>
  );
}
