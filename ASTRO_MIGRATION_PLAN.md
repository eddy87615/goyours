# Astro 遷移計劃

## 為什麼選擇 Astro？
- **極速性能**: 默認零 JavaScript，按需水合
- **多框架支持**: 可以混用 React、Vue、Svelte 組件
- **內容優先**: 特別適合你的內容驅動網站
- **優秀 SEO**: 生成純靜態 HTML

## 1. 初始設置
```bash
npm create astro@latest goyours-astro
cd goyours-astro
npm install @astrojs/react @astrojs/tailwind
npx astro add react tailwind
npm install @sanity/client @sanity/image-url @portabletext/react
```

## 2. 項目結構
```
src/
├── components/          # 保持現有 React 組件
├── layouts/
│   └── Layout.astro     # 全局布局
├── pages/               # Astro 頁面 (file-based routing)
│   ├── index.astro      # 首頁
│   ├── about-us.astro
│   ├── contact-us.astro
│   ├── goyours-post/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── studying-in-jp-school/
│       ├── index.astro
│       └── [slug].astro
├── services/            # 保持現有 Sanity 配置
└── styles/             # 保持現有樣式
```

## 3. 關鍵實現

### 全局布局
```astro
---
// src/layouts/Layout.astro
import { Navigation, Footer } from '../components/common'
import '../styles/index.css'

export interface Props {
  title: string
  description?: string
  image?: string
}

const { title, description, image } = Astro.props
---

<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    {image && <meta property="og:image" content={image} />}
  </head>
  <body>
    <Navigation client:load />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### 文章列表頁面
```astro
---
// src/pages/goyours-post/index.astro
import Layout from '../../layouts/Layout.astro'
import { PostArea } from '../../components/content'
import { client } from '../../services/sanity/client'

const posts = await client.fetch(`
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, mainImage
  }
`)
---

<Layout 
  title="日本留學資訊 | Go Yours"
  description="最新的日本留學相關文章與資訊"
>
  <div class="posts-page">
    <h1>日本留學資訊</h1>
    <PostArea posts={posts} client:load />
  </div>
</Layout>
```

### 動態文章頁面
```astro
---
// src/pages/goyours-post/[slug].astro
import Layout from '../../layouts/Layout.astro'
import { PortableText } from '@portabletext/react'
import { client, urlFor } from '../../services/sanity/client'

export async function getStaticPaths() {
  const posts = await client.fetch(`*[_type == "post"]{ slug }`)
  
  return posts.map((post) => ({
    params: { slug: post.slug.current },
  }))
}

const { slug } = Astro.params
const post = await client.fetch(`
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, body, mainImage, publishedAt, excerpt
  }
`, { slug })

if (!post) {
  return Astro.redirect('/404')
}
---

<Layout 
  title={post.title}
  description={post.excerpt}
  image={urlFor(post.mainImage).url()}
>
  <article class="post-detail">
    <h1>{post.title}</h1>
    <img src={urlFor(post.mainImage).url()} alt={post.title} />
    <PortableText value={post.body} client:load />
  </article>
</Layout>
```

### 交互式組件
```astro
---
// src/pages/contact-us.astro
import Layout from '../layouts/Layout.astro'
import { ContactForm } from '../components/forms'
---

<Layout title="聯絡我們 | Go Yours">
  <div class="contact-page">
    <h1>聯絡我們</h1>
    <!-- 只有表單需要 JavaScript -->
    <ContactForm client:load />
  </div>
</Layout>
```

## 4. 組件水合策略
```jsx
// 不同的水合策略
<Component client:load />          // 頁面加載時水合
<Component client:idle />          // 瀏覽器空閒時水合  
<Component client:visible />       // 元素可見時水合
<Component client:media="(max-width: 768px)" /> // 媒體查詢匹配時水合
```

## 5. 建構和部署
```json
// package.json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
  output: 'static', // 或 'server' 用於 SSR
  adapter: vercel(), // Vercel 適配器
})
```

## 6. 優勢
- **極快的性能**: 最少的 JavaScript
- **SEO 友好**: 完全靜態 HTML
- **漸進式**: 只在需要時添加交互
- **熟悉的開發體驗**: 可以重用現有組件

## 7. 適用場景
- 內容驅動的網站 ✅
- 需要優秀的 SEO ✅  
- 重視性能 ✅
- 有大量靜態內容 ✅

你的 Go Yours 網站特別適合 Astro，因為它主要是展示文章、學校信息等內容。