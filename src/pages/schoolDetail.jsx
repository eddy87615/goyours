import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // 用來獲取 URL 中的 slug
import { client } from '../cms/sanityClient';
import { IoLocationOutline, IoSchoolOutline } from 'react-icons/io5';
import { BsTelephone } from 'react-icons/bs';

import BreadCrumb from '../components/breadCrumb/breadCrumb';
import './schoolDetail.css';
// 文章詳情頁
export default function SchoolDetail() {
  const { slug } = useParams(); // 從 URL 獲取文章 slug
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const school = await client.fetch(
        `
        *[_type == "school" && slug.current == $slug][0] {
          name,address,transportation,phone,website,description,slideshow,slug
        }
      `,
        { slug }
      );
      setSchool(school);
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="loading">
        <p>文章加載中⋯⋯</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="loading">
        <p>沒有文章</p>
      </div>
    );
  }

  return (
    <div className="schoolDetailPage">
      <div className="picSlider">
        <BreadCrumb
          paths={[
            { name: '日本留學', url: '/studying' },
            { name: school.name },
          ]}
        />
      </div>
      <div>
        <h1>{school.name}</h1>
        <ul className="schoolInfo">
          <li>
            <IoLocationOutline className="icon" />
            <label>住址：</label>
            {school.address}
          </li>
          <li>
            <BsTelephone className="icon" />
            <label>電話：</label>
            {school.phone}
          </li>
          <li>
            <IoSchoolOutline className="icon" />
            <label>學校簡介：</label>
          </li>
          <p>{school.description}</p>
        </ul>
      </div>
    </div>
  );
}
