import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { client } from '../cms/sanityClient';

import PostArea from '../components/postArea/postArea';
import PostCategary from '../components/postCategory/postCategory';
import LoadingBear from '../components/loadingBear/loadingBear';
import useSearchHandler from '../hook/useSearchHandler';
import './goyours-post.css';

export default function Post() {
  const { searchQuery, setSearchQuery, handleSearch } = useSearchHandler(); // 從 Hook 中解構 setSearchQuery

  const [categories, setCategories] = useState([
    { label: '所有文章', value: null },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0); // 總文章數
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 當前頁
  const postPerPage = 10; // 每頁文章數

  const handleCategoryClick = (category) => {
    if (selectedCategory === category && searchQuery === '') return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (category === null) {
      setSearchQuery(''); // 清空搜索關鍵字
      setSelectedCategory(null); // 清空分類
    } else {
      setSelectedCategory(category); // 設置為選中的分類
      setSearchQuery(''); // 清空搜索關鍵字
    }

    setCurrentPage(1);
  };

  const location = useLocation();

  useEffect(() => {
    // 如果有來自路由狀態的 searchQuery，更新搜索關鍵字
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
      setSelectedCategory(null); // 清空分類篩選
      setCurrentPage(1); // 重置到第1頁
    }
  }, [location.state]);

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

      // 動態生成查詢條件
      const categoryFilter = selectedCategory
        ? `&& "${selectedCategory}" in categories[]->title`
        : '';
      const searchFilter = searchQuery ? `&& title match "${searchQuery}"` : '';

      const query = `
        *[_type == "post" && !(_id in path("drafts.**")) ${categoryFilter} ${searchFilter}] | order(publishedAt desc) [${start}...${end}] {
          title,
          body[0...1],
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

      // 查詢文章和總數
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

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
      setSearchQuery('');
      setCurrentPage(1);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="postLoading pageLoading">
        <LoadingBear />
      </div>
    );
  }

  return (
    <>
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
          <div className="postLoading postSearchResult">
            <p>沒有相關文章ಥ∀ಥ</p>
            {searchQuery ? <p>搜尋關鍵字：{searchQuery}</p> : ''}
          </div>
        ) : (
          <PostArea
            posts={posts}
            totalPages={Math.ceil(totalPosts / postPerPage)}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            handleCategoryClick={handleCategoryClick}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        )}
      </div>
    </>
  );
}
