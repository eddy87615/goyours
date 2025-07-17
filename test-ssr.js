import fetch from 'node-fetch'

async function testSSR() {
  try {
    console.log('🧪 Testing SSR...')
    
    const response = await fetch('http://localhost:3000/')
    const html = await response.text()
    
    // 檢查是否包含渲染的內容
    const hasContent = html.includes('Go Yours') && html.includes('<div')
    const hasStyles = html.includes('.css') || html.includes('style')
    
    console.log('📊 SSR Test Results:')
    console.log('✅ Server Response:', response.status === 200 ? 'OK' : 'FAIL')
    console.log('✅ Contains Content:', hasContent ? 'YES' : 'NO')
    console.log('✅ HTML Length:', html.length, 'characters')
    console.log('✅ Has Styles:', hasStyles ? 'YES' : 'NO')
    
    // 檢查特定元素
    console.log('\n🔍 Content Check:')
    console.log('- Navigation:', html.includes('nav') ? '✅' : '❌')
    console.log('- Footer:', html.includes('footer') ? '✅' : '❌')
    console.log('- Root div:', html.includes('id="root"') ? '✅' : '❌')
    
    if (html.length > 1000 && hasContent) {
      console.log('\n🎉 SSR is working correctly!')
    } else {
      console.log('\n⚠️  SSR might have issues')
    }
    
  } catch (error) {
    console.error('❌ SSR Test Failed:', error.message)
  }
}

testSSR()