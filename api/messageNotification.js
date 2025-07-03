/* eslint-disable no-undef */
import axios from "axios";

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { notifications } = req.body;

  try {

    // 檢查必要參數
    if (!notifications || !Array.isArray(notifications)) {
      return res.status(400).json({
        success: false,
        error: "Invalid notifications format",
      });
    }

    // 使用環境變數中的 token
    const token = process.env.OMNICHAT_TOKEN;
    const channelId = process.env.LINE_CHANNEL_ID;
    const settingId = process.env.OMNICHAT_SETTING_ID;

    if (!token) {
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    
    // 根據提供的 webhook URL 格式，使用正確的端點
    const webhookUrl = `https://api.omnichat.ai/restapi/v1/line/webhook/${channelId}`;
    
    const response = await axios.post(
      webhookUrl,
      { 
        notifications,
        settingId: settingId 
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {

    // 捕獲並顯示 axios 錯誤的詳細信息
    if (error.response) {
      // 服務器返回了錯誤響應
      
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}