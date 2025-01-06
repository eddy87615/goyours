/* eslint-disable react/prop-types */
import { useState } from 'react';
import { client, urlFor } from '../../cms/sanityClient';
import { useNavigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';

import { MdHomeWork } from 'react-icons/md';
import { LuClipboardList } from 'react-icons/lu';
import { FaLocationDot } from 'react-icons/fa6';
import { RiMoneyCnyCircleFill } from 'react-icons/ri';
import { FaCirclePlus, FaCircleMinus } from 'react-icons/fa6';
import { LuDownload } from 'react-icons/lu';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { TbThumbUpFilled } from 'react-icons/tb';
import { FaFireAlt } from 'react-icons/fa';

import useWindowSize from '../../hook/useWindowSize';

import './jobList.css';

export default function JobList({ jobList, isSearchTriggered, totalResults }) {
  const [isOpenList, setIsOpenList] = useState({});
  const windowSize = useWindowSize();

  const toggleList = (slug) => {
    setIsOpenList((prevState) => ({
      ...prevState,
      [slug]: !prevState[slug], // 切換指定職缺的展開狀態
    }));
  };

  const navigate = useNavigate();
  const handleInquiry = (jobName) => {
    navigate('/contact-us', {
      state: { initialMessage: `我對${jobName}職缺有興趣，想要諮詢` },
    });
  };
  const handleInquiryResume = (jobName) => {
    navigate('/working-holiday-application', {
      state: { initialMessage: `${jobName}` },
    });
  };

  return (
    <HelmetProvider>
      <div className="jobListSection">
        <Helmet>
          <title>Go Yours打工度假職缺列表</title>
          <meta
            name="description"
            content="高優熊介紹打工度假的工作機會給你！"
          />
        </Helmet>
        {isSearchTriggered && jobList.length > 0 ? (
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
        ) : (
          <></>
        )}

        {jobList.length > 0 ? (
          jobList.map((job) => (
            <div key={job.slug.current || job.slug} className="joblist">
              {windowSize < 480 ? (
                <div className="joblistBtn">
                  <button onClick={() => handleInquiry(job.name)}>
                    我要諮詢
                  </button>
                  <button onClick={() => handleInquiryResume(job.name)}>
                    我要申請
                  </button>
                </div>
              ) : (
                <></>
              )}
              <div className="listintro">
                {windowSize < 480 ? <h2>{job.name}</h2> : <></>}
                <div className="job-img-wrapper">
                  {job.tags && (
                    <div className="job-tags">
                      <span
                        className={
                          job.tags.includes('我們的推薦')
                            ? 'tag-recommend'
                            : 'tag-hidden'
                        }
                      >
                        <TbThumbUpFilled />
                        推薦職缺
                      </span>
                      <span
                        className={
                          job.tags.includes('高人氣職缺')
                            ? 'tag-popular'
                            : 'tag-hidden'
                        }
                      >
                        <FaFireAlt />
                        高人氣
                      </span>
                    </div>
                  )}
                  <img src={urlFor(job.mainImage).url()} alt={job.name} />
                </div>
                <ul>
                  {windowSize < 480 ? (
                    <></>
                  ) : (
                    <li>
                      <h2>{job.name}</h2>
                    </li>
                  )}
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
                    {job.transportation ? job.transportation : '未提供'}
                  </li>
                  <li>
                    <RiMoneyCnyCircleFill className="yellow jobisticon" />
                    時薪{job.salary}日幣
                  </li>
                </ul>
                {windowSize < 480 ? (
                  <></>
                ) : (
                  <div className="joblistBtn">
                    <button onClick={() => handleInquiry(job.name)}>
                      我要諮詢
                    </button>
                    <button onClick={() => handleInquiryResume(job.name)}>
                      我要申請
                    </button>
                  </div>
                )}
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
                <ul
                  className={`listdetaillist ${
                    isOpenList[job.slug.current || job.slug] ? '' : 'close'
                  }`}
                >
                  <li>
                    工作期間：{job.jobperiod ? job.jobperiod : '依雇主規定'}
                  </li>
                  <li>勤務時間：{job.jobtime ? job.jobtime : '依雇主規定'}</li>
                  <li>
                    休息時間：{job.resttime ? job.resttime : '依雇主規定'}
                  </li>
                  <li>
                    每週工時：{job.workhour ? job.workhour : '依雇主規定'}
                  </li>
                  <li>
                    日文程度：{job.japanese ? job.japanese : '依雇主要求'}
                  </li>
                  <li>
                    福利厚生：
                    {job.privilege ? job.privilege : '加保雇用年金以及社會保險'}
                  </li>
                </ul>
                {job.detailedFile?.asset?._ref && (
                  <a
                    href={`https://cdn.sanity.io/files/${
                      client.config().projectId
                    }/${client.config().dataset}/${
                      job.detailedFile.asset._ref.split('-')[1]
                    }.${job.detailedFile.asset._ref.split('-')[2]}`} // 動態獲取副檔名
                    download={`${job.name || '求人票'}.${
                      job.detailedFile.asset._ref.split('-')[2]
                    }`} // 設置正確的檔案名稱
                    target="_blank"
                    rel="noopener noreferrer"
                    className={` ${
                      isOpenList[job.slug.current || job.slug] ? '' : 'btnClose'
                    }`}
                  >
                    <LuDownload />
                    下載求人票
                  </a>
                )}

                <button
                  onClick={() => toggleList(job.slug.current || job.slug)}
                >
                  <FaCircleMinus className="yellow moreBtn" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="postLoading postLoadingP">無搜尋結果</div>
        )}
      </div>
    </HelmetProvider>
  );
}
