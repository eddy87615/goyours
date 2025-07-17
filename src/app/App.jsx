import "./App.css";
import { useEffect, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Navigation, Footer, ScrollToTop, LoadingBear } from "../components/common";
import VisibilityProvider from "../contexts/VisibilityProvider";
import AppContextProvider from "../contexts/AppContextProvider";

// 直接導入組件避免 SSR 問題
import HomePage from "../features/home/HomePage";
import AboutPage from "../features/about/AboutPage";
import PostsPage from "../features/posts/PostsPage";
import PostDetailPage from "../features/posts/PostDetailPage";
import StudyingPage from "../features/schools/StudyingPage";
import SchoolDetailPage from "../features/schools/SchoolDetailPage";
import PTJobPage from "../features/jobs/PTJobPage";
import JobsPage from "../features/jobs/JobsPage";
import ContactPage from "../features/contact/ContactPage";
import ContactResume from "../features/contact/contactResume";
import ContactResumeJob from "../features/contact/contactResume-job";
import PrivacyPage from "../features/misc/PrivacyPage";
import QAPage from "../features/misc/QAPage";
import StudyingInJpPage from "../features/schools/StudyingInJpPage";
import WorkingInJp from "../features/misc/working-in-jp";
import WorkingHolidayInJp from "../features/misc/workingholiday-in-jp";
import DownloadPage from "../features/misc/DownloadPage";
import InformBear from "../components/goyours-bear/InformBear/informBear";
import JobDetailPage from "../features/jobs/JobDetailPage";
import ActivityPage from "../features/misc/ActivityPage";

function AppContent() {
  const location = useLocation();
  const [loadingComplete, setLoadingComplete] = useState(true); // SSR 時需要立即顯示內容
  const [isClient, setIsClient] = useState(false);

  // 檢測是否在客戶端
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 每次路由變更時，重新觸發 loading 畫面，並設置兩秒延遲
  useEffect(() => {
    if (!isClient) return; // 只在客戶端執行載入動畫
    
    setLoadingComplete(false);
    const timer = setTimeout(() => {
      setLoadingComplete(true);
    }, 1500);

    return () => clearTimeout(timer); // 清理計時器
  }, [location.pathname, isClient]);

  return (
    <>
      <ScrollToTop />
      <Navigation />
      <InformBear />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/goyours-post" element={<PostsPage />} />
        <Route path="/goyours-post/:slug" element={<PostDetailPage />} />
        <Route path="/studying-in-jp-school" element={<StudyingPage />} />
        <Route
          path="/studying-in-jp-school/:slug"
          element={<SchoolDetailPage />}
        />
        <Route path="/jp-working-holiday-jobs" element={<PTJobPage />} />
        <Route path="/jp-jobs" element={<JobsPage />} />
        <Route path="/jp-jobs/:slug" element={<JobDetailPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/studying-in-jp" element={<StudyingInJpPage />} />
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
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/Q&A-section" element={<QAPage />} />
        <Route path="/document-download" element={<DownloadPage />} />
        <Route path="/goyours-activity" element={<ActivityPage />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    // 確保在瀏覽器環境中執行
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0); // 確保頁面加載時滾動到頂部
    }
  }, []);

  return (
    <VisibilityProvider>
      <AppContextProvider>
        <AppContent />
      </AppContextProvider>
    </VisibilityProvider>
  );
}

export default App;
