import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import App from './app/App'
import './styles/index.css'

export function render(url, context = {}) {
  const helmetContext = {}
  
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url} context={context}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  )
  
  const { helmet } = helmetContext
  
  return { 
    html, 
    helmet: {
      htmlAttributes: helmet.htmlAttributes.toString(),
      title: helmet.title.toString(),
      meta: helmet.meta.toString(),
      link: helmet.link.toString(),
      script: helmet.script.toString(),
      style: helmet.style.toString()
    }
  }
}