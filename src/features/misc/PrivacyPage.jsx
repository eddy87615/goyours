import "./privacy.css";

// 隱私權政策資料
const privacyData = {
  title: "Go Yours 高優國際留學有限公司 隱私權政策",
  description: [
    "Go Yours 高優國際留學有限公司（以下稱為本公司）",
    "非常重視會員的隱私權且遵循「個人資料保護法」之規定，",
    "因此制訂了隱私權保護政策，您可參考下列隱私權保護政策的內容。",
  ],
  sections: [
    {
      title: "第一條：資料之蒐集、使用及提供",
      content:
        "本公司依據《個人資料保護法》，蒐集並處理您於表單中所填資料，目的包括：",
      subsections: [
        {
          title: "",
          content: [
            "1. 提供日本就業媒合、履歷審查、面談安排、簽證申請等服務",
            "2. 與日本當地職業介紹機構、招聘企業及協力單位共享資料以履行服務",
            "3. 所提供資料將保存於本公司系統，使用地區包含台灣、日本及合作單位所在國家",
          ],
        },
        {
          title: "本公司表單所蒐集之資料類別包括：",
          content: [
            "・姓名",
            "・年齡",
            "・科系",
            "・行動電話",
            "・LINE ID",
            "・電子郵件",
            "・日文程度",
            "・履歷（PDF 或 Word）",
          ],
        },
      ],
    },
    {
      title: "第二條：服務內容與限制",
      content: [
        "1. 本公司提供的服務包含履歷協助、媒合推薦、就職說明、簽證諮詢等",
        "2. 本公司不保證求職錄用或簽證核准，服務為協助性質",
        "3. 若資料不足或不正確，可能影響服務品質",
        "4. 使用者若透過加入本公司官方 LINE@ 帳號、點擊廣告連結、使用線上諮詢或與本公司聯繫，即視為使用本公司服務之一部分，並同意本條款所有內容。（LINE ID：@goyours）",
      ],
    },
    {
      title: "第三條：使用者責任與義務",
      content: [
        "1. 應提供真實正確之資料，並依需要更新",
        "2. 不得冒用、偽造資料，亦不得轉交他人使用服務",
        "3. 未滿20歲者須取得法定代理人同意",
      ],
    },
    {
      title: "第四條：智慧財產與授權",
      content:
        "使用者所提供的履歷、職務經歷、自傳等內容，於服務媒合目的範圍內，授權本公司及合作機構使用、轉交、保管。",
    },
    {
      title: "第五條：隱私與資訊安全",
      content: [
        "1. 本公司依個資法管理資料，未經授權不另行使用或公開",
        "2. 使用者可行使查詢、補充、更正、刪除等個資權利",
        "3. 請聯繫客服信箱：goyourswhst@gmail.com  電話：02-7701-5618申請",
        "4. 資料將依服務目的保存三年，若逾期或申請刪除，將安全刪除處理",
      ],
    },
    {
      title: "第六條：違約處理",
      content:
        "如提供虛假資料或有妨害服務行為，本公司得中止服務並保留法律追訴權。",
    },
    {
      title: "第七條：準據法與管轄法院",
      content:
        "本條款依中華民國法律解釋，雙方同意以台灣台北地方法院為第一審管轄法院。",
    },
    {
      title: "第八條：條款修改與通知",
      content:
        "本公司得不定期更新本條款內容，將公告於官網首頁，重大變更時亦可透過 LINE@ 或電子郵件通知。",
    },
    {
      title: "第九條：依法配合司法調查",
      content:
        "如依法令或主管機關要求，本公司得提供必要資料予檢調或法院，並將依程序處理，不另行通知當事人。",
    },
    {
      title: "附加條款：Cookies 與第三方廣告追蹤",
      content: [
        "本網站使用 Cookies 技術，以改善使用體驗並分析流量，部分頁面可能引入第三方（如 Google、Meta）之追蹤碼，供廣告成效分析與再行銷使用。",
        "您可透過瀏覽器設定停用 Cookies 或追蹤功能，惟可能影響部分功能使用。",
      ],
    },
  ],
  lastUpdated: "2025-06-30",
};

export default function Privacy() {
  return (
    <div className="privacy">
      <div className="privacy-KV">
        <div className="privacyTitle">
          <h2>{privacyData.title}</h2>
          <p>
            {privacyData.description.map((line, index) => (
              <span key={index}>
                {line}
                {index < privacyData.description.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="privacy-wrapper">
        <div className="privacy-content">
          {privacyData.sections.map((section, index) => (
            <div key={index}>
              <h3>
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
                {section.title}
              </h3>

              {typeof section.content === "string" ? (
                <p>{section.content}</p>
              ) : Array.isArray(section.content) &&
                section.content.every((item) => item.match(/^\d+\./)) ? (
                <ol>
                  {section.content.map((item, pIndex) => (
                    <li key={pIndex}>{item.replace(/^\d+\.\s*/, "")}</li>
                  ))}
                </ol>
              ) : (
                section.content.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))
              )}

              {section.subsections &&
                section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex}>
                    {subsection.title && <h4>{subsection.title}</h4>}
                    {typeof subsection.content === "string" ? (
                      <p>{subsection.content}</p>
                    ) : Array.isArray(subsection.content) &&
                      subsection.content.every((item) =>
                        item.match(/^[・\d+\.]/)
                      ) ? (
                      <ul>
                        {subsection.content.map((item, pIndex) => (
                          <li key={pIndex}>
                            {item.replace(/^[・\d+\.\s]*/, "")}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      subsection.content.map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))
                    )}
                  </div>
                ))}
            </div>
          ))}
          <p className="updateTime">更新日期：{privacyData.lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}
