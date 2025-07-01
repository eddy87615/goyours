import { client } from "../cms/sanityClient";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import "./PTjob.css";
import JobList from "../components/jobList/jobList";
import Pagination from "../components/pagination/pagination";
import SearchBar from "../components/searchBar/searchBar";
import LoadingBear from "../components/loadingBear/loadingBear";

export default function PTjob() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // eslint-disable-next-line no-unused-vars
  const [totalItems, setTotalItems] = useState(0);
  const [jobList, setJobList] = useState([]);
  const [filteredJobList, setFilteredJobList] = useState([]);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  // 處理目標職缺的 useEffect
  useEffect(() => {
    const handleTargetJob = () => {
      const targetSlug = location.hash.replace("#", "");

      if (targetSlug && jobList.length > 0) {
        // 找到目標職缺的索引
        const targetIndex = jobList.findIndex(
          (job) => job.slug.current === targetSlug
        );

        if (targetIndex !== -1) {
          // 計算目標職缺在第幾頁
          const targetPage = Math.floor(targetIndex / itemsPerPage) + 1;

          // 設置到對應的頁面
          setCurrentPage(targetPage);
          setFilteredJobList(jobList); // 確保顯示完整列表
          setIsSearchTriggered(false); // 重置搜尋狀態

          // 等待頁面更新後滾動到目標位置
          setTimeout(() => {
            const element = document.getElementById(targetSlug);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, 500);
        }
      }
    };

    handleTargetJob();
  }, [location.hash, jobList]); // 當 hash 或 jobList 改變時重新執行

  useEffect(() => {
    async function fetchJobList() {
      // 獲取所有職缺
      const jobs = await client.fetch(
        `*[_type == "jobList" && !(_id in path("drafts.**"))] | order(publishedAt desc)`
      );
      setTotalItems(jobs.length);
      setJobList(jobs);
      setFilteredJobList(jobs);
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

    const salaryParts = salaryString.split("~").map((val) => parseInt(val, 10));

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

    const tagFilters = ["我們的推薦", "高人氣職缺"];
    const sortOptions = ["職缺由新到舊", "時薪由高到低"];

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
      const jobName = job.name || "";
      const jobCompany = job.company || "";
      const jobTags = job.tags || [];
      const jobArea = job.area || "";
      const jobJobType = job.jobtype || "";
      const jobSalary = job.salary || "0~Infinity";

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
    if (activeSort === "職缺由新到舊") {
      filtered = filtered.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );
    } else if (activeSort === "時薪由高到低") {
      filtered = filtered.sort((a, b) => {
        const salaryA = parseFloat(a.salary.split("~")[0]) || 0;
        const salaryB = parseFloat(b.salary.split("~")[0]) || 0;
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

  const currentURL = `${window.location.origin}${location.pathname}`;
  const imageURL = `${window.location.origin}/LOGO-02-text.png`;

  return (
    <>
      <Helmet>
        <title>
          Go
          Yours：日本打工度假職缺列表｜日本打工度假簽證申請步驟｜高優幫你實現日本打工度假的夢想！
        </title>
        <meta
          name="keywords"
          content="日本打工度假、打工度假簽證、工作機會、生活指南、申請流程"
        />
        <meta
          name="description"
          content="高優所有的日本打工度假工作推薦，讓我們幫你找到最適合你的工作，一步一步帶著你到去你的日本打工度假！"
        />
        <link rel="canonical" href={currentURL} />

        <meta property="og:site_name" content="Go Yours：高優國際" />
        <meta
          property="og:title"
          content="Go Yours：日本打工度假工作推薦｜日本打工度假簽證申請步驟｜高優幫你實現日本打工度假的夢想！"
        />
        <meta
          property="og:description"
          content="高優所有的日本打工度假工作推薦，讓我們幫你找到最適合你的工作，一步一步帶著你到去你的日本打工度假！"
        />
        <meta property="og:url" content={currentURL} />
        <meta property="og:image" content={imageURL} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:image:secure_url"
          content="https://www.goyours.tw/open_graph.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Go Yours Logo" />
        <meta
          name="twitter:title"
          content="Go Yours：日本打工度假工作推薦｜日本打工度假簽證申請步驟｜高優幫你實現日本打工度假的夢想！"
        />
        <meta
          name="twitter:description"
          content="高優所有的日本打工度假工作推薦，讓我們幫你找到最適合你的工作，一步一步帶著你到去你的日本打工度假！"
        />
        <meta name="twitter:image" content={imageURL} />
      </Helmet>
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
    </>
  );
}
