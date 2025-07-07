// 測試 OmniChat API 端點
export default async function handler(req, res) {
  // 設置 CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 檢查環境變數
    const envCheck = {
      OMNICHAT_TOKEN: !!process.env.OMNICHAT_TOKEN,
      LINE_CHANNEL_ID: process.env.LINE_CHANNEL_ID || "NOT SET",
      OMNICHAT_SETTING_ID: process.env.OMNICHAT_SETTING_ID || "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };

    // 測試 API 連線
    let apiTestResult = null;
    if (req.method === "POST" && process.env.OMNICHAT_TOKEN) {
      try {
        const axios = (await import("axios")).default;
        
        const testData = {
          notifications: [
            {
              platform: "line",
              channelId: process.env.LINE_CHANNEL_ID,
              to: "886975008716", // 測試電話
              settingId: process.env.OMNICHAT_SETTING_ID,
              valueMap: {
                name: "API 測試",
                phone: "0975008716",
                message: "這是一個 API 測試訊息",
                timestamp: new Date().toISOString()
              }
            }
          ]
        };

        const response = await axios.post(
          "https://open-api.omnichat.ai/v1/notification-messages",
          testData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OMNICHAT_TOKEN}`,
            },
            timeout: 10000
          }
        );

        apiTestResult = {
          success: true,
          status: response.status,
          data: response.data
        };
      } catch (error) {
        apiTestResult = {
          success: false,
          error: error.message,
          status: error.response?.status,
          data: error.response?.data
        };
      }
    }

    return res.status(200).json({
      message: "OmniChat API Test Endpoint",
      environment: envCheck,
      apiTest: apiTestResult,
      instructions: req.method === "GET" 
        ? "Use POST method to test actual API call" 
        : "Check the results above"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Test failed",
      message: error.message
    });
  }
}