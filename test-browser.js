import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'screenshots')

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR)
}

async function runTests() {
  console.log('🚀 Launching Chrome at:', CHROME_PATH)
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  })

  const page = await browser.newPage()

  const consoleLogs = []
  const pageErrors = []

  page.on('console', (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() })
  })

  page.on('pageerror', (err) => {
    pageErrors.push(err.toString())
  })

  console.log('🌐 Navigating to http://127.0.0.1:5173/ ...')
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 })

  console.log('⏳ Waiting for preloader transition and initial render...')
  await new Promise((r) => setTimeout(r, 2600))

  // 1. Headline & Wall Overlap and Geometry Metrics
  await page.setViewport({ width: 1920, height: 1080 })
  await new Promise((r) => setTimeout(r, 600))

  const metrics = await page.evaluate(() => {
    const l1 = document.querySelector('.headline-line-1')
    const l2 = document.querySelector('.headline-line-2')
    const sub = document.querySelector('.hero-subtext')
    const designWin = document.querySelector('.design-artboard')
    const wall = document.querySelector('.design-export-btn')

    const r1 = l1 ? l1.getBoundingClientRect() : null
    const r2 = l2 ? l2.getBoundingClientRect() : null
    const rSub = sub ? sub.getBoundingClientRect() : null
    const rWin = designWin ? designWin.getBoundingClientRect() : null

    return {
      line1: r1 ? { top: r1.top, bottom: r1.bottom, right: r1.right } : null,
      line2: r2 ? { top: r2.top, bottom: r2.bottom, right: r2.right } : null,
      subtext: rSub ? { top: rSub.top, bottom: rSub.bottom, right: rSub.right } : null,
      artboard: rWin ? { left: rWin.left, top: rWin.top } : null,
      hasOverlapWithWall: (r1 && rWin) ? (r1.right > rWin.left) : false,
      hasLineCollision: (r1 && r2) ? (r2.top < r1.bottom - 4) : false,
      studioWallFound: !!wall,
    }
  })
  console.log('📐 Hero Layout Metrics:', metrics)

  // 2. Test across all required viewports: 390, 768, 1280, 1920, 3840
  const viewports = [
    { name: 'desktop-1920', width: 1920, height: 1080 },
    { name: '4k-3840', width: 3840, height: 2160 },
    { name: 'laptop-1280', width: 1280, height: 800 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
  ]

  for (const vp of viewports) {
    console.log(`\n📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`)
    await page.setViewport({ width: vp.width, height: vp.height })
    await new Promise((r) => setTimeout(r, 600))

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1
    })
    console.log(`   - Horizontal overflow: ${hasHorizontalOverflow ? '❌ DETECTED' : '✅ NONE'}`)

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${vp.name}-live-studio-hero.png`),
      fullPage: false,
    })
  }

  // 3. Test the Master Timeline Loop Phases on Desktop 1920
  console.log('\n⏱ Testing Studio Wall Master Timeline Phases on 1920x1080...')
  await page.setViewport({ width: 1920, height: 1080 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 500))

  // Move pointer over wall to test interactive tilt and "You" tag
  await page.mouse.move(1400, 450)
  await new Promise((r) => setTimeout(r, 600))
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'live-studio-design-phase.png'),
    fullPage: false,
  })

  // Wait for Schedule Phase (~8s)
  console.log('   - Waiting for Schedule Phase (card flies to calendar)...')
  await new Promise((r) => setTimeout(r, 6000))
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'live-studio-schedule-phase.png'),
    fullPage: false,
  })

  // Wait for Publish Phase (~13s)
  console.log('   - Waiting for Publish Phase (feed cards & hearts)...')
  await new Promise((r) => setTimeout(r, 4500))
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'live-studio-publish-phase.png'),
    fullPage: false,
  })

  // 4. Test Scroll Transition: "Dive into the Artboard"
  console.log('\n🌊 Testing Scroll Transition: Dive Into Artboard...')
  await page.evaluate(() => window.scrollBy(0, 450))
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'live-studio-dive-scroll.png'),
    fullPage: false,
  })

  // 5. Test Final CTA Callback
  console.log('\n🎯 Testing Final CTA Section Callback...')
  await page.evaluate(() => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'final-cta-studio-callback.png'),
    fullPage: false,
  })

  // 6. Summary of Errors
  console.log('\n📊 Diagnostic Summary:')
  console.log(`   - Page Errors: ${pageErrors.length}`)
  if (pageErrors.length > 0) {
    console.log('   ❌ Errors:', pageErrors)
  } else {
    console.log('   ✅ 0 Page Errors')
  }

  const severeLogs = consoleLogs.filter(
    (l) => l.type === 'error' && !l.text.includes('favicon') && !l.text.includes('ERR_FILE_NOT_FOUND')
  )
  console.log(`   - Console Error Logs: ${severeLogs.length}`)
  if (severeLogs.length > 0) {
    console.log('   ❌ Severe Console Logs:', severeLogs)
  } else {
    console.log('   ✅ 0 Severe Console Errors')
  }

  await browser.close()
  console.log('\n✨ Automated QA Complete! All screenshots saved to ./screenshots/')
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err)
  process.exit(1)
})
