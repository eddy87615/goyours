import dotenv from 'dotenv';
import handler from './api/index.js';

dotenv.config();

// 模擬 Vercel 請求和回應物件
const mockRequest = {
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body: {
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
  }
};

const mockResponse = {
  status: null,
  json: null,
  statusCode: 200,
  data: null,
  
  status(code) {
    this.statusCode = code;
    return this;
  },
  
  json(data) {
    this.data = data;
    console.log('\n回應:', {
      status: this.statusCode,
      data: data
    });
    return this;
  }
};

console.log('====================================');
console.log('測試新正職職缺申請通知');
console.log('====================================\n');

console.log('環境變數檢查:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? `✅ ${process.env.EMAIL_USER}` : '❌ 未設定');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ 已設定' : '❌ 未設定');
console.log('EMAIL_USER_RECEIVE:', process.env.EMAIL_USER_RECEIVE ? `✅ ${process.env.EMAIL_USER_RECEIVE}` : '❌ 未設定');

console.log('\n測試資料:');
console.log(JSON.stringify(mockRequest.body, null, 2));

console.log('\n正在發送測試郵件...');

// 直接調用處理函數
try {
  await handler(mockRequest, mockResponse);
  
  if (mockResponse.statusCode === 200) {
    console.log('\n✅ 測試成功！');
    console.log(`請檢查 ${process.env.EMAIL_USER_RECEIVE} 信箱是否收到通知郵件。`);
    console.log('\n郵件內容預覽:');
    console.log('主旨: 新正職職缺申請表單');
    console.log('內容包含:');
    console.log('  - 申請工作名稱：測試工程師職位');
    console.log('  - 真實姓名：測試申請者');
    console.log('  - 年齡：25');
    console.log('  - 科系：資訊工程系');
    console.log('  - 行動電話：0912345678');
    console.log('  - 電子郵件：test@example.com');
    console.log('  - 方便聯絡時段：下午2-6點');
    console.log('  - Line ID：test_line_id');
    console.log('  - 履歷表：已上傳');
  } else {
    console.log('\n❌ 測試失敗');
  }
} catch (error) {
  console.error('\n❌ 發生錯誤:', error.message);
  console.error('錯誤詳情:', error);
}