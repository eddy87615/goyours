import { HelmetProvider, Helmet } from 'react-helmet-async';

import ContactForm from '../components/contactForm/contactForm';
import './contact-us.css';

export default function Contact() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Go Yours諮詢表單</title>
        <meta name="description" content="填寫表單，讓Go Yours幫你解決問題！" />
      </Helmet>
      <div className="contactusSection">
        <div className="contactus"></div>
        <ContactForm />
      </div>
    </HelmetProvider>
  );
}
