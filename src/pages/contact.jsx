import ContactForm from '../components/contactForm/contactForm';
import Faqs from '../components/faqs/faqs';
import './contact.css';

export default function Contact() {
  return (
    <div className="contactusSection">
      <div className="contactus">
        <div className="contactusTitle">
          <h2>聯絡GoYours，打工度假、留學免費諮詢</h2>
          <p>
            無論是短期進修、語言學校，還是打工度假體驗不同人生，
            <br />
            背上背包，跟我們一起冒險，留下無悔的足跡！
            <br />
            透過表單預約與我們一對一諮詢。
            <br />
            也歡迎Line或FB聯繫，GoYours將是您打工度假、留學的最佳夥伴！
            <br />
          </p>
        </div>
      </div>
      <ContactForm />
      <Faqs />
    </div>
  );
}
