import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';

import { client, urlFor } from "../../cms/sanityClient";

import HomeBg from "../homeBg/homeBg";
import AnimationSection from "../../pages/AnimationSection";
import useWindowSize from "../../hook/useWindowSize";

import "./homeJobList.css";
import "../../pages/home.css";
import { useEffect, useState } from "react";

export default function HomeJobList() {
  const windowSize = useWindowSize();

  const [recommenedJobs, setRecommenedJobs] = useState([]);
  useEffect(() => {
    async function fetchRecommenedJobs() {
      try {
        const jobs = await client.fetch(`
          *[_type == "jobList" && "我們的推薦" in tags]{
          name,
          company,
          location,
          mainImage,
          jobtype,
          trasportation,
          jobcontent,
          salary,
          slug,
          }`);
        const shuffledJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 6);
        setRecommenedJobs(shuffledJobs);
      } catch (error) {
        return;
      }
    }
    fetchRecommenedJobs();
  }, []);

  return (
    <>
      <AnimationSection className="homeJobWrapper">
        <div className="homeJobH2">
          <h2 className="underLine">
            <span className="yellow">Working Holiday</span>
            日本打工度假職缺一覽
            {/* <GoyoursBearJob /> */}
          </h2>
        </div>
        <div className="homebg-job-Wave">
          <HomeBg />
        </div>
        <div className="workingholidayDiv">
          {recommenedJobs.map((job, index) => {
            return (
              <AnimationSection key={index} className="jobListPre">
                <div className="jobListimg">
                  {job.mainImage?.asset ? (
                    <img src={urlFor(job.mainImage).url()} alt={job.name} />
                  ) : (
                    <p className="noimg-notice">未提供圖片</p>
                  )}
                </div>
                <div className="jobListcontent">
                  <h3 className="homeJobList-companyTitle">{job.company}</h3>
                  <p className="homeJobList-companyLocation">
                    <FaLocationDot /> {job.location}
                  </p>
                  <ul>
                    <li>
                      <span>職稱</span>
                      <p>{job.name}</p>
                    </li>
                    <li>
                      <span>內容</span>
                      <p>{job.jobcontent}</p>
                    </li>
                    <li>
                      <span>時薪</span>
                      <p>{job.salary}円</p>
                    </li>
                  </ul>
                  {/* <button
                  className="schoolListDetailBtn"
                  onClick={() => handleInquiry(job.name)}
                > */}
                  <Link
                    to={`/working-holiday-job#${job.slug.current}`}
                    onClick={(e) => {
                      // 如果需要，可以在這裡添加其他處理邏輯
                      localStorage.setItem("targetJobSlug", job.slug.current);
                    }}
                    className="schoolListDetailBtn"
                  >
                    {windowSize < 1200 ? "詳情" : "了解職缺詳情"}
                  </Link>
                  {/* </button> */}
                </div>
              </AnimationSection>
            );
          })}
        </div>
      </AnimationSection>
      <AnimationSection className="more-school-button">
        <ul>
          <li>
            <Link to="/working-holiday-job">
              <span className="button-wrapper">
                <span className="upperP-wrapper">
                  <p>看更多職缺</p>
                </span>
                <span className="downP-wrapper">
                  <p>看更多職缺</p>
                </span>
              </span>
              <span className="more-school-icon">
                <img
                  src="/goyoursbear-icon-w.svg"
                  alt="goyours bear white icon"
                />
              </span>
            </Link>
          </li>
        </ul>
      </AnimationSection>
      <a className="formoreBtntoPage" href="./working-holiday-job">
        看更多職缺
      </a>
    </>
  );
}
