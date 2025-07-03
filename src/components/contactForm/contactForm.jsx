import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { client } from "../../cms/sanityClient";
import { Link } from "react-router-dom";

import ThankYouTitle from "../../../public/thankYouTitle";
import ContactUsTitle from "../../../public/contactUsTitle";

import "./contactForm.css";
import MorePost from "../morePost/morePost";
import useWindowSize from "../../hook/useWindowSize";

import CryptoJS from "crypto-js";

export default function ContactForm() {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || "";
  // const [placeholdertxt, setPlaceholdertxt] = useState([
  //   '王小明',
  //   '25',
  //   '0912345678',
  //   'example12345',
  //   'example12345@gmail.com',
  //   '早上10:00-12:00/下午14:00-17:00',
  //   '我想詢問關於日本留學的資訊',
  // ]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    lineId: "",
    email: "",
    selectedCases: [],
    callTime: "",
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
  const windowSize = useWindowSize();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    // 特殊處理電子郵件欄位
    if (name === "email") {
      setEmailError(""); // 清除錯誤訊息當使用者開始輸入
    }
    // 特殊處理年齡欄位
    if (name === "age" || name === "phone") {
      // 只保留數字
      const numbersOnly = value.replace(/[^\d]/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: numbersOnly,
      }));
    } else {
      // 其他欄位保持原有的處理方式
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
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

  const [loading, setLoading] = useState(false);

  const scrollToTop = () => {
    // 嘗試多種滾動方法
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      document.body.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      // 如果 smooth 失敗，使用即時滾動
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 防止重複提交
    if (loading) return;

    // 驗證電子郵件
    const error = validateEmail(formData.email);
    if (error) {
      setEmailError(error);
      // 滾動到電子郵件欄位
      document
        .getElementById("email")
        .scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true); // 只需要設置一次 loading 狀態

    setLoading(true); // 開始 loading 狀態

    const currentDateTime = new Date().toISOString();

    // 準備發送到 Sanity 的資料
    const rawData = {
      _type: "contact",
      name: formData.name,
      age: formData.age,
      major: formData.major,
      phone: formData.phone,
      lineId: formData.lineId,
      email: formData.email,
      case: formData.selectedCases,
      callTime: formData.callTime,
      contacted: false, // 初始聯絡狀態為 false
      upTime: currentDateTime, // 表單送出時間
      tellus: formData.tellus,
    };

    try {
      // 加密資料
      const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(rawData),
        SECRET_KEY
      ).toString();
      // 發送加密資料到 Serverless Function
      const response = await fetch("/api/saveContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encryptedData }),
      });

      if (!response.ok) {
        throw new Error("提交失敗");
      }
      if (response.ok) {
        setIsSubmited(true);
        setFormData({
          name: "",
          age: "",
          phone: "",
          lineId: "",
          email: "",
          selectedCases: [],
          callTime: "",
          tellus: "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        scrollToTop();
      }
    } catch (error) {
      console.error("提交失敗:", error);
      alert("提交失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

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
  // 只需要一個 emailError state
  const [emailError, setEmailError] = useState("");

  // 驗證電子郵件格式
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "請輸入有效的電子郵件地址";
    }
    return "";
  };

  return (
    <>
      {isSubmited ? (
        <>
          <div className="contactusComponent">
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
        <div className="contactusComponent">
          <h1>
            <ContactUsTitle />
          </h1>
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
          <div className="contactimg">
            <img src="/LOGO-13.png" alt="goyours logo only words" />
            <img src="/LOGO-02.png" alt="goyours logo" />
          </div>
          <form className="contactForm" onSubmit={handleSubmit}>
            <label htmlFor="name">
              <p>真實姓名（例：王小明）：</p>
              <br />
              <input
                // // placeholder={placeholdertxt[0]}
                // onFocus={() => handleFocus(0)}
                // onBlur={() => handleBlur(0, '王小明')}
                // className="placeholder"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor="age">
              <p>年齡（例：25）：</p>
              <br />
              <input
                // // placeholder={placeholdertxt[1]}
                // onFocus={() => handleFocus(1)}
                // onBlur={() => handleBlur(1, '25')}
                // className="placeholder"
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                inputMode="numeric"
              />
            </label>

            <label htmlFor="major">
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

            <label htmlFor="phone">
              <p>行動電話（例：0912345678）：</p>
              <br />
              <input
                // // placeholder={placeholdertxt[2]}
                // onFocus={() => handleFocus(2)}
                // onBlur={() => handleBlur(2, '0912345678')}
                // className="placeholder"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                inputMode="numeric"
              />
            </label>
            <label htmlFor="lineId">
              <p>LINE ID（例：example12345）：</p>
              <br />
              <input
                // // placeholder={placeholdertxt[3]}
                // onFocus={() => handleFocus(3)}
                // onBlur={() => handleBlur(3, 'example12345')}
                // className="placeholder"
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
                // // placeholder={placeholdertxt[4]}
                // onFocus={() => handleFocus(4)}
                // onBlur={() => handleBlur(4, 'example12345@gmail.com')}
                // className={`placeholder ${emailError ? 'error-input' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {emailError && <div className="error-message">{emailError}</div>}
            </label>
            <label>
              <p>方便聯絡時段（例：早上10:00-12:00）：</p>
              <br />
              <input
                // // placeholder={placeholdertxt[5]}
                // onFocus={() => handleFocus(5)}
                // onBlur={() => handleBlur(5, '早上10:00-12:00/下午14:00-17:00')}
                // className="placeholder"
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
                // // placeholder={placeholdertxt[6]}
                // onFocus={() => handleFocus(6)}
                // onBlur={() => handleBlur(6, '我想詢問關於日本留學的資訊')}
                // className="placeholder"
                value={formData.tellus}
                id="tellus"
                name="tellus"
                onChange={handleChange}
              />
            </label>
            <div className="privicy">
              <label>
                <input type="checkbox" id="privicy" name="privicy" required />
                <span>
                  我已閱讀
                  <Link
                    to="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    required
                  >
                    隱私政策*
                  </Link>
                </span>
              </label>
            </div>

            <button type="submit" className="submitBtn" disabled={loading}>
              {loading ? "送出中..." : "送出表單"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
