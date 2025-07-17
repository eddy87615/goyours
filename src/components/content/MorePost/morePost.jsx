/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { client, urlFor } from '../../../services/sanity/client'; // 引入Sanity客戶端
import { Link } from 'react-router-dom';

import './morePost.css';

export default function MorePost({ isSubmited }) {
  const [posts, setPosts] = useState([]);
  const [randomPosts, setRandomPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await client.fetch(`
            *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
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
  return (
    <>
      {' '}
      <div className="morepostH2">
        <h2 className="yellow underLine">
          延伸閱讀
          {/* <GoyoursBearMorePost /> */}
        </h2>
      </div>
      <div className="submitPostList">
        {randomPosts.map((post, index) => (
          <Link
            key={index}
            className="submitPostLink"
            to={`/goyours-post/${post.slug.current}`}
          >
            <div className="more-post-img-frame">
              <img src={urlFor(post.mainImage).url()} alt={post.title} />
            </div>
            <p className="morepost-title">{post.title}</p>
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
    </>
  );
}
