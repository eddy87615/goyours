/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TbBoxMultiple } from 'react-icons/tb';
import { motion } from 'framer-motion';
import { HelmetProvider, Helmet } from 'react-helmet-async';

import useWindowSize from '../../hook/useWindowSize';

import './navigation.css';

const SpMenu = ({ navigation, ishamburgerClicked, setIsHamburgerClicked }) => {
  const itemVariants = {
    hidden: { x: 50, opacity: 0 }, // 初始狀態
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1, // 每個項目的延遲時間
        type: 'spring',
        stiffness: 70,
      },
    }),
  };

  return (
    <nav className="hamburger-menu-wrapper">
      <div
        className={
          ishamburgerClicked
            ? 'hamburger-body hamburger-body-clicked '
            : 'hamburger-body'
        }
      >
        <motion.ul
          className="hamburger-list"
          initial="hidden"
          animate={ishamburgerClicked ? 'visible' : 'hidden'}
        >
          {navigation.map((nav, index) => {
            return (
              <motion.li
                key={index}
                custom={index} // 傳遞索引，用於延遲計算
                variants={itemVariants}
              >
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
                  {index === 7 ? (
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
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </nav>
  );
};
export default function Navigation() {
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const [ishamburgerClicked, setIsHamburgerClicked] = useState(false);
  const windowSize = useWindowSize();

  const navigation = [
    { to: '/', title: 'Home', target: '_self' },
    { to: '/about-us', title: 'About', target: '_self' },
    { to: '/goyours-post', title: '文章專區', target: '_self' },
    { to: '/studying-in-jp', title: '日本留學', target: '_self' },
    { to: '/working-holiday', title: '打工度假', target: '_self' },
    { to: '/Q&A-section', title: '常見Q&A', target: '_self' },
    { to: '/document-download', title: '下載專區', target: '_self' },
    { to: '/contact-us', title: '聯絡我們', target: '_blank' },
  ];

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

    setVisible(isVisible);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    if (ishamburgerClicked) {
      const preventScroll = (e) => {
        e.preventDefault();
      };

      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('wheel', preventScroll, { passive: false });
      return () => {
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('wheel', preventScroll);
      };
    }
  }, [ishamburgerClicked]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <HelmetProvider>
      <Helmet>
        <meta
          name="theme-color"
          content={ishamburgerClicked ? '#414042' : ''}
        />
      </Helmet>
      <nav className="nav-wrapper">
        <nav
          className={`${windowSize > 1024 ? 'mainNav-pc' : 'mainNav'}  ${
            ishamburgerClicked ? 'mainNav-hamburger-clicked' : ''
          } ${visible && windowSize <= 1024 ? 'nav-visible-sp' : 'nav-hidden'}`}
        >
          <div
            className={`${windowSize > 1024 ? 'nav-logo-pc' : 'nav-logo-sp'} ${
              visible ? 'nav-visible' : 'nav-hidden'
            }`}
          >
            <Link to="/">
              <img src="/LOGO-03.png" alt="goyours logo" width={250} />
            </Link>
          </div>
          <div
            className={`navMenu ${windowSize > 1024 ? 'nav-list' : ''} ${
              visible ? 'nav-visible' : 'nav-hidden'
            }`}
          >
            <ul>
              {navigation.map((nav, index) => (
                <li key={index}>
                  <Link to={nav.to} target={nav.target}>
                    <span className="nav-wrapper">
                      <span className="upperP-wrapper">
                        <p id={`navText${index}`}>
                          {nav.title}
                          <span className="nav-icon">
                            {index === 7 ? <TbBoxMultiple /> : null}
                          </span>
                        </p>
                      </span>
                      <span className="downP-wrapper">
                        <p id={`navText${index}`}>
                          {nav.title}
                          <span className="nav-icon">
                            {index === 7 ? <TbBoxMultiple /> : null}
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
      </nav>

      <SpMenu
        navigation={navigation}
        ishamburgerClicked={ishamburgerClicked}
        setIsHamburgerClicked={setIsHamburgerClicked}
      />
    </HelmetProvider>
  );
}
