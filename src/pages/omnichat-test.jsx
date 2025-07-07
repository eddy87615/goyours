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

      // 在開發環境直接模擬 API 呼叫結果
      console.log('⚠️ 注意：開發環境模擬測試');
      
      // 模擬成功的回應
      const mockResponse = {
        success: true,
        message: "測試通知模擬發送成功",
        data: {
          triggerId: "mock_trigger_" + Date.now(),
          originalPhone: phone,
          formattedPhone: formattedPhone,
          lineId: lineId,
          channelId: "2007407348",
          settingId: "68527dfb060eab724d2c4d9a",
          note: "這是開發環境的模擬結果，實際 OmniChat API 呼叫需要在生產環境測試"
        }
      };

      console.log('📄 模擬回應:', mockResponse);
      
      // 模擬 API 延遲
      await new Promise(resolve => setTimeout(resolve, 1000));

      setResult(mockResponse);

      if (mockResponse.success) {
        alert('✅ 模擬測試成功！\n注意：這是開發環境模擬，實際 API 呼叫需要部署到生產環境測試');
      } else {
        alert('❌ 測試失敗：' + (mockResponse.error || '未知錯誤'));
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
          <div className="warning-box">
            ⚠️ <strong>開發環境注意</strong>：目前在 localhost 環境中，這是模擬測試。
            要進行真實的 OmniChat API 測試，請部署到生產環境！
          </div>
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