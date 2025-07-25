// pages/api/saveContact.js
/* eslint-env node */

import { createClient } from "@sanity/client";
import CryptoJS from "crypto-js";
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

// 發送 OmniChat 通知 (基於成功的 Python 實現)
const sendOmniChatNotification = async (formData) => {
  try {
    const token = process.env.OMNICHAT_TOKEN;
    const channelId = process.env.LINE_CHANNEL_ID;
    // 優先使用 OMNICHAT_SETTING_ID_BASIC_NO_BUTTON，如果沒有則使用 OMNICHAT_SETTING_ID
    const settingId =
      process.env.OMNICHAT_SETTING_ID_BASIC_NO_BUTTON ||
      process.env.OMNICHAT_SETTING_ID;

    console.log("OmniChat 環境變數檢查:", {
      hasToken: !!token,
      channelId: channelId || "NOT SET",
      settingId: settingId || "NOT SET",
    });

    if (!token || !channelId || !settingId) {
      console.log("缺少 OmniChat 環境變數，跳過 LINE 通知");
      console.log("缺少的變數:", {
        token: !token ? "OMNICHAT_TOKEN 未設定" : "已設定",
        channelId: !channelId ? "LINE_CHANNEL_ID 未設定" : "已設定",
        settingId: !settingId ? "OMNICHAT_SETTING_ID 未設定" : "已設定",
      });
      return false;
    }

    // 格式化電話號碼
    let formattedPhone = formData.phone;
    if (formattedPhone && formattedPhone.startsWith("0")) {
      formattedPhone = "886" + formattedPhone.substring(1);
    }

    // 驗證電話號碼格式
    if (!formattedPhone || formattedPhone.length < 10) {
      console.error("電話號碼格式不正確:", formattedPhone);
      return false;
    }

    console.log("電話號碼格式化:", {
      原始: formData.phone,
      格式化: formattedPhone,
      長度: formattedPhone.length,
    });

    // 根據不同的 settingId 準備不同的通知資料
    let notificationData;

    // 從環境變數讀取不同的 settingIds
    const SETTING_ID_BASIC_NO_BUTTON =
      process.env.OMNICHAT_SETTING_ID_BASIC_NO_BUTTON; // 完成表單預約-基本(無按鈕)
    const SETTING_ID_BASIC_WITH_BUTTON =
      process.env.OMNICHAT_SETTING_ID_BASIC_WITH_BUTTON; // 完成表單預約-基本(有按鈕)
    const SETTING_ID_SPECIFIED_NO_BUTTON =
      process.env.OMNICHAT_SETTING_ID_SPECIFIED_NO_BUTTON; // 完成表單預約-指定(無按鈕)
    const SETTING_ID_SPECIFIED_WITH_BUTTON =
      process.env.OMNICHAT_SETTING_ID_SPECIFIED_WITH_BUTTON; // 完成表單預約-指定(有按鈕)

    switch (settingId) {
      // 完成表單預約-基本(無按鈕)
      // case SETTING_ID_BASIC_NO_BUTTON:
      //   notificationData = {
      //     notifications: [
      //       {
      //         platform: "line",
      //         channelId: channelId,
      //         to: formattedPhone,
      //         settingId: SETTING_ID_BASIC_NO_BUTTON,
      //         valueMap: {
      //           appointmentContent: Array.isArray(formData.case)
      //             ? formData.case.join(", ")
      //             : formData.case || "未指定",
      //           appointmentDate: new Date().toLocaleDateString("zh-TW"),
      //           appointmentTime: formData.callTime || "未指定",
      //           appointmentLocation: "線上",
      //           note: `姓名: ${formData.name || "N/A"}\\n年齡: ${
      //             formData.age || "N/A"
      //           }\\n電話: ${formData.phone || "N/A"}\\nEmail: ${
      //             formData.email || "N/A"
      //           }\\nLine ID: ${formData.lineId || "N/A"}\\n留言: ${
      //             formData.tellus || "無"
      //           }`,
      //           contactInfo: "0277015618",
      //         },
      //       },
      //     ],
      //   };
      //   break;

      // 完成表單預約-基本(有按鈕)
      // case SETTING_ID_BASIC_WITH_BUTTON:
      //   notificationData = {
      //     notifications: [
      //       {
      //         platform: "line",
      //         channelId: channelId,
      //         to: formattedPhone,
      //         settingId: SETTING_ID_BASIC_WITH_BUTTON,
      //         valueMap: {
      //           appointmentContent: Array.isArray(formData.case)
      //             ? formData.case.join(", ")
      //             : formData.case || "未指定",
      //           appointmentDate: new Date().toLocaleDateString("zh-TW"),
      //           appointmentTime: formData.callTime || "未指定",
      //           appointmentLocation: "線上",
      //           note: `姓名: ${formData.name || "N/A"}\\n年齡: ${
      //             formData.age || "N/A"
      //           }\\n電話: ${formData.phone || "N/A"}\\nEmail: ${
      //             formData.email || "N/A"
      //           }\\nLine ID: ${formData.lineId || "N/A"}\\n留言: ${
      //             formData.tellus || "無"
      //           }`,
      //           contactInfo: "0277015618",
      //           appointmentDetailLink: "https://www.goyours.tw/",
      //         },
      //       },
      //     ],
      //   };
      //   break;

      // 完成表單預約-指定(無按鈕)
      // case SETTING_ID_SPECIFIED_NO_BUTTON:
      //   notificationData = {
      //     notifications: [
      //       {
      //         platform: "line",
      //         channelId: channelId,
      //         to: formattedPhone,
      //         settingId: SETTING_ID_SPECIFIED_NO_BUTTON,
      //         valueMap: {
      //           appointmentContent: Array.isArray(formData.case)
      //             ? formData.case.join(", ")
      //             : formData.case || "未指定",
      //           appointmentDate: new Date().toLocaleDateString("zh-TW"),
      //           appointmentTime: formData.callTime || "未指定",
      //           appointmentLocation: "線上",
      //           appointmentAssignee: "無",
      //           contactInfo: "0277015618",
      //         },
      //       },
      //     ],
      //   };
      //   break;

      // 完成表單預約-指定(有按鈕)
      case SETTING_ID_SPECIFIED_WITH_BUTTON:
        notificationData = {
          notifications: [
            {
              platform: "line",
              channelId: channelId,
              to: formattedPhone,
              settingId: SETTING_ID_SPECIFIED_WITH_BUTTON,
              valueMap: {
                appointmentContent: Array.isArray(formData.case)
                  ? formData.case.join(", ")
                  : formData.case || "未指定",
                appointmentDate: new Date().toLocaleDateString("zh-TW"),
                appointmentTime: formData.callTime || "未指定",
                appointmentLocation: "線上",
                appointmentAssignee: "無",
                contactInfo: "0277015618",
                appointmentDetailLink: "https://www.goyours.tw/",
              },
            },
          ],
        };
        break;

      // 預設情況（使用原本的格式）
      default:
        notificationData = {
          notifications: [
            {
              platform: "line",
              channelId: channelId,
              to: formattedPhone,
              settingId: SETTING_ID_SPECIFIED_WITH_BUTTON,
              valueMap: {
                appointmentContent: Array.isArray(formData.case)
                  ? formData.case.join(", ")
                  : formData.case || "未指定",
                appointmentDate: new Date().toLocaleDateString("zh-TW"),
                appointmentTime: formData.callTime || "未指定",
                appointmentLocation: "線上",
                appointmentAssignee: "無",
                contactInfo: "0277015618",
                appointmentDetailLink: "https://www.goyours.tw/",
              },
            },
          ],
        };
        break;
    }

    console.log("發送 OmniChat 通知:", {
      to: formattedPhone,
      settingId: settingId,
      channelId: channelId,
      valueMap: notificationData.notifications[0].valueMap,
    });

    console.log("完整的通知資料:", JSON.stringify(notificationData, null, 2));

    const response = await fetch(
      "https://open-api.omnichat.ai/v1/notification-messages",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      }
    );

    console.log("OmniChat API 回應狀態:", response.status);

    // 先讀取回應內容
    const responseText = await response.text();
    console.log("OmniChat API 原始回應:", responseText);

    if (response.ok) {
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("無法解析 OmniChat 回應:", e);
        return false;
      }
      console.log("OmniChat API 成功回應:", responseData);

      // 檢查回應格式
      if (
        responseData &&
        responseData.content &&
        responseData.content.triggerId
      ) {
        console.log(
          "✅ OmniChat 通知發送成功, Trigger ID:",
          responseData.content.triggerId
        );
        return responseData.content.triggerId;
      } else {
        console.log(
          "✅ OmniChat 通知發送成功，但回應格式可能不同:",
          responseData
        );
        return true;
      }
    } else {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = responseText;
      }
      console.error("OmniChat API 錯誤:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: errorData,
      });
      return false;
    }
  } catch (error) {
    console.error("OmniChat 通知發送失敗:", {
      message: error.message,
      stack: error.stack,
    });
    return false;
  }
};

// 發送電子郵件通知
const sendEmailNotification = async (formData) => {
  try {
    console.log("檢查電子郵件環境變數:", {
      EMAIL_USER: process.env.EMAIL_USER || "NOT SET",
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      EMAIL_USER_RECEIVE: process.env.EMAIL_USER_RECEIVE || "NOT SET",
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("缺少電子郵件環境變數:", {
        EMAIL_USER: !process.env.EMAIL_USER ? "未設定" : "已設定",
        EMAIL_PASS: !process.env.EMAIL_PASS ? "未設定" : "已設定",
      });
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 驗證 transporter 設定
    try {
      await transporter.verify();
      console.log("郵件伺服器連接成功");
    } catch (verifyError) {
      console.error("郵件伺服器連接失敗:", verifyError);
      return false;
    }

    const emailTo = process.env.EMAIL_USER_RECEIVE || process.env.EMAIL_USER;
    let mailOptions;

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
  - 想詢問的方案：${
    Array.isArray(formData.case) ? formData.case.join(", ") : "N/A"
  }
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
      console.log("準備發送郵件給:", emailTo);
      console.log("郵件主題:", mailOptions.subject);

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("電子郵件發送成功! Message ID:", info.messageId);
        console.log("Response:", info.response);
        return true;
      } catch (sendError) {
        console.error("發送郵件時發生錯誤:", {
          error: sendError.message,
          code: sendError.code,
          command: sendError.command,
          response: sendError.response,
          responseCode: sendError.responseCode,
        });

        // 如果是認證錯誤，提供更多資訊
        if (sendError.code === "EAUTH") {
          console.error("Gmail 認證失敗，請檢查:");
          console.error("1. EMAIL_USER 是否正確");
          console.error("2. EMAIL_PASS 是否為應用程式專用密碼");
          console.error("3. Gmail 帳戶是否啟用了兩步驟驗證");
        }

        // 如果是頻率限制錯誤
        if (sendError.responseCode === 550 || sendError.code === "EDNS") {
          console.error("可能遇到 Gmail 發送限制，請稍後再試");
        }

        return false;
      }
    }

    return false;
  } catch (error) {
    console.error("電子郵件發送失敗:", {
      message: error.message,
      code: error.code,
    });
    return false;
  }
};

// 主要處理函數
export default async function handler(req, res) {
  console.log("Request received:", new Date().toISOString());

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

    // 記錄解密後的數據（開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("Decrypted data:", JSON.stringify(decryptedData, null, 2));
    }

    // 添加創建時間
    const dataToSave = {
      ...decryptedData,
      _createdAt: new Date().toISOString(),
    };

    // 保存到 Sanity
    const result = await sanityClient.create(dataToSave);
    console.log("Sanity 儲存成功:", result._id);

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
      sanity: "已儲存",
      omnichat: omniChatResult ? "已發送" : "未發送",
      email: emailResult ? "已發送" : "未發送",
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
