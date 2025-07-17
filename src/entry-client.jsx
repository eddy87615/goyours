import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './app/App.jsx'
import './styles/index.css'

// 純客戶端渲染 - 完全禁用水合
const container = document.getElementById('root')

// 清空服務端渲染的內容
container.innerHTML = ''

// 使用 createRoot 而不是 hydrateRoot
const root = createRoot(container)

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
)