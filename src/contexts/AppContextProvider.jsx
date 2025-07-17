import { LoadingProvider } from './LoadingContext';
import { SanityDataProvider } from './SanityDataContext';
import { SEOProvider } from './SEOContext';
import { ResponsiveProvider } from './ResponsiveContext';

const AppContextProvider = ({ children }) => {
  return (
    <ResponsiveProvider>
      <SanityDataProvider>
        <LoadingProvider>
          <SEOProvider>
            {children}
          </SEOProvider>
        </LoadingProvider>
      </SanityDataProvider>
    </ResponsiveProvider>
  );
};

export default AppContextProvider;