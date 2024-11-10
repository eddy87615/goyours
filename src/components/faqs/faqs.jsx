import { useState, useEffect } from 'react';
import { client } from '../../cms/sanityClient';

import './faqs.css';

export default function Faqs() {
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
    <div className="qaSection">
      <h1>
        <span className="yellow">FAQs</span>常見QA
      </h1>
      <div>
        <div className="part1">
          <h2 className="yellow">
            <span className="goyoursbear goyoursbearonfaqs">
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
            Part1 日本留學
          </h2>
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
          <h2 className="yellow">
            <span className="goyoursbear goyoursbearonfaqs">
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
            Part2 打工度假
          </h2>
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
  );
}
