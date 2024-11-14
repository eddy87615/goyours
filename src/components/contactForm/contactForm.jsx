import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { client } from '../../cms/sanityClient'; // 引入Sanity客戶端
import { urlFor } from '../../cms/sanityClient'; // 导入 urlFor
import { Link } from 'react-router-dom';

import GoyoursBearMorePost from '../goyoursBear/goyoursBear-morepost';
import Faqs from '../faqs/faqs';

import './contactForm.css';

export default function ContactForm() {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || '';
  const [placeholdertxt, setPlaceholdertxt] = useState([
    '王小明',
    '25',
    '0912345678',
    'example12345',
    'example12345@gmail.com',
    '早上10:00-12:00/下午14:00-17:00',
    '我想詢問關於日本留學的資訊',
  ]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    lineId: '',
    email: '',
    selectedCases: [],
    callTime: '',
    tellus: initialMessage,
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      tellus: initialMessage,
    }));
  }, [initialMessage]);

  const [caseOptions, setCaseOptions] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [posts, setPosts] = useState([]);
  const [randomPosts, setRandomPosts] = useState([]);

  // 從Sanity中獲取方案選項
  useEffect(() => {
    async function fetchCaseOptions() {
      const cases = await client.fetch(`
        *[_type == "caseOptions"]{
          _id, title
        }
      `);
      setCaseOptions(cases);
    }

    fetchCaseOptions();
  }, []);
  useEffect(() => {
    async function fetchPosts() {
      const posts = await client.fetch(`
        *[_type == "post"] | order(publishedAt desc) {
          title,
          publishedAt,
          mainImage,
          slug,
          categories[]->{
            title
          },
        }
        `);
      setPosts(posts);
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const shuffledPosts = [...posts].sort(() => 0.5 - Math.random());
      setRandomPosts(shuffledPosts.slice(0, 3));
    }
  }, [posts, isSubmited]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        selectedCases: [...prevData.selectedCases, value],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        selectedCases: prevData.selectedCases.filter((item) => item !== value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDateTime = new Date().toISOString();

    // 準備發送到 Sanity 的資料
    const contactData = {
      _type: 'contact',
      name: formData.name,
      age: formData.age,
      phone: formData.phone,
      lineId: formData.lineId,
      email: formData.email,
      case: formData.selectedCases,
      callTime: formData.callTime,
      contacted: false, // 初始聯絡狀態為 false
      remarks: formData.tellus, // 備註初始為空
      upTime: currentDateTime, // 表單送出時間
      tellus: formData.tellus,
    };

    try {
      // 將資料發送到 Sanity
      await client.create(contactData);
      setIsSubmited(true);
      // alert('資料已成功提交');
      setFormData({
        name: '',
        age: '',
        phone: '',
        lineId: '',
        email: '',
        selectedCases: [],
        callTime: '',
      });
    } catch (error) {
      console.error('提交失敗:', error);
      alert('提交失敗，請稍後再試');
    }
  };

  const handleFocus = (index) => {
    setPlaceholdertxt((prev) => {
      const updatedPlaceholders = [...prev];
      updatedPlaceholders[index] = '';
      return updatedPlaceholders;
    });
  };

  const handleBlur = (index, defaultText) => {
    setPlaceholdertxt((prev) => {
      const updatedPlaceholders = [...prev];
      updatedPlaceholders[index] = defaultText;
      return updatedPlaceholders;
    });
  };

  return (
    <>
      {isSubmited ? (
        <>
          <div className="contactusComponent">
            <h1>Thank you</h1>
            <img src="/LOGO-02.png" alt="goyours logo" className="formlogo" />
            <p className="subitedtxt">
              感謝您的報名，也歡迎直接在LINE上搜尋：@goyours加入我們，專員會更快服務您喔！
            </p>
          </div>
          <div className="submittedLayout">
            <Faqs />
            <div className="submitedPostArea">
              <div className="morepostH2">
                <h2 className="yellow">
                  延伸閱讀
                  <GoyoursBearMorePost />
                </h2>
              </div>
              <div className="submitPostList">
                {randomPosts.map((post, index) => (
                  <Link
                    key={index}
                    className="submitPostLink"
                    to={`/post/${post.slug.current}`}
                  >
                    <img src={urlFor(post.mainImage).url()} alt={post.title} />
                    <h3>{post.title}</h3>
                    <ul>
                      {post.categories.map((category, index) => (
                        <li key={index}>#{category.title}</li>
                      ))}
                    </ul>
                    <div className="submitPostDate">
                      <p>
                        {new Date(post.publishedAt)
                          .toLocaleDateString('zh-TW', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                          .replace(/\//g, '.')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="contactusComponent">
          <h1>Contact us</h1>
          <div className="contactimg">
            <img src="/LOGO-09.png" alt="goyours logo only words" />
            <img src="/LOGO-02.png" alt="goyours logo" />
          </div>
          <form className="contactForm" onSubmit={handleSubmit}>
            <label htmlFor="name">
              <p>真實姓名：</p>
              <br />
              <input
                placeholder={placeholdertxt[0]}
                onFocus={() => handleFocus(0)}
                onBlur={() => handleBlur(0, '王小明')}
                className="placeholder"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="age">
              <p>年齡：</p>
              <br />
              <input
                placeholder={placeholdertxt[1]}
                onFocus={() => handleFocus(1)}
                onBlur={() => handleBlur(1, '25')}
                className="placeholder"
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="phone">
              <p>行動電話：</p>
              <br />
              <input
                placeholder={placeholdertxt[2]}
                onFocus={() => handleFocus(2)}
                onBlur={() => handleBlur(2, '0912345678')}
                className="placeholder"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="lineId">
              <p>LINE ID：</p>
              <br />
              <input
                placeholder={placeholdertxt[3]}
                onFocus={() => handleFocus(3)}
                onBlur={() => handleBlur(3, 'example12345')}
                className="placeholder"
                id="lineId"
                name="lineId"
                value={formData.lineId}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="email">
              <p>電子郵件：</p>
              <br />
              <input
                placeholder={placeholdertxt[4]}
                onFocus={() => handleFocus(4)}
                onBlur={() => handleBlur(4, 'example12345@gmail.com')}
                className="placeholder"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              <p>方便聯絡時段：</p>
              <br />
              <input
                placeholder={placeholdertxt[5]}
                onFocus={() => handleFocus(5)}
                onBlur={() => handleBlur(5, '早上10:00-12:00/下午14:00-17:00')}
                className="placeholder"
                type="text"
                id="callTime"
                name="callTime"
                value={formData.callTime}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="case">
              <p>想詢問的方案：</p>
              <br />
              <div className="caseOptions">
                {caseOptions.map((option) => (
                  <label key={option._id}>
                    <input
                      type="checkbox"
                      value={option.title}
                      checked={formData.selectedCases.includes(option.title)}
                      onChange={handleCheckboxChange}
                      // required={
                      //   index === 0 && formData.selectedCases.length === 0
                      // }
                    />
                    {option.title}
                  </label>
                ))}
              </div>
            </label>
            <label>
              <p>想對我們說的話：</p>
              <br />
              <textarea
                placeholder={placeholdertxt[6]}
                onFocus={() => handleFocus(6)}
                onBlur={() => handleBlur(6, '我想詢問關於日本留學的資訊')}
                className="placeholder"
                value={formData.tellus}
                id="tellus"
                name="tellus"
                onChange={handleChange}
              />
            </label>
            <div className="privicy">
              <input type="checkbox" id="privicy" name="privicy" />
              <span>
                我已閱讀
                <Link
                  to="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  required
                >
                  隱私政策*
                </Link>
              </span>
            </div>

            <button type="submit" className="submitBtn">
              送出表單
            </button>
          </form>
        </div>
      )}
    </>
  );
}
