import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('====================================');
console.log('測試 Gmail 認證');
console.log('====================================\n');

console.log('環境變數檢查:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ 未設定');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? `✅ 已設定 (${process.env.EMAIL_PASS.length} 字元)` : '❌ 未設定');
console.log('EMAIL_USER_RECEIVE:', process.env.EMAIL_USER_RECEIVE || '❌ 未設定');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log('\n正在測試認證...');

transporter.verify(function(error, success) {
  if (error) {
    console.log('\n❌ 認證失敗:');
    console.log(error.message);
    console.log('\n解決方法:');
    console.log('1. 確認 Gmail 帳戶已啟用兩步驟驗證');
    console.log('2. 前往 https://myaccount.google.com/apppasswords');
    console.log('3. 生成新的應用程式密碼');
    console.log('4. 更新 .env 檔案中的 EMAIL_PASS（移除空格）');
    console.log('5. 重新執行此測試');
  } else {
    console.log('\n✅ 認證成功！');
    console.log('Gmail 連線正常，可以發送郵件。');
    
    // 可選：發送測試郵件
    console.log('\n是否要發送測試郵件？執行: node test-job-notification-direct.js');
  }
  
  process.exit(0);
});