import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url'; // 導入 imageUrlBuilder

export const client = createClient({
  projectId: '87td6piu', // 替換為你的 Sanity Project ID
  dataset: 'production', // 默認使用 production
  apiVersion: '2023-09-01', // API 版本
  useCdn: false, // 使用 CDN 加快讀取速度
  token: import.meta.env.VITE_SANITY_API_TOKEN,
});

// 初始化 imageUrlBuilder
const builder = imageUrlBuilder(client);

// 函數來生成圖片 URL
export const urlFor = (source) => {
  return builder.image(source);
};
