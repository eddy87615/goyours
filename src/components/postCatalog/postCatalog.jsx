import { useEffect, useState } from 'react';
import './postCatalog.css';

export default function PostCatalog() {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const h2Elements = Array.from(document.querySelectorAll('.postTxtarea h2'));
    const h3Elements = Array.from(document.querySelectorAll('.postTxtarea h3'));

    // 为每个 h2 和 h3 生成唯一的 id
    h2Elements.forEach((h2, index) => {
      h2.id = `heading-${index}`;
    });
    h3Elements.forEach((h3, index) => {
      h3.id = `subheading-${index}`;
    });

    const combinedHeadings = h2Elements.map((h2) => {
      const followingH3s = [];
      let nextElement = h2.nextElementSibling;

      while (nextElement && nextElement.tagName !== 'H2') {
        if (nextElement.tagName === 'H3') {
          followingH3s.push({
            text: nextElement.innerText,
            id: nextElement.id,
          });
        }
        nextElement = nextElement.nextElementSibling;
      }
      return {
        h2: h2.innerText,
        id: h2.id,
        h3s: followingH3s,
      };
    });
    setHeadings(combinedHeadings);
  }, []);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 如果没有任何 h2 或 h3，则不渲染目录
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="postCatalog">
      <p className="postCatalog-title">內容目錄</p>
      <ul>
        {headings.map((heading, index) => (
          <li key={index} className="catalogH2">
            <a onClick={() => scrollToHeading(heading.id)}>{heading.h2}</a>
            {heading.h3s.length > 0 && (
              <ul className="catalogH3">
                {heading.h3s.map((subHeading, subIndex) => (
                  <li key={subIndex}>
                    <a onClick={() => scrollToHeading(subHeading.id)}>
                      {subHeading.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
