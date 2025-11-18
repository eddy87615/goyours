import { HelmetProvider, Helmet } from "react-helmet-async";

import { ContactFormResumeJob } from "../../components/forms";
import "./contactResume.css";

export default function ContactResume() {
  const currentURL = `${window.location.origin}${location.pathname}`;
  return (
    <HelmetProvider>
      <Helmet>
        <title>Go Yours職缺申請表單</title>
        <meta
          name="keywords"
          content="聯絡方式、客服資訊、地址電話、線上諮詢、日本工作應徵"
        />
        <meta
          name="description"
          content="高優國際的日本工作應徵表單，提交申請，讓我們可以手把手的幫助你！"
        />
        <link rel="canonical" href={currentURL} />

        <meta property="og:site_name" content="Go Yours：高優國際" />
        <meta
          property="og:title"
          content="Go Yours：高優國際線上日本職缺申請｜高優國際日本職缺應徵｜讓我們幫助你！"
        />
        <meta
          property="og:description"
          content="高優國際的日本工作應徵表單，提交申請，讓我們可以手把手的幫助你！"
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
          content="Go Yours：高優國際線上日本職缺申請｜高優國際日本職缺應徵｜讓我們幫助你！"
        />
        <meta
          name="twitter:description"
          content="高優國際的日本工作應徵表單，提交申請，讓我們可以手把手的幫助你！"
        />
        <meta name="twitter:image" content={imageURL} />
      </Helmet>
      <div className="contactusSection">
        <div className="contactusResume"></div>
        <ContactFormResumeJob />
      </div>
    </HelmetProvider>
  );
}
