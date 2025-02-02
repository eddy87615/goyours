/* eslint-disable no-undef */
import dotenv from 'dotenv';
// import { createClient } from '@sanity/client';
import nodemailer from 'nodemailer';

dotenv.config();

// 初始化 Sanity 客戶端
// const client = createClient({
//   projectId: process.env.SANITY_API_SANITY_PROJECT_ID,
//   dataset: 'production',
//   apiVersion: '2023-09-01',
//   token: process.env.SANITY_API_SANITY_TOKEN,
//   useCdn: false,
// });

export default async function handler(req, res) {
  // 添加這些日誌
  console.log('Request received at:', new Date().toISOString());
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Environment variables:', {
    SANITY_PROJECT_ID: process.env.SANITY_API_SANITY_PROJECT_ID
      ? 'Set'
      : 'Not set',
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Webhook triggered:', req.body);

  const type = req.body._type; // 注意這裡改成 _type
  if (!type) {
    return res
      .status(400)
      .json({ message: 'Type is required in the request body.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // 不需要再從 Sanity 獲取數據，因為數據已經在請求體中
    const data = req.body;

    console.log('Preparing to send email with data:', data);

    const mailOptions =
      type === 'contact'
        ? {
            from: process.env.EMAIL_USER,
            to: 'goyoursjp@gmail.com',
            subject: '新聯絡資料表單',
            text: `
新聯絡資料表單:
  - 真實姓名：${data.name || 'N/A'}
  - 年齡：${data.age || 'N/A'}
  - 行動電話：${data.phone || 'N/A'}
  - 電子郵件：${data.email || 'N/A'}
  - 想詢問的方案：${Array.isArray(data.case) ? data.case.join(', ') : 'N/A'}
  - 方便聯絡的時段：${data.callTime || 'N/A'}
  - Line ID：${data.lineId || 'N/A'}
快到後台查看更多資訊！
      `,
          }
        : {
            from: process.env.EMAIL_USER,
            to: 'goyoursjp@gmail.com',
            subject: '新聯絡資料表單',
            text: `
    新打工度假申請:
      - 申請工作名稱：${data?.jobname || 'N/A'}
      - 真實姓名：${data?.name || 'N/A'}
      - 年齡：${data?.age || 'N/A'}
      - 行動電話：${data?.phone || 'N/A'}
      - 電子郵件：${data?.email || 'N/A'}
      - 方便聯絡時段：${data?.callTime || 'N/A'}
      - Line ID：${data.lineId || 'N/A'}
    快到後台看看履歷吧！
    `,
          };

    console.log('Attempting to send email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');

    return res.status(200).json({
      message: `Webhook processed successfully for type "${type}".`,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Failed to process webhook',
      error: error.message,
    });
  }
}
