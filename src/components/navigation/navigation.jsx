/* eslint-disable react/prop-types */
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
            return (
              <li key={index}>
                <Link
                  to={nav.to}
                  target={nav.target}
                  onClick={() => setIsHamburgerClicked(!ishamburgerClicked)}
                >
                  <span className="hamburger-menu-icon">
                    <img
                      src="/goyoursbear-line-W.svg"
                      alt="hamburger menu goyours icon"
                    />
                  </span>
                  {index === 6 ? (
                    <span className="hamburger-contact-us-button">
                      <img
                        src="/goyoursbear-icon-w.svg"
                        alt="hamburger menu goyours icon"
                      />
                    </span>
                  ) : (
                    ''
                  )}
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
      // 記錄當前滾動位置
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden'; // 禁止滾動
      document.body.dataset.scrollY = scrollY; // 保存滾動位置到自定義屬性
    } else {
      // 恢復滾動位置
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.dataset.scrollY = '';
      window.scrollTo(0, scrollY); // 回到正確滾動位置
    }
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsHamburgerClicked(!ishamburgerClicked);
          }}
        >
          <span
            className={ishamburgerClicked ? 'hamburger-active-line' : ''}
          ></span>
          <span
            className={ishamburgerClicked ? 'hamburger-active-line' : ''}
          ></span>
          <span
            className={ishamburgerClicked ? 'hamburger-active-line' : ''}
          ></span>
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
