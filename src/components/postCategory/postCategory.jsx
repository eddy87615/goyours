import './postCategory.css';
import { GoTriangleRight } from 'react-icons/go';

// eslint-disable-next-line react/prop-types
export default function PostCategary({ handleCategoryClick }) {
  const categories = [
    { label: '所有文章', value: null },
    { label: '最新消息', value: '最新消息' },
    { label: '日本生活分享', value: '日本生活分享' },
    { label: '日本留學', value: '日本留學' },
    { label: '打工度假', value: '打工度假' },
    { label: '日本就職', value: '日本就職' },
  ];

  return (
    <>
      <ul>
        <h4>文章分類</h4>
        {categories.map((category, index) => (
          <li key={index} onClick={() => handleCategoryClick(category.value)}>
            <GoTriangleRight />
            <a>{category.label}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
