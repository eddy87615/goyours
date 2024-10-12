/* eslint-disable react/prop-types */
import { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../../cms/sanityClient'; // 导入 urlFor
import { Link } from 'react-router-dom';
import Pagination from '../pagination/pagination';
import './postArea.css'; // 导入样式表

// import { BiShow, BiCalendar, BiEditAlt, BiPurchaseTag } from 'react-icons/bi';

// PostArea 組件：渲染傳入的文章數據
// eslint-disable-next-line react/prop-types
export default function PostArea({ posts, handleCategoryClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 2;

  // 分頁邏輯
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="postRight">
      {currentPosts.map((post, index) => (
        <div key={index} className="postarea">
          {post.mainImage && (
            <Link to={`/post/${post.slug.current}`} className="imgLink">
              <img src={urlFor(post.mainImage).url()} alt={post.title} />
            </Link>
          )}
          <div className="postListInfo">
            <h1>
              <Link to={`/post/${post.slug.current}`}>{post.title}</Link>{' '}
            </h1>
            <ul className="info">
              {/* <li className="view">
                <BiShow className="icon" />
                {post.views || 0}
              </li> */}
              {/* {post.author ? (
                <li className="author">
                  <BiEditAlt className="icon" />
                  {post.author.name}
                </li>
              ) : (
                <li className="author">無作者</li>
              )} */}
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
              {/* <BiCalendar className="icon" /> */}
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
            <div className="textPart">
              <PortableText value={post.body} />
            </div>
            {/* <Link to={`/post/${post.slug.current}`}>Read More</Link>{' '} */}
          </div>
        </div>
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
