import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/navigation/navigation';
import Home from './pages/home';
import Post from './pages/post';
import Studying from './pages/studying';
import Working from './pages/working';
import Contact from './pages/contact';
import PostDetail from './pages/postDetail';
import About from './pages/about';
import SchoolDetail from './pages/schoolDetail';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/post" element={<Post />} />
        <Route path="/post/:slug" element={<PostDetail />} />
        <Route path="/studying" element={<Studying />} />
        <Route path="/school/:slug" element={<SchoolDetail />} />
        <Route path="/working" element={<Working />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
