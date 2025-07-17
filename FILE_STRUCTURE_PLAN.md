# File Structure Reorganization Plan

## Current Issues Identified

1. **Mixed concerns in pages folder** - CSS files mixed with JSX files
2. **Duplicate sanityClient files** - Both in `src/cms/` and `src/`
3. **Inconsistent component organization** - Some components grouped by feature, others not
4. **Missing index.js files** - No barrel exports for cleaner imports
5. **Assets scattered** - Some in `src/assets/`, logos in `public/`
6. **Mixed naming conventions** - camelCase, kebab-case, PascalCase mixed
7. **Unstructured public folder** - Too many loose files

## Proposed New Structure

```
src/
├── app/                          # App-level files
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── assets/                       # Static assets used in components
│   ├── images/
│   │   ├── logos/
│   │   ├── icons/
│   │   └── illustrations/
│   └── styles/
│       ├── globals.css
│       └── variables.css
├── components/                   # Reusable UI components
│   ├── common/                   # Generic reusable components
│   │   ├── LoadingBear/
│   │   ├── Navigation/
│   │   ├── Footer/
│   │   ├── ScrollToTop/
│   │   └── index.js
│   ├── forms/                    # Form-related components
│   │   ├── ContactForm/
│   │   ├── ContactFormResume/
│   │   ├── ContactFormResumeJob/
│   │   └── index.js
│   ├── content/                  # Content display components
│   │   ├── PostArea/
│   │   ├── PostCatalog/
│   │   ├── PostCategory/
│   │   ├── HotPost/
│   │   ├── MorePost/
│   │   └── index.js
│   ├── search/                   # Search-related components
│   │   ├── SearchBar/
│   │   ├── SearchBarCareer/
│   │   ├── SchoolSearch/
│   │   └── index.js
│   ├── jobs/                     # Job-related components
│   │   ├── JobList/
│   │   ├── HomeJobList/
│   │   ├── OfficialJob/
│   │   └── index.js
│   ├── schools/                  # School-related components
│   │   ├── School/
│   │   └── index.js
│   ├── goyours-bear/            # GoYours Bear themed components
│   │   ├── GoyoursBear/
│   │   ├── InformBear/
│   │   └── index.js
│   └── index.js
├── contexts/                     # React contexts
│   ├── LoadingContext.jsx
│   ├── SanityDataContext.jsx
│   ├── SEOContext.jsx
│   ├── ResponsiveContext.jsx
│   ├── VisibilityProvider.jsx
│   ├── AppContextProvider.jsx
│   └── index.js
├── features/                     # Feature-based modules
│   ├── home/
│   │   ├── components/
│   │   │   ├── HomeBg/
│   │   │   ├── AnimationSection/
│   │   │   └── index.js
│   │   ├── HomePage.jsx
│   │   ├── home.css
│   │   └── index.js
│   ├── about/
│   │   ├── AboutPage.jsx
│   │   ├── about.css
│   │   └── index.js
│   ├── contact/
│   │   ├── ContactPage.jsx
│   │   ├── contact.css
│   │   └── index.js
│   ├── posts/
│   │   ├── PostsPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   ├── posts.css
│   │   └── index.js
│   ├── jobs/
│   │   ├── JobsPage.jsx
│   │   ├── JobDetailPage.jsx
│   │   ├── PTJobPage.jsx
│   │   ├── jobs.css
│   │   └── index.js
│   ├── schools/
│   │   ├── SchoolsPage.jsx
│   │   ├── SchoolDetailPage.jsx
│   │   ├── StudyingInJpPage.jsx
│   │   ├── schools.css
│   │   └── index.js
│   └── misc/
│       ├── PrivacyPage.jsx
│       ├── QAPage.jsx
│       ├── DownloadPage.jsx
│       ├── ActivityPage.jsx
│       └── index.js
├── hooks/                        # Custom React hooks
│   ├── useWindowSize.js
│   ├── useGetKeywords.js
│   ├── useSearchHandler.js
│   └── index.js
├── services/                     # External service integrations
│   ├── sanity/
│   │   ├── client.js
│   │   ├── queries/
│   │   │   ├── posts.js
│   │   │   ├── schools.js
│   │   │   ├── jobs.js
│   │   │   └── index.js
│   │   └── index.js
│   └── index.js
├── styles/                       # Global styles
│   ├── index.css
│   ├── components.css
│   └── pages.css
├── utils/                        # Utility functions
│   ├── constants.js
│   ├── helpers.js
│   └── index.js
└── types/                        # TypeScript types (if migrating to TS)
    ├── sanity.ts
    ├── components.ts
    └── index.ts
```

## Public Folder Reorganization

```
public/
├── favicon/                      # All favicon files
├── images/                       # Static images served directly
│   ├── logos/
│   ├── kv/                      # Key visual images
│   ├── about/
│   ├── guide-page/
│   └── jobs/
├── icons/                        # SVG icons
├── documents/                    # Downloadable files
├── manifest.json
├── robots.txt
├── sitemap.xml
└── google7fcf4624e7855afe.html
```

## Benefits of New Structure

1. **Feature-based Organization**: Related files grouped together
2. **Clear Separation of Concerns**: Components, pages, services clearly separated
3. **Better Scalability**: Easy to add new features without cluttering
4. **Improved Developer Experience**: Easier to find and maintain code
5. **Consistent Naming**: All folders use camelCase or kebab-case consistently
6. **Barrel Exports**: Clean import statements with index.js files
7. **Asset Organization**: Images and styles properly categorized

## Migration Strategy

1. Create new folder structure
2. Move files to appropriate locations
3. Update all import paths
4. Create index.js files for barrel exports
5. Test all functionality
6. Remove old unused files

## Breaking Changes

- All import paths will need to be updated
- Some component names may be changed for consistency
- File extensions normalized (.jsx for components, .js for utilities)