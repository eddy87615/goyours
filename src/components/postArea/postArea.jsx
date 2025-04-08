/* eslint-disable react/prop-types */
import "./postArea.css";
import Pagination from "../pagination/pagination";
import { PortableText } from "@portabletext/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { urlFor } from "../../cms/sanityClient";

const customComponents = {
  types: {
    image: ({ value }) => {
      // 直接确认 asset 是否存在，无需过多检查
      if (!value?.asset?._ref) {
        return null;
      }

      return (
        <div className="post-image">
          <img src={urlFor(value).url()} alt={value.alt || "Image"} />
        </div>
      );
    },
    gallery: ({ value }) => {
      if (!value.images || value.images.length === 0) return null;
      return (
        <div className="gallery">
          <Swiper
            navigation={true}
            modules={[Navigation]}
            loop
            className="mySwiper"
            spaceBetween={50}
          >
            {value.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={urlFor(image).url()}
                  alt={`Gallery Image ${index + 1}`}
                  className="gallery-image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      );
    },
    table: ({ value }) => {
      if (
        !value?.rows ||
        !Array.isArray(value.rows) ||
        value.rows.length === 0
      ) {
        return <p>No table data available</p>;
      }

      // 提取 `cells` 以获得真正的数据
      const sanitizedRows = value.rows.map((row) => {
        if (row?.cells && Array.isArray(row.cells)) {
          return row.cells;
        }
        return []; // 如果没有 cells，返回空数组
      });

      if (sanitizedRows.length === 0) {
        return <p>Invalid table data</p>;
      }

      // 合并表头的逻辑
      const mergeTableHeaders = (headers) => {
        const mergedHeaders = [];
        let currentHeader = null;
        let spanCount = 0;

        headers.forEach((header, index) => {
          if (header === currentHeader) {
            // 如果当前 header 和前一个相同，增加 colspan
            spanCount++;
          } else {
            // 保存之前的 header
            if (currentHeader !== null) {
              mergedHeaders.push({
                content: currentHeader,
                colspan: spanCount,
              });
            }
            // 更新当前 header
            currentHeader = header;
            spanCount = 1;
          }
        });

        // 保存最后一个 header
        if (currentHeader !== null) {
          mergedHeaders.push({ content: currentHeader, colspan: spanCount });
        }

        return mergedHeaders;
      };

      const headers = sanitizedRows[0];
      const mergedHeaders = mergeTableHeaders(headers);

      return (
        <table border="1" style={{ borderCollapse: "collapse", width: "90%" }}>
          <thead>
            <tr>
              {mergedHeaders.map((header, index) => (
                <th key={index} colSpan={header.colspan}>
                  {header.content || ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sanitizedRows.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell || ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
    span: ({ value, children }) => {
      return <span>{children}</span>;
    },
  },
  block: {
    normal: ({ children }) => <p>{children}</p>, // 普通文本渲染為 <p>
    h1: ({ children }) => <p>{children}</p>, // 將 h1 渲染為 <p>
    h2: ({ children }) => <p>{children}</p>, // 將 h2 渲染為 <p>
    h3: ({ children }) => <p>{children}</p>, // 將 h3 渲染為 <p>
    h4: ({ children }) => <p>{children}</p>, // 同理處理其他標題
    h5: ({ children }) => <p>{children}</p>,
    h6: ({ children }) => <p>{children}</p>,
  },
  marks: {
    color: ({ children, value }) => {
      const color = value?.hex?.hex || "#FF0000";

      return (
        <span
          style={{
            color,
          }}
        >
          {children}
        </span>
      );
    },
    favoriteColor: ({ children, value }) => {
      const color = value?.hex?.hex || "#FF0000";

      return (
        <span
          style={{
            color,
          }}
        >
          {children}
        </span>
      );
    },
    link: ({ children }) => <span>{children}</span>,
  },
  // 默認對於未定義的類型不進行渲染
  default: () => null,
};

const highlightText = (text, query) => {
  if (!query) return text;

  const escapeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapeQuery})`, "gi");

  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
};

export default function PostArea({
  posts,
  totalPages,
  currentPage,
  onPageChange,
  handleCategoryClick,
  searchQuery,
  selectedCategory,
}) {
  return (
    <div className="postRight">
      {searchQuery ? (
        <p className="post-searchword">搜尋關鍵字：{searchQuery}</p>
      ) : (
        <></>
      )}
      {selectedCategory ? (
        <p className="post-searchword">目前分類：{selectedCategory}</p>
      ) : null}

      {posts.map((post, index) => (
        <div key={index} className="postarea">
          {post.mainImage && (
            <Link
              to={`/goyours-post/${post.slug.current}`}
              className="imgLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.mainImage?.asset ? (
                <img src={urlFor(post.mainImage).url()} alt={post.title} />
              ) : (
                <p className="noimg-notice">未提供圖片</p>
              )}
            </Link>
          )}
          <div className="postListInfo">
            <h2>
              <Link to={`/goyours-post/${post.slug.current}`} target="_blank">
                {highlightText(post.title, searchQuery)}
              </Link>
            </h2>
            <ul className="info">
              {post.categories && post.categories.length > 0 ? (
                <>
                  {/* <BiPurchaseTag className="icon" /> */}
                  {post.categories.map((category, index) => (
                    <li key={index} className="category">
                      <a onClick={() => handleCategoryClick(category.title)}>
                        #{category.title}
                      </a>
                    </li>
                  ))}
                </>
              ) : (
                <li className="category">無分類</li>
              )}
            </ul>
            <p className="date">
              <span>
                <img src="/圓形logo.png" alt="goyours logo" />
              </span>
              {new Date(post.publishedAt)
                .toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, ".")}
            </p>
            <div className="textPart">
              <PortableText value={post.body} components={customComponents} />
            </div>
          </div>
        </div>
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
