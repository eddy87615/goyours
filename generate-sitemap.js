// generate-sitemap.js

import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { createClient } from '@sanity/client';

// 重新創建 Sanity client
const client = createClient({
  projectId: '87td6piu',
  dataset: 'production', // 默認使用 production
  apiVersion: '2023-09-01', // API 版本
  useCdn: false, // 使用 CDN 加快讀取速度
});

// 添加生成 robots.txt 的函數
function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
  Allow: /
  
  Sitemap: https://www.goyours.tw/sitemap.xml`;

  createWriteStream('./public/robots.txt').write(robotsTxt);
  console.log('Robots.txt generated successfully!');
}

async function generateSitemap() {
  try {
    // 獲取所有文章的 slugs
    const posts = await client.fetch(`
      *[_type == "post"] {
        "slug": slug.current
      }
    `);

    // 獲取所有學校的 slugs
    const schools = await client.fetch(`
      *[_type == "school"] {
        "slug": slug.current
      }
    `);

    // 靜態頁面
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about-us', changefreq: 'monthly', priority: 0.8 },
      { url: '/goyours-post', changefreq: 'weekly', priority: 0.8 },
      { url: '/studying-in-jp', changefreq: 'weekly', priority: 0.8 },
      { url: '/working-holiday', changefreq: 'weekly', priority: 0.8 },
      { url: '/Q&A-section', changefreq: 'monthly', priority: 0.7 },
      { url: '/document-download', changefreq: 'monthly', priority: 0.7 },
      { url: '/contact-us', changefreq: 'monthly', priority: 0.7 },
    ];

    // 動態文章頁面
    const postPages = posts.map((post) => ({
      url: `/goyours-post/${post.slug}`,
      changefreq: 'weekly',
      priority: 0.6,
    }));

    // 動態學校頁面
    const schoolPages = schools.map((school) => ({
      url: `/studying-in-jp-school/${school.slug}`,
      changefreq: 'weekly',
      priority: 0.6,
    }));

    // 合併所有頁面
    const links = [...staticPages, ...postPages, ...schoolPages];

    // 創建 sitemap
    const stream = new SitemapStream({ hostname: 'https://www.goyours.tw' });

    // 生成並寫入文件
    const sitemap = await streamToPromise(Readable.from(links).pipe(stream));
    createWriteStream('./public/sitemap.xml').write(sitemap.toString());

    generateRobotsTxt();

    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
