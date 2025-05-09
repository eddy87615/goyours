import { useState, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { client } from '../../cms/sanityClient';

import LoadingBear from '../loadingBear/loadingBear';

import './faqs.css';

export default function Faqs() {
  // 定義 PortableText 的渲染組件
  const components = {
    marks: {
      link: ({ value, children }) => {
        const { blank, href } = value;
        return blank ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ) : (
          <a href={href}>{children}</a>
        );
      },
    },
  };
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchfeedback() {
      const faqs = await client.fetch(
        `*[_type == 'faqs']{
        question,
        answer,
        type,
        }`
      );
      setFaqs(faqs);
      setLoading(false);
    }
    fetchfeedback();
  }, []);

  useEffect(() => {
    // 等待内容加载完成后再执行滚动
    if (!loading && location.hash) {
      // 添加一个小延迟确保DOM已经完全渲染
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }
  }, [location.hash, loading]); // 添加 loading 作为依赖项

  function scrollToSection(event) {
    event.preventDefault(); // 阻止默認的頁面跳轉
    const targetId = event.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    targetElement.scrollIntoView({
      behavior: 'smooth', // 設置平滑滾動效果
      block: 'start', // 滾動到目標元素頂部
    });
  }

  if (loading) {
    return (
      <div className="postLoading pageLoading">
        <LoadingBear />
      </div>
    );
  }

  return (
    <div className="qaSection" id="faqsSection">
      <div className="fqa-KV">
        <h1>
          <span className="yellow faq-title">FAQs</span>常見QA
        </h1>
      </div>
      <div className="fqa-body">
        <div className="fqa-wrapper">
          {/* <div className="qa-sectionBtn">
            <a href="#part1" onClick={scrollToSection}>
              關於日本留學
            </a>
            <a href="#part2" onClick={scrollToSection}>
              關於日本打工度假
            </a>
          </div> */}
          <div>
            <div className="part1">
              <h2 className="yellow faq-title" id="part1">
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
                        <img src="/LOGO-07.png" alt="goyours logo" />
                      </div>
                      {/* <p>{faq.answer}</p> */}
                      <PortableText
                        value={faq.answer}
                        components={components}
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="part2">
              <h2 className="yellow faq-title" id="part2">
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
                        <img src="/LOGO-07.png" alt="goyours logo" />
                      </div>
                      {/* <p>{faq.answer}</p> */}
                      <PortableText
                        value={faq.answer}
                        components={components}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
