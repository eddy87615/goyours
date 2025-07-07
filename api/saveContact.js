// pages/api/saveContact.js
/* eslint-disable no-undef */

import { createClient } from "@sanity/client";
import CryptoJS from "crypto-js";
import axios from "axios";

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

    if (!token || !channelId || !settingId) {
      console.error("Missing OmniChat environment variables");
      return null;
    }

    // 格式化電話號碼為國際格式 (台灣 +886)
    let formattedPhone = formData.phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '886' + formattedPhone.substring(1);
    }

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
      }
    );

    console.log("OmniChat notification sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send OmniChat notification:", error.response?.data || error.message);
    // 不讓通知失敗影響主要流程
    return null;
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
    
    // 返回成功響應
    return res.status(200).json({
      success: true,
      message: "資料成功存儲",
      result:
        process.env.NODE_ENV === "development" ? result : { _id: result._id },
      omniChatNotificationSent: omniChatResult !== null
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
