import React, { createContext, useContext, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

const SEOContext = createContext();

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within SEOProvider');
  }
  return context;
};

const defaultSEO = {
  title: 'Go Yours - Your Gateway to Japan',
  description: 'Discover opportunities in Japan with Go Yours. We provide comprehensive services for studying, working holidays, and living in Japan.',
  keywords: 'Japan, study in Japan, working holiday Japan, Japanese language school, jobs in Japan',
  author: 'Go Yours',
  image: '/logo.png',
  url: 'https://goyours.com',
  locale: 'zh_TW',
  type: 'website'
};

const SEOProvider = ({ children, defaults = {} }) => {
  const [seoData, setSeoData] = useState({ ...defaultSEO, ...defaults });

  const updateSEO = useCallback((newData) => {
    setSeoData(prev => ({ ...prev, ...newData }));
  }, []);

  const resetSEO = useCallback(() => {
    setSeoData({ ...defaultSEO, ...defaults });
  }, [defaults]);

  const value = {
    seoData,
    updateSEO,
    resetSEO
  };

  return (
    <SEOContext.Provider value={value}>
      {children}
    </SEOContext.Provider>
  );
};

export const SEOHelmet = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  author,
  locale = 'zh_TW',
  noindex = false,
  children 
}) => {
  const { seoData } = useSEO();
  
  const finalTitle = title || seoData.title;
  const finalDescription = description || seoData.description;
  const finalKeywords = keywords || seoData.keywords;
  const finalImage = image || seoData.image;
  const finalUrl = url || seoData.url;
  const finalType = type || seoData.type;
  const finalAuthor = author || seoData.author;
  const finalLocale = locale || seoData.locale;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={finalAuthor} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={finalType} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:locale" content={finalLocale} />
      <meta property="og:site_name" content="Go Yours" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content={finalLocale} />
      
      {children}
    </Helmet>
  );
};

export { SEOProvider };
export default SEOProvider;