import { useState } from 'react';
import PostArea from '../components/postArea/postArea';
import PostCategary from '../components/postCategory/postCategory';
import './post.css';

export default function Post() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="postPage">
      <div>
        <PostCategary handleCategoryClick={handleCategoryClick} />
        <div>
          <h4>Go Yours 遊留學代辦專家，實現你的打工度假、出國遊學夢！</h4>
          <img src="/src/assets/LOGO-07.png" style={{ width: '90%' }} />
        </div>
      </div>
      <PostArea
        selectedCategory={selectedCategory}
        handleCategoryClick={handleCategoryClick}
      />
    </div>
  );
}
