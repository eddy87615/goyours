import "./activityPage.css";

export default function ActivityPage() {
  return (
    <>
      <div className="topBg"></div>
      <div className="avtivityPage">
        <div className="activityPage_wrapper">
          <h1>
            《日本企業就職面試會》
            <br className="title_br" />
            強勢登場！
          </h1>
          <h2>
            一天限定的就職快閃通道！
            <br />
            直接與日本企業面談，內定即有機會申請就職簽證，別讓機會擦身而過！
          </h2>
          <span className="bar">
            <span className="bar_line"></span>
            <img src="/goyoursbear-B.svg" alt="goyours logo black" />
            <span className="bar_line"></span>
          </span>
          <div className="info_form">
            {/* <dl>
              <dt>什麼是 TAREC Meet Up 呢？</dt>
              <dd>
                這是一場讓企業負責人與求職者能輕鬆交流的一日線下活動，
                在一天內完成說明會、座談會與面試！{" "}
              </dd>
            </dl> */}
            <p className="intro_text">
              日本超過 500 間企業 的就職計畫陸續展開，
              <br />
              GOYOURS 高優國際留學 攜手 TAREC JAPAN重磅打造，
              <br className="txt_br" />
              為台灣年輕人才量身打造的一日限定【日本企業就業面試會】！
            </p>
            <ul>
              <dt>主辦單位｜</dt>
              <dd>GOYOURS 高優國際留學 × TAREC JAPAN</dd>
              <dt>活動日期｜</dt>
              <dd>2025年8月2日（星期六）</dd>
              <dt>活動地點｜</dt>
              <dd>淡江大學 台北校區</dd>
            </ul>
          </div>
          <a
            className="google_form_btn"
            href="https://docs.google.com/forms/d/e/1FAIpQLSeaE0PghPxOYX-B4qY19ZD-bjlXYaOsps-fjaRhyf0g8TaH8g/viewform"
            target="_blank"
          >
            點擊看詳細
          </a>
        </div>
      </div>
    </>
  );
}
