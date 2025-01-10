import { useEffect, useRef, useState } from 'react';

import { client } from '../cms/sanityClient';
import { useInView } from 'react-intersection-observer';

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

  // useEffect(() => {
  //   const aboutTop = document.querySelector('.aboutTop');

  //   function showRandomImage() {
  //     // 隨機選擇一張圖片
  //     const img = document.createElement('img');
  //     img.src = images[Math.floor(Math.random() * images.length)];
  //     img.className = 'random-image';

  //     // 隨機生成圖片位置，避免生成在中央區域
  //     const maxTop = aboutTop.clientHeight - 400; // 減去圖片高度，避免溢出
  //     const maxLeft = aboutTop.clientWidth - 100; // 減去圖片寬度，避免溢出

  //     let top, left;
  //     do {
  //       top = Math.random() * maxTop;
  //       left = Math.random() * maxLeft;
  //     } while (
  //       top > aboutTop.clientHeight / 2 - 200 &&
  //       top < aboutTop.clientHeight / 2 + 200 &&
  //       left > aboutTop.clientWidth / 2 - 200 &&
  //       left < aboutTop.clientWidth / 2 + 200
  //     );

  //     img.style.top = `${top}px`;
  //     img.style.left = `${left}px`;

  //     const randomSize = Math.floor(Math.random() * 100) + 100;
  //     img.style.width = `${randomSize}px`;
  //     img.style.height = 'auto';

  //     // 把圖片加到 aboutTop 中
  //     aboutTop.appendChild(img);

  //     setTimeout(() => {
  //       aboutTop.removeChild(img);
  //     }, 5000);
  //   }

  //   // 畫面載入時立即顯示第一張圖片
  //   showRandomImage();

  //   const interval = setInterval(showRandomImage, 2000); // 每 2 秒顯示一張新圖片

  //   return () => clearInterval(interval); // 清理 interval
  // }, [images]);

  const { ref, inView } = useInView({
    triggerOnce: true, // 進入視窗後只觸發一次
    threshold: 1, // 元素出現在視窗 10% 時觸發
  });

  return (
    <>
      <div className="aboutTop">
        <img src="/LOGO-09.png" alt="goyours logo" className="centerLogo" />
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
          <span className="yellow">About Us</span>關於我們
        </h1>
        <p>
          打工度假、留學好夥伴 相信GoYours
          <br />
          你是否也曾在某一年， 或某個時刻觸動了想出去看看的念頭？
          <br />
          出國留學或打工，是每一個年輕人都能實現的夢想
          <br />
          我們堅持不管是打工度假，留學都要提供給大家最好的服務
          <br />
          當你最堅強的後盾，給予大家去到國外真實遇到的狀況
          <br />
          <span>GoYours</span>諮詢過你會感受到我們的用心
          <br />
          <span>GoYours</span>夥伴有最豐實的經驗
          <br />
          <span>GoYours</span>用最真誠的心給你最實用的資訊與陪伴
          <br />
          這一次不為誰，只為了你的夢想起飛～ 去吧！去你的打工度假！
        </p>
      </AnimationSection>
      <AnimationSection className="goyoursserviceWrapper">
        <div className="goyoursservice">
          <h1 className="underLine">
            <span className="yellow">Service</span>服務內容
            {/* <GoyoursBear /> */}
          </h1>
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
          <h1 className="underLine">
            <span className="yellow">Review</span>學員心得
            {/* <GoyoursBear /> */}
          </h1>
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
        <h1>
          <span className="yellow">If You...</span>如果你
        </h1>
        <ProgressBar />
      </div>
      <AnimationSection className="aboutContactArea">
        <ContactUs />
      </AnimationSection>
    </>
  );
}
