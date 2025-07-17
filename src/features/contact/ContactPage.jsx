import { ContactForm } from "../../components/forms";
import "./contact.css";
import { Helmet } from "react-helmet-async";

export default function Contact() {
  const currentURL = `${window.location.origin}${location.pathname}`;
  const imageURL = `${window.location.origin}/LOGO-02-text.png`;
  return (
    <>
      <Helmet>
        <title>
          Go Yours：高優國際線上諮詢服務｜高優國際預約諮詢｜讓我們直接的幫助你！
        </title>
        <meta
          name="keywords"
          content="聯絡方式、客服資訊、地址電話、線上諮詢、預約服務"
        />
        <meta
          name="description"
          content="高優國際的聯絡資訊表單，預約跟我們的一對一對談，我們可以手把手的幫助你！"
        />
        <link rel="canonical" href={currentURL} />

        <meta property="og:site_name" content="Go Yours：高優國際" />
        <meta
          property="og:title"
          content="Go Yours：高優國際線上諮詢服務｜高優國際預約諮詢｜讓我們直接的幫助你！"
        />
        <meta
          property="og:description"
          content="高優國際的聯絡資訊表單，預約跟我們的一對一對談，我們可以手把手的幫助你！"
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
          content="Go Yours：高優國際線上諮詢服務｜高優國際預約諮詢｜讓我們直接的幫助你！"
        />
        <meta
          name="twitter:description"
          content="高優國際的聯絡資訊表單，預約跟我們的一對一對談，我們可以手把手的幫助你！"
        />
        <meta name="twitter:image" content={imageURL} />
      </Helmet>
      <div className="contactusSection">
        <div className="contactus"></div>
        <ContactForm />
      </div>
    </>
  );
}
