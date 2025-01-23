/* eslint-disable react/prop-types */
import './postArea.css';
import Pagination from '../pagination/pagination';
// import { PortableText } from '@portabletext/react';
import { Link } from 'react-router-dom';
import { urlFor } from '../../cms/sanityClient';

const extractPlainText = (body) => {
  return body
    .map((block) => {
      if (block._type === 'block' && block.children) {
        return block.children
          .filter((child) => child._type === 'span')
          .map((span) => span.text)
          .join('');
      }
      return ''; // Ignore non-text content
    })
    .join(' ');
};
//

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
            <h1>
              <Link to={`/goyours-post/${post.slug.current}`} target="_blank">
                {highlightText(post.title, searchQuery)}
              </Link>
            </h1>
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
              <p>{extractPlainText(post.body)}</p>
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
