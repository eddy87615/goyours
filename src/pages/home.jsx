import { useEffect, useState } from 'react';
import './home.css';

export default function Home() {
  //nav height get
  const [navHeight, setNavHeight] = useState(0);
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (nav) {
      setNavHeight(nav.offsetHeight);
    }
  }, []);
  //nav height get

  return (
    <>
      <div className="kv">kv</div>
      <div>
        <h2>國外打工度假 、 遊留學的好夥伴 ， 日本 、 加拿大留學超推薦！</h2>
        <p>
          世界這麼大，你不該只留在原地 何年何月何日何時，你會在哪裡？
          去你自己的打工度假、留遊學吧！ Go Yours 團隊幫你找出適合的路，
          去各個國家打工度假、留遊學， 體驗各種生活，感受世界各地 ～
        </p>
      </div>
      <div>
        <h2>最新消息</h2>
      </div>
    </>
  );
}
