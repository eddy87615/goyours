/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 用來獲取 URL 中的 slug
import { client, urlFor } from '../cms/sanityClient';
import { PortableText } from '@portabletext/react'; // 用來顯示富文本
import { Link } from 'react-router-dom';

import PostCategary from '../components/postCategory/postCategory';
import ContactUs from '../components/contactUs/contactUs';
import PostCatalog from '../components/postCatalog/postCatalog';
import GoyoursBearRelatedPost from '../components/goyoursBear/goyoursBear-relatedpost';

import { LuEye } from 'react-icons/lu';

import './postDetail.css';

const customComponents = {
  types: {
    image: ({ value }) => {
      if (!value.asset) return null;
      return (
        <div className="post-image">
          <img src={urlFor(value).url()} alt={value.alt || 'Image'} />
        </div>
      );
    },
    gallery: ({ value }) => {
      if (!value.images || value.images.length === 0) return null;
      return (
        <div className="gallery">
          {value.images.map((image, index) => (
            <img
              key={index}
              src={urlFor(image).url()}
              alt={`Gallery Image ${index + 1}`}
              className="gallery-image"
            />
          ))}
        </div>
      );
    },
  },
  marks: {
    color: ({ children, value }) => (
      <span style={{ color: value?.hex || '#000' }}>{children}</span>
    ),
    favoriteColor: ({ children, value }) => (
      <span style={{ color: value?.hex || '#000' }}>{children}</span>
    ),
  },
};

// 文章詳情頁
export default function PostDetail({ handleSearch }) {
  const categories = [
    { label: '所有文章', value: null },
    { label: '最新消息', value: '最新消息' },
    { label: '日本SGU項目', value: '日本SGU項目' },
    { label: '日本EJU', value: '日本EJU' },
    { label: '日本介護・護理相關', value: '日本介護・護理相關' },
    { label: '日本特定技能一號簽證', value: '日本特定技能一號簽證' },
    { label: '日本相關', value: '日本相關' },
    { label: '日本留學', value: '日本留學' },
    { label: '打工度假', value: '打工度假' },
  ];

  const { slug } = useParams(); // 從 URL 獲取文章 slug
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const navigate = useNavigate();
  const handleSortClick = (selectedCategory) => {
    navigate('/post', { state: { selectedCategory } });
  };

  const handleRelatedPostClick = (slug) => {
    navigate(`/post/${slug}`);
    window.location.reload(); // 强制页面刷新
  };

  useEffect(() => {
    async function fetchPost() {
      const post = await client.fetch(
        `
        *[_type == "post" && slug.current == $slug][0] {
          _id,
          title,
          body,
          publishedAt,
          mainImage,
          views,
          categories[]->{
            title
          },
          author->{
            name
          }
        }
      `,
        { slug }
      );

      if (post) {
        console.log('Fetched post ID:', post._id);
        await updateViews(post._id, post.views || 0);
        setPost({ ...post, views: (post.views || 0) + 1 });

        fetchRelatedPosts(post.categories, slug);
      }
      setLoading(false);
    }

    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function fetchRelatedPosts(categories, currentSlug) {
    if (!categories || categories.length === 0) return;

    // 提取类别标题用于查询相关帖子
    const categoryTitles = categories.map((cat) => cat.title);

    // 先获取相同标签的相关文章
    let relatedPosts = await client.fetch(
      `
      *[_type == "post" && slug.current != $currentSlug && count(categories[]->title in $categoryTitles) > 0] | order(publishedAt desc)[0...3] {
        title,
        publishedAt,
        mainImage,
        slug,
        categories[]->{
          title
        }
      }
      `,
      { currentSlug, categoryTitles }
    );

    const fetchedSlugs = new Set(relatedPosts.map((post) => post.slug.current));

    // 如果相关文章不足三篇，则从所有文章中补足
    if (relatedPosts.length < 3) {
      const additionalPosts = await client.fetch(
        `
        *[_type == "post" && slug.current != $currentSlug && !(slug.current in $fetchedSlugs)] | order(publishedAt desc)[0...${
          3 - relatedPosts.length
        }]  {
          title,
          publishedAt,
          mainImage,
          slug,
          categories[]->{
            title
          }
        }
        `,
        { currentSlug, fetchedSlugs: Array.from(fetchedSlugs) }
      );

      // 将其他文章加入到相关文章中
      relatedPosts = [...relatedPosts, ...additionalPosts];
    }

    setRelatedPosts(relatedPosts);
  }

  async function updateViews(postId, currentViews) {
    await client
      .patch(postId)
      .set({ views: currentViews + 1 })
      .commit()
      .catch((err) => {
        console.error('更新 views 失敗', err);
      });
  }

  if (loading) {
    return (
      <div className="postLoading loading">
        <p>文章加載中⋯⋯</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <p className="postLoading">沒有文章</p>
      </div>
    );
  }

  return (
    <>
      <div className="postDetailSection">
        <PostCategary
          categories={categories}
          handleCategoryClick={handleSortClick}
          handleSearch={handleSearch}
          title="文章分類"
        />
        <div className="postbody">
          {post.mainImage && (
            <img
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              width={500}
            />
          )}
          <div className="postinfolist">
            <ul>
              <li className="postDetaildate">
                <p>
                  {new Date(post.publishedAt)
                    .toLocaleDateString('zh-TW', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                    .replace(/\//g, '.')}
                </p>
              </li>
              <li className="postDetailviews">
                <LuEye className="viewsicon" />
                <p>瀏覽次數：{post.views || 0}</p>
              </li>
            </ul>
            <ul>
              {post.categories.map((category, index) => (
                <li key={index} className="postDetailtags">
                  <p>#{category.title}</p>
                </li>
              ))}
            </ul>
          </div>
          <h1>{post.title}</h1>
          <PostCatalog />
          <div className="postTxtarea">
            <PortableText value={post.body} components={customComponents} />
          </div>

          {relatedPosts.length > 0 && (
            <div className="relatedPosts">
              <div className="relatedpostH2">
                <h2 className="yellow">
                  更多相關文章
                  <GoyoursBearRelatedPost />
                </h2>
              </div>
              <div className="relatedpostsList">
                {relatedPosts.map((relatedPost, index) => (
                  <Link
                    key={index}
                    className="relatedpostsLink"
                    to={`/goyours-post/${relatedPost.slug.current}`}
                    onClick={() =>
                      handleRelatedPostClick(relatedPost.slug.current)
                    }
                  >
                    <img
                      src={urlFor(relatedPost.mainImage).url()}
                      alt={relatedPost.title}
                    />
                    <h3>{relatedPost.title}</h3>
                    <ul>
                      {relatedPost.categories.map((category, idx) => (
                        <li key={idx}>#{category.title}</li>
                      ))}
                    </ul>
                    <div className="submitPostDate">
                      <p>
                        {new Date(relatedPost.publishedAt)
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
            </div>
          )}
        </div>
        <div></div>
      </div>

      <div className="postDetialContactus">
        <ContactUs />
      </div>
    </>
  );
}
