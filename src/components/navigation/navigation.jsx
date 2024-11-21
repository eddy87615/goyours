import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TbBoxMultiple } from 'react-icons/tb';

import './navigation.css';

const SpMenu = ({ navigation, ishamburgerClicked, setIsHamburgerClicked }) => {
  return (
    <nav className="hamburger-menu-wrapper">
      <div
        className={
          ishamburgerClicked
            ? 'hamburger-body hamburger-body-clicked '
            : 'hamburger-body'
        }
      >
        <ul className="hamburger-list">
          {navigation.map((nav, index) => {
            // 檢查是否為第一個項目，跳過渲染
            if (index === 0) return null;

            return (
              <li key={index}>
                <Link
                  to={nav.to}
                  target={nav.target}
                  onClick={() => setIsHamburgerClicked(!ishamburgerClicked)}
                >
                  <p id={`navText${index}`}>{nav.title}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
export default function Navigation() {
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const navigation = [
    { to: '/', title: 'Home', target: '_self' },
    { to: '/about-us', title: 'About', target: '_self' },
    { to: '/goyours-post', title: '文章專區', target: '_self' },
    { to: '/studying-in-jp', title: '日本留學', target: '_self' },
    { to: '/working-holiday', title: '打工度假', target: '_self' },
    { to: '/Q&A-section', title: '常見Q&A', target: '_self' },
    { to: '/contact-us', title: '聯絡我們', target: '_blank' },
  ];

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

  const [ishamburgerClicked, setIsHamburgerClicked] = useState(false);

  useEffect(() => {
    if (ishamburgerClicked) {
      document.body.style.overflow = 'hidden'; // 禁用滾動
      document.body.style.position = 'fixed'; // 防止滾動位置變化
      document.body.style.width = '100%'; // 防止滾動條佔位
    } else {
      document.body.style.overflow = ''; // 恢復滾動
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // 清理副作用
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [ishamburgerClicked]);

  return (
    <>
      <nav
        className={`mainNav ${visible ? 'visible' : 'hidden'} ${
          ishamburgerClicked ? 'mainNav-hamburger-clicked' : ''
        }`}
      >
        <div className="navLogo">
          <Link to="/">
            <img src="/LOGO-03.png" alt="goyours logo" width={250} />
          </Link>
        </div>
        <div className="navMenu">
          <ul>
            {navigation.map((nav, index) => (
              <li key={index}>
                <Link to={nav.to} target={nav.target}>
                  <span className="nav-wrapper">
                    <span className="upperP-wrapper">
                      <p id={`navText${index}`}>
                        {nav.title}
                        <span className="nav-icon">
                          {index === 6 ? <TbBoxMultiple /> : null}
                        </span>
                      </p>
                    </span>
                    <span className="downP-wrapper">
                      <p id={`navText${index}`}>
                        {nav.title}
                        <span className="nav-icon">
                          {index === 6 ? <TbBoxMultiple /> : null}
                        </span>
                      </p>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="hamburger-line-wrapper"
          onClick={() => setIsHamburgerClicked(!ishamburgerClicked)}
        >
          <div
            className={
              ishamburgerClicked
                ? 'hamburger-menu-line hamburger-clicked'
                : 'hamburger-menu-line'
            }
          ></div>
        </div>
      </nav>
      <SpMenu
        navigation={navigation}
        ishamburgerClicked={ishamburgerClicked}
        setIsHamburgerClicked={setIsHamburgerClicked}
      />
    </>
  );
}
