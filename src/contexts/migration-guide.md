# Context Migration Status and Guide

## Completed Migrations

✅ **App.jsx** - Added AppContextProvider wrapper
✅ **studying.jsx** - Fully migrated to use all contexts
✅ **home.jsx** - Migrated LoadingContext, SanityDataContext, SEOContext, ResponsiveContext  
✅ **contactForm.jsx** - Migrated ResponsiveContext

## Remaining Files to Migrate

### Priority 1 - Page Components (High Impact)

1. **postDetail.jsx** - Uses loading state, Sanity client, Helmet, windowSize
2. **JPjobs.jsx** - Uses loading state, Sanity client, Helmet, windowSize  
3. **goyours-post.jsx** - Uses loading state, Sanity client, Helmet
4. **about-us.jsx** - Uses Helmet
5. **contact-us.jsx** - Uses Helmet
6. **privacy.jsx** - Uses Helmet

### Priority 2 - Component Files (Medium Impact)

1. **components/hotPost/hotPost.jsx** - Uses Sanity client, windowSize
2. **components/homeJobList/homeJobList.jsx** - Uses Sanity client, windowSize
3. **components/morePost/morePost.jsx** - Uses Sanity client
4. **components/school/school.jsx** - Uses windowSize
5. **components/schoolSearch/schoolSearch.jsx** - Uses windowSize

## Quick Migration Steps

### For Each Page Component:

1. **Update imports:**
```jsx
// Remove
import { Helmet } from 'react-helmet-async';
import { client } from '../cms/sanityClient';
import useWindowSize from '../hook/useWindowSize';

// Add
import { useLoading } from '../contexts/LoadingContext';
import { useSanityData } from '../contexts/SanityDataContext';
import { SEOHelmet } from '../contexts/SEOContext';
import { useResponsive } from '../contexts/ResponsiveContext';
```

2. **Update component body:**
```jsx
// Remove
const [loading, setLoading] = useState(true);
const windowSize = useWindowSize();

// Add
const { withLoading } = useLoading();
const { fetchData, fetchPosts, fetchCategories } = useSanityData();
const { isMobile, windowSize } = useResponsive();
```

3. **Update data fetching:**
```jsx
// Replace
setLoading(true);
const data = await client.fetch(query);
setLoading(false);

// With
await withLoading('uniqueKey', async () => {
  const data = await fetchData(query);
  // process data
});
```

4. **Update SEO:**
```jsx
// Replace Helmet with SEOHelmet
<SEOHelmet
  title="Page Title"
  description="Page description"
  keywords="keywords"
  url={window.location.href}
/>
```

5. **Update responsive:**
```jsx
// Replace
const windowSize = useWindowSize();
const isMobile = windowSize <= 768;

// With
const { isMobile, windowSize } = useResponsive();
```

## Search and Replace Patterns

### Global Find/Replace Operations:

1. `import useWindowSize from '../hook/useWindowSize';` → Remove line
2. `import { client } from '../cms/sanityClient';` → Remove line  
3. `import { Helmet } from 'react-helmet-async';` → Remove line
4. `const windowSize = useWindowSize();` → `const { windowSize } = useResponsive();`
5. `const [loading, setLoading] = useState(true);` → Remove line
6. `setLoading(true);` → Remove line
7. `setLoading(false);` → Remove line
8. `client.fetch(` → `fetchData(`
9. `<Helmet>` → `<SEOHelmet`
10. `</Helmet>` → `/>`

## Testing Checklist

After migration, verify:
- [ ] All pages load without errors
- [ ] Loading states work correctly
- [ ] SEO meta tags are rendered properly
- [ ] Responsive behavior works on different screen sizes
- [ ] Data fetching and caching work as expected
- [ ] No console errors related to context usage

## Benefits Achieved

1. **Reduced Bundle Size**: Eliminated duplicate code across components
2. **Better Performance**: Data caching reduces API calls
3. **Consistent UX**: Global loading states and error handling
4. **Easier Maintenance**: Centralized logic for common patterns
5. **Better Developer Experience**: Simplified component code

## Migration Commands

Run these after migration:
```bash
npm run lint
npm run build
npm run dev
```