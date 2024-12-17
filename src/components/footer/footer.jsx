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

export default function Footer() {
  const [latestNewPosts, setLatestNewsPosts] = useState([]);

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
      // 查詢 "最新消息" 標籤的文章
      //&& "最新消息" in categories[]->title
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
          就業服務許可證號：3508
        </li>
        <li>
          <FaPhone className="businessicon" />
          02 7727 3780
        </li>
        <li>
          <FaLocationDot className="businessicon" />
          台北市中山區南京東路一段52號2樓
        </li>
      </ul>
      <ul className="footerNews">
        <h3>最新消息</h3>
        {latestNewPosts.map((post, index) => (
          <li key={index} className="footerNewsPosts">
            <a href={`/goyours-post/${encodeURIComponent(post.slug.current)}`}>
              <p>
                {new Date(post.publishedAt)
                  .toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(/\//g, '.')}
              </p>
              <h4>{post.title}</h4>
            </a>
          </li>
        ))}
      </ul>
      <ul className="footerMedia">
        <h3>社群連結</h3>
        <li>
          <a
            href="https://www.instagram.com/goyourswhst?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            alt="goyours instagram"
          >
            <FaInstagram className="icon" />
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/GoYoursWhSt"
            target="_blank"
            alt="goyours facebook"
          >
            <FaFacebook className="icon" />
          </a>
        </li>
        <li>
          <a
            href="https://line.me/R/ti/p/%40749omkba"
            target="_blank"
            alt="goyours line"
          >
            <FaLine className="icon" />
          </a>
        </li>
        <li>
          <h3>
            <Link to="/Q&A-section">常見Q&A</Link>
          </h3>
        </li>
      </ul>
      <button className="backtotop">
        <FaArrowUpLong style={{ width: '1.2rem', height: '1.2rem' }} />
      </button>
    </div>
  );
}
