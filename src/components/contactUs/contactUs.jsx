/* eslint-disable react/prop-types */
import './contactUs.css';

export default function ContactUs() {
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
          <text fill="#F8B300" fontSize="20" fontWeight="bold">
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
          href="/contact-us"
          alt="to Contact Us page"
        >
          <ArcText text="填寫表單，我們將聯絡您！" />
          <span className="homecontactusArrow ">
            <img src="/submit-arrow.svg" alt="submit button arrow" />
          </span>
        </a>
      </div>
    </>
  );
}
