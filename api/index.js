/* eslint-disable no-undef */
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import nodemailer from 'nodemailer';

dotenv.config();

// 初始化 Sanity 客戶端
const client = createClient({
  projectId: process.env.SANITY_API_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2023-09-01',
  token: process.env.SANITY_API_SANITY_TOKEN,
  useCdn: false,
});

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

  const { type } = req.body;
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

  let data;
  try {
    if (type === 'contact') {
      data = await client.fetch('*[_type == "contact"][0]');
    } else if (type === 'jobapply') {
      data = await client.fetch('*[_type == "jobapply"][0]');
    } else {
      return res.status(400).json({ message: 'Unsupported type.' });
    }

    console.log(`Fetched data for type "${type}":`, data);

    // 驗證 SMTP 設定
    await transporter.verify();
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  // 郵件設定保持不變...
  const mailOptions =
    type === 'contact'
      ? {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: '新聯絡資料表單',
          text: `
    新聯絡資料表單:
    - Name: ${data?.name || 'N/A'}
    - Age: ${data?.age || 'N/A'}
    - Phone: ${data?.phone || 'N/A'}
    - Email: ${data?.email || 'N/A'}
    - Case: ${data?.case?.join(', ') || 'N/A'}
    - Call Time: ${data?.callTime || 'N/A'}
    `,
        }
      : {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: '新聯絡資料表單',
          text: `
    新打工度假申請:
      - Job Name: ${data?.jobname || 'N/A'}
      - Name: ${data?.name || 'N/A'}
      - Age: ${data?.age || 'N/A'}
      - Phone: ${data?.phone || 'N/A'}
      - Email: ${data?.email || 'N/A'}
      - Resume: ${data?.resume || 'N/A'}
      - Call Time: ${data?.callTime || 'N/A'}
      - Remarks: ${data?.remarks || 'N/A'}
    `,
        };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent for type "${type}"!`);
    return res
      .status(200)
      .json({ message: `Webhook processed successfully for type "${type}".` });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email.' });
  }
}
