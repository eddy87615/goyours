import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { client } from '../../cms/sanityClient'; // 引入Sanity客戶端
import { urlFor } from '../../cms/sanityClient'; // 导入 urlFor
import { Link } from 'react-router-dom';

import { FaCirclePlus } from 'react-icons/fa6';
import { BsTrashFill } from 'react-icons/bs';

import CryptoJS from 'crypto-js';

import GoyoursBearMorePost from '../goyoursBear/goyoursBear-morepost';

import './contactFormResume.css';
import '../contactForm/contactForm.css';

export default function ContactFormResume() {
  const [placeholdertxt, setPlaceholdertxt] = useState([
    '王小明',
    '25',
    '0912345678',
    'example12345',
    'example12345@gmail.com',
    '早上10:00-12:00/下午14:00-17:00',
    '我對這份工作有興趣',
  ]);
  const location = useLocation();
  const jobTitle =
    location.state?.initialMessage || '聯絡GoYours，打工度假、留學免費諮詢';

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    lineId: '',
    email: '',
    callTime: '',
    resume: null,
  });
  const [isSubmited, setIsSubmited] = useState(false);
  const [posts, setPosts] = useState([]);
  const [randomPosts, setRandomPosts] = useState([]);

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
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        resume: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checked' ? checked : value,
      }));
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('檔案內容:', formData.resume); // 檢查 `resume` 是否包含檔案物件

    if (loading) return;

    setLoading(true);

    const currentDateTime = new Date().toISOString();

    let resumeAsset;
    if (formData.resume) {
      try {
        resumeAsset = await client.assets.upload('file', formData.resume, {
          filename: formData.resume.name,
        });
        console.log('上傳成功，返回的 resumeAsset:', resumeAsset); // 確認回傳的結果
      } catch (error) {
        console.error('上傳履歷失敗：', error);
        alert('上傳履歷失敗，請稍後再試');
        return;
      }
    }
    // 準備發送到 Sanity 的資料
    const rawData = {
      _type: 'jobapply',
      jobname: jobTitle,
      name: formData.name,
      age: formData.age,
      phone: formData.phone,
      lineId: formData.lineId,
      email: formData.email,
      callTime: formData.callTime,
      contacted: false, // 初始聯絡狀態為 false
      remarks: '', // 備註初始為空
      upTime: currentDateTime, // 表單送出時間
      resume: resumeAsset?._id
        ? {
            _type: 'file',
            asset: { _type: 'reference', _ref: resumeAsset._id },
          }
        : null,
    };

    console.log('目前的 formData:', formData);
    if (!formData.resume) {
      console.error('沒有檔案可供上傳！');
      return;
    }

    try {
      const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(rawData),
        SECRET_KEY
      ).toString();
      console.log('開始提交');
      const response = await fetch('/api/saveContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedData }),
      });
      console.log('提交完成,回應:', response);

      if (!response.ok) {
        throw new Error('提交失敗');
      }

      setIsSubmited(true);
      setFormData({
        name: '',
        age: '',
        phone: '',
        lineId: '',
        email: '',
        callTime: '',
        resume: null,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' }); // 返回到頁面的最頂端
    } catch (error) {
      console.error('提交失敗:', error);
      alert('提交失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const [files, setFiles] = useState([]);

  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files);

  //   if (files.length + selectedFiles.length > 4) {
  //     alert('最多只能上傳 4 個文件！');
  //     return;
  //   }

  //   setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  // };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // 將檔案列表轉為陣列

    // 檢查是否超過限制
    if (files.length + selectedFiles.length > 4) {
      alert('最多只能上傳 4 個文件！');
      return;
    }

    // 更新檔案列表狀態
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    // 如果需要單一檔案上傳，也更新到 formData
    if (selectedFiles.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        resume: selectedFiles[0], // 僅取第一個檔案更新到 formData
      }));
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const fileInputRef = useRef(null);

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
          <div className="contactusComponent-resume">
            <h1>Thank you</h1>
            <img src="/LOGO-02.png" alt="goyours logo" className="formlogo" />
            <p className="subitedtxt">
              感謝您的報名，也歡迎直接在LINE上搜尋：@goyours加入我們，專員會更快服務您喔！
            </p>
          </div>
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
        </>
      ) : (
        <div className="contactusComponent-resume">
          <div className="contactusTitleforApply">
            <h1>Application</h1>
            <h2 className="jobapplyh1">{jobTitle}——打工度假申請</h2>
          </div>
          <div className="contactimg">
            <img src="/LOGO-09.png" alt="goyours logo only words" />
            <img src="/LOGO-02.png" alt="goyours logo" />
          </div>
          <form className="contactFormResume" onSubmit={handleSubmit}>
            <label htmlFor="name" className="realName">
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

            <label htmlFor="age" className="age">
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

            <label htmlFor="phone" className="phone">
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
            <label htmlFor="lineId" className="lineId">
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
            <label htmlFor="email" className="email">
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

            <label className="contactTime">
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
            <div className="upload">
              <p>上傳履歷：</p>
              <div className="uploadSection">
                <div className="uploadTool">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }} // 隱藏
                  />
                  <span className="uploadNotice">
                    最大檔案大小為30MB。不支援 .bat、.exe
                    等檔案類型；最多上傳四個檔案。
                  </span>
                  <div className="fileList">
                    <ul>
                      {files.map((file, index) => (
                        <li key={index}>
                          {file.name}

                          <button onClick={() => removeFile(index)}>
                            <BsTrashFill />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="uploadBtn"
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      fileInputRef.current.click();
                    }}
                  >
                    <FaCirclePlus />
                    點我上傳檔案
                  </div>
                </div>
              </div>
            </div>
            <label className="tellus">
              <p>想對我們說的話：</p>
              <br />
              <textarea
                placeholder={placeholdertxt[6]}
                onFocus={() => handleFocus(6)}
                onBlur={() => handleBlur(6, '我對這份工作有興趣')}
                className="placeholder"
                type="textarea"
                id="tellus"
                name="tellus"
                value={formData.tellus}
                onChange={handleChange}
              />
            </label>
            <div className="privicy">
              <label>
                <input type="checkbox" id="privicy" name="privicy" required />
                <span>
                  我已閱讀
                  <Link to="privacy-policy" target="blank" required>
                    隱私政策*
                  </Link>
                </span>
              </label>
            </div>

            <button type="submit" className="submitBtn">
              {loading ? '送出中...' : '送出表單'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
