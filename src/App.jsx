/* eslint-disable no-unused-vars */

import "./App.css";
import React, { useEffect, Suspense, lazy, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navigation from "./components/navigation/navigation";
import Footer from "./components/footer/footer";
import ScrollToTop from "./components/scrollToTop/scrollToTop";
import useGetKeyWords from "./hook/useGetKeyWords";
import { VisibilityProvider } from "./visibilityProvider";
import LoadingBear from "./components/loadingBear/loadingBear";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Toaster, toast } from "react-hot-toast";

// 使用 React.lazy 延遲加載每個頁面組件
const Home = lazy(() => import("./pages/home"));
const About = lazy(() => import("./pages/about-us"));
const Post = lazy(() => import("./pages/goyours-post"));
const PostDetail = lazy(() => import("./pages/postDetail"));
const Studying = lazy(() => import("./pages/studying"));
const SchoolDetail = lazy(() => import("./pages/schoolDetail"));
const PTjob = lazy(() => import("./pages/PTjob"));
const JPjobs = lazy(() => import("./pages/JPjobs"));
const Contact = lazy(() => import("./pages/contact-us"));
const ContactResume = lazy(() => import("./pages/contactResume"));
const ContactResumeJob = lazy(() => import("./pages/contactResume-job"));
const Privacy = lazy(() => import("./pages/privacy"));
const QAsection = lazy(() => import("./pages/QAsection"));
const StudyingInJp = lazy(() => import("./pages/studying-in-jp"));
const WorkingInJp = lazy(() => import("./pages/working-in-jp"));
const WorkingHolidayInJp = lazy(() => import("./pages/workingholiday-in-jp"));
const DownloadPage = lazy(() => import("./pages/downloadPage"));
const InformBear = lazy(() => import("./components/informBear/informBear"));
const JPjobsDetail = lazy(() => import("./pages/JPjobsDetail"));
const ActivityPage = lazy(() => import("./pages/activityPage"));

// 路徑映射表
const PATH_TO_PAGE = {
  "/": "首頁",
  "/about-us": "關於我們",
  "/goyours-post": "文章專區",
  "/studying-in-jp": "日本留學",
  "/studying-in-jp-school": "日本留學學校",
  "/jp-jobs": "日本正職職缺",
  "/jp-working-holiday-jobs": "日本打工職缺",
  "/Q&A-section": "常見Q&A",
  "/document-download": "下載專區",
  "/contact-us": "聯絡我們",
};

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

  useEffect(() => {
    console.log(
      `%c不要亂看啦！！！
見ちゃダメだろう！？`,
      "color: red; font-size: 24px; font-weight: bold;"
    );
  }, []);

  return (
    <>
      <ScrollToTop />
      <Navigation />
      <InformBear />

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
            <Route path="/jp-working-holiday-jobs" element={<PTjob />} />
            <Route path="/jp-jobs" element={<JPjobs />} />
            <Route path="/jp-jobs/:slug" element={<JPjobsDetail />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/studying-in-jp" element={<StudyingInJp />} />
            <Route path="/working-in-jp" element={<WorkingInJp />} />
            <Route
              path="/workingholiday-in-jp"
              element={<WorkingHolidayInJp />}
            />
            <Route
              path="/working-holiday-application"
              element={<ContactResume />}
            />
            <Route
              path="/japan-job-application"
              element={<ContactResumeJob />}
            />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/Q&A-section" element={<QAsection />} />
            <Route path="/document-download" element={<DownloadPage />} />
            <Route path="/goyours-activity" element={<ActivityPage />} />
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
