import { IoDownloadOutline } from 'react-icons/io5';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { LuThumbsUp } from 'react-icons/lu';
import { BsTranslate } from 'react-icons/bs';
import { LiaIdCardSolid } from 'react-icons/lia';

import './about.css';

export default function About() {
  const topImg = [
    { src: '/src/assets/aboutRandom/about_01.png' },
    { src: '/src/assets/aboutRandom/about_02.png' },
    { src: '/src/assets/aboutRandom/about_03.png' },
    { src: '/src/assets/aboutRandom/about_04.png' },
    { src: '/src/assets/aboutRandom/about_05.png' },
    { src: '/src/assets/aboutRandom/about_06.png' },
    { src: '/src/assets/aboutRandom/about_07.png' },
    { src: '/src/assets/aboutRandom/about_08.png' },
    { src: '/src/assets/aboutRandom/about_09.png' },
    // { src: '/src/assets/aboutRandom/about_10.png' },
    // { src: '/src/assets/aboutRandom/about_11.png' },
    // { src: '/src/assets/aboutRandom/about_12.png' },
    { src: '/src/assets/aboutRandom/about_13.png' },
  ];

  const services = [
    { label: '資料下載', icon: <IoDownloadOutline /> },
    { label: '1對1諮詢', icon: <RiQuestionAnswerLine /> },
    { label: '行前說明會', icon: <LiaChalkboardTeacherSolid /> },
    { label: '方案推薦', icon: <LuThumbsUp /> },
    { label: '中日翻譯', icon: <BsTranslate /> },
    { label: '簽證申請協助', icon: <LiaIdCardSolid /> },
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

  return (
    <>
      <div className="aboutTop">
        <img
          src="/src/assets/LOGO-09.png"
          alt="goyours logo"
          className="centerLogo"
        />
        {topImg.map((img, index) => (
          <div key={index} className="aboutusTopImg">
            <img src={img.src} alt={`about us top img ${index}`} />
          </div>
        ))}
        <div className="aboutScroolDown">
          <div className="aboutScroolDownArrowArea">
            <div className="aboutScroolDownLine"></div>
            <div className="aboutScroolDownDot"></div>
          </div>
          <p className="aboutScroolDownText">Scroll</p>
        </div>
      </div>
      <div className="goyoursIntro">
        <h1>
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
          GoYours諮詢過你會感受到我們的用心
          <br />
          GoYours夥伴有最豐實的經驗
          <br />
          GoYours用最真誠的心給你最實用的資訊與陪伴
          <br />
          這一次不為誰，只為了你的夢想起飛～ 去吧！去你的打工度假！
        </p>
      </div>
      <div className="goyoursservice">
        <h1>
          <span className="yellow">Service</span>服務內容
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
              <img src="/src/assets/LOGO-02.png" alt="goyours logo" />
              <div className="serviceBgCircle"></div>
            </div>
            {services.map((service, index) => (
              <div
                key={index}
                className="serviceCircle"
                style={{ '--i': index }}
              >
                <div className="serviceContent">
                  <span className="serviceIcon">{service.icon}</span>
                  <span className="serviceTxt">{service.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ifYou">
          <h1>
            <span className="yellow">If You...</span>如果你
          </h1>
        </div>
      </div>
    </>
  );
}
