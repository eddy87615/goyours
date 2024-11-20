import { createClient } from '@sanity/client';
import CryptoJS from 'crypto-js';

const sanityClient = createClient({
  projectId: 'your-project-id',
  dataset: 'your-dataset',
  useCdn: false,
  token: 'your-sanity-api-token',
});

const SECRET_KEY = 'your-secret-key'; // 與前端加密的密鑰相同

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { encryptedData } = req.body;

    // 解密資料
    const decryptedData = decryptData(encryptedData);

    // 儲存到 Sanity
    const result = await sanityClient.create({
      _type: 'contact',
      ...decryptedData, // 存儲解密後的資料
    });

    res.status(200).json({ message: '資料成功存儲', result });
  } catch (error) {
    console.error('錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
}
