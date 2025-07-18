/* eslint-disable no-undef */
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }


  const type = req.body._type; // 注意這裡改成 _type
  if (!type) {
    return res
      .status(400)
      .json({ message: "Type is required in the request body." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // 不需要再從 Sanity 獲取數據，因為數據已經在請求體中
    const data = req.body;


    let mailOptions;

    if (type === "contact") {
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER_RECEIVE,
        subject: "新聯絡資料表單",
        text: `
新聯絡資料表單:
  - 真實姓名：${data.name || "N/A"}
  - 年齡：${data.age || "N/A"}
  - 行動電話：${data.phone || "N/A"}
  - 電子郵件：${data.email || "N/A"}
  - 想詢問的方案：${Array.isArray(data.case) ? data.case.join(", ") : "N/A"}
  - 方便聯絡的時段：${data.callTime || "N/A"}
  - Line ID：${data.lineId || "N/A"}
快到後台查看更多資訊！
        `,
      };
    } else if (type === "JPjobapply") {
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER_RECEIVE,
        subject: "新正職職缺申請表單",
        text: `
新正職職缺申請:
  - 申請工作名稱：${data?.jobname || "N/A"}
  - 真實姓名：${data?.name || "N/A"}
  - 年齡：${data?.age || "N/A"}
  - 科系：${data?.major || "N/A"}
  - 行動電話：${data?.phone || "N/A"}
  - 電子郵件：${data?.email || "N/A"}
  - 方便聯絡時段：${data?.callTime || "N/A"}
  - Line ID：${data?.lineId || "N/A"}
  - 履歷表：${data?.resume ? "已上傳" : "未上傳"}
快到後台查看詳細資訊和履歷！
        `,
      };
    } else {
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER_RECEIVE,
        subject: "新打工度假申請表單",
        text: `
新打工度假申請:
  - 申請工作名稱：${data?.jobname || "N/A"}
  - 真實姓名：${data?.name || "N/A"}
  - 年齡：${data?.age || "N/A"}
  - 行動電話：${data?.phone || "N/A"}
  - 電子郵件：${data?.email || "N/A"}
  - 方便聯絡時段：${data?.callTime || "N/A"}
  - Line ID：${data.lineId || "N/A"}
  - 履歷表：${data?.resume ? "已上傳" : "未上傳"}
快到後台看看履歷吧！
        `,
      };
    }

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: `Webhook processed successfully for type "${type}".`,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Failed to process webhook",
      error: error.message,
    });
  }
}
