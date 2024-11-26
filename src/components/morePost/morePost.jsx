import { useState, useEffect } from 'react';
import { client } from '../../cms/sanityClient'; // 引入Sanity客戶端
import { urlFor } from '../../cms/sanityClient'; // 导入 urlFor
import { Link } from 'react-router-dom';

import './morePost.css';
import GoyoursBearMorePost from '../goyoursBear/goyoursBear-morepost';

export default function MorePost({ isSubmited }) {
  const [posts, setPosts] = useState([]);
  const [randomPosts, setRandomPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await client.fetch(`
            *[_type == "post"] | order(publishedAt desc) {
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
        <h2 className="yellow">
          延伸閱讀
          <GoyoursBearMorePost />
        </h2>
      </div>
      <div className="submitPostList">
        {randomPosts.map((post, index) => (
          <Link
            key={index}
            className="submitPostLink"
            to={`/goyours-post/${post.slug.current}`}
          >
            <img src={urlFor(post.mainImage).url()} alt={post.title} />
            <h3>{post.title}</h3>
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
