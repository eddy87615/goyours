import { Link } from 'react-router-dom';
import './navigation.css';

export default function Navigation() {
  return (
    <nav className="mainNav">
      <div className="navLogo">
        <Link to="/">
          <img src="/src/assets/LOGO-03.png" alt="logo" width={150} />
        </Link>
      </div>
      <div className="navMenu">
        <Link to="/about">關於Go Yours</Link>
        <Link to="/post">文章專區</Link>
        <Link to="/studying">日本留學</Link>
        <Link to="/working">打工度假</Link>
        <Link to="/contact">聯絡我們</Link>
      </div>
    </nav>
  );
}
