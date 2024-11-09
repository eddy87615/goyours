import { FaLocationDot } from 'react-icons/fa6';
import GoyoursBearJob from '../goyoursBear/goyoursBearJob';

import './homeJobList.css';

export default function HomeJobList() {
  const jobListContent = [
    {
      jobName: '巧克力工廠',
      location: '東京都・千葉縣',
      src: '/src/assets/巧克力工廠.jpg',
      alt: '巧克力工廠',
      introtxt: '',
      jobContent: '巧克力工廠作業員',
      traffic: '新京成線稔台站',
      salary: '1100円',
    },
    {
      jobName: '舞濱物流生產線作業員',
      location: '東京都',
      src: '/src/assets/生產線.jpg',
      alt: '生產線',
      introtxt: '',
      jobContent: '生產線輕作業',
      traffic: '舞濱車站巴士・徒步',
      salary: '1300円',
    },
    {
      jobName: '溫泉飯店餐廳服務員',
      location: '栃木縣',
      src: '/src/assets/鬼怒川溫泉站.jpg',
      alt: '鬼怒川溫泉站',
      introtxt: '',
      jobContent: '自助餐廳服務員',
      traffic: '鬼怒川溫泉站',
      salary: '1300円',
    },
    {
      jobName: '關西機場免稅店',
      location: '關西機場',
      src: '/src/assets/關西機場.jpg.webp',
      alt: '關西機場',
      introtxt: '',
      jobContent: '機場免稅店',
      traffic: 'JR關空快線',
      salary: '1100円',
    },
    {
      jobName: '滑雪中心',
      location: '長野縣',
      src: '/src/assets/滑雪中心.jpg',
      alt: '長野縣滑雪中心',
      introtxt: '',
      jobContent: '滑雪場相關業務',
      traffic: '飯山站',
      salary: '1200円',
    },
    {
      jobName: '倉庫作業員',
      location: '東京都',
      src: '/src/assets/上野倉庫作業員.jpeg',
      alt: '上野倉庫作業員',
      introtxt: '',
      jobContent: '倉庫輕作業及食品分類人員',
      traffic: '上野站',
      salary: '1150円',
    },
  ];
  return (
    <>
      <div>
        <div className="homeJobH1">
          <h1>
            <span className="yellow">Working Holiday</span>
            打工度假職缺一覽
            <GoyoursBearJob />
          </h1>
        </div>
        <div className="workingholidayDiv">
          {jobListContent.map((job, index) => {
            return (
              <div key={index} className="jobListPre">
                <div className="jobListimg">
                  <img src={job.src} alt={job.jobName} />
                </div>
                <div className="jobListcontent">
                  <h3>{job.jobName}</h3>
                  <p>
                    <FaLocationDot /> {job.location}
                  </p>
                  {/* <p dangerouslySetInnerHTML={{ __html: job.introtxt }}></p> */}
                  <ul>
                    <li>
                      <span>職稱</span>
                      {job.jobContent}
                    </li>
                    <li>
                      <span>內容</span>
                      {job.traffic}
                    </li>
                    <li>
                      <span>時薪</span>
                      {job.salary}
                    </li>
                  </ul>
                  <button className="schoolListDetailBtn">了解職缺詳情</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <a className="formoreBtntoPage" href="./working">
        看更多職缺
      </a>
    </>
  );
}
