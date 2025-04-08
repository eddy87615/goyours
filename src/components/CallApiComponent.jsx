// src/components/CallApiComponent.jsx
import React, { useEffect, useState } from "react";
import { generateCheckCode } from "../utils/generateCheckCode";

const CallApiComponent = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const callApi = async () => {
      const checkcode = generateCheckCode();

      try {
        const response = await fetch("https://your-api-endpoint.com/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkcode: checkcode,
            // 其他你需要傳的欄位也加在這裡
          }),
        });

        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error("API 呼叫錯誤：", err);
        setError("API 錯誤");
      }
    };

    callApi();
  }, []);

  return (
    <div>
      <h2>API 呼叫結果</h2>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : "載入中..."}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CallApiComponent;
