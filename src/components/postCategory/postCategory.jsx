import './postCategory.css';
import { GoTriangleRight } from 'react-icons/go';

// eslint-disable-next-line react/prop-types
export default function PostCategary({ handleCategoryClick }) {
  const categories = [
    { label: '所有文章', value: null },
    { label: '最新消息', value: '最新消息' },
    { label: '日本SGU項目', value: '日本SGU項目' },
    { label: '日本EJU', value: '日本EJU' },
    { label: '日本介護・護理相關', value: '日本介護・護理相關' },
    { label: '日本特定技能一號簽證', value: '日本特定技能一號簽證' },
    { label: '日本相關', value: '日本相關' },
    { label: '日本留學', value: '日本留學' },
    { label: '打工度假', value: '打工度假' },
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
