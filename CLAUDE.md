# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Go Yours is a React-based web application built with Vite that provides services for Japanese language study and working holiday programs. It integrates with Sanity CMS for content management and features both static pages and dynamic content.

## Development Commands

### Core Commands
```bash
# Start development server
npm run dev

# Start SEO-optimized SSR server (RECOMMENDED)
npm run dev:seo-ssr

# Start pure CSR server (no SEO)
npm run dev:pure-csr

# Build for production
npm run build

# Serve SEO SSR in production
npm run serve:seo-ssr

# Serve pure CSR in production
npm run serve:pure-csr

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

### Rendering Strategy
- **SEO SSR** (Recommended): Server-generated meta tags + client-side rendering
- **Pure CSR**: Complete client-side rendering with static meta tags
- **No Hydration**: Avoids SSR hydration issues entirely

### Frontend Structure
- **Framework**: React 18 with React Router v6
- **Build Tool**: Vite with React plugin
- **Styling**: CSS modules with animations (animate.css)
- **State Management**: React hooks and context (VisibilityProvider)
- **CMS Integration**: Sanity Client for content fetching
- **SEO**: Dynamic meta tags + structured data (Schema.org)

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

### Server Architecture

#### SEO SSR Server (seo-ssr-server.js) - RECOMMENDED
- Dynamic meta tags from Sanity CMS data
- Structured data (Schema.org) generation
- Open Graph and Twitter Cards support
- SEO-friendly content structure for crawlers
- Client-side data preloading

#### Pure CSR Server (pure-csr-server-simple.js)
- Static meta tags only
- Complete client-side rendering
- Minimal server processing

#### API Functions
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

#### SEO SSR Mode
1. Server fetches content from Sanity CMS for meta tags
2. Dynamic meta tags and structured data generated
3. Content preloaded and passed to client
4. Client renders React app with preloaded data
5. Forms submitted with AES encryption to API endpoints

#### Pure CSR Mode
1. Static HTML with basic meta tags served
2. Client fetches content from Sanity CMS
3. React app renders entirely on client
4. Forms submitted with AES encryption to API endpoints

### Key Dependencies
- **@sanity/client**: CMS integration
- **react-router-dom**: Client-side routing
- **react-helmet-async**: SEO management
- **framer-motion**: Animations
- **crypto-js**: Form data encryption
- **nodemailer**: Email notifications

## Important Notes

1. **SEO Mode**: Use `dev:seo-ssr` for development to get proper meta tags and SEO optimization
2. **Environment Variables**: Ensure `VITE_SANITY_API_SANITY_PROJECT_ID` is set for SEO SSR
3. **Security**: The OmniChat API token in `messageNotification.js` needs to be moved to environment variables
4. **No Hydration**: The app uses `createRoot` instead of `hydrateRoot` to avoid hydration issues
5. **Git Branch**: Currently on `main` branch
6. **Deployment**: Designed for Vercel or similar platforms with Node.js support

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
4. Use `useSEOData()` hook to access server-preloaded data
5. SEO data automatically includes meta tags and structured data

### Creating API Endpoints
1. Add file to `/api/` directory
2. Export default async handler function
3. Handle CORS for POST requests
4. Return appropriate status codes and messages

### SEO Optimization
1. Use SEO SSR mode for production (`serve:seo-ssr`)
2. Implement `SEOWrapper` component for dynamic meta tags
3. Use structured data for rich snippets
4. Test with Google Rich Results Test
5. Verify Open Graph tags for social sharing