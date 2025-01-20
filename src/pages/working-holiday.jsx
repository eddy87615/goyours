/* eslint-disable no-irregular-whitespace */
// import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './working-holiday.css';
import './guide-page-animation.css';

import { GoArrowRight } from 'react-icons/go';

import MorePost from '../components/morePost/morePost';
import ContactUs from '../components/contactUs/contactUs';
import ScrollDownSide from '../components/scroolDown/scrollDownSide';

export default function StudyingInJp() {
  const sliderRight = [
    { src: '/guidePage/slide009.jpg', alt: 'japanese school interior images' },
    { src: '/guidePage/slide020.png', alt: 'japanese school images' },
    { src: '/guidePage/slide019.jpg', alt: 'japanese school' },
    { src: '/guidePage/slide012.png', alt: 'japanese boy' },
    { src: '/guidePage/slide003.png', alt: 'japanese school interior images' },
    { src: '/guidePage/slide017.png', alt: 'japanese girl' },
  ];
  const sliderLeft = [
    { src: '/guidePage/slide013.png', alt: 'japanese school interior images' },
    { src: '/guidePage/slide014.jpg', alt: 'japanese school classtime images' },
    { src: '/guidePage/slide016.JPG', alt: 'japanese school public room' },
    { src: '/guidePage/slide008.jpg', alt: 'japanese school interior images' },
    { src: '/guidePage/slide010.jpg', alt: 'japanese boy' },
    {
      src: '/guidePage/slide004.webp',
      alt: 'japanese school classtime images',
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="working-holiday-section">
        <div className="guidePage-working-holiday-top">
          <div className="scrollDown-side-workingPage">
            <ScrollDownSide />
          </div>
          <div className="guide-title">
            <h1>
              <span className="goyoursbear">
                <svg
                  version="1.1"
                  id="_レイヤー_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 340.2 338"
                >
                  <path
                    className="goyoursbear-line"
                    d="M36.6,337.5c0,0-13.5-150.2,68.7-211.6c0,0-5.4-16.2-40.1-28c0,0-12.5-5.6-15.7-16.7c0,0-1.1-14.6,0.7-16.9
	c0,0,0.9-1.8,3-2.1c0,0,39.1-7.4,41.8-8.1c0,0,2.5-1.2,3.3-3.3c0,0-0.5-9.9,1.9-11.8c0,0,1.4-1.4,2.3-1.9c0,0,27.8-8.8,48.3-12.7
	h1.8c0,0,3.7-17.8,22.7-10.1c0,0,11.1,5.6,5.8,20.3c0,0,0.2,2.5,0,4.8c0,0,46.4,29.8,51.6,84.9c0,0,79.4,32.1,70.9,213.5"
                  />
                </svg>
              </span>
              <span className="yellow">Working Holiday</span>
              {currentYear}日本打工度假
            </h1>
          </div>
          <p className="guide-text">
            日本是離台灣最近且有打工度假簽證的國家
            <br />
            2019年開放名額至10000人，使得機會更大
            <br />
            這一次，你可以有一年的時間
            <br />
            不再是走馬看花，而是深度旅遊、了解日本文化
            <br />
            即便日文還不熟練，只要敢開口就有機會！
            <br />
            感受他們的認真與細心
            <br />
            在天氣正好、陽光正好、年紀正好的時候走吧！
            <br />
            想知道更多詳情，歡迎填表諮詢
            <br />
            我們將會協助您在日本的生活大小事！
          </p>
          <div className="guide-vertical-slide-left">
            {sliderLeft.map((img, index) => (
              <div className="guideImgFrame-left" key={index}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>

          <div className="silde-text-wrapper-right01">
            {Array.from({ length: 13 }).map((_, index) => (
              <p key={index}>Go Yours ●　</p>
            ))}
          </div>

          <div className="silde-text-wrapper-right01 right02">
            {Array.from({ length: 13 }).map((_, index) => (
              <p key={index}>Go Yours ●　</p>
            ))}
          </div>
          <div className="guide-vertical-slide-right">
            {sliderRight.map((img, index) => (
              <div className="guideImgFrame-right" key={index}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
          <div className="silde-text-wrapper-left01">
            {Array.from({ length: 13 }).map((_, index) => (
              <p key={index}>Go Yours ●　</p>
            ))}
          </div>
          <div className="silde-text-wrapper-left01 left02">
            {Array.from({ length: 13 }).map((_, index) => (
              <p key={index}>Go Yours ●　</p>
            ))}
          </div>
        </div>
        <div className="guide-content">
          <div>
            <div className="aboutworkingH2">
              <h2 className="yellow underLine">
                關於打工度假
                {/* <GoyoursBearRelatedPost /> */}
              </h2>
            </div>
            <div className="working-page-button">
              <Link className="to-all-job" to="/working-holiday-job">
                <h3>
                  <span className="white-icon">
                    <img
                      src="/goyoursbear-icon-w.svg"
                      alt="goyours white icon"
                    />
                  </span>
                  查看所有職缺
                </h3>
                <GoArrowRight className="button-arrow" />
              </Link>
              <Link className="to-QA-page" to="/Q&A-section#part2">
                <h3>
                  <span className="white-icon">
                    <img
                      src="/goyoursbear-icon-w.svg"
                      alt="goyours white icon"
                    />
                  </span>
                  打工度假Q&A
                </h3>
                <GoArrowRight className="button-arrow" />
              </Link>
            </div>
            <div className="guide-morePost">
              <MorePost />
            </div>
            <div className="guide-page-contact-wrapper">
              <ContactUs />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
