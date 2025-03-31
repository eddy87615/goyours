import { useEffect, useRef, useState } from 'react';

import { client } from '../cms/sanityClient';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';

import ContactUs from '../components/contactUs/contactUs';
import ScrollDownSide from '../components/scroolDown/scrollDownSide';
import AnimationSection from '../pages/AnimationSection';

import './about-us.css';

function getRandomSixFeedbacks(feedbacks) {
  const shuffled = [...feedbacks].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 6);
}

const ProgressBar = () => {
  const [animated, setAnimated] = useState([false, false, false, false]); // 用于跟踪每个进度条的动画状态
  const progressRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = progressRefs.current.indexOf(entry.target);
          if (entry.isIntersecting && !animated[index]) {
            const progressBar = entry.target.querySelector('.progress-bar');
            const progressNumber =
              entry.target.querySelector('.progress-number');
            const targetValue = parseInt(
              progressBar.getAttribute('data-target')
            );

            progressBar.style.width = `${targetValue}%`;

            let currentValue = 0;
            const increment = Math.ceil(targetValue / 100);
            const interval = setInterval(() => {
              currentValue += increment;
              if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(interval);

                if (targetValue === 100) {
                  progressNumber.classList.add('completed');
                }
              }
              progressNumber.innerText = `${currentValue}%`;
            }, 20);

            setAnimated((prev) => {
              const newAnimated = [...prev];
              newAnimated[index] = true;
              return newAnimated;
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    progressRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => {
      observer.disconnect();
    };
  }, [animated]);

  return (
    <div className="progress-section">
      {[
        { label: '想改變生活的渴望超過...', target: 87 },
        { label: '想換工作的執著超過...', target: 87 },
        { label: '出國體驗人生的期待超過...', target: 87 },
        { label: '那我們能給你的協助就是', target: 100 },
      ].map((item, index) => (
        <div
          className="progress-item"
          key={index}
          ref={(el) => (progressRefs.current[index] = el)}
        >
          <div className="progress-txt">
            <p>{item.label}</p>
            <p className="progress-number">0%</p>
          </div>
          <div className="progress-bar-area">
            <div className="progress-bar-container">
              <div className="progress-bar" data-target={item.target}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function About() {
  const [feedbacks, setFeedBacks] = useState([]);
  useEffect(() => {
    async function fetchfeedback() {
      const feedbackData = await client.fetch(
        `*[_type == 'feedBack']{
      name,
      feedback,
      }`
      );
      const randomFeedBacks = getRandomSixFeedbacks(feedbackData);
      setFeedBacks(randomFeedBacks);
    }
    fetchfeedback();
  }, []);

  const topImg = [
    { src: '/aboutRandom/about_01.jpg' },
    { src: '/aboutRandom/about_02.jpg' },
    { src: '/aboutRandom/about_03.jpg' },
    { src: '/aboutRandom/about_04.jpg' },
    { src: '/aboutRandom/about_05.jpg' },
    { src: '/aboutRandom/about_06.jpg' },
    { src: '/aboutRandom/about_07.jpg' },
    { src: '/aboutRandom/about_08.jpg' },
    { src: '/aboutRandom/about_14.jpeg' },
    { src: '/aboutRandom/about_13.jpg' },
  ];

  const services = [
    { label: '1對1諮詢', icon: '/service-icon_consult.svg' },
    { label: '行前說明會', icon: '/service-icon_teaching.svg' },
    { label: '中日翻譯', icon: '/service-icon_translate.svg' },
    { label: '方案推薦', icon: '/service-icon_recommend.svg' },
    { label: '簽證申請協助', icon: '/service-icon_visa.svg' },
    { label: '資料下載', icon: '/service-icon_download.svg' },
  ];

  const { ref, inView } = useInView({
    triggerOnce: true, // 進入視窗後只觸發一次
    threshold: 1, // 元素出現在視窗 10% 時觸發
  });

  const currentURL = `${window.location.origin}${location.pathname}`;
  const imageURL = `${window.location.origin}/LOGO-02-text.png`;

  return (
    <>
      <Helmet>
        <title>
          Go Yours：關於高優｜高優國際專業顧問團隊｜幫你實現你的留學夢想！
        </title>
        <meta
          name="keywords"
          content="高優國際留學、公司介紹、服務項目、專業團隊、聯絡資訊"
        />
        <meta
          name="description"
          content="關於高優國際留學公司背景，高優國際服務範圍的介紹。高優國際專業顧問團隊有許多的成功案例，幫所有想要去日本發展的朋友們實現夢想。"
        />
        <link rel="canonical" href={currentURL} />

        <meta property="og:site_name" content="Go Yours：高優國際" />
        <meta
          property="og:title"
          content="Go Yours：關於高優｜高優國際專業顧問團隊｜幫你實現你的留學夢想！"
        />
        <meta
          property="og:description"
          content="關於高優國際留學公司背景，高優國際服務範圍的介紹。高優國際專業顧問團隊有許多的成功案例，幫所有想要去日本發展的朋友們實現夢想。"
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
          content="Go Yours：關於高優｜高優國際專業顧問團隊｜幫你實現你的留學夢想！"
        />
        <meta
          name="twitter:description"
          content="關於高優國際留學公司背景，高優國際服務範圍的介紹。高優國際專業顧問團隊有許多的成功案例，幫所有想要去日本發展的朋友們實現夢想。"
        />
        <meta name="twitter:image" content={imageURL} />
      </Helmet>
      <div className="aboutTop">
        <img
          src="/LOGO-09.png"
          alt="GoYours LOGO with handwriting words, 手寫字高優國際公司商標"
          className="centerLogo"
        />
        {topImg.map((img, index) => (
          <div key={index} className="aboutusTopImg">
            <img src={img.src} alt={`about us top img ${index}`} />
          </div>
        ))}
        <div className="aboutPage-scrollDown">
          <ScrollDownSide />
        </div>
      </div>
      <AnimationSection className="goyoursIntro">
        <h2>
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
          <span className="yellow">About Us</span>關於我們
        </h2>
        <h1>日本就職、留學、打工度假好夥伴</h1>
        <p>
          <span>GOYOURS</span>高優國際留學有限公司
          <br />
          台灣勞動部立案，評鑑A級 私立就業服務機構證號3508
          <br />
          <span>GOYOURS</span>
          專注日本市場，提供日本就職、留學、打工度假等完整服務。
          <br />
          我們堅持以同理心出發，透過專業分析為你量身規劃最佳方案，
          <br />
          幫助你有效掌握機會，減少時間與資源的浪費。
          <br />
          我們憑藉豐富經驗，累積上萬件成功案例，
          <br />
          從簽證申請到海外工作安排，全程陪伴你的成長與發展。
          <br />
          選擇<span>GOYOURS</span>安心前行，讓我們用專業與誠意，助你實現夢想！
        </p>
      </AnimationSection>
      <AnimationSection className="goyoursserviceWrapper">
        <div className="goyoursservice">
          <h2 className="underLine">
            <span className="yellow">Service</span>服務內容
            {/* <GoyoursBear /> */}
          </h2>
          <div className="serviceArea">
            <p>
              GoYours團隊集合了數位有著業界多年經驗的顧問
              <br />
              無論您是想要短期進修、語言學校、打工度假
              <br />
              我們都將給你最完善的服務與協助
              <br />
              約時間與我們一對一諮詢
              <br />
              也歡迎用Line、FB讓我們了解大家的需求
              <br />
              讓高優成為你們打工度假、留學圓夢的好夥伴！
            </p>
            <div className="circleMenu">
              <div className="circleMenuLogo">
                <img src="/LOGO-02-text.png" alt="goyours logo" />
              </div>
              {services.map((service, index) => (
                <div
                  key={index}
                  className={
                    inView
                      ? 'serviceCircle serviceCircleAnimation'
                      : 'serviceCircle'
                  }
                  style={{ '--i': index }}
                  ref={ref}
                >
                  <div className="serviceContent">
                    <img
                      src={service.icon}
                      alt={service.label}
                      className="serviceIcon"
                    />
                    <span className="serviceTxt">{service.label}</span>
                  </div>
                </div>
              ))}
              <div className="serviceBgCircle"></div>
            </div>
          </div>
          <div className="servicecontentBg"></div>
        </div>
      </AnimationSection>

      <AnimationSection className="Review">
        <div className="reviewTitle">
          <h2 className="underLine">
            <span className="yellow">Review</span>學員心得
            {/* <GoyoursBear /> */}
          </h2>
        </div>
        <div className="feedBackArea">
          {feedbacks.map((feedback, index) => (
            <AnimationSection key={index} className="feedbackList">
              <div className="feedbackInfo">
                <p>By {feedback.name}</p>
              </div>
              <div className="feedbackTxt">
                <p>{feedback.feedback}</p>
              </div>
            </AnimationSection>
          ))}
        </div>
      </AnimationSection>
      <div className="ifYou">
        <h2>
          <span className="yellow">If You...</span>如果你
        </h2>
        <ProgressBar />
      </div>
      <AnimationSection className="aboutContactArea">
        <ContactUs />
      </AnimationSection>
    </>
  );
}
