/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { urlFor } from "../../../services/sanity/client";
import { Link, useNavigate } from "react-router-dom";

import { LuClipboardList } from "react-icons/lu";
import { RiMoneyCnyCircleFill } from "react-icons/ri";
import { FaCircleMinus } from "react-icons/fa6";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TbThumbUpFilled } from "react-icons/tb";
import { FaFireAlt } from "react-icons/fa";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

import { useWindowSize } from "../../../hooks";

import "./OfficialJob.css";

const MOBILE_BREAKPOINT = 480;
const SCROLL_DELAY = 500;

const JobTags = ({ tags }) => {
  if (!tags) return null;

  return (
    <div className="job-tags">
      {tags.includes("我們的推薦") && (
        <span className="tag-recommend">
          <TbThumbUpFilled />
          推薦職缺
        </span>
      )}
      {tags.includes("高人氣職缺") && (
        <span className="tag-popular">
          <FaFireAlt />
          高人氣
        </span>
      )}
    </div>
  );
};

const JobImage = ({ mainImage, title }) => {
  if (!mainImage?.asset) {
    return <p className="noimg-notice">未提供圖片</p>;
  }
  return <img src={urlFor(mainImage).url()} alt={title} />;
};

const JobListItem = ({
  job,
  isOpen,
  onToggle,
  onInquiry,
  onApply,
  isMobile,
}) => {
  const jobSlug = job.slug.current || job.slug;

  return (
    <div className="joblist" id={jobSlug}>
      {isMobile && (
        <div className="joblistBtn">
          <button onClick={() => onInquiry(job.title)}>我要諮詢</button>
          <button onClick={() => onApply(job.title)}>我要申請</button>
        </div>
      )}

      <div className="listintro">
        {isMobile && <h2>{job.title}</h2>}

        <div className="job-img-wrapper">
          <JobTags tags={job.tags} />
          <JobImage mainImage={job.mainImage} title={job.title} />
        </div>

        <ul>
          {!isMobile && (
            <li>
              <h2>{job.title}</h2>
            </li>
          )}
          <li>
            <HiOutlineOfficeBuilding className="yellow jobisticon" />
            {job.officialSite ? (
              <Link
                style={{ textDecoration: "none" }}
                to={job.officialSite}
                target="_blank"
              >
                {job.company || "公司名稱未提供"}
              </Link>
            ) : (
              <span>{job.company || "公司名稱未提供"}</span>
            )}
          </li>
          <li>
            <LuClipboardList className="yellow jobisticon" />
            {job.syokusyu || "未提供職業類別"}
          </li>
          <li>
            <RiMoneyCnyCircleFill className="yellow jobisticon" />
            月薪：{job.salary ? `${job.salary}日幣` : "未提供月薪資訊"}
          </li>
          <li>
            <span
              style={{
                display: "flex",
                flexShrink: "0",
                alignItems: "center",
                justifyContent: "top",
                gap: "0.5rem",
              }}
            >
              <LuClipboardList className="yellow jobisticon" />
              工作內容：
            </span>
            <span className="work-content-item">
              {(() => {
                if (!job.workContent) {
                  return "未提供工作內容";
                }
                if (Array.isArray(job.workContent)) {
                  const content = job.workContent
                    .map((item) => {
                      if (typeof item === "string") return item;
                      if (item && typeof item === "object") {
                        if (item._type === "block" && item.children) {
                          return item.children
                            .map((child) => child.text || "")
                            .join("");
                        }
                        return item.text || item.content || item.value || "";
                      }
                      return "";
                    })
                    .filter((text) => text) // Remove empty strings
                    .join("、");
                  return content || "未提供工作內容";
                }
                return job.workContent || "未提供工作內容";
              })()}
            </span>
          </li>
        </ul>

        {!isMobile && (
          <div className="joblistBtn">
            <button onClick={() => onInquiry(job.title)}>我要諮詢</button>
            <button onClick={() => onApply(job.title)}>我要應徵</button>
          </div>
        )}

        <Link
          to={`/jp-jobs/${job.slug.current}`}
          className={`openDetail ${isOpen ? "btnClose" : ""}`}
          target="_blank"
        >
          職缺詳情
          <IoIosArrowDroprightCircle className="yellow moreBtn" />
        </Link>
      </div>

      <div className={`listdetail ${isOpen ? "" : "close"}`}>
        <button onClick={() => onToggle(jobSlug)}>
          <FaCircleMinus className="yellow moreBtn" />
        </button>
      </div>
    </div>
  );
};

export default function OfficialJob({
  jobList,
  isSearchTriggered,
  totalResults,
}) {
  const [isOpenList, setIsOpenList] = useState({});
  const windowSize = useWindowSize();
  const navigate = useNavigate();

  const isMobile = windowSize < MOBILE_BREAKPOINT;

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");

    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setIsOpenList((prev) => ({
            ...prev,
            [hash]: true,
          }));
        }
      }, SCROLL_DELAY);
    }
  }, [jobList]);

  const toggleList = (slug) => {
    setIsOpenList((prevState) => ({
      ...prevState,
      [slug]: !prevState[slug],
    }));
  };

  const handleInquiry = (jobTitle) => {
    navigate("/contact-us", {
      state: { initialMessage: `我對${jobTitle}職缺有興趣，想要諮詢` },
    });
  };

  const handleInquiryResume = (jobTitle) => {
    navigate("/japan-job-application", {
      state: { initialMessage: `${jobTitle}` },
    });
  };

  return (
    <div className="jobListSection">
      {isSearchTriggered && jobList.length > 0 && (
        <div className="searchResultArea">
          <h2 className="yellow">
            <FaMagnifyingGlass />
            搜尋結果
          </h2>
          <span className="yellow searchResult">
            您所搜尋的資料符合條件共有
            <span className="searchNumber">{totalResults}</span>筆
          </span>
        </div>
      )}

      {jobList.length > 0 ? (
        jobList.map((job) => (
          <JobListItem
            key={job.slug.current || job.slug}
            job={job}
            isOpen={isOpenList[job.slug.current || job.slug]}
            onToggle={toggleList}
            onInquiry={handleInquiry}
            onApply={handleInquiryResume}
            isMobile={isMobile}
          />
        ))
      ) : (
        <div className="postLoading postLoadingP">無搜尋結果</div>
      )}
    </div>
  );
}
