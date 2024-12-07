import { sanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url'; // 導入 imageUrlBuilder

export const client = sanityClient({
  projectId: import.meta.env.VITE_SANITY_API_SANITY_PROJECT_ID, // 替換為你的 Sanity Project ID
  dataset: 'production',
  apiVersion: '2023-09-01',
  useCdn: false,
  token: import.meta.env.VITE_SANITY_API_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true, // 隐藏警告
});

// 初始化 imageUrlBuilder
const builder = imageUrlBuilder(client);

// 函數來生成圖片 URL
export const urlFor = (source) => {
  return builder.image(source);
};
