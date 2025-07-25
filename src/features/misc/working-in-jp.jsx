// import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import "./working-in-jp.css";
import "./guide-page-animation.css";

import { GoArrowRight } from "react-icons/go";

import { MorePost } from "../../components/content";
import ContactUs from "../../components/contactUs/contactUs";
import ScrollDownSide from "../../components/scroolDown/scrollDownSide";
import useWindowSize from "../../hooks/useWindowSize";

export default function WorkingInJp() {
  const windowSize = useWindowSize();

  const sliderLeft = [
    { src: "/guidePage/slide009.jpg", alt: "japanese school interior images" },
    { src: "/guidePage/slide020.png", alt: "japanese school images" },
    { src: "/guidePage/slide019.jpg", alt: "japanese school" },
    { src: "/guidePage/slide012.png", alt: "japanese boy" },
    { src: "/guidePage/slide029.jpg", alt: "japanese answers the direction" },
    { src: "/guidePage/slide027.jpg", alt: "japanese meeting" },
    { src: "/guidePage/slide025.jpg", alt: "japanese businessman working" },
    { src: "/guidePage/slide023.jpg", alt: "japanese businessman working" },
    { src: "/guidePage/slide021.jpg", alt: "japanese businessman walking" },
  ];
  const sliderRight = [
    { src: "/guidePage/slide012.png", alt: "japanese boy" },
    { src: "/guidePage/slide003.png", alt: "japanese school interior images" },
    { src: "/guidePage/slide017.png", alt: "japanese girl" },
    { src: "/guidePage/slide030.jpg", alt: "building picture" },
    { src: "/guidePage/slide028.jpg", alt: "japanese girl say hi" },
    { src: "/guidePage/slide026.jpg", alt: "japanese girls" },
    { src: "/guidePage/slide024.jpg", alt: "japanese calligrapher" },
    { src: "/guidePage/slide022.jpg", alt: "japanese boy" },

    {
      src: "/guidePage/slide004.webp",
      alt: "japanese school classtime images",
    },
  ];

  const currentYear = new Date().getFullYear();
  const currentURL = `${window.location.origin}${location.pathname}`;
  const imageURL = `${window.location.origin}/LOGO-02-text.png`;

  return (
    <>
      <Helmet>
        <title>
          Go
          Yours：日本打工度假工作推薦｜日本打工度假簽證申請步驟｜高優幫你實現日本打工度假的夢想！
        </title>
        <meta
          name="keywords"
          content="日本打工度假、打工度假簽證、工作機會、生活指南、申請流程"
        />
        <meta
          name="description"
          content="高優所有的日本打工度假工作推薦，讓我們幫你找到最適合你的工作，一步一步帶著你到去你的日本打工度假！"
        />
        <link rel="canonical" href={currentURL} />

        <meta property="og:site_name" content="Go Yours：高優國際" />
        <meta
          property="og:title"
          content="Go Yours：日本打工度假工作推薦｜日本打工度假簽證申請步驟｜高優幫你實現日本打工度假的夢想！"
        />
        <meta
          property="og:description"
          content="高優所有的日本打工度假工作推薦，讓我們幫你找到最適合你的工作，一步一步帶著你到去你的日本打工度假！"
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
          content="Go Yours：日本打工度假工作推薦｜日本打工度假簽證申請步驟｜高優幫你實現日本打工度假的夢想！"
        />
        <meta
          name="twitter:description"
          content="高優所有的日本打工度假工作推薦，讓我們幫你找到最適合你的工作，一步一步帶著你到去你的日本打工度假！"
        />
        <meta name="twitter:image" content={imageURL} />
      </Helmet>
      <div className="working-holiday-section">
        <div className="guidePage-working-holiday-top">
          {windowSize < 1024 ? (
            <div className="scrollDown-side-workingPage">
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
              <span className="yellow">Career in Japan</span>
              {/* {currentYear}日本就職 */}
              あなたの未来は、日本で始まる。
            </h1>
          </div>
          <p className="guide-text">
            GOYOURS 高優國際攜手日本在地企業，
            <br />
            安排正式面談、協助取得就職簽證。
            <br />
            日本正面臨人力短缺，正是外國人才前進的最佳時機
            <br />
            超過500間日企正社員、1800間飯店職缺持續招募中。
            <br />
            面談安排 × 簽證支援 × 海外內定
            <br />
            GOYOURS × 日本就職，一起找到未來的方向。
          </p>
          <Link to="/contact-us" className="careerTopBtn">
            聯絡我們
          </Link>
          <div className="guide-animation-wrapper">
            <div className="guide-animation-left">
              <div className="guide-text-animation-wrapper">
                {Array.from({ length: 13 }).map((_, index) => (
                  <p key={index}>Go Yours ●</p>
                ))}
              </div>
              <div className="left-picWrapper">
                <div className="guide-pic-animation-left left-1">
                  {sliderLeft.map((img, index) => (
                    <div className="guide-pic-animation-wrapper" key={index}>
                      <img src={img.src} alt={img.alt} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="guide-text-animation-wrapper">
                {Array.from({ length: 13 }).map((_, index) => (
                  <p key={index}>Go Yours ●</p>
                ))}
              </div>
            </div>
            <div
              className="guide-animation-right"
              style={
                windowSize > 1024
                  ? {}
                  : windowSize > 500
                  ? { display: "none" }
                  : {}
              }
            >
              <div className="guide-text-animation-wrapper">
                {Array.from({ length: 13 }).map((_, index) => (
                  <p key={index}>Go Yours ●</p>
                ))}
              </div>
              <div className="right-picWrapper">
                <div className="guide-pic-animation-right right-1">
                  {sliderRight.map((img, index) => (
                    <div className="guide-pic-animation-wrapper" key={index}>
                      <img src={img.src} alt={img.alt} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="guide-text-animation-wrapper">
                {Array.from({ length: 13 }).map((_, index) => (
                  <p key={index}>Go Yours ●</p>
                ))}
              </div>
            </div>
          </div>
          <div className="working-rightgirl">
            <img src="/guidePage/working-G.png" />
          </div>
          <div className="working-leftboy">
            <img src="/guidePage/working-B.png" />
          </div>
        </div>
        <div className="guide-content">
          <div>
            <div className="aboutworkingH2">
              <h2 className="yellow underLine">
                關於日本就職
                {/* <GoyoursBearRelatedPost /> */}
              </h2>
            </div>
            <div className="working-page-button">
              <Link className="to-all-official-job" to="/jp-jobs">
                <h3>
                  <span className="white-icon">
                    <img
                      src="/goyoursbear-icon-w.svg"
                      alt="goyours white icon"
                    />
                  </span>
                  查看正職職缺
                </h3>
                <GoArrowRight className="button-arrow" />
              </Link>
              <Link className="to-official-job-QA-page" to="/Q&A-section#part1">
                <h3>
                  <span className="white-icon">
                    <img
                      src="/goyoursbear-icon-w.svg"
                      alt="goyours white icon"
                    />
                  </span>
                  日本就職Q&A
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
