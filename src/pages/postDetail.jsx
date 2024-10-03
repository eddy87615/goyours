import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // 用來獲取 URL 中的 slug
import { client, urlFor } from '../cms/sanityClient';
import { PortableText } from '@portabletext/react'; // 用來顯示富文本

// 文章詳情頁
export default function PostDetail() {
  const { slug } = useParams(); // 從 URL 獲取文章 slug
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
      }
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

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
      <div>
        <p>文章加載中⋯⋯</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <p>沒有文章</p>
      </div>
    );
  }

  return (
    <div>
      {post.mainImage && (
        <img src={urlFor(post.mainImage).url()} alt={post.title} width={500} />
      )}
      <h1>{post.title}</h1>
      <div>
        <PortableText value={post.body} />
      </div>
      <ul>
        <li>Views: {post.views || 0}</li>
        <li>Published: {new Date(post.publishedAt).toLocaleDateString()}</li>
        {post.author && <li>Author: {post.author.name}</li>}
      </ul>
    </div>
  );
}
