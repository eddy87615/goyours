import { client, urlFor } from '../../cms/sanityClient'; // 导入 client 和 urlFor
import { useEffect, useState } from 'react'; // 导入 useEffect 和 useState
import { Link } from 'react-router-dom'; // 导入 Link 用于页面跳转
import './school.css'; // 导入样式表

export default function School() {
  const [schools, setSchools] = useState([]); // 存储学校数据
  const [loading, setLoading] = useState(true); // 加载状态

  // 使用 useEffect 來處理異步數據加載
  useEffect(() => {
    async function fetchSchools() {
      try {
        const result = await client.fetch(`
          *[_type == "school"] | order(publishedAt desc) {
            name,
            adress,
            transportation,
            phone,
            website,
            description,
            slideshow,
            mainImage,
            slug
          }
        `);
        setSchools(result); // 将返回的数据存储在状态中
        setLoading(false); // 加载完成
      } catch (error) {
        console.error('Failed to fetch schools:', error);
        setLoading(false); // 即使加载失败也要关闭加载状态
      }
    }

    fetchSchools(); // 调用异步函数
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  // 加载时显示的内容
  if (loading) {
    return <p>Loading...</p>;
  }

  // 如果没有学校数据，显示提示信息
  if (!schools.length) {
    return <p>No schools available</p>;
  }

  return (
    <>
      {schools.map((school, index) => (
        <Link key={index} to={`/school/${school.slug.current}`}>
          <div className="school">
            {school.slideshow && school.slideshow.length > 0 ? (
              <div className="schoolimg">
                <img
                  src={urlFor(school.mainImage).url()} // 使用 urlFor 函數生成圖片 URL
                  alt={`${school.name} image`}
                />
              </div>
            ) : (
              <p>No images available</p> // 如果没有图片，显示提示信息
            )}
            <h2>{school.name}</h2>
          </div>
        </Link>
      ))}
    </>
  );
}
