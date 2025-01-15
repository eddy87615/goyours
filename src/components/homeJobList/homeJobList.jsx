import { FaLocationDot } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { client, urlFor } from '../../cms/sanityClient';

import GoyoursBearJob from '../goyoursBear/goyoursBearJob';
import HomeBg from '../homeBg/homeBg';
import AnimationSection from '../../pages/AnimationSection';
import useWindowSize from '../../hook/useWindowSize';

import './homeJobList.css';
import '../../pages/home.css';
import { useEffect, useState } from 'react';

export default function HomeJobList() {
  // const jobListContent = [
  //   {
  //     jobName: '巧克力工廠',
  //     location: '東京都・千葉縣',
  //     src: '/巧克力工廠.jpg',
  //     alt: '巧克力工廠',
  //     introtxt: '',
  //     jobContent: '巧克力工廠作業員',
  //     traffic: '新京成線稔台站',
  //     salary: '1100円',
  //   },
  //   {
  //     jobName: '舞濱物流生產線作業員',
  //     location: '東京都',
  //     src: '/生產線.jpg',
  //     alt: '生產線',
  //     introtxt: '',
  //     jobContent: '生產線輕作業',
  //     traffic: '舞濱車站巴士・徒步',
  //     salary: '1300円',
  //   },
  //   {
  //     jobName: '溫泉飯店餐廳服務員',
  //     location: '栃木縣',
  //     src: '/鬼怒川溫泉站.jpg',
  //     alt: '鬼怒川溫泉站',
  //     introtxt: '',
  //     jobContent: '自助餐廳服務員',
  //     traffic: '鬼怒川溫泉站',
  //     salary: '1300円',
  //   },
  //   {
  //     jobName: '關西機場免稅店',
  //     location: '關西機場',
  //     src: '/關西機場.jpg',
  //     alt: '關西機場',
  //     introtxt: '',
  //     jobContent: '機場免稅店',
  //     traffic: 'JR關空快線',
  //     salary: '1100円',
  //   },
  //   {
  //     jobName: '滑雪中心',
  //     location: '長野縣',
  //     src: '/滑雪中心.jpg',
  //     alt: '長野縣滑雪中心',
  //     introtxt: '',
  //     jobContent: '滑雪場相關業務',
  //     traffic: '飯山站',
  //     salary: '1200円',
  //   },
  //   {
  //     jobName: '倉庫作業員',
  //     location: '東京都',
  //     src: '/上野倉庫作業員.jpg',
  //     alt: '上野倉庫作業員',
  //     introtxt: '',
  //     jobContent: '倉庫輕作業及食品分類人員',
  //     traffic: '上野站',
  //     salary: '1150円',
  //   },
  // ];
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
          }`);
        const shuffledJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 6);
        setRecommenedJobs(shuffledJobs);
      } catch (error) {
        console.error('Error fetching recommened jobs:', error);
      }
    }
    fetchRecommenedJobs();
  }, []);

  const navigate = useNavigate();
  const handleInquiry = (jobName) => {
    navigate('/contact-us', {
      state: { initialMessage: `我對${jobName}職缺有興趣，想要諮詢` },
    });
  };

  return (
    <>
      <AnimationSection className="homeJobWrapper">
        <div className="homeJobH1">
          <h1 className="underLine">
            <span className="yellow">Working Holiday</span>
            日本打工度假職缺一覽
            {/* <GoyoursBearJob /> */}
          </h1>
        </div>
        <div className="homebg-job-Wave">
          <HomeBg />
        </div>
        <div className="workingholidayDiv">
          {recommenedJobs.map((job, index) => (
            <AnimationSection key={index} className="jobListPre">
              <div className="jobListimg">
                <img src={urlFor(job.mainImage).url()} alt={job.name} />
              </div>
              <div className="jobListcontent">
                <p className="homeJobList-companyTitle">{job.company}</p>
                <p className="homeJobList-companyLocation">
                  <FaLocationDot /> {job.location}
                </p>
                <ul>
                  <li>
                    <span>職稱</span>
                    {job.name}
                  </li>
                  <li>
                    <span>內容</span>
                    {job.jobcontent}
                  </li>
                  <li>
                    <span>時薪</span>
                    {job.salary}円
                  </li>
                </ul>
                <button
                  className="schoolListDetailBtn"
                  onClick={() => handleInquiry(job.name)}
                >
                  {windowSize < 1200 ? '詳情' : '了解職缺詳情'}
                </button>
              </div>
            </AnimationSection>
          ))}
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
