/* eslint-disable react/prop-types */
import './postArea.css';
import Pagination from '../pagination/pagination';
import { PortableText } from '@portabletext/react';
import { Link } from 'react-router-dom';
import { urlFor } from '../../cms/sanityClient';

const customComponents = {
  types: {},
  block: {
    normal: ({ children }) => <p>{children}</p>, // 普通文本渲染為 <p>
    h1: ({ children }) => <p>{children}</p>, // 將 h1 渲染為 <p>
    h2: ({ children }) => <p>{children}</p>, // 將 h2 渲染為 <p>
    h3: ({ children }) => <p>{children}</p>, // 將 h3 渲染為 <p>
    h4: ({ children }) => <p>{children}</p>, // 同理處理其他標題
    h5: ({ children }) => <p>{children}</p>,
    h6: ({ children }) => <p>{children}</p>,
  },
  marks: {
    link: ({ children }) => <span>{children}</span>, // 避免渲染內層 <a>
  },
  // 默認對於未定義的類型不進行渲染
  default: () => null,
};

const highlightText = (text, query) => {
  if (!query) return text;

  const escapeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapeQuery})`, 'gi');

  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

export default function PostArea({
  posts,
  totalPages,
  currentPage,
  onPageChange,
  handleCategoryClick,
  searchQuery,
  selectedCategory,
}) {
  return (
    <div className="postRight">
      {searchQuery ? (
        <p className="post-searchword">搜尋關鍵字：{searchQuery}</p>
      ) : (
        <></>
      )}
      {selectedCategory ? (
        <p className="post-searchword">目前分類：{selectedCategory}</p>
      ) : null}

      {posts.map((post, index) => (
        <div key={index} className="postarea">
          {post.mainImage && (
            <Link
              to={`/goyours-post/${post.slug.current}`}
              className="imgLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={urlFor(post.mainImage).url()} alt={post.title} />
            </Link>
          )}
          <div className="postListInfo">
            <h2>
              <Link to={`/goyours-post/${post.slug.current}`} target="_blank">
                {highlightText(post.title, searchQuery)}
              </Link>
            </h2>
            <ul className="info">
              {post.categories && post.categories.length > 0 ? (
                <>
                  {/* <BiPurchaseTag className="icon" /> */}
                  {post.categories.map((category, index) => (
                    <li key={index} className="category">
                      <a onClick={() => handleCategoryClick(category.title)}>
                        #{category.title}
                      </a>
                    </li>
                  ))}
                </>
              ) : (
                <li className="category">無分類</li>
              )}
            </ul>
            <p className="date">
              <span>
                <img src="/圓形logo.png" alt="goyours logo" />
              </span>
              {new Date(post.publishedAt)
                .toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\//g, '.')}
            </p>
            <div className="textPart">
              <PortableText value={post.body} components={customComponents} />
            </div>
          </div>
        </div>
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
