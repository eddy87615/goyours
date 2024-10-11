import { useState, useEffect } from 'react';
import { client } from '../../cms/sanityClient'; // 引入Sanity客戶端
import './contactForm.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    lineId: '',
    email: '',
    selectedCases: [],
    callTime: '',
  });
  const [caseOptions, setCaseOptions] = useState([]);

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
      remarks: '', // 備註初始為空
      upTime: currentDateTime, // 表單送出時間
    };

    try {
      // 將資料發送到 Sanity
      await client.create(contactData);
      alert('資料已成功提交');
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

  return (
    <div>
      <form className="contactForm" onSubmit={handleSubmit}>
        <label htmlFor="name">
          真實姓名：
          <br />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="age">
          年齡：
          <br />
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="phone">
          行動電話：
          <br />
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="lineId">
          LINE ID：
          <br />
          <input
            id="lineId"
            name="lineId"
            value={formData.lineId}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email">
          電子郵件：
          <br />
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="case">
          想詢問的方案：
          <br />
          {caseOptions.map((option) => (
            <label key={option._id}>
              <input
                type="checkbox"
                value={option.title}
                checked={formData.selectedCases.includes(option.title)}
                onChange={handleCheckboxChange}
              />
              {option.title}
            </label>
          ))}
        </label>
        <label>
          方便聯絡時段：
          <br />
          <input
            type="text"
            id="callTime"
            name="callTime"
            value={formData.callTime}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
