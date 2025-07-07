import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/messageNotification", async (req, res) => {
  const { notifications } = req.body;

  try {
    console.log("收到請求數據:", req.body);

    // 檢查必要參數
    if (!notifications || !Array.isArray(notifications)) {
      return res.status(400).json({
        success: false,
        error: "Invalid notifications format",
      });
    }

    // 確保這裡使用了實際的令牌
    const token = "YOUR-REAL-ACCESS-TOKEN";

    console.log("發送請求到 OmniChat API...");
    const response = await axios.post(
      "https://open-api.omnichat.ai/v1/notification-messages",
      { notifications },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("OmniChat API 響應:", response.data);
    res.json({ success: true, triggerId: response.data.triggerId });
  } catch (error) {
    console.error("錯誤詳情:", error);

    // 捕獲並顯示 axios 錯誤的詳細信息
    if (error.response) {
      // 服務器返回了錯誤響應
      console.error("API 錯誤響應:", {
        status: error.response.status,
        data: error.response.data,
      });
    }

    res.status(500).json({
      success: false,
      error: error.response
        ? JSON.stringify(error.response.data)
        : error.message,
    });
  }
});
