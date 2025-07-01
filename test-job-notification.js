import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const testJobApplication = {
  _type: 'JPjobapply',
  jobname: '測試工程師職位',
  name: '測試申請者',
  age: '25',
  major: '資訊工程系',
  phone: '0912345678',
  email: 'test@example.com',
  callTime: '下午2-6點',
  lineId: 'test_line_id',
  resume: true,
  _createdAt: new Date().toISOString()
};

async function testEmailNotification() {
  console.log('正在測試新正職職缺申請通知...\n');
  console.log('測試資料:', testJobApplication);
  
  const apiUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.vercel.app/api/index'
    : 'http://localhost:5173/api/index';
  
  try {
    console.log('\n發送請求到:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testJobApplication),
    });
    
    const result = await response.json();
    
    console.log('\n回應狀態:', response.status);
    console.log('回應內容:', result);
    
    if (response.ok) {
      console.log('\n✅ 測試成功！請檢查 EMAIL_USER_RECEIVE 信箱是否收到通知郵件。');
      console.log(`收件信箱: ${process.env.EMAIL_USER_RECEIVE}`);
    } else {
      console.log('\n❌ 測試失敗:', result.message);
    }
  } catch (error) {
    console.error('\n❌ 發生錯誤:', error.message);
  }
}

// 檢查環境變數
console.log('環境變數檢查:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ 已設定' : '❌ 未設定');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ 已設定' : '❌ 未設定');
console.log('EMAIL_USER_RECEIVE:', process.env.EMAIL_USER_RECEIVE ? '✅ 已設定' : '❌ 未設定');

// 執行測試
testEmailNotification();