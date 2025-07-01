import { useState, useEffect } from "react";
import { PortableText } from "@portabletext/react";
import { client } from "../../cms/sanityClient";

import LoadingBear from "../loadingBear/loadingBear";

import "./faqs.css";

const SCROLL_DELAY = 100;

const FAQ_SECTIONS = [
  {
    id: "part1",
    title: "Part1 日本留學",
    type: "studying",
  },
  {
    id: "part2",
    title: "Part2 打工度假",
    type: "working",
  },
  {
    id: "part3",
    title: "Part3 日本就職",
    type: "jpJob",
  },
];

const SANITY_QUERY = `
  *[_type == 'faqs']{
    question,
    answer,
    type,
  }
`;

const PORTABLE_TEXT_COMPONENTS = {
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

const BearSVG = () => (
  <svg version="1.1" id="_レイヤー_1" x="0px" y="0px" viewBox="0 0 340.2 338">
    <path
      className="goyoursbear-line"
      d="M36.6,337.5c0,0-13.5-150.2,68.7-211.6c0,0-5.4-16.2-40.1-28c0,0-12.5-5.6-15.7-16.7c0,0-1.1-14.6,0.7-16.9
c0,0,0.9-1.8,3-2.1c0,0,39.1-7.4,41.8-8.1c0,0,2.5-1.2,3.3-3.3c0,0-0.5-9.9,1.9-11.8c0,0,1.4-1.4,2.3-1.9c0,0,27.8-8.8,48.3-12.7
h1.8c0,0,3.7-17.8,22.7-10.1c0,0,11.1,5.6,5.8,20.3c0,0,0.2,2.5,0,4.8c0,0,46.4,29.8,51.6,84.9c0,0,79.4,32.1,70.9,213.5"
    />
  </svg>
);

const FAQItem = ({ faq }) => (
  <div className="preQA">
    <div className="question">
      <div className="Qmark">Q</div>
      <h3>{faq.question}</h3>
    </div>
    <div className="answer">
      <div className="answerLogo">
        <img src="/LOGO-07.png" alt="goyours logo" />
      </div>
      <PortableText value={faq.answer} components={PORTABLE_TEXT_COMPONENTS} />
    </div>
  </div>
);

const FAQSection = ({ section, faqs }) => {
  const sectionFaqs = faqs.filter((faq) => faq.type === section.type);

  // 如果沒有對應的 FAQ 內容，不渲染該區段
  if (sectionFaqs.length === 0) {
    return null;
  }

  return (
    <div className={section.id}>
      <h2 className="yellow faq-title" id={section.id}>
        <span className="goyoursbear goyoursbearonfaqs">
          <BearSVG />
        </span>
        {section.title}
      </h2>
      {sectionFaqs.map((faq, index) => (
        <FAQItem key={index} faq={faq} />
      ))}
    </div>
  );
};

const useScrollToHash = (loading) => {
  useEffect(() => {
    if (!loading && typeof window !== "undefined" && window.location.hash) {
      setTimeout(() => {
        const element = document.querySelector(window.location.hash);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, SCROLL_DELAY);
    }
  }, [loading]);
};

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useScrollToHash(loading);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const faqsData = await client.fetch(SANITY_QUERY);
        setFaqs(faqsData);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

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
          <div>
            {FAQ_SECTIONS.map((section) => (
              <FAQSection key={section.id} section={section} faqs={faqs} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
