import { HelmetProvider, Helmet } from 'react-helmet-async';

import { ContactFormResume } from '../../components/forms';
import './contactResume.css';

export default function ContactResume() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Go Yours打工度假申請表單</title>
        <meta name="description" content="填寫表單，讓Go Yours幫你媒合工作！" />
      </Helmet>
      <div className="contactusSection">
        <div className="contactusResume"></div>
        <ContactFormResume />
      </div>
    </HelmetProvider>
  );
}
