import { useState, useEffect } from 'react';
import { client } from '../cms/sanityClient';

import ContactForm from '../components/contactForm/contactForm';
import './contact.css';

export default function Contact() {
  const [faqs, setFaqs] = useState([]);
  useEffect(() => {
    async function fetchfeedback() {
      const faqs = await client.fetch(
        `*[_type == 'faqs']{
      question,
      answer,
      type,
      }`
      );
      console.log('Fetched feedback data:', faqs); // 调试输出
      setFaqs(faqs);
    }
    fetchfeedback();
  }, []);
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
      <div className="qaSection">
        <h1>
          <span className="yellow">FAQs</span>常見QA
        </h1>
        <div>
          <div className="part1">
            <h2 className="yellow">Part1 日本留學</h2>
            {faqs
              .filter((faq) => faq.type === 'studying')
              .map((faq, index) => (
                <div key={index} className="preQA">
                  <div className="question">
                    <div className="Qmark">Q</div>
                    <h3>{faq.question}</h3>
                  </div>
                  <div className="answer">
                    <div className="answerLogo">
                      <img src="/src/assets/LOGO-07.png" />
                    </div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="part2">
            <h2 className="yellow">Part2 打工度假</h2>
            {faqs
              .filter((faq) => faq.type === 'working')
              .map((faq, index) => (
                <div key={index} className="preQA">
                  <div className="question">
                    <div className="Qmark">Q</div>
                    <h3>{faq.question}</h3>
                  </div>
                  <div className="answer">
                    <div className="answerLogo">
                      <img src="/src/assets/LOGO-07.png" />
                    </div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
