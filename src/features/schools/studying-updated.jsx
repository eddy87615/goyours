import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { urlFor } from "../../services/sanity/client";
import { useLoading } from "../../contexts/LoadingContext";
import { useSanityData } from "../../contexts/SanityDataContext";
import { SEOHelmet } from "../../contexts";
import { useResponsive } from "../../contexts/ResponsiveContext";
import { Footer, Navigation } from "../../components/common";
import './schools.css';

const Studying = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading, withLoading } = useLoading();
  const { fetchSchools } = useSanityData();
  const { isMobile } = useResponsive();
  
  const [studyingInJapanLists, setStudyingInJapanLists] = useState([]);
  const [currentPageCard, setCurrentPageCard] = useState(1);

  // URL state management
  const cardsPerPage = isMobile ? 9 : 10;
  const queryParams = new URLSearchParams(location.search);
  const currentPage = queryParams.get("p") || currentPageCard;

  const totalPagesCard = Math.ceil(studyingInJapanLists.length / cardsPerPage);
  const currentItemsCard = studyingInJapanLists.slice(
    (currentPageCard - 1) * cardsPerPage,
    currentPageCard * cardsPerPage
  );

  useEffect(() => {
    const loadSchools = async () => {
      await withLoading('schools', async () => {
        try {
          const data = await fetchSchools();
          setStudyingInJapanLists(data);
        } catch (error) {
          console.error('Error loading schools:', error);
        }
      });
    };

    loadSchools();
  }, [fetchSchools, withLoading]);

  useEffect(() => {
    if (currentPage !== currentPageCard) {
      const page = parseInt(currentPage) || 1;
      setCurrentPageCard(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, currentPageCard]);

  const handlePageChangeCard = (page) => {
    setCurrentPageCard(page);
    navigate(`?p=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <SEOHelmet
        title="日本語言學校推薦 | Go Yours"
        description="探索日本頂尖語言學校，Go Yours 為您精選優質日語教育機構，提供完整的學校資訊、學費說明和申請指導。"
        keywords="日本語言學校, 日語學習, 留學日本, 日本留學, 語言學校推薦"
        url={`https://goyours.com${location.pathname}`}
      />

      <Navigation />
      
      <div className="studying-body-wrapper">
        <div className="studying-header-section">
          <h1 className="studying-main-title">日本語言學校</h1>
          <p className="studying-subtitle">發現您的日語學習之旅</p>
        </div>

        <div className="studying-cards-container">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPageCard}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="studying-cards-grid"
            >
              {currentItemsCard.map((school, index) => (
                <motion.div
                  key={school._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={school.slug?.current ? `/studying-in-jp-school/${school.slug.current}` : '#'}
                    className="studying-card-link"
                  >
                    <div className="studying-card">
                      <div className="studying-card-image-container">
                        {school.mainImage?.asset ? (
                          <img
                            src={urlFor(school.mainImage).url()}
                            alt={school.title}
                            className="studying-card-image"
                          />
                        ) : (
                          <p className="noimg-notice">未提供圖片</p>
                        )}
                        <div className="studying-card-rank">
                          #{school.schoolRank}
                        </div>
                      </div>
                      <div className="studying-card-content">
                        <h3 className="studying-card-title">{school.title}</h3>
                        <p className="studying-card-location">{school.location}</p>
                        <p className="studying-card-excerpt">{school.excerpt}</p>
                        <div className="studying-card-footer">
                          <span className="studying-card-tuition">
                            學費: {school.tuitionFee}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPagesCard > 1 && (
            <div className="studying-pagination">
              <button
                onClick={() => handlePageChangeCard(currentPageCard - 1)}
                disabled={currentPageCard === 1}
                className="studying-pagination-button"
              >
                上一頁
              </button>
              
              <div className="studying-pagination-numbers">
                {[...Array(totalPagesCard)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChangeCard(index + 1)}
                    className={`studying-pagination-number ${
                      currentPageCard === index + 1 ? 'active' : ''
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChangeCard(currentPageCard + 1)}
                disabled={currentPageCard === totalPagesCard}
                className="studying-pagination-button"
              >
                下一頁
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Studying;