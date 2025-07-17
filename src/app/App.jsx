import "./App.css";
import { useEffect, Suspense, lazy, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Navigation, Footer, ScrollToTop, LoadingBear } from "../components/common";
import VisibilityProvider from "../contexts/VisibilityProvider";
import AppContextProvider from "../contexts/AppContextProvider";

// 使用 React.lazy 延遲加載每個頁面組件
const Home = lazy(() => import("../features/home/HomePage"));
const About = lazy(() => import("../features/about/AboutPage"));
const Post = lazy(() => import("../features/posts/PostsPage"));
const PostDetail = lazy(() => import("../features/posts/PostDetailPage"));
const Studying = lazy(() => import("../features/schools/StudyingPage"));
const SchoolDetail = lazy(() => import("../features/schools/SchoolDetailPage"));
const PTjob = lazy(() => import("../features/jobs/PTJobPage"));
const JPjobs = lazy(() => import("../features/jobs/JobsPage"));
const Contact = lazy(() => import("../features/contact/ContactPage"));
const ContactResume = lazy(() => import("../features/contact/contactResume"));
const ContactResumeJob = lazy(() => import("../features/contact/contactResume-job"));
const Privacy = lazy(() => import("../features/misc/PrivacyPage"));
const QAsection = lazy(() => import("../features/misc/QAPage"));
const StudyingInJp = lazy(() => import("../features/schools/StudyingInJpPage"));
const WorkingInJp = lazy(() => import("../features/misc/working-in-jp"));
const WorkingHolidayInJp = lazy(() => import("../features/misc/workingholiday-in-jp"));
const DownloadPage = lazy(() => import("../features/misc/DownloadPage"));
const InformBear = lazy(() => import("../components/goyours-bear/InformBear/informBear"));
const JPjobsDetail = lazy(() => import("../features/jobs/JobDetailPage"));
const ActivityPage = lazy(() => import("../features/misc/ActivityPage"));

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
    <VisibilityProvider>
      <AppContextProvider>
        <AppContent />
      </AppContextProvider>
    </VisibilityProvider>
  );
}

export default App;
