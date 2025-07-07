// 測試電子郵件發送功能
export default async function handler(req, res) {
  // 設置 CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 檢查環境變數
    const emailEnvCheck = {
      EMAIL_USER: process.env.EMAIL_USER || "NOT SET",
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      EMAIL_USER_RECEIVE: process.env.EMAIL_USER_RECEIVE || process.env.EMAIL_USER || "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };

    console.log("Email Environment Check:", emailEnvCheck);

    // 動態導入 nodemailer
    const nodemailer = (await import("nodemailer")).default;

    // 測試郵件設定
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 驗證連接
    console.log("Testing email connection...");
    await transporter.verify();
    console.log("Email connection verified successfully!");

    // 發送測試郵件
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER_RECEIVE || process.env.EMAIL_USER,
      subject: "GoYours 系統測試 - 電子郵件通知",
      text: `
這是一封測試郵件，用於驗證 GoYours 系統的電子郵件通知功能。

測試時間: ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
測試來源: API 測試端點

如果您收到這封郵件，表示電子郵件通知功能正常運作。

--- GoYours 系統 ---
      `,
    };

    console.log("Sending test email...");
    const result = await transporter.sendMail(testMailOptions);
    console.log("Test email sent successfully:", result.messageId);

    return res.status(200).json({
      success: true,
      message: "電子郵件測試成功",
      environment: emailEnvCheck,
      testResult: {
        messageId: result.messageId,
        to: testMailOptions.to,
        subject: testMailOptions.subject
      }
    });

  } catch (error) {
    console.error("Email test failed:", error);

    let errorDetails = {
      message: error.message,
      code: error.code,
    };

    // 常見錯誤處理
    if (error.code === "EAUTH") {
      errorDetails.suggestion = "Gmail 認證失敗，請檢查 EMAIL_USER 和 EMAIL_PASS";
    } else if (error.code === "ECONNECTION") {
      errorDetails.suggestion = "網路連接問題，請檢查網路設定";
    } else if (error.message.includes("Invalid login")) {
      errorDetails.suggestion = "Gmail 登入無效，請確認使用應用程式密碼而非一般密碼";
    } else if (error.message.includes("Less secure app")) {
      errorDetails.suggestion = "需要啟用 Gmail 的兩步驟驗證並使用應用程式密碼";
    }

    return res.status(500).json({
      success: false,
      error: "電子郵件測試失敗",
      details: errorDetails,
      environment: {
        EMAIL_USER: process.env.EMAIL_USER || "NOT SET",
        EMAIL_PASS: !!process.env.EMAIL_PASS,
        EMAIL_USER_RECEIVE: process.env.EMAIL_USER_RECEIVE || "NOT SET"
      }
    });
  }
}