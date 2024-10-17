import { useEffect, useState } from 'react';
import { client } from '../cms/sanityClient';
import PostArea from '../components/postArea/postArea';
import PostCategary from '../components/postCategory/postCategory';
import './post.css';

export default function Post() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [filteredPostsAfter, setFilteredPostsAfter] = useState([]); // 篩選後的文章
  const [loading, setLoading] = useState(true);

  const handleSearch = (query) => {
    setSearchQuery(query || '');
    setSelectedCategory(null);
  };

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
      setPosts(posts);
      setFilteredPostsAfter(posts);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    let tempPosts = [...posts];

    // 如果選擇了標籤
    if (selectedCategory) {
      tempPosts = tempPosts.filter((post) =>
        post.categories.some((category) => category.title === selectedCategory)
      );
    }

    // 如果有搜尋內容
    if (searchQuery) {
      tempPosts = tempPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPostsAfter(tempPosts); // 更新篩選結果
  }, [searchQuery, selectedCategory, posts]);

  if (loading) {
    return (
      <div className="postLoading">
        <p>文章加載中⋯⋯</p>
      </div>
    );
  }
  if (!posts.length) {
    return (
      <div className="postLoading">
        <p>沒有文章</p>
      </div>
    );
  }

  const filteredPosts = Array.isArray(posts)
    ? posts.filter((post) => {
        const matchesCategory =
          !selectedCategory ||
          post.categories.some(
            (category) => category.title === selectedCategory
          );
        const matchesSearch =
          !searchQuery ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      })
    : [];

  return (
    <div className="postPage">
      <PostCategary
        handleCategoryClick={handleCategoryClick}
        handleSearch={handleSearch}
      />
      {filteredPosts.length === 0 ? (
        <div className="postLoading">
          <p>沒有這個標籤的文章ＱＡＱ"</p>
        </div>
      ) : (
        <PostArea
          posts={filteredPosts} // 傳遞篩選後的文章數據
          selectedCategory={selectedCategory}
          handleCategoryClick={handleCategoryClick}
        />
      )}
    </div>
  );
}
