import { useState } from 'react';
import './omnichat-test.css';

export default function OmniChatTest() {
  const [phone, setPhone] = useState('0975008716');
  const [lineId, setLineId] = useState('');
  const [testMessage, setTestMessage] = useState('這是一個測試通知訊息');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTest = async (e) => {
    e.preventDefault();
    
    if (!phone || !lineId) {
      alert('請填寫電話號碼和 LINE ID');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('🧪 開始 OmniChat 測試');
      console.log('📋 測試資料:', { phone, lineId, testMessage });

      // 格式化電話號碼
      let formattedPhone = phone;
      if (phone.startsWith('0')) {
        formattedPhone = '886' + phone.substring(1);
      }

      console.log('📱 電話號碼格式化:', { 原始: phone, 格式化: formattedPhone });

      // 直接呼叫 OmniChat API（開發環境測試）
      const notificationData = {
        notifications: [
          {
            platform: "line",
            channelId: "2007407348", // 直接使用已知的 Channel ID
            to: formattedPhone,
            settingId: "68527dfb060eab724d2c4d9a", // 直接使用已知的 Setting ID
            valueMap: {
              lineId: lineId || "測試用戶",
              phone: phone,
              testMessage: testMessage || "這是一個簡單的測試通知",
              timestamp: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
              testType: "前端直接測試"
            }
          }
        ]
      };

      console.log('🚀 發送到 OmniChat API');
      console.log('📡 請求資料:', notificationData);

      // 注意：這裡直接呼叫 OmniChat API，Token 需要在前端設置（僅用於測試）
      const response = await fetch('https://open-api.omnichat.ai/v1/notification-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 4U8mCf50jkTAt3iGegYD9wtOG6WUTcYpnbbg8igVkbRsoh5RPrKMJm3uRiwSfxEE', // 臨時測試用
        },
        body: JSON.stringify(notificationData),
      });

      console.log('📥 收到回應:', response.status, response.statusText);

      const data = await response.json();
      console.log('📄 回應資料:', data);

      const result = {
        success: response.ok,
        message: response.ok ? "測試通知已發送!" : "測試失敗",
        data: response.ok ? {
          triggerId: data?.triggerId || data?.content?.triggerId,
          originalPhone: phone,
          formattedPhone: formattedPhone,
          lineId: lineId,
          channelId: "2007407348",
          settingId: "68527dfb060eab724d2c4d9a",
          apiResponse: data
        } : null,
        error: response.ok ? null : data?.error || `HTTP ${response.status}`,
        details: response.ok ? null : data
      };

      setResult(result);

      if (result.success) {
        alert('✅ 測試通知已發送！請檢查您的 LINE');
      } else {
        alert('❌ 測試失敗：' + result.error);
      }

    } catch (error) {
      console.error('❌ 測試錯誤:', error);
      const errorResult = {
        success: false,
        error: '網路錯誤',
        details: { message: error.message, stack: error.stack }
      };
      setResult(errorResult);
      alert('❌ 測試失敗：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="omnichat-test-container">
      <div className="test-card">
        <h1>🧪 OmniChat LINE 通知測試</h1>
        <p>填寫您的資訊來測試 LINE 通知功能</p>

        <form onSubmit={handleTest} className="test-form">
          <div className="form-group">
            <label htmlFor="phone">📱 電話號碼：</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="例：0975008716"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lineId">💬 LINE ID：</label>
            <input
              type="text"
              id="lineId"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              placeholder="例：your.line.id"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="testMessage">📝 測試訊息：</label>
            <textarea
              id="testMessage"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="自訂測試訊息"
              rows="3"
            />
          </div>

          <button 
            type="submit" 
            className="test-button"
            disabled={loading}
          >
            {loading ? '發送中...' : '🚀 發送測試通知'}
          </button>
        </form>

        {result && (
          <div className={`result ${result.success ? 'success' : 'error'}`}>
            <h3>{result.success ? '✅ 測試成功' : '❌ 測試失敗'}</h3>
            
            {result.success ? (
              <div className="success-info">
                <p><strong>通知已發送！</strong></p>
                <div className="details">
                  <p><strong>Trigger ID:</strong> {result.data?.triggerId}</p>
                  <p><strong>目標電話:</strong> {result.data?.formattedPhone}</p>
                  <p><strong>LINE ID:</strong> {result.data?.lineId}</p>
                  <p><strong>Channel ID:</strong> {result.data?.channelId}</p>
                </div>
                <p className="check-message">請檢查您的 LINE 是否收到通知！</p>
              </div>
            ) : (
              <div className="error-info">
                <p><strong>錯誤：</strong>{result.error}</p>
                {result.details && (
                  <div className="error-details">
                    <p><strong>詳細資訊：</strong></p>
                    <pre>{JSON.stringify(result.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="info-section">
          <h3>📋 測試說明</h3>
          <ul>
            <li>確保您的電話號碼已在 OmniChat 系統中綁定 LINE</li>
            <li>電話號碼會自動轉換為國際格式（+886）</li>
            <li>如果成功發送但沒收到通知，請檢查 OmniChat 後台設定</li>
            <li>測試完成後可以刪除此頁面</li>
          </ul>
        </div>
      </div>
    </div>
  );
}