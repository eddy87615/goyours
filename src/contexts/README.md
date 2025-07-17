# Context Integration Guide

## Overview
This guide explains how to integrate the new context providers into your existing components.

## 1. Setup in App.jsx

First, wrap your app with the AppContextProvider:

```jsx
import { AppContextProvider } from './contexts/AppContextProvider';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <AppContextProvider>
        <Routes>
          {/* Your routes */}
        </Routes>
      </AppContextProvider>
    </HelmetProvider>
  );
}
```

## 2. Using LoadingContext

Replace individual loading states with the global loading context:

```jsx
// Before
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  fetchData().then(() => setLoading(false));
}, []);

// After
import { useLoading } from '../contexts/LoadingContext';

const { withLoading } = useLoading();

useEffect(() => {
  withLoading('uniqueKey', async () => {
    await fetchData();
  });
}, []);
```

## 3. Using SanityDataContext

Replace direct Sanity client calls with context methods:

```jsx
// Before
import { client } from '../cms/sanityClient';

const data = await client.fetch(query);

// After
import { useSanityData } from '../contexts/SanityDataContext';

const { fetchData, fetchPosts, fetchCategories } = useSanityData();

// For custom queries
const data = await fetchData(query, params);

// For common queries
const posts = await fetchPosts({ limit: 10 });
const categories = await fetchCategories();
```

## 4. Using SEOContext

Replace Helmet components with SEOHelmet:

```jsx
// Before
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>Page Title</title>
  <meta name="description" content="Description" />
  {/* More meta tags */}
</Helmet>

// After
import { SEOHelmet } from '../contexts/SEOContext';

<SEOHelmet
  title="Page Title"
  description="Description"
  keywords="keyword1, keyword2"
  url={window.location.href}
/>
```

## 5. Using ResponsiveContext

Replace useWindowSize hook with ResponsiveContext:

```jsx
// Before
import useWindowSize from '../hook/useWindowSize';

const size = useWindowSize();
const isMobile = size.width <= 768;

// After
import { useResponsive } from '../contexts/ResponsiveContext';

const { isMobile, isTablet, isDesktop, windowSize } = useResponsive();
```

## Benefits

1. **Reduced Code Duplication**: Common patterns are centralized
2. **Better Performance**: Data caching reduces API calls
3. **Consistent UX**: Global loading states and error handling
4. **Easier Maintenance**: Changes in one place affect all components
5. **Type Safety**: Can add TypeScript support easily

## Migration Checklist

- [ ] Wrap App with AppContextProvider
- [ ] Replace loading states with LoadingContext
- [ ] Replace Sanity client calls with SanityDataContext
- [ ] Replace Helmet with SEOHelmet
- [ ] Replace useWindowSize with ResponsiveContext
- [ ] Remove old imports and unused code
- [ ] Test all functionality