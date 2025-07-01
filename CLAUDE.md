# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Go Yours is a React-based web application built with Vite that provides services for Japanese language study and working holiday programs. It integrates with Sanity CMS for content management and features both static pages and dynamic content.

## Development Commands

### Core Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Generate sitemap
npm run generate-sitemap

# Start dev server with host access
npm start
```

### Environment Setup
The project requires several environment variables:
- `VITE_SANITY_API_SANITY_PROJECT_ID` - Sanity project ID
- `VITE_SANITY_API_SANITY_TOKEN` - Sanity API token
- `VITE_SECRET_KEY` - Encryption key for contact forms
- `EMAIL_USER` - Gmail address for sending notifications
- `EMAIL_PASS` - Gmail app password
- `EMAIL_USER_RECEIVE` - Email address to receive notifications

## Architecture Overview

### Frontend Structure
- **Framework**: React 18 with React Router v6
- **Build Tool**: Vite with React plugin
- **Styling**: CSS modules with animations (animate.css)
- **State Management**: React hooks and context (VisibilityProvider)
- **CMS Integration**: Sanity Client for content fetching
- **SEO**: React Helmet Async for meta tags

### Key Directories
- `/src/pages/` - Route components with lazy loading
- `/src/components/` - Reusable UI components
- `/src/cms/` - Sanity client configuration
- `/api/` - Serverless API endpoints

### Routing Pattern
The app uses lazy-loaded routes defined in `src/App.jsx`:
- Static pages: `/about-us`, `/contact-us`, `/privacy-policy`
- Dynamic content: `/goyours-post/:slug`, `/studying-in-jp-school/:slug`
- Job listings: `/jp-jobs`, `/jp-part-time-jobs`

### API Architecture
Serverless functions in `/api/`:
1. **index.js** - Webhook handler for Sanity form notifications
2. **saveContact.js** - Encrypted contact form submission to Sanity
3. **messageNotification.js** - OmniChat API integration (needs refactoring for serverless)

### Component Patterns
- Components use functional React with hooks
- CSS modules for styling (`.css` files alongside components)
- Loading states handled by `LoadingBear` component
- Form components integrate with encrypted API endpoints

### Data Flow
1. Content fetched from Sanity CMS via `sanityClient.jsx`
2. Forms submitted with AES encryption to API endpoints
3. API endpoints validate, decrypt, and save to Sanity
4. Email notifications sent via Nodemailer

### Key Dependencies
- **@sanity/client**: CMS integration
- **react-router-dom**: Client-side routing
- **react-helmet-async**: SEO management
- **framer-motion**: Animations
- **crypto-js**: Form data encryption
- **nodemailer**: Email notifications

## Important Notes

1. **Security**: The OmniChat API token in `messageNotification.js` needs to be moved to environment variables
2. **Mixed API Patterns**: Most endpoints are serverless except `messageNotification.js` which uses Express
3. **Environment Variables**: Some use `VITE_` prefix (frontend convention) but are used in backend
4. **Git Branch**: Currently on `activityPage` branch, main branch is `main`
5. **Deployment**: Designed for Vercel or similar serverless platforms

## Common Tasks

### Adding a New Page
1. Create component in `/src/pages/`
2. Add lazy import in `App.jsx`
3. Add route in Routes component
4. Update sitemap in `vite.config.js` if static

### Working with Sanity Content
1. Use `client` from `sanityClient.jsx` for queries
2. Use `urlFor()` helper for image URLs
3. Handle loading states with `LoadingBear`

### Creating API Endpoints
1. Add file to `/api/` directory
2. Export default async handler function
3. Handle CORS for POST requests
4. Return appropriate status codes and messages