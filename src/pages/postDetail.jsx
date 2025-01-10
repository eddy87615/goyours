/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 用來獲取 URL 中的 slug
import { client, urlFor } from '../cms/sanityClient';
import { PortableText } from '@portabletext/react'; // 用來顯示富文本
import { Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';

import PostCategary from '../components/postCategory/postCategory';
import ContactUs from '../components/contactUs/contactUs';
import PostCatalog from '../components/postCatalog/postCatalog';
import GoyoursBearRelatedPost from '../components/goyoursBear/goyoursBear-relatedpost';
import LoadingBear from '../components/loadingBear/loadingBear';
import useSearchHandler from '../hook/useSearchHandler';
import MorePost from '../components/morePost/morePost';

import { LuEye } from 'react-icons/lu';

import './postDetail.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css'; // 引入核心樣式
import 'swiper/css/navigation'; // 引入導航按鈕樣式

const customComponents = {
  types: {
    image: ({ value }) => {
      // 直接确认 asset 是否存在，无需过多检查
      if (!value?.asset?._ref) {
        return null;
      }

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
          <Swiper
            navigation={true}
            modules={[Navigation]}
            loop
            className="mySwiper"
            spaceBetween={50}
          >
            {value.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={urlFor(image).url()}
                  alt={`Gallery Image ${index + 1}`}
                  className="gallery-image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      );
    },
    table: ({ value }) => {
      if (
        !value?.rows ||
        !Array.isArray(value.rows) ||
        value.rows.length === 0
      ) {
        return <p>No table data available</p>;
      }

      // 提取 `cells` 以获得真正的数据
      const sanitizedRows = value.rows.map((row) => {
        if (row?.cells && Array.isArray(row.cells)) {
          return row.cells;
        }
        return []; // 如果没有 cells，返回空数组
      });

      if (sanitizedRows.length === 0) {
        return <p>Invalid table data</p>;
      }

      // 合并表头的逻辑
      const mergeTableHeaders = (headers) => {
        const mergedHeaders = [];
        let currentHeader = null;
        let spanCount = 0;

        headers.forEach((header, index) => {
          if (header === currentHeader) {
            // 如果当前 header 和前一个相同，增加 colspan
            spanCount++;
          } else {
            // 保存之前的 header
            if (currentHeader !== null) {
              mergedHeaders.push({
                content: currentHeader,
                colspan: spanCount,
              });
            }
            // 更新当前 header
            currentHeader = header;
            spanCount = 1;
          }
        });

        // 保存最后一个 header
        if (currentHeader !== null) {
          mergedHeaders.push({ content: currentHeader, colspan: spanCount });
        }

        return mergedHeaders;
      };

      const headers = sanitizedRows[0];
      const mergedHeaders = mergeTableHeaders(headers);

      return (
        <table border="1" style={{ borderCollapse: 'collapse', width: '90%' }}>
          <thead>
            <tr>
              {mergedHeaders.map((header, index) => (
                <th key={index} colSpan={header.colspan}>
                  {header.content || ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sanitizedRows.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell || ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
    span: ({ value, children }) => {
      return <span>{children}</span>;
    },
  },
  marks: {
    color: ({ children, value }) => {
      const color = value?.hex?.hex || '#FF0000';

      return (
        <span
          style={{
            color,
          }}
        >
          {children}
        </span>
      );
    },
  },
};

const cache = new Map();
const CACHE_LIFETIME = 5 * 60 * 1000;

// 儲存快取時加入時間戳記
function setCache(key, data) {
  const expiryTime = Date.now() + CACHE_LIFETIME;
  cache.set(key, { data, expiryTime });
}

// 取得快取時檢查是否過期
function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expiryTime) {
    // 如果過期，從快取中移除
    cache.delete(key);
    return null;
  }

  return cached.data;
}

// 文章詳情頁
export default function PostDetail() {
  const { slug } = useParams(); // 從 URL 獲取文章 slug
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const navigate = useNavigate();

  const handleSortClick = (selectedCategory) => {
    navigate('/goyours-post', {
      state: {
        selectedCategory: selectedCategory,
        searchQuery: '',
      },
    });
  };

  const handleSearch = (searchQuery) => {
    // 導向到文章列表頁面並帶上搜尋參數
    navigate('/goyours-post', {
      state: {
        searchQuery: searchQuery,
        selectedCategory: null, // 重置分類選擇
      },
    });
  };

  const handleRelatedPostClick = (slug) => {
    navigate(`/goyours-post/${slug}`);
    window.location.reload(); // 强制页面刷新
  };

  const [categories, setCategories] = useState([
    { label: '所有文章', value: null },
  ]); // 儲存分類數據

  // 取得分類數據
  useEffect(() => {
    async function fetchCategories() {
      const categoriesData = await client.fetch(`
        *[_type == "category"] {
          title
        }
      `);
      const fetchedCategories = categoriesData.map((cat) => ({
        label: cat.title,
        value: cat.title,
      }));
      setCategories([{ label: '所有文章', value: null }, ...fetchedCategories]);
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setPost(null); // 清空舊數據

      const cacheKey = `post-${slug}`;

      const cachedPost = getCache(cacheKey);

      if (cachedPost) {
        console.log('Using caches data');
        setPost(cachedPost);
        setLoading(false);
        return;
      }

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
          },
          description

        }
      `,
        { slug }
      );

      if (post) {
        console.log('Fetched post ID:', post._id);
        await updateViews(post._id, post.views || 0);
        const updatedPost = { ...post, views: (post.views || 0) + 1 };

        setCache(cacheKey, updatedPost);

        setPost(updatedPost);
      }
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  // useEffect(() => {
  //   if (post && post.categories) {
  //     fetchRelatedPosts(post.categories, slug);
  //   }
  // }, [post, slug]);

  // async function fetchRelatedPosts(categories, currentSlug) {
  //   if (!categories || categories.length === 0) return;

  //   // 提取类别标题用于查询相关帖子
  //   const categoryTitles = categories.map((cat) => cat.title);

  //   // 先获取相同标签的相关文章
  //   let relatedPosts = await client.fetch(
  //     `
  //     *[_type == "post" && slug.current != $currentSlug && count(categories[]->title in $categoryTitles) > 0] | order(publishedAt desc)[0...3] {
  //       title,
  //       publishedAt,
  //       mainImage,
  //       slug,
  //       categories[]->{
  //         title
  //       },
  //     }
  //     `,
  //     { currentSlug, categoryTitles }
  //   );

  //   const fetchedSlugs = new Set(relatedPosts.map((post) => post.slug.current));

  //   // 如果相关文章不足三篇，则从所有文章中补足
  //   if (relatedPosts.length < 3) {
  //     const additionalPosts = await client.fetch(
  //       `
  //       *[_type == "post" && slug.current != $currentSlug && !(slug.current in $fetchedSlugs)] | order(publishedAt desc)[0...${
  //         3 - relatedPosts.length
  //       }]  {
  //         title,
  //         publishedAt,
  //         mainImage,
  //         slug,
  //         categories[]->{
  //           title
  //         }
  //       }
  //       `,
  //       { currentSlug, fetchedSlugs: Array.from(fetchedSlugs) }
  //     );

  //     // 将其他文章加入到相关文章中
  //     relatedPosts = [...relatedPosts, ...additionalPosts];
  //   }

  //   setRelatedPosts(relatedPosts);
  // }

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
      <div className="postLoading pageLoading">
        <LoadingBear />
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <p className="postLoading nopost-warning">
          沒有文章
          <span className="nopost">
            <img src="/goyoursbear-B.svg" alt="goyours bear gray" />
          </span>
        </p>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Go Yours文章分享：{post.title}</title>
        <meta name="description" content={`${post.description}`} />
      </Helmet>
      <div className="postDetailSection">
        <PostCategary
          categories={categories}
          handleCategoryClick={handleSortClick}
          handleSearch={handleSearch} // 使用新的 handleSearch
          placeholder="搜尋文章⋯"
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

          <MorePost />
        </div>
      </div>

      <div className="postDetialContactus">
        <ContactUs />
      </div>
    </HelmetProvider>
  );
}
