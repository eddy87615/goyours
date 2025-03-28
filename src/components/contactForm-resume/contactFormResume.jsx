/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { client } from '../../cms/sanityClient'; // 引入Sanity客戶端
// import { urlFor } from '../../cms/sanityClient'; // 导入 urlFor
import { Link } from 'react-router-dom';

import MorePost from '../morePost/morePost';
import ApplicationTitle from '../../../public/applicationTitle';
import ThankYouTitle from '../../../public/thankYouTitle';

import useWindowSize from '../../hook/useWindowSize';

import { FaCirclePlus } from 'react-icons/fa6';
import { BsTrashFill } from 'react-icons/bs';
import { FiDownload } from 'react-icons/fi';
import { GoArrowRight } from 'react-icons/go';

import CryptoJS from 'crypto-js';

import './contactFormResume.css';
import '../contactForm/contactForm.css';

export default function ContactFormResume() {
  // const [placeholdertxt, setPlaceholdertxt] = useState([
  //   '王小明',
  //   '25',
  //   '0912345678',
  //   'example12345',
  //   'example12345@gmail.com',
  //   '早上10:00-12:00/下午14:00-17:00',
  //   '我對這份工作有興趣',
  // ]);
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
  // const [posts, setPosts] = useState([]);
  // const [randomPosts, setRandomPosts] = useState([]);
  const windowSize = useWindowSize();

  // useEffect(() => {
  //   async function fetchPosts() {
  //     const posts = await client.fetch(`
  //       *[_type == "post"] | order(publishedAt desc) {
  //         title,
  //         publishedAt,
  //         mainImage,
  //         slug,
  //         categories[]->{
  //           title
  //         },
  //       }
  //       `);
  //     setPosts(posts);
  //   }
  //   fetchPosts();
  // }, []);

  // useEffect(() => {
  //   if (posts.length > 0) {
  //     const shuffledPosts = [...posts].sort(() => 0.5 - Math.random());
  //     setRandomPosts(shuffledPosts.slice(0, 3));
  //   }
  // }, [posts, isSubmited]);

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
    if (name === 'age' || name === 'phone') {
      // 只保留數字
      const numbersOnly = value.replace(/[^\d]/g, '');
      setFormData((prevData) => ({
        ...prevData,
        [name]: numbersOnly,
      }));
    } else {
      // 其他欄位保持原有的處理方式
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const [loading, setLoading] = useState(false);

  const scrollToTop = () => {
    // 嘗試多種滾動方法
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      // 如果 smooth 失敗，使用即時滾動
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    }
  };

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
      major: formData.major,
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

      if (response.ok) {
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        scrollToTop();
      }
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

  // const handleFocus = (index) => {
  //   setPlaceholdertxt((prev) => {
  //     const updatedPlaceholders = [...prev];
  //     updatedPlaceholders[index] = '';
  //     return updatedPlaceholders;
  //   });
  // };

  // const handleBlur = (index, defaultText) => {
  //   setPlaceholdertxt((prev) => {
  //     const updatedPlaceholders = [...prev];
  //     updatedPlaceholders[index] = defaultText;
  //     return updatedPlaceholders;
  //   });
  // };

  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    async function fetchDocuments() {
      const document = await client.fetch(`*[_type == 'download']`);

      setDocuments(document);
    }

    fetchDocuments();
  }, []);

  return (
    <>
      {isSubmited ? (
        <>
          <div className="contactusComponent-resume">
            <h1>
              <ThankYouTitle />
            </h1>
            {windowSize > 800 && (
              <img
                src="/goyoursline@.png"
                alt="goyours line@ QR code"
                className="formlogo"
              />
            )}
            {windowSize > 800 ? (
              <></>
            ) : (
              <img
                src="/LOGO-02.png"
                alt="goyours line@ QR code"
                className="formlogo"
              />
            )}

            <p className="subitedtxt">
              感謝您的報名，也歡迎加我們的LINE，專員會更快服務您喔！
            </p>
            {windowSize < 800 && (
              <a
                className="goyours-line-btn"
                href="https://page.line.me/749omkba?openQrModal=true"
                target="_blank"
              >
                <img src="/goyoursbear-line-W.svg" />
                點我加入Line好友
              </a>
            )}
          </div>
          <div className="submitedPostArea">
            <MorePost isSubmited={isSubmited} />
          </div>
        </>
      ) : (
        <div className="contactusComponent-resume">
          <div className="contactusTitleforApply">
            <h1>
              <ApplicationTitle />
            </h1>
            <h2 className="jobapplyh1">{jobTitle}——打工度假申請</h2>
          </div>
          <div className="contactimg">
            <img src="/LOGO-09.png" alt="goyours logo only words" />
            <img src="/LOGO-02.png" alt="goyours logo" />
          </div>
          <form className="contactFormResume" onSubmit={handleSubmit}>
            <label htmlFor="name" className="realName">
              <p>真實姓名（例：王小明）：</p>
              <br />
              <input
                // placeholder={placeholdertxt[0]}
                // onFocus={() => handleFocus(0)}
                // onBlur={() => handleBlur(0, '王小明')}
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
              <p>年齡（例：25）：</p>
              <br />
              <input
                // placeholder={placeholdertxt[1]}
                // onFocus={() => handleFocus(1)}
                // onBlur={() => handleBlur(1, '25')}
                className="placeholder"
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                inputMode="numeric"
              />
            </label>

            <label htmlFor="major" className="major">
              <p>科系（例：日文系）：</p>
              <br />
              <input
                // // placeholder={placeholdertxt[1]}
                // onFocus={() => handleFocus(1)}
                // onBlur={() => handleBlur(1, '25')}
                // className="placeholder"
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                // inputMode="numeric"
              />
            </label>

            <label htmlFor="phone" className="phone">
              <p>行動電話（例：0912345678）：</p>
              <br />
              <input
                // placeholder={placeholdertxt[2]}
                // onFocus={() => handleFocus(2)}
                // onBlur={() => handleBlur(2, '0912345678')}
                className="placeholder"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                inputMode="numeric"
              />
            </label>
            <label htmlFor="lineId" className="lineId">
              <p>LINE ID（例：example12345）：</p>
              <br />
              <input
                // placeholder={placeholdertxt[3]}
                // onFocus={() => handleFocus(3)}
                // onBlur={() => handleBlur(3, 'example12345')}
                className="placeholder"
                id="lineId"
                name="lineId"
                value={formData.lineId}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="email" className="email">
              <p>電子郵件（例：aaa@gmail.com）：</p>
              <br />
              <input
                // placeholder={placeholdertxt[4]}
                // onFocus={() => handleFocus(4)}
                // onBlur={() => handleBlur(4, 'example12345@gmail.com')}
                className="placeholder"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="contactTime">
              <p>方便聯絡時段（例：早上10:00-12:00）：</p>
              <br />
              <input
                // placeholder={placeholdertxt[5]}
                // onFocus={() => handleFocus(5)}
                // onBlur={() => handleBlur(5, '早上10:00-12:00/下午14:00-17:00')}
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
                    required
                  />
                  <span className="uploadNotice">
                    最大檔案大小為30MB。不支援 .bat、.exe
                    等檔案類型；最多上傳四個檔案。請先下載提供的履歷書填寫。
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
                  <div className="upload-download-btnarea">
                    <Link
                      className="uploadBtn downloadBtn"
                      to="/document-download"
                      target="_blank"
                    >
                      <FiDownload />
                      履歷書下載
                    </Link>
                    <GoArrowRight />
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
            </div>
            <label className="tellus">
              <p>想對我們說的話：</p>
              <br />
              <textarea
                // placeholder={placeholdertxt[6]}
                // onFocus={() => handleFocus(6)}
                // onBlur={() => handleBlur(6, '我對這份工作有興趣')}
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
                  <Link to="/privacy-policy" target="blank" required>
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
