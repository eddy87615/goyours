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
import WaitingAnimation from './components/waitingAnimation/waitingAnimation';

function AppContent() {
  const location = useLocation();
  const [loadingComplete, setLoadingComplete] = useState(false);

  // 每次路由變更時，重新觸發 loading 畫面，並設置兩秒延遲
  useEffect(() => {
    setLoadingComplete(false);
    const timer = setTimeout(() => {
      setLoadingComplete(true);
    }, 3000);

    return () => clearTimeout(timer); // 清理計時器
  }, [location.pathname]);

  useEffect(() => {
    setTimeout(() => {
      setLoadingComplete(false);
      setLoadingComplete(true); // 强制重渲染 LoadingBear
    }, 0);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Navigation />
      {/* <WaitingAnimation /> */}

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
