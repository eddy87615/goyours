/* eslint-disable no-unused-vars */
import './App.css';
import React, { useEffect, Suspense, lazy, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Navigation from './components/navigation/navigation';
import Footer from './components/footer/footer';
import ScrollToTop from './components/scrollToTop/scrollToTop';
import { VisibilityProvider } from './visibilityProvider';
import LoadingBear from './components/loadingBear/loadingBear';

// 使用 React.lazy 延遲加載每個頁面組件
const Home = lazy(() => import('./pages/home'));
const About = lazy(() => import('./pages/about'));
const Post = lazy(() => import('./pages/post'));
const PostDetail = lazy(() => import('./pages/postDetail'));
const Studying = lazy(() => import('./pages/studying'));
const SchoolDetail = lazy(() => import('./pages/schoolDetail'));
const Working = lazy(() => import('./pages/working'));
const Contact = lazy(() => import('./pages/contact'));
const ContactResume = lazy(() => import('./pages/contactResume'));
const Privacy = lazy(() => import('./pages/privacy'));

function AppContent() {
  const location = useLocation();
  const [loadingComplete, setLoadingComplete] = useState(false);

  // 每次路由變更時，重新觸發 loading 畫面，並設置兩秒延遲
  useEffect(() => {
    setLoadingComplete(false);
    const timer = setTimeout(() => {
      setLoadingComplete(true);
    }, 1500); // 設置兩秒延遲

    return () => clearTimeout(timer); // 清理計時器
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <Navigation />

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
            <Route path="/about" element={<About />} />
            <Route path="/post" element={<Post />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/studying" element={<Studying />} />
            <Route path="/school/:slug" element={<SchoolDetail />} />
            <Route path="/working" element={<Working />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contactResume" element={<ContactResume />} />
            <Route path="/privacy" element={<Privacy />} />
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
    <VisibilityProvider>
      <Router>
        <AppContent />
      </Router>
    </VisibilityProvider>
  );
}

export default App;
