import { client } from '../cms/sanityClient';
import { useState, useEffect } from 'react';

import './working.css';
import JobList from '../components/jobList/jobList';
import Pagination from '../components/pagination/pagination';
import SearchBar from '../components/searchBar/searchBar';
import LoadingBear from '../components/loadingBear/loadingBear';

export default function Working() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // eslint-disable-next-line no-unused-vars
  const [totalItems, setTotalItems] = useState(0);
  const [jobList, setJobList] = useState([]);
  const [filteredJobList, setFilteredJobList] = useState([]);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  useEffect(() => {
    async function fetchJobList() {
      // 獲取所有職缺
      const jobs = await client.fetch(
        `*[_type == "jobList"] | order(name asc)`
      );
      setTotalItems(jobs.length); // 設置總項目數
      setJobList(jobs); // 設置完整職缺數據
      setFilteredJobList(jobs); // 設置過濾後的職缺數據
      setLoading(false);
    }
    fetchJobList();
  }, []);

  useEffect(() => {
    setTotalItems(filteredJobList.length); // 更新總項目數
  }, [filteredJobList]);

  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobList.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const parseSalaryRange = (salaryString) => {
    if (!salaryString) return { min: 0, max: Infinity };

    const salaryParts = salaryString.split('~').map((val) => parseInt(val, 10));

    if (salaryParts.length === 1) {
      // 單一數值
      return { min: salaryParts[0], max: salaryParts[0] };
    } else if (salaryParts.length === 2) {
      // 範圍值
      return { min: salaryParts[0] || 0, max: salaryParts[1] || Infinity };
    }

    return { min: 0, max: Infinity };
  };

  const handleSearch = (searchParams) => {
    const {
      keyword,
      selectedJapanese,
      selectedLocation,
      selectedJob,
      selectedSalary,
      selectedTags,
    } = searchParams;

    const tagFilters = ['我們的推薦', '高人氣職缺'];
    const sortOptions = ['職缺由新到舊', '時薪由高到低'];

    // 分離出標籤條件和排序條件
    const activeTags = (selectedTags || []).filter((tag) =>
      tagFilters.includes(tag)
    );
    const activeSort = (selectedTags || []).find((tag) =>
      sortOptions.includes(tag)
    );

    const isEmptySearch =
      !keyword &&
      !selectedJapanese &&
      !selectedLocation &&
      !selectedJob &&
      !selectedSalary &&
      selectedTags.length === 0;

    if (isEmptySearch) {
      setFilteredJobList(jobList);
      setTotalItems(jobList.length);
      setCurrentPage(1);
      setIsSearchTriggered(true);
      return;
    }

    let filtered = jobList.filter((job) => {
      const jobName = job.name || '';
      const jobCompany = job.company || '';
      const jobTags = job.tags || [];
      const jobArea = job.area || '';
      const jobJobType = job.jobtype || '';
      const jobSalary = job.salary || '0~Infinity';

      const matchesKeyword = keyword
        ? jobName.includes(keyword) || jobCompany.includes(keyword)
        : true;

      const matchesJapanese = selectedJapanese
        ? job.japanese === selectedJapanese
        : true;

      const matchesLocation = selectedLocation
        ? jobArea === selectedLocation
        : true;

      const matchesJob = selectedJob ? jobJobType.includes(selectedJob) : true;

      const salaryRange = selectedSalary
        ? parseSalaryRange(selectedSalary)
        : null;
      const jobSalaryRange = parseSalaryRange(jobSalary);

      const matchesSalary = salaryRange
        ? jobSalaryRange.min >= salaryRange.min &&
          jobSalaryRange.max <= salaryRange.max
        : true;

      const matchesTags =
        activeTags.length > 0
          ? activeTags.some((tag) => jobTags.includes(tag))
          : true;

      return (
        matchesKeyword &&
        matchesJapanese &&
        matchesLocation &&
        matchesJob &&
        matchesSalary &&
        matchesTags
      );
    });

    // 應用排序
    if (activeSort === '職缺由新到舊') {
      filtered = filtered.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );
    } else if (activeSort === '時薪由高到低') {
      filtered = filtered.sort((a, b) => {
        const salaryA = parseFloat(a.salary.split('~')[0]) || 0;
        const salaryB = parseFloat(b.salary.split('~')[0]) || 0;
        return salaryB - salaryA;
      });
    }

    // 更新狀態
    setFilteredJobList(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
    setIsSearchTriggered(true);
  };

  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="postLoading pageLoading">
        <LoadingBear />
      </div>
    );
  }

  return (
    <div className="workingholiday">
      <div className="jobListKv">
        <SearchBar onSearch={handleSearch} />
      </div>
      <JobList
        jobList={currentJobs}
        isSearchTriggered={isSearchTriggered}
        totalResults={filteredJobList.length}
      />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
