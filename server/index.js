/* eslint-disable no-undef */
import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@sanity/client';
import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

// 初始化 Sanity 客户端
export const client = createClient({
  projectId: process.env.SANITY_API_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_API_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_SANITY_VERSION || '2023-09-01',
  token: process.env.SANITY_API_SANITY_TOKEN,
  useCdn: false,
});

// 初始化 Express 应用
const app = express();
app.use(bodyParser.json()); // 解析 JSON 请求体

// Webhook 路由
app.post('/webhook', async (req, res) => {
  console.log('Webhook triggered:', req.body);

  // 检查请求体是否包含 type 字段
  const { type } = req.body;
  if (!type) {
    return res.status(400).send('Type is required in the request body.');
  }

  // 使用 nodemailer 初始化邮件发送器
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // 通过环境变量读取 Gmail 用户名
      pass: process.env.EMAIL_PASS, // 通过环境变量读取 Gmail 密码
    },
  });

  let data; // 定义通用数据容器
  try {
    // 从 Sanity 获取数据
    if (type === 'contact') {
      data = await client.fetch('*[_type == "contact"][0]');
    } else if (type === 'jobapply') {
      data = await client.fetch('*[_type == "jobapply"][0]');
    } else {
      return res.status(400).send('Unsupported type.');
    }

    console.log(`Fetched data for type "${type}":`, data);

    // 验证 SMTP 配置是否正确
    const smtpResult = await transporter.verify();
    console.log('SMTP Connection Successful:', smtpResult);
  } catch (error) {
    console.error('Error fetching data or SMTP setup:', error);
    return res.status(500).send('Failed to fetch data or set up SMTP.');
  }

  // 定义邮件内容
  let mailOptions;
  if (type === 'contact') {
    mailOptions = {
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
    };
  } else if (type === 'jobapply') {
    mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '新打工度假申請',
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
  }

  // 发送邮件
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent for type "${type}"!`);
    res.status(200).send(`Webhook processed successfully for type "${type}".`);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
