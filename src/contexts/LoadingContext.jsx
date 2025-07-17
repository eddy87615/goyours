import { createContext, useContext, useState, useCallback } from 'react';
import { LoadingBear } from '../components/common';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key) => {
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.values(loadingStates).some(state => state) || globalLoading;
  }, [loadingStates, globalLoading]);

  const withLoading = useCallback(async (key, asyncFunction) => {
    try {
      setLoading(key, true);
      const result = await asyncFunction();
      return result;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  const value = {
    setLoading,
    isLoading,
    setGlobalLoading,
    globalLoading,
    withLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading() && <LoadingBear />}
    </LoadingContext.Provider>
  );
};

export { LoadingProvider };
export default LoadingProvider;