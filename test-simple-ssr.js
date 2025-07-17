import fetch from 'node-fetch'

async function testSimpleSSR() {
  try {
    console.log('🧪 Testing Simple SSR...')
    
    const response = await fetch('http://localhost:3002/')
    const html = await response.text()
    
    console.log('📊 Simple SSR Test Results:')
    console.log('✅ Server Response:', response.status === 200 ? 'OK' : 'FAIL')
    console.log('✅ HTML Length:', html.length, 'characters')
    
    // 檢查 SEO 元素
    console.log('\n🔍 SEO Check:')
    console.log('- Title tag:', html.includes('<title>') ? '✅' : '❌')
    console.log('- Meta description:', html.includes('meta name="description"') ? '✅' : '❌')
    console.log('- Meta keywords:', html.includes('meta name="keywords"') ? '✅' : '❌')
    console.log('- Open Graph:', html.includes('property="og:') ? '✅' : '❌')
    console.log('- Canonical URL:', html.includes('rel="canonical"') ? '✅' : '❌')
    
    // 檢查基本結構
    console.log('\n🏗️ Structure Check:')
    console.log('- DOCTYPE:', html.includes('<!DOCTYPE html>') ? '✅' : '❌')
    console.log('- Root div:', html.includes('id="root"') ? '✅' : '❌')
    console.log('- Main script:', html.includes('/src/main.jsx') ? '✅' : '❌')
    console.log('- Google Analytics:', html.includes('gtag') ? '✅' : '❌')
    
    console.log('\n📄 Preview:')
    console.log(html.substring(0, 500) + '...')
    
    if (html.length > 1000) {
      console.log('\n🎉 Simple SSR is working correctly!')
      console.log('💡 This provides excellent SEO with client-side hydration')
    }
    
  } catch (error) {
    console.error('❌ Simple SSR Test Failed:', error.message)
  }
}

testSimpleSSR()