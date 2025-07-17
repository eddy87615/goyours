import Faqs from '../../components/faqs/faqs';
import { Helmet } from 'react-helmet-async';

export default function QAsection() {
  const currentURL = `${window.location.origin}${location.pathname}`;
  const imageURL = `${window.location.origin}/LOGO-02-text.png`;
  return (
    <>
      <Helmet>
        <title>
          Go
          Yours：高優解惑專區｜日本留學常見問題解答｜日本打工度假常見疑問｜日本簽證申請常見問題｜日本生活常見問題
        </title>
        <meta
          name="keywords"
          content="常見問題、留學問答、打工度假問答、申請疑難、服務諮詢"
        />
        <meta
          name="description"
          content="高優統整出來的日本打工度假常見疑問與日本簽證申請常見問題，讓你前往日本不害怕！"
        />
        <link rel="canonical" href={currentURL} />

        <meta property="og:site_name" content="Go Yours：高優國際" />
        <meta
          property="og:title"
          content="Go Yours：高優解惑專區｜日本留學常見問題解答｜日本打工度假常見疑問｜日本簽證申請常見問題｜日本生活常見問題"
        />
        <meta
          property="og:description"
          content="高優統整出來的日本打工度假常見疑問與日本簽證申請常見問題，讓你前往日本不害怕！"
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
          content="Go Yours：高優解惑專區｜日本留學常見問題解答｜日本打工度假常見疑問｜日本簽證申請常見問題｜日本生活常見問題"
        />
        <meta
          name="twitter:description"
          content="高優統整出來的日本打工度假常見疑問與日本簽證申請常見問題，讓你前往日本不害怕！"
        />
        <meta name="twitter:image" content={imageURL} />
      </Helmet>
      <Faqs />
    </>
  );
}
