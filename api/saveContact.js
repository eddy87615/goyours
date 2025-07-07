// pages/api/saveContact.js
/* eslint-disable no-undef */

import { createClient } from "@sanity/client";
import CryptoJS from "crypto-js";
import axios from "axios";
import nodemailer from "nodemailer";

// 初始化 Sanity 客戶端
const createSanityClient = () => {
  try {
    return createClient({
      projectId: process.env.VITE_SANITY_API_SANITY_PROJECT_ID,
      dataset: process.env.VITE_SANITY_API_SANITY_DATASET,
      apiVersion: "2023-09-01",
      useCdn: false,
      token: process.env.VITE_SANITY_API_SANITY_TOKEN,
    });
  } catch (error) {
    console.error("Sanity 客戶端初始化錯誤:", error);
    throw error;
  }
};

// 加密相關
const getSECRET_KEY = () => {
  const key = process.env.VITE_SECRET_KEY;
  if (!key) {
    throw new Error("SECRET_KEY not found in environment variables");
  }
  return key;
};

// 解密數據
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, getSECRET_KEY());
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) {
      throw new Error("解密結果為空");
    }
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("解密失敗:", error);
    throw new Error("數據解密失敗");
  }
};

// 驗證環境變數
const validateEnvVariables = () => {
  const requiredVars = [
    "VITE_SANITY_API_SANITY_PROJECT_ID",
    "VITE_SANITY_API_SANITY_DATASET",
    "VITE_SANITY_API_SANITY_TOKEN",
    "VITE_SECRET_KEY",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

// 發送 OmniChat 通知
const sendOmniChatNotification = async (formData) => {
  try {
    const token = process.env.OMNICHAT_TOKEN;
    const channelId = process.env.LINE_CHANNEL_ID;
    const settingId = process.env.OMNICHAT_SETTING_ID;

    console.log("OmniChat Environment Check:", {
      hasToken: !!token,
      channelId: channelId || "NOT SET",
      settingId: settingId || "NOT SET",
      environment: process.env.NODE_ENV
    });

    if (!token || !channelId || !settingId) {
      console.error("Missing OmniChat environment variables:", {
        token: !!token,
        channelId: !!channelId,
        settingId: !!settingId
      });
      return null;
    }

    // 格式化電話號碼為國際格式 (台灣 +886)
    let formattedPhone = formData.phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '886' + formattedPhone.substring(1);
    }

    console.log("Phone number formatting:", {
      original: formData.phone,
      formatted: formattedPhone
    });

    // 準備通知請求
    const notificationData = {
      notifications: [
        {
          platform: "line",
          channelId: channelId,
          to: formattedPhone,
          settingId: settingId,
          valueMap: {
            name: formData.name,
            age: formData.age,
            phone: formData.phone,
            lineId: formData.lineId || "未提供",
            email: formData.email,
            selectedCases: formData.case ? formData.case.join(", ") : "未選擇",
            callTime: formData.callTime,
            message: formData.tellus || "無留言",
            submittedAt: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
          }
        }
      ]
    };

    console.log("Sending OmniChat notification:", {
      url: "https://open-api.omnichat.ai/v1/notification-messages",
      channelId: channelId,
      settingId: settingId,
      to: formattedPhone,
      valueMapKeys: Object.keys(notificationData.notifications[0].valueMap)
    });

    // 使用正確的 notification-messages API endpoint
    const apiUrl = "https://open-api.omnichat.ai/v1/notification-messages";
    
    const response = await axios.post(
      apiUrl,
      notificationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    console.log("OmniChat API Response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      triggerId: response.data?.triggerId || response.data?.content?.triggerId
    });

    return response.data;
  } catch (error) {
    console.error("OmniChat API Error Details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers ? {
          ...error.config.headers,
          Authorization: error.config.headers.Authorization ? "Bearer [HIDDEN]" : undefined
        } : undefined
      }
    });
    
    // 不讓通知失敗影響主要流程
    return null;
  }
};

// 發送電子郵件通知
const sendEmailNotification = async (formData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions;
    const emailTo = process.env.EMAIL_USER_RECEIVE || process.env.EMAIL_USER;

    if (formData._type === "contact") {
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailTo,
        subject: "新聯絡資料表單",
        text: `
新聯絡資料表單:
  - 真實姓名：${formData.name || "N/A"}
  - 年齡：${formData.age || "N/A"}
  - 科系：${formData.major || "N/A"}
  - 行動電話：${formData.phone || "N/A"}
  - 電子郵件：${formData.email || "N/A"}
  - 想詢問的方案：${Array.isArray(formData.case) ? formData.case.join(", ") : "N/A"}
  - 方便聯絡的時段：${formData.callTime || "N/A"}
  - Line ID：${formData.lineId || "N/A"}
  - 想對我們說的話：${formData.tellus || "N/A"}
  - 提交時間：${formData.upTime || "N/A"}
快到後台查看更多資訊！
        `,
      };
    } else if (formData._type === "JPjobapply") {
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailTo,
        subject: "新正職職缺申請表單",
        text: `
新正職職缺申請:
  - 申請工作名稱：${formData.jobname || "N/A"}
  - 真實姓名：${formData.name || "N/A"}
  - 年齡：${formData.age || "N/A"}
  - 科系：${formData.major || "N/A"}
  - 行動電話：${formData.phone || "N/A"}
  - 電子郵件：${formData.email || "N/A"}
  - 方便聯絡時段：${formData.callTime || "N/A"}
  - Line ID：${formData.lineId || "N/A"}
  - 履歷表：${formData.resume ? "已上傳" : "未上傳"}
快到後台查看詳細資訊和履歷！
        `,
      };
    } else if (formData._type === "jobapply") {
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailTo,
        subject: "新打工度假申請表單",
        text: `
新打工度假申請:
  - 申請工作名稱：${formData.jobname || "N/A"}
  - 真實姓名：${formData.name || "N/A"}
  - 年齡：${formData.age || "N/A"}
  - 科系：${formData.major || "N/A"}
  - 行動電話：${formData.phone || "N/A"}
  - 電子郵件：${formData.email || "N/A"}
  - 方便聯絡時段：${formData.callTime || "N/A"}
  - Line ID：${formData.lineId || "N/A"}
  - 履歷表：${formData.resume ? "已上傳" : "未上傳"}
快到後台看看履歷吧！
        `,
      };
    }

    if (mailOptions) {
      await transporter.sendMail(mailOptions);
      console.log("Email notification sent successfully");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Failed to send email notification:", error.message);
    // 不讓郵件發送失敗影響主要流程
    return false;
  }
};

// 主要處理函數
export default async function handler(req, res) {

  // 設置 CORS 頭
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 處理預檢請求
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 驗證請求方法
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "Only POST requests are allowed",
    });
  }

  try {
    // 驗證環境變數
    validateEnvVariables();

    // 驗證請求內容
    const { encryptedData } = req.body;
    if (!encryptedData) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing encrypted data",
      });
    }

    // 初始化 Sanity 客戶端
    const sanityClient = createSanityClient();

    // 解密數據
    const decryptedData = decryptData(encryptedData);

    // 驗證解密後的數據
    if (!decryptedData || typeof decryptedData !== "object") {
      return res.status(400).json({
        error: "Invalid Data",
        message: "解密後的數據格式無效",
      });
    }


    // 添加創建時間
    const dataToSave = {
      ...decryptedData,
      _createdAt: new Date().toISOString(),
    };

    // 保存到 Sanity
    const result = await sanityClient.create(dataToSave);

    // 發送 OmniChat 通知
    const omniChatResult = await sendOmniChatNotification(decryptedData);
    
    // 發送電子郵件通知
    const emailResult = await sendEmailNotification(decryptedData);
    
    // 返回成功響應
    return res.status(200).json({
      success: true,
      message: "資料成功存儲",
      result:
        process.env.NODE_ENV === "development" ? result : { _id: result._id },
      omniChatNotificationSent: omniChatResult !== null,
      emailNotificationSent: emailResult
    });
  } catch (error) {
    // 錯誤處理
    console.error("Server error:", error);

    // 根據環境返回適當的錯誤信息
    const errorResponse = {
      error: "Server Error",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "伺服器錯誤，請稍後再試",
    };

    // 在開發環境添加更多調試信息
    if (process.env.NODE_ENV === "development") {
      errorResponse.stack = error.stack;
      errorResponse.details = error.details;
    }

    return res.status(500).json(errorResponse);
  }
}
