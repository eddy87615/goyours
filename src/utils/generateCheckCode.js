import CryptoJS from "crypto-js";

export function generateCheckCode() {
  // 取得當下 UTC+0 的時間 yyyyMMddHHmm 格式
  const now = new Date();
  const utcNow = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes()
  );
  const yyyy = utcNow.getFullYear();
  const MM = String(utcNow.getMonth() + 1).padStart(2, "0");
  const dd = String(utcNow.getDate()).padStart(2, "0");
  const HH = String(utcNow.getHours()).padStart(2, "0");
  const mm = String(utcNow.getMinutes()).padStart(2, "0");

  const timestamp = `${yyyy}${MM}${dd}${HH}${mm}`;
  const plaintext = `ESi${timestamp}`;

  // AES 加密設定
  const key = CryptoJS.enc.Utf8.parse("ESiAIM2019".padEnd(32, "x")); // 補足為 32 bytes
  const iv = CryptoJS.enc.Utf8.parse("ESiAIM2019".padEnd(16, "x")); // 補足為 16 bytes

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plaintext),
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  const checkcode = encrypted.toString(); // Base64 編碼
  return checkcode;
}
