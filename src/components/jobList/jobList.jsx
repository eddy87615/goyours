import { useEffect, useState } from 'react';
import { client, urlFor } from '../../cms/sanityClient';
import { useNavigate } from 'react-router-dom';

import { MdHomeWork } from 'react-icons/md';
import { LuClipboardList } from 'react-icons/lu';
import { FaLocationDot } from 'react-icons/fa6';
import { RiMoneyCnyCircleFill } from 'react-icons/ri';
import { FaCirclePlus, FaCircleMinus } from 'react-icons/fa6';
import { LuDownload } from 'react-icons/lu';

import './jobList.css';

export default function JobList() {
  const [jobList, setJobList] = useState([]);
  const [isOpenList, setIsOpenList] = useState({});

  useEffect(() => {
    async function fetchJoblist() {
      const job = await client.fetch(`
            *[_type == "jobList"] | order(publishedAt desc) {
              name,
              publishedAt,
              mainImage,
              slug,
            location,
            transportation,
            jobcontent,
            jobtime,
            workhour,
            resttime,
            jobperiod,
            salary,
            privilege,
            japanese,
            detailedFile,
            company
            }
            `);
      setJobList(job);
    }
    fetchJoblist();
  }, []);

  const toggleList = (slug) => {
    setIsOpenList((prevState) => ({
      ...prevState,
      [slug]: !prevState[slug], // 切換指定職缺的展開狀態
    }));
  };

  const navigate = useNavigate();
  const handleInquiry = (jobName) => {
    navigate('/contact', {
      state: { initialMessage: `我對${jobName}職缺有興趣，想要諮詢` },
    });
  };
  const handleInquiryResume = (jobName) => {
    navigate('/contactResume', {
      state: { initialMessage: `${jobName}` },
    });
  };

  return (
    <div className="jobListSection">
      {jobList.map((job) => (
        <div key={job.slug.current || job.slug} className="joblist">
          <div className="listintro">
            <img src={urlFor(job.mainImage).url()} />
            <ul>
              <li>
                <h2>{job.name}</h2>
              </li>
              <li>
                <MdHomeWork className="yellow jobisticon" />
                {job.company}
              </li>
              <li>
                <LuClipboardList className="yellow jobisticon" />
                {job.jobcontent}
              </li>
              <li>
                <FaLocationDot className="yellow jobisticon" />
                {job.transportation}
              </li>
              <li>
                <RiMoneyCnyCircleFill className="yellow jobisticon" />
                時薪{job.salary}日幣
              </li>
            </ul>
            <div className="joblistBtn">
              <button onClick={() => handleInquiry(job.name)}>我要諮詢</button>
              <button onClick={() => handleInquiryResume(job.name)}>
                我要申請
              </button>
            </div>
            <button
              onClick={() => toggleList(job.slug.current || job.slug)}
              className={`${
                isOpenList[job.slug.current || job.slug]
                  ? 'openDetail btnClose'
                  : 'openDetail'
              }`}
            >
              ⋯⋯點我看更多
              <FaCirclePlus className="yellow moreBtn" />
            </button>
          </div>
          <div
            className={`listdetail ${
              isOpenList[job.slug.current || job.slug] ? '' : 'close'
            }`}
          >
            <ul>
              <li>工作期間：{job.jobperiod}</li>
              <li>勤務時間：{job.jobtime}</li>
              <li>休息時間：{job.resttime}</li>
              <li>每週工時：{job.workhour}</li>
              <li>日文程度：{job.japanese}</li>
              <li>福利厚生：{job.privilege}</li>
            </ul>
            {job.detailedFile?.asset?._ref && (
              <a
                href={`https://cdn.sanity.io/files/${
                  client.config().projectId
                }/${client.config().dataset}/${
                  job.detailedFile.asset._ref.split('-')[1]
                }.pdf`} // 使用 _ref 生成 URL
                download
                target="blank"
              >
                <LuDownload />
                下載求人票
              </a>
            )}
            <button onClick={() => toggleList(job.slug.current || job.slug)}>
              <FaCircleMinus className="yellow moreBtn" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
