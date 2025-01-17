/* eslint-disable no-unused-vars */

import './App.css';
import React, { useEffect, Suspense, lazy, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Navigation from './components/navigation/navigation';
import Footer from './components/footer/footer';
import ScrollToTop from './components/scrollToTop/scrollToTop';
import useGetKeyWords from './hook/useGetKeyWords';
import { VisibilityProvider } from './visibilityProvider';
import LoadingBear from './components/loadingBear/loadingBear';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster, toast } from 'react-hot-toast';

// 使用 React.lazy 延遲加載每個頁面組件
const Home = lazy(() => import('./pages/home'));
const About = lazy(() => import('./pages/about-us'));
const Post = lazy(() => import('./pages/goyours-post'));
const PostDetail = lazy(() => import('./pages/postDetail'));
const Studying = lazy(() => import('./pages/studying'));
const SchoolDetail = lazy(() => import('./pages/schoolDetail'));
const Working = lazy(() => import('./pages/working'));
const Contact = lazy(() => import('./pages/contact-us'));
const ContactResume = lazy(() => import('./pages/contactResume'));
const Privacy = lazy(() => import('./pages/privacy'));
const QAsection = lazy(() => import('./pages/QAsection'));
const StudyingInJp = lazy(() => import('./pages/studying-in-jp'));
const WorkingHoliday = lazy(() => import('./pages/working-holiday'));
const DownloadPage = lazy(() => import('./pages/downloadPage'));
const InformBear = lazy(() => import('./components/informBear/informBear'));

// 路徑映射表
const PATH_TO_PAGE = {
  '/': '首頁',
  '/about-us': '關於我們',
  '/goyours-post': '文章專區',
  '/studying-in-jp': '日本留學',
  '/working-holiday': '打工度假',
  '/Q&A-section': '常見Q&A',
  '/document-download': '下載專區',
  '/contact-us': '聯絡我們',
};
function MetaManager() {
  const location = useLocation();
  const { loading, getKeywordsByPage, getDescriptionByPage, getTitleByPage } =
    useGetKeyWords();

  // 根據當前路徑獲取頁面名稱
  const pageName = PATH_TO_PAGE[location.pathname] || '首頁';

  if (loading) {
    return (
      <Helmet>
        <title>Go Yours：去你的打工度假</title>
        <meta
          name="description"
          content="讓Go Yours完成你的打工度假與留學的夢想"
        />
      </Helmet>
    );
  }

  const pageKeywords = getKeywordsByPage(pageName);
  const pageDescription = getDescriptionByPage(pageName);
  const pageTitle = getTitleByPage(pageName);
  const currentURL = `${window.location.origin}${location.pathname}`;

  return (
    <Helmet>
      <title>{`Go Yours：${pageTitle}`}</title>
      <meta name="keywords" content={pageKeywords} />
      <meta
        name="description"
        content={
          pageDescription
            ? pageDescription
            : '讓Go Yours完成你的打工度假與留學的夢想'
        }
      />
      <meta property="og:title" content={`Go Yours：${pageTitle}`} />
      <meta
        property="og:description"
        content={`Go Yours：${pageDescription}`}
      />
      <meta
        property="og:image"
        content="https://drive.google.com/file/d/1ANuhzbXQWHEeEstt9zGt-r2nwSyWlaon/view?usp=drive_link"
      />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`Go Yours：${pageTitle}`} />
      <meta
        name="twitter:description"
        content={`Go Yours：${pageDescription}`}
      />
      <meta
        name="twitter:image"
        content="https://drive.google.com/file/d/1ANuhzbXQWHEeEstt9zGt-r2nwSyWlaon/view?usp=drive_link"
      />
    </Helmet>
  );
}

function AppContent() {
  const location = useLocation();
  const [loadingComplete, setLoadingComplete] = useState(false);

  // 每次路由變更時，重新觸發 loading 畫面，並設置兩秒延遲
  useEffect(() => {
    setLoadingComplete(false);
    const timer = setTimeout(() => {
      setLoadingComplete(true);
    }, 1500);

    return () => clearTimeout(timer); // 清理計時器
  }, [location.pathname]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoadingComplete(false);
  //     setLoadingComplete(true); // 强制重渲染 LoadingBear
  //   }, 0);
  // }, []);

  return (
    <>
      <ScrollToTop />
      <MetaManager />
      <Navigation />
      <InformBear />
      {/* <Toaster /> */}

      {loadingComplete ? (
        <Suspense
          fallback={
            <div className="postLoading pageLoading">
              <LoadingBear />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/goyours-post" element={<Post />} />
            <Route path="/goyours-post/:slug" element={<PostDetail />} />
            <Route path="/studying-in-jp-school" element={<Studying />} />
            <Route
              path="/studying-in-jp-school/:slug"
              element={<SchoolDetail />}
            />
            <Route path="/working-holiday-job" element={<Working />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/studying-in-jp" element={<StudyingInJp />} />
            <Route path="/working-holiday" element={<WorkingHoliday />} />
            <Route
              path="/working-holiday-application"
              element={<ContactResume />}
            />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/Q&A-section" element={<QAsection />} />
            <Route path="/document-download" element={<DownloadPage />} />
          </Routes>
        </Suspense>
      ) : (
        <div className="postLoading pageLoading">
          <LoadingBear />
        </div>
      )}
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    window.scrollTo(0, 0); // 確保頁面加載時滾動到頂部
  }, []);

  return (
    <HelmetProvider>
      <VisibilityProvider>
        <Router>
          <AppContent />
        </Router>
      </VisibilityProvider>
    </HelmetProvider>
  );
}

export default App;
