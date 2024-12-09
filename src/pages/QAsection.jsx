import { HelmetProvider, Helmet } from 'react-helmet-async';

import Faqs from '../components/faqs/faqs';

export default function QAsection() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>日本留遊學常見問題</title>
        <meta
          name="description"
          content="關於留遊學的疑難雜症，Go Your來回答！"
        />
      </Helmet>
      <Faqs />
    </HelmetProvider>
  );
}
