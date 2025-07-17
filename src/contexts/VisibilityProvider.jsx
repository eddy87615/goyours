import { createContext, useContext, useState, useEffect, useRef } from 'react';

const VisibilityContext = createContext();

const VisibilityProvider = ({ children }) => {
  const [visibleElement, setVisibleElement] = useState(new Set());
  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElement((prev) => new Set(prev.add(entry.target)));
          } else {
            setVisibleElement((prev) => {
              const updated = new Set(prev);
              updated.delete(entry.target);
              return updated;
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => observer.current.disconnect();
  }, []);

  const observe = (element) => element && observer.current.observe(element);
  const unoserve = (element) => element && observer.current.unobserve(element);

  return (
    <VisibilityContext.Provider value={{ visibleElement, observe, unoserve }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => useContext(VisibilityContext);

export default VisibilityProvider;
