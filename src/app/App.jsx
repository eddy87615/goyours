import "./App.css";
import { useEffect, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Footer, ScrollToTop } from "../components/common";
import { createCSRComponent } from "../components/common/LazyWrapper/LazyWrapper";
import VisibilityProvider from "../contexts/VisibilityProvider";
import AppContextProvider from "../contexts/AppContextProvider";

// ✅ SSR 組件 - 直接導入
import HomePage from "../features/home/HomePage";
import AboutPage from "../features/about/AboutPage";
import PostsPage from "../features/posts/PostsPage";
import PostDetailPage from "../features/posts/PostDetailPage";
import StudyingPage from "../features/schools/StudyingPage";
import SchoolDetailPage from "../features/schools/SchoolDetailPage";
import JobsPage from "../features/jobs/JobsPage";
import JobDetailPage from "../features/jobs/JobDetailPage";
import StudyingInJpPage from "../features/schools/StudyingInJpPage";
import WorkingInJp from "../features/misc/working-in-jp";
import WorkingHolidayInJp from "../features/misc/workingholiday-in-jp";

// ❌ CSR 組件 - 懶載入（複雜互動組件）
const LazyNavigation = createCSRComponent(
  () => import("../components/common/Navigation/navigation"),
  "Navigation"
);
const LazyInformBear = createCSRComponent(
  () => import("../components/goyours-bear/InformBear/informBear"),
  "InformBear"
);
const LazyContactPage = createCSRComponent(
  () => import("../features/contact/ContactPage"),
  "ContactPage"
);
const LazyContactResume = createCSRComponent(
  () => import("../features/contact/contactResume"),
  "ContactResume"
);
const LazyContactResumeJob = createCSRComponent(
  () => import("../features/contact/contactResume-job"),
  "ContactResumeJob"
);
const LazyPTJobPage = createCSRComponent(
  () => import("../features/jobs/PTJobPage"),
  "PTJobPage"
);
const LazyPrivacyPage = createCSRComponent(
  () => import("../features/misc/PrivacyPage"),
  "PrivacyPage"
);
const LazyQAPage = createCSRComponent(
  () => import("../features/misc/QAPage"),
  "QAPage"
);
const LazyDownloadPage = createCSRComponent(
  () => import("../features/misc/DownloadPage"),
  "DownloadPage"
);
const LazyActivityPage = createCSRComponent(
  () => import("../features/misc/ActivityPage"),
  "ActivityPage"
);

function AppContent() {
  const location = useLocation();
  const [loadingComplete, setLoadingComplete] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    setLoadingComplete(false);
    const timer = setTimeout(() => {
      setLoadingComplete(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname, isClient]);

  
  return (
    <>
      <ScrollToTop />
      <LazyNavigation />
      <LazyInformBear />

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
        <Route path="/jp-working-holiday-jobs" element={<LazyPTJobPage />} />
        <Route path="/jp-jobs" element={<JobsPage />} />
        <Route path="/jp-jobs/:slug" element={<JobDetailPage />} />
        <Route path="/contact-us" element={<LazyContactPage />} />
        <Route path="/studying-in-jp" element={<StudyingInJpPage />} />
        <Route path="/working-in-jp" element={<WorkingInJp />} />
        <Route
          path="/workingholiday-in-jp"
          element={<WorkingHolidayInJp />}
        />
        <Route
          path="/working-holiday-application"
          element={<LazyContactResume />}
        />
        <Route
          path="/japan-job-application"
          element={<LazyContactResumeJob />}
        />
        <Route path="/privacy-policy" element={<LazyPrivacyPage />} />
        <Route path="/Q&A-section" element={<LazyQAPage />} />
        <Route path="/document-download" element={<LazyDownloadPage />} />
        <Route path="/goyours-activity" element={<LazyActivityPage />} />
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
