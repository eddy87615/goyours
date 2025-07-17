import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './app/App.jsx'
import './styles/index.css'

// 使用 createRoot 而非 hydrateRoot - 純客戶端渲染
const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
)
