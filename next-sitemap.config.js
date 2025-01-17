// 使用 ES Module 語法
export default {
  siteUrl: 'https://www.goyours.tw',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
