import { hydrateRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  // react-snap 預渲染的情況，使用 hydrateRoot
  hydrateRoot(rootElement, <App />);
} else {
  // 全新渲染（通常不會觸發，因為 react-snap 會生成內容）
  hydrateRoot(rootElement, <App />);
}
