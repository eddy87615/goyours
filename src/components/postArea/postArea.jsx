import { PortableText } from '@portabletext/react'; // 导入 PortableText
import { useEffect, useState } from 'react';
import { client, urlFor } from '../../cms/sanityClient'; // 导入 client 和 urlFor
import { Link } from 'react-router-dom'; // 导入 Link 用于页面跳转
import './postArea.css'; // 导入样式表

import { BiShow, BiCalendar, BiEditAlt, BiPurchaseTag } from 'react-icons/bi';

// PostArea 組件：顯示文章摘要
// eslint-disable-next-line react/prop-types
export default function PostArea({ selectedCategory, handleCategoryClick }) {
  const [posts, setPosts] = useState([]); // 狀態來保存數據
  const [loading, setLoading] = useState(true); // 用來處理加載狀態

  // 使用 useEffect 來進行數據加載
  useEffect(() => {
    async function fetchPosts() {
      const posts = await client.fetch(`
        *[_type == "post"] | order(publishedAt desc) {
          title,
          body,
          publishedAt,
          mainImage,
          slug,
          views,
          categories[]->{
            title
          },
          author->{
            name
          }
        }
      `);
      setPosts(posts); // 設置加載後的數據
      setLoading(false); // 加載完成後設置 loading 狀態
    }
    fetchPosts(); // 調用異步函數
  }, []); // 空依賴數組表示只在組件掛載時執行一次

  if (loading) {
    return (
      <div className="loading">
        <p>文章加載中⋯⋯</p>
      </div>
    );
  }

  const filteredPosts = Array.isArray(posts)
    ? selectedCategory
      ? posts.filter((post) =>
          post.categories.some(
            (category) => category.title === selectedCategory
          )
        )
      : posts
    : [];

  return (
    <div className="postRight">
      {filteredPosts.map((post, index) => (
        <div key={index} className="postarea">
          {post.mainImage && (
            <Link to={`/post/${post.slug.current}`}>
              <img src={urlFor(post.mainImage).url()} alt={post.title} />
            </Link>
          )}
          <ul className="info">
            <li className="view">
              <BiShow style={{ fontSize: '1.2rem' }} />
              {post.views || 0}
            </li>
            <li className="date">
              <BiCalendar style={{ fontSize: '1.2rem' }} />
              {new Date(post.publishedAt).toLocaleDateString()}
            </li>
            {post.author ? (
              <li className="author">
                <BiEditAlt style={{ fontSize: '1.2rem' }} />
                {post.author.name}
              </li>
            ) : (
              <li className="author">無作者</li>
            )}
            {post.categories && post.categories.length > 0 ? (
              <li className="category">
                <BiPurchaseTag style={{ fontSize: '1.2rem' }} />
                {post.categories.map((category, index) => (
                  <a
                    key={index}
                    onClick={() => handleCategoryClick(category.title)}
                  >
                    {category.title}
                  </a>
                ))}
              </li>
            ) : (
              <li className="category">無分類</li>
            )}
          </ul>
          <h1>
            <Link to={`/post/${post.slug.current}`}>{post.title}</Link>{' '}
          </h1>
          <div className="textPart">
            <PortableText value={post.body} />
          </div>
          <Link to={`/post/${post.slug.current}`}>Read More</Link>{' '}
        </div>
      ))}
    </div>
  );
}
