// 簡單的 OmniChat 測試 API
import axios from "axios";

export default async function handler(req, res) {
  // CORS 設置
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { phone, lineId, testMessage } = req.body;

    console.log("收到測試請求:", { phone, lineId, testMessage });

    // 檢查環境變數
    const token = process.env.OMNICHAT_TOKEN;
    const channelId = process.env.LINE_CHANNEL_ID;
    const settingId = process.env.OMNICHAT_SETTING_ID;

    if (!token || !channelId || !settingId) {
      return res.status(400).json({
        success: false,
        error: "缺少 OmniChat 環境變數",
        missing: {
          token: !token,
          channelId: !channelId,
          settingId: !settingId,
        },
      });
    }

    // 格式化電話號碼
    let formattedPhone = phone;
    if (phone.startsWith("0")) {
      formattedPhone = "886" + phone.substring(1);
    }

    // 準備測試通知
    const notificationData = {
      notifications: [
        {
          platform: "line",
          channelId: channelId,
          to: formattedPhone,
          settingId: settingId,
          valueMap: {
            lineId: lineId || "測試用戶",
            phone: phone,
            testMessage: testMessage || "這是一個簡單的測試通知",
            timestamp: new Date().toLocaleString("zh-TW", {
              timeZone: "Asia/Taipei",
            }),
            testType: "手動測試",
          },
        },
      ],
    };

    console.log("發送 OmniChat 請求:", {
      to: formattedPhone,
      channelId,
      settingId,
    });

    // 發送到 OmniChat API
    const response = await axios.post(
      "https://api.omnichat.ai/restapi/v1/line/webhook/2007407348",
      notificationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    console.log("OmniChat 回應:", response.data);

    return res.status(200).json({
      success: true,
      message: "測試通知已發送!",
      data: {
        triggerId:
          response.data?.triggerId || response.data?.content?.triggerId,
        originalPhone: phone,
        formattedPhone: formattedPhone,
        lineId: lineId,
        channelId: channelId,
        settingId: settingId,
      },
    });
  } catch (error) {
    console.error("OmniChat 測試失敗:", error);

    return res.status(500).json({
      success: false,
      error: "測試失敗",
      details: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    });
  }
}
