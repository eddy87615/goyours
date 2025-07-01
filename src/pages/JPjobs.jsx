import { client } from "../cms/sanityClient";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";

import "./JPjobs.css";
import OfficialJob from "../components/OfficialJob/OfficialJob";
import Pagination from "../components/pagination/pagination";
import SearchBar from "../components/searchBar_career/searchBar";
import LoadingBear from "../components/loadingBear/loadingBear";

const ITEMS_PER_PAGE = 10;
const SCROLL_DELAY = 500;

const RECOMMENDATION_TAGS = ["我們的推薦", "高人氣職缺"];
const SORT_OPTIONS = ["職缺由新到舊", "年薪由高到低"];

const SALARY_RANGES = {
  "~400": (cleaned, range) =>
    cleaned === "~400" || (range.min === 0 && range.max <= 400),
  "400~500": (cleaned) => cleaned === "400~500" || cleaned === "400500",
  "500~600": (cleaned) => cleaned === "500~600" || cleaned === "500600",
  "600~": (cleaned, range) =>
    cleaned === "600~" || cleaned.startsWith("600~") || range.min >= 600,
};

const SANITY_QUERY = `
  *[_type == "company" && !(_id in path("drafts.**"))] {
    ...,
    "jobs": *[_type == "job" && references(^._id) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      ..., 
      "parentCompany": ^ {
        ...,
      }
    }
  } | order(name asc)
`;

const SEO_CONFIG = {
  title:
    "Go Yours：日本打工度假職缺列表｜日本打工度假簽證申請步驟｜高優幫你實現日本打工度假的夢想！",
  description:
    "高優所有的日本打工度假工作推薦，讓我們幫你找到最適合你的工作，一步一步帶著你到去你的日本打工度假！",
  keywords: "日本打工度假、打工度假簽證、工作機會、生活指南、申請流程",
};

const parseSalaryRange = (salaryString) => {
  if (!salaryString || typeof salaryString !== "string") {
    return { min: 0, max: Infinity };
  }

  const cleanedSalaryString = salaryString.replace(/[^\d~]/g, "");

  if (cleanedSalaryString.startsWith("~")) {
    const max = parseInt(cleanedSalaryString.substring(1), 10);
    return { min: 0, max: !isNaN(max) ? max : Infinity };
  } else if (cleanedSalaryString.endsWith("~")) {
    const min = parseInt(cleanedSalaryString.slice(0, -1), 10);
    return { min: !isNaN(min) ? min : 0, max: Infinity };
  } else if (cleanedSalaryString.includes("~")) {
    const salaryParts = cleanedSalaryString
      .split("~")
      .map((val) => parseInt(val, 10));
    if (salaryParts.length === 2) {
      const min = !isNaN(salaryParts[0]) ? salaryParts[0] : 0;
      const max = !isNaN(salaryParts[1]) ? salaryParts[1] : Infinity;
      return { min, max };
    }
  } else {
    const value = parseInt(cleanedSalaryString, 10);
    if (!isNaN(value)) {
      return { min: value, max: value };
    }
  }

  return { min: 0, max: Infinity };
};

const matchesSalaryFilter = (job, selectedSalary) => {
  if (!selectedSalary) return true;

  const jobSalaryClean = job.yearIncome
    ? job.yearIncome.replace(/[^\d~]/g, "")
    : "";
  const jobActualSalaryRange = parseSalaryRange(job.yearIncome || "");

  const matcher = SALARY_RANGES[selectedSalary];
  return matcher ? matcher(jobSalaryClean, jobActualSalaryRange) : false;
};

const filterJobs = (jobList, searchParams) => {
  const {
    keyword,
    selectedLocation,
    selectedJob,
    selectedSalary,
    selectedGyousyu,
    selectedSyokusyu,
    selectedTags = [],
  } = searchParams;

  return jobList.filter((job) => {
    const jobTitle = job.title || "";
    const companyName = job.parentCompany?.name || "";
    const jobActualTags = job.tags || [];
    const jobArea = job.area || "";
    const jobHiringType = job.hiringType || "";
    const jobGyousyu = job.gyousyu || "";
    const jobSyokusyu = job.syokusyu || "";

    const matchesKeyword = keyword
      ? jobTitle.toLowerCase().includes(keyword.toLowerCase()) ||
        companyName.toLowerCase().includes(keyword.toLowerCase())
      : true;

    const matchesLocation = selectedLocation
      ? jobArea === selectedLocation
      : true;
    const matchesJobType = selectedJob ? jobHiringType === selectedJob : true;
    const matchesSalary = matchesSalaryFilter(job, selectedSalary);
    const matchesGyousyu = selectedGyousyu
      ? jobGyousyu === selectedGyousyu
      : true;
    const matchesSyokusyu = selectedSyokusyu
      ? jobSyokusyu === selectedSyokusyu
      : true;

    const activeRecommendationTags = selectedTags.filter((tag) =>
      RECOMMENDATION_TAGS.includes(tag)
    );
    const matchesRecommendationTags =
      activeRecommendationTags.length > 0
        ? activeRecommendationTags.every((tag) => jobActualTags.includes(tag))
        : true;

    return (
      matchesKeyword &&
      matchesLocation &&
      matchesJobType &&
      matchesSalary &&
      matchesGyousyu &&
      matchesSyokusyu &&
      matchesRecommendationTags
    );
  });
};

const sortJobs = (jobList, selectedTags) => {
  const activeSortOption = selectedTags.find((tag) =>
    SORT_OPTIONS.includes(tag)
  );

  if (activeSortOption === "職缺由新到舊") {
    return [...jobList].sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );
  } else if (activeSortOption === "年薪由高到低") {
    return [...jobList].sort((a, b) => {
      const salaryA = parseSalaryRange(a.yearIncome).min || 0;
      const salaryB = parseSalaryRange(b.yearIncome).min || 0;
      return salaryB - salaryA;
    });
  }

  return jobList;
};

const useHashNavigation = (jobList, setCurrentPage) => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location &&
      jobList.length > 0
    ) {
      const targetSlug = window.location.hash.replace("#", "");

      if (targetSlug) {
        const targetIndex = jobList.findIndex(
          (job) => job.slug?.current === targetSlug
        );

        if (targetIndex !== -1) {
          const targetPage = Math.floor(targetIndex / ITEMS_PER_PAGE) + 1;
          setCurrentPage(targetPage);

          setTimeout(() => {
            const element = document.getElementById(targetSlug);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, SCROLL_DELAY);
        }
      }
    }
  }, [jobList, setCurrentPage]);
};

const MetaTags = () => {
  const currentURL =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "";
  const imageURL =
    typeof window !== "undefined"
      ? `${window.location.origin}/LOGO-02-text.png`
      : "";

  return (
    <Helmet>
      <title>{SEO_CONFIG.title}</title>
      <meta name="keywords" content={SEO_CONFIG.keywords} />
      <meta name="description" content={SEO_CONFIG.description} />
      <link rel="canonical" href={currentURL} />

      <meta property="og:site_name" content="Go Yours：高優國際" />
      <meta property="og:title" content={SEO_CONFIG.title} />
      <meta property="og:description" content={SEO_CONFIG.description} />
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
      <meta name="twitter:title" content={SEO_CONFIG.title} />
      <meta name="twitter:description" content={SEO_CONFIG.description} />
      <meta name="twitter:image" content={imageURL} />
    </Helmet>
  );
};

export default function JPjobs() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [jobList, setJobList] = useState([]);
  const [filteredJobList, setFilteredJobList] = useState([]);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialFilters, setInitialFilters] = useState(null);

  useHashNavigation(jobList, setCurrentPage);

  // Initialize filters from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filters = {
      keyword: params.get('keyword') || '',
      selectedLocation: params.get('location') || '',
      selectedJob: params.get('job') || '',
      selectedSalary: params.get('salary') || '',
      selectedGyousyu: params.get('gyousyu') || '',
      selectedSyokusyu: params.get('syokusyu') || '',
      selectedTags: params.get('tags') ? JSON.parse(params.get('tags')) : []
    };
    
    setInitialFilters(filters);
    const page = parseInt(params.get('page') || '1', 10);
    setCurrentPage(page);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const companiesWithNestedJobs = await client.fetch(SANITY_QUERY);
        const flatJobList = companiesWithNestedJobs.flatMap(
          (company) => company.jobs || []
        );

        setJobList(flatJobList);
        
        // Apply initial filters if they exist
        if (initialFilters && Object.values(initialFilters).some(v => v.length > 0)) {
          const filteredJobs = sortJobs(
            filterJobs(flatJobList, initialFilters),
            initialFilters.selectedTags
          );
          setFilteredJobList(filteredJobs);
          setIsSearchTriggered(true);
        } else {
          setFilteredJobList(flatJobList);
        }
      } catch (error) {
        console.error("Failed to fetch job list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialFilters]);

  const handleSearch = (searchParams) => {
    const {
      keyword,
      selectedLocation,
      selectedJob,
      selectedSalary,
      selectedGyousyu,
      selectedSyokusyu,
      selectedTags = [],
    } = searchParams;

    // Update URL with search parameters
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedJob) params.set('job', selectedJob);
    if (selectedSalary) params.set('salary', selectedSalary);
    if (selectedGyousyu) params.set('gyousyu', selectedGyousyu);
    if (selectedSyokusyu) params.set('syokusyu', selectedSyokusyu);
    if (selectedTags.length > 0) params.set('tags', JSON.stringify(selectedTags));
    params.set('page', '1');

    const isEmptySearch =
      !keyword &&
      !selectedLocation &&
      !selectedJob &&
      !selectedSalary &&
      !selectedGyousyu &&
      !selectedSyokusyu &&
      selectedTags.length === 0;

    if (isEmptySearch) {
      navigate(`?`); // Clear URL parameters
      setFilteredJobList(jobList);
      setCurrentPage(1);
      setIsSearchTriggered(false);
      return;
    }

    navigate(`?${params.toString()}`);

    let filteredJobs = filterJobs(jobList, searchParams);
    filteredJobs = sortJobs(filteredJobs, selectedTags);

    setFilteredJobList(filteredJobs);
    setCurrentPage(1);
    setIsSearchTriggered(true);
  };

  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber);
    navigate(`?${params.toString()}`);
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="postLoading pageLoading">
        <LoadingBear />
      </div>
    );
  }

  const indexOfLastJob = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - ITEMS_PER_PAGE;
  const currentJobs = filteredJobList.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobList.length / ITEMS_PER_PAGE);

  return (
    <>
      <MetaTags />
      <div className="workingholiday">
        <div className="jobListKv">
          <SearchBar onSearch={handleSearch} initialFilters={initialFilters} />
        </div>
        <OfficialJob
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
