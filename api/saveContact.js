import { createClient } from '@sanity/client';
import CryptoJS from 'crypto-js';

const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_API_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_API_SANITY_DATASET,
  useCdn: false,
  token: import.meta.env.VITE_SANITY_API_SANITY_TOKEN,
});

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY; // 與前端加密的密鑰相同

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export default async function handler(req, res) {
  console.log('環境變數測試:');
  console.log('PROJECT_ID:', import.meta.env.VITE_SANITY_API_SANITY_PROJECT_ID);
  console.log('DATASET:', import.meta.env.VITE_SANITY_API_SANITY_DATASET);
  console.log(
    'TOKEN:',
    import.meta.env.VITE_SANITY_API_SANITY_TOKEN ? '存在' : '不存在'
  );
  console.log(
    'SECRET_KEY:',
    import.meta.env.VITE_SECRET_KEY ? '存在' : '不存在'
  );
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { encryptedData } = req.body;

    // 解密資料
    const decryptedData = decryptData(encryptedData);
    console.log('Decrypted Data:', decryptedData);
    console.log('Received encryptedData:', encryptedData);

    // 儲存到 Sanity
    const result = await sanityClient.create({
      _type: 'contact',
      ...decryptedData, // 存儲解密後的資料
    });

    console.log('Decrypted Data:', decryptedData);

    res.status(200).json({ message: '資料成功存儲', result });
  } catch (error) {
    console.error('錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
}
