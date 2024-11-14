import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // 確保使用 useLocation 來監聽傳遞的狀態

import { client } from '../cms/sanityClient';
import PostArea from '../components/postArea/postArea';
import PostCategary from '../components/postCategory/postCategory';
import './post.css';

export default function Post() {
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

  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 返回到頁面的最頂端
    setSearchQuery('');
  };

  // 监听 location.state 的变化
  const location = useLocation(); // 接收路由傳遞的狀態
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory); // 如果有新的分类传入，更新 selectedCategory
    }
  }, [location.state]);

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
      <div className="postLoading loading">
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
        categories={categories}
        handleCategoryClick={handleCategoryClick}
        handleSearch={handleSearch}
        title="文章分類"
      />
      {filteredPosts.length === 0 ? (
        <div className="postLoading">
          <p>沒有相關文章ಥ∀ಥ</p>
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
