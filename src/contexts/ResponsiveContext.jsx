import { createContext, useContext, useState, useEffect } from 'react';

const ResponsiveContext = createContext();

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within ResponsiveProvider');
  }
  return context;
};

const breakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280
};

const ResponsiveProvider = ({ children }) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const [device, setDevice] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const { width } = windowSize;
    
    if (width < breakpoints.mobile) {
      setDevice('mobile');
    } else if (width < breakpoints.tablet) {
      setDevice('tablet');
    } else if (width < breakpoints.desktop) {
      setDevice('desktop');
    } else {
      setDevice('largeDesktop');
    }
  }, [windowSize]);

  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const isDesktop = device === 'desktop' || device === 'largeDesktop';
  const isLargeDesktop = device === 'largeDesktop';

  const isBreakpoint = (breakpoint) => {
    const { width } = windowSize;
    
    switch (breakpoint) {
      case 'mobile':
        return width < breakpoints.mobile;
      case 'tablet':
        return width >= breakpoints.mobile && width < breakpoints.tablet;
      case 'desktop':
        return width >= breakpoints.tablet && width < breakpoints.desktop;
      case 'largeDesktop':
        return width >= breakpoints.desktop;
      default:
        return false;
    }
  };

  const isMinWidth = (width) => windowSize.width >= width;
  const isMaxWidth = (width) => windowSize.width <= width;

  const value = {
    windowSize,
    device,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isBreakpoint,
    isMinWidth,
    isMaxWidth,
    breakpoints
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export { ResponsiveProvider };
export default ResponsiveProvider;