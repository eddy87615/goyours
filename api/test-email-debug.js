// 專門診斷電子郵件問題的 API
/* eslint-env node */
export default async function handler(req, res) {
  // CORS 設置
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    console.log('=== 電子郵件診斷開始 ===');

    // 1. 檢查環境變數
    const envCheck = {
      EMAIL_USER: process.env.EMAIL_USER || "❌ 未設置",
      EMAIL_PASS: process.env.EMAIL_PASS ? "✅ 已設置" : "❌ 未設置",
      EMAIL_USER_RECEIVE: process.env.EMAIL_USER_RECEIVE || process.env.EMAIL_USER || "❌ 未設置",
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV
    };

    console.log('環境變數檢查:', envCheck);

    // 2. 基本驗證
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({
        success: false,
        error: "缺少必要的環境變數",
        environment: envCheck,
        suggestions: [
          "請在 Vercel 設置 EMAIL_USER (完整 Gmail 地址)",
          "請在 Vercel 設置 EMAIL_PASS (Gmail 應用程式密碼)",
          "確認不是使用一般密碼，而是應用程式密碼"
        ]
      });
    }

    // 3. 如果是 POST 請求，執行實際測試
    if (req.method === "POST") {
      console.log('開始實際郵件測試...');

      // 動態導入 nodemailer
      const nodemailer = (await import("nodemailer")).default;

      // 創建傳輸器
      const transporter = nodemailer.createTransporter({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // 驗證連接
      console.log('驗證 Gmail 連接...');
      await transporter.verify();
      console.log('Gmail 連接驗證成功!');

      // 發送測試郵件
      const testEmail = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER_RECEIVE || process.env.EMAIL_USER,
        subject: `GoYours 電子郵件測試 - ${new Date().toLocaleTimeString()}`,
        text: `
這是一封電子郵件功能測試信件。

測試時間: ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
測試來源: /api/test-email-debug

如果您收到這封郵件，表示電子郵件通知功能正常！

--- GoYours 系統測試 ---
        `
      };

      console.log('發送測試郵件...');
      const result = await transporter.sendMail(testEmail);
      console.log('測試郵件發送成功!', result.messageId);

      return res.status(200).json({
        success: true,
        message: "電子郵件測試成功!",
        details: {
          messageId: result.messageId,
          from: testEmail.from,
          to: testEmail.to,
          subject: testEmail.subject
        },
        environment: envCheck
      });
    }

    // GET 請求只返回環境檢查
    return res.status(200).json({
      message: "電子郵件診斷端點",
      environment: envCheck,
      instructions: {
        method: "使用 POST 請求來執行實際的郵件測試",
        gmailSetup: [
          "1. 啟用 Gmail 兩步驟驗證",
          "2. 產生應用程式密碼",
          "3. 在 Vercel 設置環境變數"
        ]
      }
    });

  } catch (error) {
    console.error('電子郵件測試失敗:', error);

    let errorInfo = {
      message: error.message,
      code: error.code
    };

    // 常見錯誤診斷
    if (error.code === "EAUTH") {
      errorInfo.diagnosis = "Gmail 認證失敗";
      errorInfo.solutions = [
        "檢查 EMAIL_USER 是否為完整的 Gmail 地址",
        "確認 EMAIL_PASS 是應用程式密碼，不是帳號密碼",
        "確認 Gmail 已啟用兩步驟驗證"
      ];
    } else if (error.message.includes("Invalid login")) {
      errorInfo.diagnosis = "登入資訊無效";
      errorInfo.solutions = [
        "重新產生 Gmail 應用程式密碼",
        "確認環境變數值沒有多餘的空格"
      ];
    } else if (error.code === "ECONNECTION") {
      errorInfo.diagnosis = "網路連接問題";
      errorInfo.solutions = [
        "檢查伺服器網路設定",
        "確認 Gmail SMTP 端口可以訪問"
      ];
    }

    return res.status(500).json({
      success: false,
      error: "電子郵件測試失敗",
      details: errorInfo,
      environment: {
        EMAIL_USER: process.env.EMAIL_USER || "未設置",
        EMAIL_PASS: process.env.EMAIL_PASS ? "已設置" : "未設置"
      }
    });
  }
}