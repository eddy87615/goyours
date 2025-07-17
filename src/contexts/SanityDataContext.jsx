import { createContext, useContext, useState, useCallback } from 'react';
import { client } from '../services/sanity/client';

const SanityDataContext = createContext();

export const useSanityData = () => {
  const context = useContext(SanityDataContext);
  if (!context) {
    throw new Error('useSanityData must be used within SanityDataProvider');
  }
  return context;
};

const SanityDataProvider = ({ children }) => {
  const [cache, setCache] = useState({});
  const [error, setError] = useState(null);

  const getCacheKey = (query, params = {}) => {
    return JSON.stringify({ query, params });
  };

  const fetchData = useCallback(async (query, params = {}, options = {}) => {
    const { 
      useCache = true, 
      cacheTime = 5 * 60 * 1000, // 5 minutes default
      onError = null 
    } = options;

    const cacheKey = getCacheKey(query, params);
    
    // Check cache
    if (useCache && cache[cacheKey]) {
      const { data, timestamp } = cache[cacheKey];
      const isExpired = Date.now() - timestamp > cacheTime;
      
      if (!isExpired) {
        return data;
      }
    }

    try {
      setError(null);
      const data = await client.fetch(query, params);
      
      // Update cache
      if (useCache) {
        setCache(prev => ({
          ...prev,
          [cacheKey]: {
            data,
            timestamp: Date.now()
          }
        }));
      }
      
      return data;
    } catch (err) {
      setError(err);
      if (onError) {
        onError(err);
      } else {
        console.error('Sanity fetch error:', err);
      }
      throw err;
    }
  }, [cache]);

  const invalidateCache = useCallback((query = null, params = null) => {
    if (!query) {
      // Clear all cache
      setCache({});
    } else {
      // Clear specific cache entry
      const cacheKey = getCacheKey(query, params);
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[cacheKey];
        return newCache;
      });
    }
  }, []);

  const prefetchData = useCallback(async (queries) => {
    const promises = queries.map(({ query, params, options }) => 
      fetchData(query, params, options)
    );
    
    try {
      await Promise.all(promises);
    } catch (err) {
      console.error('Prefetch error:', err);
    }
  }, [fetchData]);

  // Common queries as methods
  const fetchPosts = useCallback(async (params = {}) => {
    const query = `*[_type == "goyours-post"] | order(publishedAt desc) ${params.limit ? `[0...${params.limit}]` : ''} {
      title, slug, mainImage, author, publishedAt, categories[]->{title}, excerpt, _id
    }`;
    return fetchData(query, {}, { useCache: true });
  }, [fetchData]);

  const fetchPostBySlug = useCallback(async (slug) => {
    const query = `*[_type == "goyours-post" && slug.current == $slug][0] {
      title, slug, mainImage, body, author, publishedAt, categories[]->{title}, excerpt, _id
    }`;
    return fetchData(query, { slug }, { useCache: true });
  }, [fetchData]);

  const fetchCategories = useCallback(async () => {
    const query = `*[_type == "category"] | order(title asc) {title, _id}`;
    return fetchData(query, {}, { useCache: true, cacheTime: 10 * 60 * 1000 }); // 10 min cache
  }, [fetchData]);

  const fetchJobs = useCallback(async (params = {}) => {
    const query = `*[_type == "jp-jobs"] | order(publishedAt desc) ${params.limit ? `[0...${params.limit}]` : ''} {
      jobTitle, slug, location, salary, employmentType, publishedAt, company, excerpt, _id
    }`;
    return fetchData(query, {}, { useCache: true });
  }, [fetchData]);

  const fetchSchools = useCallback(async (params = {}) => {
    const query = `*[_type == "studying-in-jp-school"] | order(schoolRank asc) ${params.limit ? `[0...${params.limit}]` : ''} {
      title, slug, mainImage, schoolRank, location, tuitionFee, excerpt, _id
    }`;
    return fetchData(query, {}, { useCache: true });
  }, [fetchData]);

  const value = {
    fetchData,
    invalidateCache,
    prefetchData,
    error,
    // Common data fetchers
    fetchPosts,
    fetchPostBySlug,
    fetchCategories,
    fetchJobs,
    fetchSchools,
    // Direct client access if needed
    client
  };

  return (
    <SanityDataContext.Provider value={value}>
      {children}
    </SanityDataContext.Provider>
  );
};

export { SanityDataProvider };
export default SanityDataProvider;