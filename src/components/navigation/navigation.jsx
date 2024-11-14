import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TbBoxMultiple } from 'react-icons/tb';

import './navigation.css';

export default function Navigation() {
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

    setVisible(isVisible);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <nav className={`mainNav ${visible ? 'visible' : 'hidden'}`}>
      <div className="navLogo">
        <Link to="/">
          <img src="/LOGO-03.png" alt="goyours logo" width={250} />
        </Link>
      </div>
      <div className="navMenu">
        <Link to="/about">關於Go Yours</Link>
        <Link to="/post">文章專區</Link>
        <Link to="/studying">日本留學</Link>
        <Link to="/working">打工度假</Link>
        <Link to="/contact" target="blank">
          聯絡我們
          <TbBoxMultiple />
        </Link>
      </div>
    </nav>
  );
}
