/* eslint-disable no-irregular-whitespace */
// import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Marquee } from '../components/ui/marquee';

import './studying-in-jp.css';
import './guide-page-animation.css';

import { GoArrowRight } from 'react-icons/go';

import MorePost from '../components/morePost/morePost';
import ContactUs from '../components/contactUs/contactUs';
import ScrollDownSide from '../components/scroolDown/scrollDownSide';
import useWindowSize from '../hook/useWindowSize';

export default function StudyingInJp() {
  const windowSize = useWindowSize();
  const sliderRight = [
    { src: '/guidePage/slide009.jpg', alt: 'japanese school interior images' },
    { src: '/guidePage/slide020.png', alt: 'japanese school images' },
    { src: '/guidePage/slide019.jpg', alt: 'japanese school' },
    { src: '/guidePage/slide012.png', alt: 'japanese boy' },
    { src: '/guidePage/slide003.png', alt: 'japanese school interior images' },
    { src: '/guidePage/slide017.png', alt: 'japanese girl' },
    { src: '/guidePage/slide012.png', alt: 'japanese boy' },
    { src: '/guidePage/slide003.png', alt: 'japanese school interior images' },
    { src: '/guidePage/slide017.png', alt: 'japanese girl' },
  ];
  const sliderLeft = [
    { src: '/guidePage/slide010.jpg', alt: 'japanese boy' },
    { src: '/guidePage/slide013.png', alt: 'japanese school interior images' },
    { src: '/guidePage/slide014.jpg', alt: 'japanese school classtime images' },
    {
      src: '/guidePage/slide004.webp',
      alt: 'japanese school classtime images',
    },
    { src: '/guidePage/slide016.JPG', alt: 'japanese school public room' },
    { src: '/guidePage/slide008.jpg', alt: 'japanese school interior images' },
    { src: '/guidePage/slide010.jpg', alt: 'japanese boy' },
    {
      src: '/guidePage/slide004.webp',
      alt: 'japanese school classtime images',
    },
    { src: '/guidePage/slide008.jpg', alt: 'japanese school interior images' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="studying-in-jp-section">
        <div className="guidePage-studying-top">
          {windowSize < 1024 ? (
            <div className="scrollDown-side-studyingPage">
              <ScrollDownSide />
            </div>
          ) : (
            <></>
          )}
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
              <span className="yellow">Language School</span>
              {currentYear}日本語言學校
            </h1>
          </div>
          <p className="guide-text">
            為了補足勞動力短缺的問題
            <br />
            日本計畫釋放比往年更多的就業機會
            <br />
            如果您有想法在日本生活及工作
            <br />
            日本語言學校就是您實現夢想的捷徑！ <br />
            只要滿足學歷高中 / 職以上的條件
            <br />
            即可報名日本語言學校
            <br />
            視語言程度及專長科目來協助您的需求 <br />
            想了解有哪些日本語言學校
            <br />
            歡迎向我們索取簡章或報名說明會了解更多！
          </p>
          <div className="guide-animation-wrapper">
            <div className="guide-animation-left">
              <div className="guide-text-animation-wrapper">
                {windowSize > 1024 ? (
                  <Marquee vertical repeat={4}>
                    {Array.from({ length: 13 }).map((_, index) => (
                      <p key={index}>Go Yours ●</p>
                    ))}
                  </Marquee>
                ) : windowSize > 500 ? (
                  <Marquee repeat={4}>
                    {Array.from({ length: 13 }).map((_, index) => (
                      <p key={index}>Go Yours ●</p>
                    ))}
                  </Marquee>
                ) : (
                  <Marquee vertical repeat={4}>
                    {Array.from({ length: 13 }).map((_, index) => (
                      <p key={index}>Go Yours ●</p>
                    ))}
                  </Marquee>
                )}
              </div>
              <div className="left-picWrapper">
                <div className="guide-pic-animation-left left-1">
                  {windowSize > 1024 ? (
                    <Marquee vertical repeat={4} reverse>
                      {sliderLeft.map((img, index) => (
                        <div
                          className="guide-pic-animation-wrapper"
                          key={index}
                        >
                          <img src={img.src} alt={img.alt} />
                        </div>
                      ))}
                    </Marquee>
                  ) : windowSize > 500 ? (
                    <Marquee repeat={4} reverse>
                      {sliderLeft.map((img, index) => (
                        <div
                          className="guide-pic-animation-wrapper"
                          key={index}
                        >
                          <img src={img.src} alt={img.alt} />
                        </div>
                      ))}
                    </Marquee>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="guide-text-animation-wrapper">
                {windowSize > 1024 ? (
                  <Marquee vertical repeat={4}>
                    {Array.from({ length: 13 }).map((_, index) => (
                      <p key={index}>Go Yours ●</p>
                    ))}
                  </Marquee>
                ) : windowSize > 500 ? (
                  <Marquee repeat={4}>
                    {Array.from({ length: 13 }).map((_, index) => (
                      <p key={index}>Go Yours ●</p>
                    ))}
                  </Marquee>
                ) : (
                  <Marquee vertical repeat={4}>
                    {Array.from({ length: 13 }).map((_, index) => (
                      <p key={index}>Go Yours ●</p>
                    ))}
                  </Marquee>
                )}
              </div>
            </div>
            <div
              className="guide-animation-right"
              style={
                windowSize > 1024
                  ? {}
                  : windowSize > 500
                  ? { display: 'none' }
                  : {}
              }
            >
              <div className="guide-text-animation-wrapper">
                {windowSize > 1024 ? (
                  <Marquee vertical repeat={4}>
                    {Array.from({ length: 13 }).map((_, index) => (
                      <p key={index}>Go Yours ●</p>
                    ))}
                  </Marquee>
                ) : windowSize > 500 ? (
                  <Marquee repeat={4}>
                    {Array.from({ length: 13 }).map((_, index) => (
                      <p key={index}>Go Yours ●</p>
                    ))}
                  </Marquee>
                ) : (
                  <></>
                )}
              </div>
              <div className="right-picWrapper">
                {windowSize > 1024 ? (
                  <Marquee vertical repeat={4} reverse>
                    <div className="guide-pic-animation-right right-1">
                      {sliderRight.map((img, index) => (
                        <div
                          className="guide-pic-animation-wrapper"
                          key={index}
                        >
                          <img src={img.src} alt={img.alt} />
                        </div>
                      ))}
                    </div>
                  </Marquee>
                ) : (
                  <></>
                )}
              </div>
              <div className="guide-text-animation-wrapper">
                {windowSize > 1024 ? (
                  <Marquee vertical horizental repeat={4}>
                    {Array.from({ length: 13 }).map((_, index) => (
                      <p key={index}>Go Yours ●</p>
                    ))}
                  </Marquee>
                ) : (
                  <Marquee vertical repeat={4}>
                    {Array.from({ length: 13 }).map((_, index) => (
                      <p key={index}>Go Yours ●</p>
                    ))}
                  </Marquee>
                )}
              </div>
            </div>
          </div>

          <div className="studying-rightboy">
            <img src="/guidePage/studying-B.png" />
          </div>
          <div className="studying-leftgirl">
            <img src="/guidePage/studying-G.png" />
          </div>
        </div>
        <div className="guide-content">
          <div>
            <div className="aboutstudyingH2">
              <h2 className="yellow underLine">
                關於留學
                {/* <GoyoursBearAboutStudying /> */}
              </h2>
            </div>
            <div className="studying-page-button">
              <Link className="to-all-school" to="/studying-in-jp-school">
                <h3>
                  <span className="white-icon">
                    <img
                      src="/goyoursbear-icon-w.svg"
                      alt="goyours white icon"
                    />
                  </span>
                  查看所有學校
                </h3>
                <GoArrowRight className="button-arrow" />
              </Link>
              <Link className="to-QA-page" to="/Q&A-section#part1">
                <h3>
                  <span className="white-icon">
                    <img
                      src="/goyoursbear-icon-w.svg"
                      alt="goyours white icon"
                    />
                  </span>
                  留學Q&A
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
