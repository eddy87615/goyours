import { useState, useEffect } from 'react';
import { client } from '../../cms/sanityClient';
import { FaInstagram, FaFacebook, FaLine } from 'react-icons/fa';
import {
  FaBuildingUser,
  FaPhone,
  FaLocationDot,
  FaArrowUpLong,
} from 'react-icons/fa6';

import './footer.css';
import { Link } from 'react-router-dom';
import useWindowSize from '../../hook/useWindowSize';

export default function Footer() {
  const [latestNewPosts, setLatestNewsPosts] = useState([]);
  const windowSize = useWindowSize();

  useEffect(() => {
    const backToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const img = document.querySelector('.backtotop');
    if (img) {
      img.addEventListener('click', backToTop);
    }
    return () => {
      img.removeEventListener('click', backToTop);
    };
  }, []);

  // 從 Sanity 獲取最新消息標籤的文章
  useEffect(() => {
    async function fetchLatestNewsPosts() {
      const result = await client.fetch(`
        *[_type == "post"] | order(publishedAt desc)[0...3] {
          title,
          slug,
          publishedAt,
        }
      `);

      setLatestNewsPosts(result);
    }
    fetchLatestNewsPosts();
  }, []);

  return (
    <div className="footer">
      <ul className="footerInfo">
        <li>
          <img src="/圓形logo.png" alt="圓形logo" />
        </li>
        <li>
          <FaBuildingUser className="businessicon" />
          <a
            href="https://agent.wda.gov.tw/agentext/agent/QryAgentBrief.jsp"
            target="_blank"
            style={{ color: '#fff' }}
          >
            就業服務許可證號：3508
          </a>
        </li>
        <li>
          <FaPhone className="businessicon" />
          <a
            href={windowSize <= 500 ? 'tel:0277273780' : ''}
            style={{
              color: '#fff',
              pointerEvents: windowSize <= 500 ? 'auto' : 'none',
            }}
          >
            02 7701 5618
          </a>
        </li>
        <li
          onClick={() => {
            navigator.clipboard.writeText('台北市中山區南京東路一段52號2樓');
            alert('地址已複製'); // 或者用其他方式提示使用者
          }}
          style={{ cursor: 'pointer' }}
        >
          <FaLocationDot className="businessicon" />
          103617 台北市大同區承德路二段83-2號
        </li>
      </ul>
      <ul className="footerNews">
        <p className="footer-title">最新消息</p>
        {latestNewPosts.map((post, index) => (
          <li key={index} className="footerNewsPosts">
            <a href={`/goyours-post/${encodeURIComponent(post.slug.current)}`}>
              <p className="footerPost-date">
                {new Date(post.publishedAt)
                  .toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(/\//g, '.')}
              </p>
              <p className="footerPost-title">{post.title}</p>
            </a>
          </li>
        ))}
      </ul>
      <ul className="footerMedia">
        <p className="footer-title">社群連結</p>
        <li>
          <a
            href="https://www.instagram.com/goyourswhst?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            aria-label="goyours instagram"
          >
            <FaInstagram className="icon" />
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/GoYoursWhSt"
            target="_blank"
            aria-label="goyours facebook"
          >
            <FaFacebook className="icon" />
          </a>
        </li>
        <li>
          <a
            href="https://line.me/R/ti/p/%40749omkba"
            target="_blank"
            aria-label="goyours line"
          >
            <FaLine className="icon" />
          </a>
        </li>
        <li>
          <p className="footer-title">
            <Link to="/Q&A-section">常見Q&A</Link>
          </p>
        </li>
      </ul>
      <button className="backtotop" aria-label="back to top button">
        <FaArrowUpLong style={{ width: '1.2rem', height: '1.2rem' }} />
      </button>
      <small style={{ position: 'absolute', bottom: '2%', right: '1%' }}>
        All rights reserved. &#169; Go Yours
      </small>
    </div>
  );
}
