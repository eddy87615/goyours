import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { client } from '../cms/sanityClient';
import { HelmetProvider, Helmet } from 'react-helmet-async';

import PostArea from '../components/postArea/postArea';
import PostCategary from '../components/postCategory/postCategory';
import LoadingBear from '../components/loadingBear/loadingBear';
import './goyours-post.css';

export default function Post() {
  const [categories, setCategories] = useState([
    { label: '所有文章', value: null },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0); // 總文章數
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 當前頁
  const postPerPage = 10; // 每頁文章數

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedCategory(category);
    setSearchQuery('');
    setCurrentPage(1); // 重置到第1頁
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
    setCurrentPage(1); // 重置到第1頁
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
      setLoading(true);

      const start = (currentPage - 1) * postPerPage;
      const end = start + postPerPage;

      // 根據分類或關鍵字動態生成查詢
      const categoryFilter = selectedCategory
        ? `&& "${selectedCategory}" in categories[]->title`
        : '';
      const searchFilter = searchQuery ? `&& title match "${searchQuery}"` : '';

      const query = `
        *[_type == "post" && !(_id in path("drafts.**")) ${categoryFilter} ${searchFilter}] | order(publishedAt desc) [${start}...${end}] {
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
      `;

      const totalQuery = `
        count(*[_type == "post" ${categoryFilter} ${searchFilter}])
      `;

      // 查詢符合條件的文章總數和當前頁數據
      const [fetchedPosts, total] = await Promise.all([
        client.fetch(query),
        client.fetch(totalQuery),
      ]);

      setPosts(fetchedPosts);
      setTotalPosts(total);
      setLoading(false);
    }

    fetchCategories();
    fetchPosts();
  }, [currentPage, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="postLoading pageLoading">
        <LoadingBear />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Go Yours文章分享</title>
        <meta name="description" content="Go Yours跟你分享關於日本的點點滴滴" />
      </Helmet>
      <div className="postPage">
        <PostCategary
          categories={categories}
          handleCategoryClick={handleCategoryClick}
          handleSearch={handleSearch}
          placeholder="搜尋文章⋯"
          title="文章分類"
          isSpSearchClicked={false}
          setIsSpSearchClicked={() => {}}
        />
        {posts.length === 0 ? (
          <div className="postLoading">
            <p>沒有相關文章ಥ∀ಥ</p>
          </div>
        ) : (
          <PostArea
            posts={posts}
            totalPages={Math.ceil(totalPosts / postPerPage)}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            handleCategoryClick={handleCategoryClick}
          />
        )}
      </div>
    </HelmetProvider>
  );
}
