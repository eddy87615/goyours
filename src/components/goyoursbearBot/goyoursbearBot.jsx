import { useEffect } from 'react';

const GoyoursbearBot = () => {
  useEffect(() => {
    // 加载 inject.js
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
    injectScript.async = true;
    injectScript.onload = () => {
      console.log('inject.js 加载完成');

      if (window.botpress) {
        console.log('Botpress Webchat 加载成功，开始初始化');
        console.log('选择器是否存在：', document.querySelector('body')); // 检查选择器
        window.botpress.init({
          botId: '23206da7-0a51-48f5-a057-84acaea39f41',
          clientId: '7bf81765-287e-4974-97c4-d21a939cbe53',
          selector: 'body', // 这里可以替换为 '#root'
          onEvent: (event) => {
            console.log('Botpress Event:', event); // 输出事件日志
          },

          configuration: {
            email: {
              link: 'mailto:support@example.com', // 设置默认邮件链接
            },
            botAvatar: '/圓形logo.png', // 替换为机器人头像的 URL
            botName: '高優熊', // 设置机器人的名称
          },
        });
      } else {
        console.error('Botpress Webchat 未正确加载');
      }
    };

    injectScript.onerror = () => {
      console.error('无法加载 inject.js');
    };

    document.body.appendChild(injectScript);

    return () => {
      document.body.removeChild(injectScript);
    };
  }, []);

  return null;
};

export default GoyoursbearBot;
