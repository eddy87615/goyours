import { useState, useEffect, useRef } from 'react';
import { client } from '../../cms/sanityClient'; // 引入Sanity客戶端
import { urlFor } from '../../cms/sanityClient'; // 导入 urlFor
import { Link } from 'react-router-dom';

import { FaCirclePlus } from 'react-icons/fa6';
import { BsTrashFill } from 'react-icons/bs';

import './contactFormResume.css';

export default function ContactFormResume() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDateTime = new Date().toISOString();

    let resumeAsset;
    if (formData.resume) {
      try {
        resumeAsset = await client.assets.upload('file', formData.resume, {
          filename: formData.resume.name,
        });
      } catch (error) {
        console.error('上傳履歷失敗：', error);
        alert('上傳履歷失敗，請稍後再試');
        return;
      }
    }
    // 準備發送到 Sanity 的資料
    const contactData = {
      _type: 'jobapply',
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
        callTime: '',
        resume: null,
      });
    } catch (error) {
      console.error('提交失敗:', error);
      alert('提交失敗，請稍後再試');
    }
  };

  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 4) {
      alert('最多只能上傳 4 個文件！');
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const fileInputRef = useRef(null);

  return (
    <>
      {isSubmited ? (
        <>
          <div className="contactusComponent">
            <h1>Thank you</h1>
            <img
              src="/src/assets/LOGO-02.png"
              alt="goyours logo"
              className="formlogo"
            />
            <p className="subitedtxt">
              感謝您的報名，也歡迎直接在LINE上搜尋：@goyours加入我們，專員會更快服務您喔！
            </p>
          </div>
          <div className="submitedPostArea">
            <h2 className="yellow">
              <span>延伸閱讀</span>
            </h2>
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
        <div className="contactusComponent">
          <h1>Application</h1>
          <div className="contactimg">
            <img src="/src/assets/LOGO-09.png" />
            <img src="/src/assets/LOGO-02.png" />
          </div>
          <form className="contactFormResume" onSubmit={handleSubmit}>
            <label htmlFor="name" className="realName">
              <p>真實姓名：</p>
              <br />
              <input
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
              </div>
            </div>
            <label className="tellus">
              <p>想對我們說的話：</p>
              <br />
              <textarea
                type="textarea"
                id="tellus"
                name="tellus"
                value={formData.tellus}
                onChange={handleChange}
              />
            </label>
            <div className="privicy">
              <input type="checkbox" id="privicy" name="privicy" />
              <span>
                我已閱讀
                <a
                  href="https://go-yours.com/privacy-policy/"
                  target="blank"
                  required
                >
                  隱私政策*
                </a>
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