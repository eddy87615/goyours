import { client } from '../cms/sanityClient';
import { useState, useEffect } from 'react';

import './working.css';
import JobList from '../components/jobList/jobList';
import Pagination from '../components/pagination/pagination';

export default function Working() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [jobList, setJobList] = useState([]);

  useEffect(() => {
    async function fetchJobList() {
      // 獲取所有職缺
      const jobs = await client.fetch(`*[_type == "jobList"]`);
      setTotalItems(jobs.length); // 設置總項目數
      setJobList(jobs); // 設置完整職缺數據
    }
    fetchJobList();
  }, []);

  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = jobList.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="workingholiday">
      <div className="jobListKv"></div>
      <JobList jobList={currentJobs} />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
