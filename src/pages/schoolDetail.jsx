import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // 用來獲取 URL 中的 slug
import { client, urlFor } from '../cms/sanityClient';

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
      <div>
        <p>文章加載中⋯⋯</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div>
        <p>沒有文章</p>
      </div>
    );
  }

  return (
    <>
      <h1>{school.name}</h1>
      <ul>
        <li>住址：{school.address}</li>
        <li>電話：{school.phone}</li>
      </ul>
      <div>
        <p>{school.description}</p>
      </div>
      {school.slideshow && school.slideshow.length > 0 ? (
        <div className="slider">
          {school.slideshow.map((image, imgIndex) => (
            <img
              key={imgIndex}
              src={urlFor(image).url()} // 使用 urlFor 函數生成圖片 URL
              alt={`${school.name} image ${imgIndex + 1}`}
            />
          ))}
        </div>
      ) : (
        <p>No images available</p> // 如果沒有圖片，顯示提示信息
      )}
    </>
  );
}
