import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url'; // 導入 imageUrlBuilder

export const client = sanityClient({
  projectId: '87td6piu', // 替換為你的 Sanity Project ID
  dataset: 'production', // 默認使用 production
  apiVersion: '2023-09-01', // API 版本
  useCdn: false, // 使用 CDN 加快讀取速度
  token:
    'skvlQZJj6DGSoYFzTVXyFY0XvEotM37ZOZbV20nRScVmkiJRChnOVBjNaDOOS136N9W4Pin9EkPmrtG5sJTONSCyYYScSvA3pk5pxPeNFo5WlvjJ9Z5yh9qrjCklT9miO1ofbaQsCKJV6W4WeOOCKyDQ0V7PS1wZgxdq4CKeEfGzmWU6Ekiw',
});

// 初始化 imageUrlBuilder
const builder = imageUrlBuilder(client);

// 函數來生成圖片 URL
export const urlFor = (source) => {
  return builder.image(source);
};
