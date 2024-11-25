import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { client } from '../cms/sanityClient';
import PostArea from '../components/postArea/postArea';
import PostCategary from '../components/postCategory/postCategory';
import './goyours-post.css';

export default function Post() {
  const [categories, setCategories] = useState([
    { label: '所有文章', value: null },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPostsAfter, setFilteredPostsAfter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSpSearchClicked, setIsSpSearchClicked] = useState(false);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) return; // 避免重复更新状态
    setSelectedCategory(category); // 更新分类
    setSearchQuery(''); // 清空搜索关键字
    setIsSpSearchClicked(false); // 关闭 SP 搜索视窗
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 滚动到页面顶部
  };

  const location = useLocation();
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  const handleSearch = (query) => {
    setSearchQuery(query || '');
    setSelectedCategory(null);
  };

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

    fetchCategories();
    fetchPosts();
  }, []);

  useEffect(() => {
    let tempPosts = [...posts];
    if (selectedCategory) {
      tempPosts = tempPosts.filter((post) =>
        post.categories.some((category) => category.title === selectedCategory)
      );
    }
    if (searchQuery) {
      tempPosts = tempPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredPostsAfter(tempPosts);
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
        <p>沒有相關文章ಥ∀ಥ</p>
      </div>
    );
  }

  const filteredPosts = filteredPostsAfter;

  return (
    <div className="postPage">
      <PostCategary
        categories={categories}
        handleCategoryClick={handleCategoryClick}
        handleSearch={handleSearch}
        placeholder="搜尋文章⋯"
        title="文章分類"
        isSpSearchClicked={isSpSearchClicked}
        setIsSpSearchClicked={setIsSpSearchClicked}
      />
      {filteredPosts.length === 0 ? (
        <div className="postLoading">
          <p>沒有相關文章ಥ∀ಥ</p>
        </div>
      ) : (
        <PostArea
          posts={filteredPosts}
          selectedCategory={selectedCategory}
          handleCategoryClick={handleCategoryClick}
        />
      )}
    </div>
  );
}
