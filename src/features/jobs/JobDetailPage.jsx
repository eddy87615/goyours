import { useState, useEffect } from "react";
import { client, urlFor } from "../../services/sanity/client";
import { PortableText } from "@portabletext/react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import "./JPjobsDetail.css";
import { LoadingBear } from "../../components/common";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { RiMoneyCnyCircleFill } from "react-icons/ri";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const cache = new Map();
const CACHE_LIFETIME = 5 * 60 * 1000;

// 儲存快取時加入時間戳記
function setCache(key, data) {
  const expiryTime = Date.now() + CACHE_LIFETIME;
  cache.set(key, { data, expiryTime });
}

// 取得快取時檢查是否過期
function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expiryTime) {
    // 如果過期，從快取中移除
    cache.delete(key);
    return null;
  }

  return cached.data;
}

const RecommendedJobItem = ({ job }) => {
  const handleClick = () => {
    // 直接導航到職缺詳細頁面，確保清除錨點
    const newUrl = `${window.location.origin}/jp-jobs/${
      job.slug?.current || job._id
    }`;
    window.location.href = newUrl;
  };

  return (
    <div className="recommended-job-item" onClick={handleClick}>
      <div className="recommended-job-image">
        {job.mainImage?.asset ? (
          <img
            src={urlFor(job.mainImage).width(150).height(100).url()}
            alt={job.mainImage.alt || job.title || "職缺圖片"}
          />
        ) : (
          <div className="no-image">無圖片</div>
        )}
      </div>
      <div className="recommended-job-info">
        <h4>{job.hiringPotsition || job.title || "未命名職缺"}</h4>
        <p className="company-name">{job.parentCompany?.name || "未知公司"}</p>
        {job.yearIncome && <p className="salary">年薪：{job.yearIncome}</p>}
        {job.workLocation && job.workLocation.length > 0 && (
          <p className="location">地點：{job.workLocation[0]}</p>
        )}
      </div>
    </div>
  );
};

const RecommendedJobs = ({ currentJob, allJobs }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 730);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const recommendedJobs = allJobs
    .filter(
      (job) =>
        job._id !== currentJob._id && // 排除當前工作
        job.syokusyu === currentJob.syokusyu && // 相同職種
        job.syokusyu // 確保職種不為空
    )
    .sort((a, b) => {
      // 按發布日期排序，最新的在前
      const dateA = new Date(a.publishedAt || 0);
      const dateB = new Date(b.publishedAt || 0);
      return dateB - dateA;
    })
    .slice(0, 5); // 限制 5 個推薦

  if (recommendedJobs.length === 0) {
    return (
      <div className="recommended-jobs">
        <h3>相關職缺</h3>
        <p>暫無相關職缺</p>
      </div>
    );
  }

  return (
    <div className="recommended-jobs">
      <h3>相關 {currentJob.syokusyu} 職缺</h3>
      {isMobile ? (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          navigation
          loop
          pagination={{ clickable: true }}
          className="recommended-jobs-swiper"
        >
          {recommendedJobs.map((job) => (
            <SwiperSlide key={job._id}>
              <RecommendedJobItem job={job} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="recommended-jobs-list">
          {recommendedJobs.map((job) => (
            <RecommendedJobItem key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

const ContentRenderer = ({ title, content, emptyMessage = "暫無資訊" }) => {
  const isPlainText =
    !content ||
    !Array.isArray(content) ||
    (Array.isArray(content) && content.length === 0) ||
    (Array.isArray(content) && content[0]?._type !== "block");

  return (
    <div style={isPlainText ? { display: "flex", gap: "1rem" } : {}}>
      <h3>
        {/* <IoMdInformationCircle /> */}
        {title}
      </h3>
      {content && Array.isArray(content) ? (
        content.length > 0 ? (
          content[0]._type === "block" ? (
            <PortableText value={content} />
          ) : (
            <ul>
              {content.map((item, index) => (
                <li key={index}>
                  {typeof item === "string"
                    ? item
                    : item.text || item.content || ""}
                </li>
              ))}
            </ul>
          )
        ) : (
          <p style={{ display: "inline-flex", alignItems: "center" }}>
            {emptyMessage}
          </p>
        )
      ) : (
        <p style={{ display: "inline-flex", alignItems: "center" }}>
          {content || emptyMessage}
        </p>
      )}
    </div>
  );
};

const ContentWithSupplement = ({
  title,
  mainContent,
  supplementContent,
  emptyMessage = "暫無資訊",
}) => {
  const hasMainContent =
    mainContent &&
    (Array.isArray(mainContent) ? mainContent.length > 0 : mainContent);
  const hasSupplementContent =
    supplementContent &&
    (Array.isArray(supplementContent)
      ? supplementContent.length > 0
      : supplementContent);

  const isPlainText =
    (!hasMainContent && !hasSupplementContent) ||
    (hasMainContent && !Array.isArray(mainContent)) ||
    (hasMainContent &&
      Array.isArray(mainContent) &&
      mainContent[0]?._type !== "block");

  if (!hasMainContent && !hasSupplementContent) {
    return (
      <div style={{ display: "flex", gap: "1rem" }}>
        <h3>
          {/* <IoMdInformationCircle /> */}
          {title}
        </h3>
        <p style={{ display: "inline-flex", alignItems: "center" }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  const renderContent = (content) => {
    if (!content) return null;

    if (Array.isArray(content)) {
      if (content.length === 0) return null;
      if (content[0]._type === "block") {
        return <PortableText value={content} />;
      } else {
        return (
          <ul>
            {content.map((item, index) => (
              <li key={index}>
                {typeof item === "string"
                  ? item
                  : item.text || item.content || ""}
              </li>
            ))}
          </ul>
        );
      }
    } else {
      return (
        <p style={{ display: "inline-flex", alignItems: "center" }}>
          {content}
        </p>
      );
    }
  };

  return (
    <div style={isPlainText ? { display: "flex", gap: "1rem" } : {}}>
      <h3>
        {/* <IoMdInformationCircle /> */}
        {title}
      </h3>
      {hasMainContent && renderContent(mainContent)}
      {hasSupplementContent && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
          <strong>補足：</strong>
          {renderContent(supplementContent)}
        </div>
      )}
    </div>
  );
};

const JobActionButtons = ({ jobTitle }) => {
  const navigate = useNavigate();

  const handleInquiry = (jobTitle) => {
    navigate("/contact-us", {
      state: { initialMessage: `我對${jobTitle}職缺有興趣，想要諮詢` },
    });
  };

  const handleApply = (jobTitle) => {
    navigate("/japan-job-application", {
      state: { initialMessage: `${jobTitle}` },
    });
  };

  return (
    <div className="job-action-buttons">
      <button className="inquiry-btn" onClick={() => handleInquiry(jobTitle)}>
        我要諮詢
      </button>
      <button className="apply-btn" onClick={() => handleApply(jobTitle)}>
        我要申請
      </button>
    </div>
  );
};

export default function JPjobsDetail() {
  const { slug } = useParams();
  const [currentJob, setCurrentJob] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showActionButtons, setShowActionButtons] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cacheKey = "all-jobs-v2"; // 更新版本以清除舊快取

        // 先檢查快取
        const cachedJobs = getCache(cacheKey);

        let flatJobList;

        if (cachedJobs) {
          // 使用快取資料
          flatJobList = cachedJobs;
          setAllJobs(flatJobList);
        } else {
          // 從 API 獲取新資料
          const companiesWithNestedJobs = await client.fetch(
            `
                *[_type == "company" && !(_id in path("drafts.**"))] {
                ...,
                  "jobs": *[_type == "job" && references(^._id) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
                    ..., 
                    "parentCompany": ^ {
                      _id,
                      name,
                      logo,
                      property,
                      officialSite
                    }
                  }
                }
                | order(name asc)
              `
          );

          flatJobList = companiesWithNestedJobs.flatMap(
            (company) => company.jobs || []
          );

          // 存入快取
          setCache(cacheKey, flatJobList);
          setAllJobs(flatJobList);
        }

        // Find the specific job by slug
        const job = flatJobList.find((job) => job.slug?.current === slug);

        // Debug: 檢查 parentCompany 資料結構
        if (job) {
          console.log("Job found:", job);
          console.log("Parent Company:", job.parentCompany);
        }

        setCurrentJob(job);
      } catch (error) {
        console.error("Failed to fetch job list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  // 滾動監聽
  useEffect(() => {
    const handleScroll = () => {
      // 當滾動超過視窗高度（100%）時顯示按鈕
      if (window.scrollY > window.innerHeight) {
        setShowActionButtons(true);
      } else {
        setShowActionButtons(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="postLoading pageLoading">
        <LoadingBear />
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div>
        <p className="postLoading nopost-warning">
          找不到此職缺
          <span className="nopost">
            <img src="/goyoursbear-B.svg" alt="goyours bear gray" />
          </span>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="JPjob-mainimg">
        {currentJob.mainImage?.asset ? (
          <img
            src={urlFor(currentJob.mainImage).url()}
            alt={currentJob.mainImage.alt || currentJob.title || "職缺圖片"}
          />
        ) : (
          <p className="noimg-notice">此職缺未提供圖片</p>
        )}
      </div>
      <div className="JPjob-body">
        <div
          key={currentJob._id || currentJob.slug?.current || currentJob.title}
          id={currentJob.slug?.current || currentJob._id}
        >
          <div className="job-content-body">
            <div className="job-header">
              <h1>{currentJob.hiringPotsition || "未命名職缺"}</h1>
              <JobActionButtons
                jobTitle={
                  currentJob.hiringPotsition || currentJob.title || "未命名職缺"
                }
              />
            </div>
            <div className="company-and-jobtype">
              <div className="company-info">
                {currentJob.parentCompany?.logo?.asset ? (
                  <img
                    src={urlFor(currentJob.parentCompany.logo).url()}
                    alt={
                      currentJob.parentCompany.logo.alt ||
                      currentJob.parentCompany.name ||
                      "公司圖片"
                    }
                  />
                ) : (
                  <p className="noimg-notice">未提供公司圖片</p>
                )}
              </div>
              <div className="job-and-company-type">
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <HiOutlineOfficeBuilding className="yellow jobisticon" />
                  <Link
                    style={{ textDecoration: "none" }}
                    to={currentJob.parentCompany?.officialSite}
                    target="_blank"
                  >
                    {currentJob.parentCompany?.name || "未知公司"}
                  </Link>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <RiMoneyCnyCircleFill className="yellow jobisticon" />
                  資本額：
                  {currentJob.parentCompany?.property || "未提供公司資本額"}
                </div>
                {currentJob.workLocation ? (
                  <div className="job-location">
                    {currentJob.workLocation.map((location, index) => (
                      <div key={index}>{location}</div>
                    ))}
                  </div>
                ) : (
                  <p>暫無工作地點資訊</p>
                )}
                <div className="job-type-wrapper">
                  {currentJob.gyousyu ? (
                    <div className="job-type">{currentJob.gyousyu}</div>
                  ) : (
                    <p>暫無業種資訊</p>
                  )}
                  {currentJob.syokusyu ? (
                    <div className="job-type">{currentJob.syokusyu}</div>
                  ) : (
                    <p>暫無職種資訊</p>
                  )}
                </div>
              </div>
            </div>
            <div className="job-detail" id="job-detail">
              <div className="wanted-info" id="wanted-info">
                <h2 className="yellow underLine">招募內容</h2>
                <ContentRenderer
                  title="工作內容"
                  content={currentJob.workContent}
                  emptyMessage="暫無工作內容資訊"
                />
                <ContentRenderer
                  title="要求技能"
                  content={currentJob.skill}
                  emptyMessage="暫無技能要求資訊"
                />
                <ContentWithSupplement
                  title="就業時間"
                  mainContent={currentJob.workingTime}
                  supplementContent={currentJob.workingTimeAdd}
                  emptyMessage="暫無就業時間資訊"
                />
                <ContentRenderer
                  title="入職時間"
                  content={currentJob.workingFrom}
                  emptyMessage="暫無入職時間資訊"
                />
                <ContentRenderer
                  title="雇用期間"
                  content={currentJob.hiringPeriod}
                  emptyMessage="暫無雇用期間資訊"
                />
                <ContentRenderer
                  title="招募人數"
                  content={currentJob.hiringPopularity}
                  emptyMessage="暫無招募人數資訊"
                />
                <ContentWithSupplement
                  title="彈性工時制"
                  mainContent={currentJob.flexWorkingTime}
                  supplementContent={currentJob.flexWorkingTimeAdd}
                  emptyMessage="暫無彈性工時制資訊"
                />
                <ContentWithSupplement
                  title="試用期間"
                  mainContent={currentJob.tryPeriod}
                  supplementContent={currentJob.tryPeriodAdd}
                  emptyMessage="暫無試用期間資訊"
                />
              </div>

              <div className="treatment" id="treatment">
                <h2 className="yellow underLine">薪資與福利</h2>
                <ContentRenderer
                  title="支薪方式"
                  content={currentJob.salaryType}
                  emptyMessage="暫無支薪方式資訊"
                />
                <ContentRenderer
                  title="月薪"
                  content={currentJob.salary}
                  emptyMessage="暫無月薪資訊"
                />
                <ContentRenderer
                  title="固定加班費"
                  content={currentJob.workingLateSalary}
                  emptyMessage="暫無固定加班費資訊"
                />
                <ContentRenderer
                  title="調薪制度"
                  content={currentJob.promotion}
                  emptyMessage="暫無調薪制度資訊"
                />
                <ContentRenderer
                  title="獎金"
                  content={currentJob.price}
                  emptyMessage="暫無獎金資訊"
                />
                <ContentRenderer
                  title="年薪"
                  content={currentJob.yearIncome}
                  emptyMessage="暫無年薪資訊"
                />
                <ContentWithSupplement
                  title="參考年薪"
                  mainContent={currentJob.modelYearIncome}
                  supplementContent={currentJob.modelYearIncomeAdd}
                  emptyMessage="暫無參考年薪資訊"
                />
                <ContentRenderer
                  title="交通補助"
                  content={currentJob.trafficPay}
                  emptyMessage="暫無交通補助資訊"
                />
                <ContentRenderer
                  title="加班費"
                  content={currentJob.workingLatePay}
                  emptyMessage="暫無加班費資訊"
                />
                <ContentRenderer
                  title="其他津貼"
                  content={currentJob.otherPay}
                  emptyMessage="暫無其他津貼資訊"
                />
                <ContentRenderer
                  title="保險與福利"
                  content={currentJob.insurance}
                  emptyMessage="暫無保險與福利資訊"
                />
                <ContentRenderer
                  title="各項津貼"
                  content={currentJob.otherSupport}
                  emptyMessage="暫無各項津貼資訊"
                />
                <ContentRenderer
                  title="休假制度"
                  content={currentJob.vacation}
                  emptyMessage="暫無休假制度資訊"
                />
                <ContentRenderer
                  title="年假天數"
                  content={currentJob.yearHoliday}
                  emptyMessage="暫無年假天數資訊"
                />
                <ContentRenderer
                  title="調職可能性"
                  content={currentJob.workingOtherPlace}
                  emptyMessage="暫無調職可能性資訊"
                />
                <ContentRenderer
                  title="工作地點詳細"
                  content={currentJob.workingPlaceDetail}
                  emptyMessage="暫無工作地點詳細資訊"
                />
                <ContentRenderer
                  title="禁菸政策"
                  content={currentJob.smokingRule}
                  emptyMessage="暫無禁菸政策資訊"
                />
              </div>
              <div className="interview" id="interview">
                <h2 className="yellow underLine">選考內容</h2>
                <ContentRenderer
                  title="年齡要求"
                  content={currentJob.old}
                  emptyMessage="暫無年齡要求資訊"
                />
                <ContentRenderer
                  title="面試次數"
                  content={currentJob.interviewTimes}
                  emptyMessage="暫無面試次數資訊"
                />
                <ContentRenderer
                  title="學歷要求"
                  content={currentJob.education}
                  emptyMessage="暫無學歷要求資訊"
                />
                <ContentRenderer
                  title="年齡限制原因"
                  content={currentJob.oldRuleReason}
                  emptyMessage="暫無年齡限制原因資訊"
                />
                <ContentRenderer
                  title="必要資格"
                  content={currentJob.requiredSkill}
                  emptyMessage="暫無必要資格資訊"
                />
                <ContentRenderer
                  title="選考內容"
                  content={currentJob.testContent}
                  emptyMessage="暫無選考內容資訊"
                />
              </div>
            </div>
            <div className="other-job">
              <RecommendedJobs currentJob={currentJob} allJobs={allJobs} />
            </div>
          </div>
        </div>
        <div className="job-nav-list">
          <ul>
            <li>
              <a href="#wanted-info">招募內容</a>
            </li>
            <li>
              <a href="#treatment">薪資與福利</a>
            </li>
            <li>
              <a href="#interview">選考內容</a>
            </li>
          </ul>
          <div className={`job-nav-actions ${showActionButtons ? "show" : ""}`}>
            <JobActionButtons
              jobTitle={
                currentJob.hiringPotsition || currentJob.title || "未命名職缺"
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
