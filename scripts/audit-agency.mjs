import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const screenshotsDir = path.resolve('screenshots/agency')
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })

const viewports = [
  { name: 'mobile-360', width: 360, height: 640 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-1024', width: 1024, height: 768 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'uhd-3840', width: 3840, height: 2160 },
]

async function runAudit() {
  console.log('🚀 Starting Comprehensive Agency Website QA Audit...')
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  })

  const page = await browser.newPage()

  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
      console.error('Console Error:', msg.text())
    }
  })
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message)
    console.error('Page Error:', err.message)
  })

  // 1. Check Scroll Budget at 1440x900
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 10000 })
  await new Promise((r) => setTimeout(r, 1500))

  const scrollMetrics = await page.evaluate(() => {
    const scrollHeight = document.documentElement.scrollHeight
    const innerHeight = window.innerHeight
    const ratio = scrollHeight / innerHeight
    return { scrollHeight, innerHeight, ratio }
  })

  console.log('\n📊 SCROLL BUDGET AUDIT (1440x900):')
  console.log(`   - Scroll Height: ${scrollMetrics.scrollHeight}px`)
  console.log(`   - Viewport Height: ${scrollMetrics.innerHeight}px`)
  console.log(`   - Ratio (Budget <= 6.5): ${scrollMetrics.ratio.toFixed(2)}x`)
  if (scrollMetrics.ratio <= 6.5) {
    console.log('   ✅ PASSED: Scroll budget is within hard rule (<= 6.5x)!')
  } else {
    console.error('   ❌ FAILED: Scroll budget exceeds 6.5x!')
  }

  // 2. Test All Viewports for Horizontal Overflow & Capture Screenshots
  console.log('\n📱 VIEWPORT & OVERFLOW AUDIT:')
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height })
    await new Promise((r) => setTimeout(r, 600))

    const overflow = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth
      const clientWidth = document.documentElement.clientWidth
      return scrollWidth > clientWidth
    })

    console.log(
      `   - ${vp.name} (${vp.width}x${vp.height}): Overflow: ${
        overflow ? '❌ DETECTED' : '✅ NONE'
      }`
    )

    // Capture screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, `${vp.name}-hero.png`),
    })
  }

  // 3. Test Interactive Services Explorer
  console.log('\n🛠 TESTING SERVICES EXPLORER:')
  await page.setViewport({ width: 1440, height: 900 })
  await page.evaluate(() => {
    document.getElementById('services')?.scrollIntoView()
  })
  await new Promise((r) => setTimeout(r, 1000))

  // Click Service Tab 2 (Paid Advertising)
  const serviceTab2 = await page.$('#service-tab-1')
  if (serviceTab2) {
    await serviceTab2.click()
    await new Promise((r) => setTimeout(r, 800))
    const activeText = await page.evaluate(() => {
      return document.querySelector('#service-panel-1 h3')?.textContent
    })
    console.log('   - Clicked Tab 02 (Paid Advertising). Detail promise:', activeText)
    await page.screenshot({ path: path.join(screenshotsDir, 'services-tab-paid.png') })
  }

  // Click "Get a quote for Paid Advertising" and check form pre-selection
  console.log('\n🎯 TESTING QUOTE TO CONTACT FLOW:')
  const quoteBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const qBtn = btns.find((b) => b.textContent && b.textContent.includes('Get a quote'))
    if (qBtn) {
      qBtn.click()
      return true
    }
    return false
  })

  await new Promise((r) => setTimeout(r, 1200))
  const selectedServiceValue = await page.evaluate(() => {
    const select = document.getElementById('contact-service')
    return select ? select.value : ''
  })
  console.log('   - Contact form pre-selected service:', selectedServiceValue)
  if (selectedServiceValue === 'Paid Advertising') {
    console.log('   ✅ PASSED: Quote button correctly pre-selected service in contact form!')
  }

  // 4. Test Work Modal Dialog
  console.log('\n🖼 TESTING SELECTED WORK MODAL DIALOG:')
  await page.evaluate(() => {
    document.getElementById('work')?.scrollIntoView()
  })
  await new Promise((r) => setTimeout(r, 800))

  const firstWorkCard = await page.$('#work article')
  if (firstWorkCard) {
    await firstWorkCard.click()
    await new Promise((r) => setTimeout(r, 800))
    const dialogOpen = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]')
      return dialog ? dialog.getAttribute('aria-labelledby') : null
    })
    console.log('   - Opened work modal. Dialog title label:', dialogOpen)
    await page.screenshot({ path: path.join(screenshotsDir, 'work-modal-open.png') })

    // Press Escape to close modal
    await page.keyboard.press('Escape')
    await new Promise((r) => setTimeout(r, 500))
    const dialogClosed = await page.evaluate(() => {
      return document.querySelector('[role="dialog"]') === null
    })
    console.log('   - Pressed Escape. Modal closed:', dialogClosed ? '✅ YES' : '❌ NO')
  }

  // 5. Test FAQ Accordion
  console.log('\n❓ TESTING FAQ ACCORDION:')
  await page.evaluate(() => {
    document.getElementById('faq')?.scrollIntoView()
  })
  await new Promise((r) => setTimeout(r, 600))
  const faqBtn2 = await page.$('#faq-btn-1')
  if (faqBtn2) {
    await faqBtn2.click()
    await new Promise((r) => setTimeout(r, 500))
    const isFaqExpanded = await page.evaluate(() => {
      return document.getElementById('faq-btn-1')?.getAttribute('aria-expanded')
    })
    console.log('   - Clicked FAQ 2. Aria expanded:', isFaqExpanded)
  }

  // Capture Full Page Screenshot
  console.log('\n📸 Capturing full-length desktop view...')
  await page.setViewport({ width: 1440, height: 900 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({
    path: path.join(screenshotsDir, 'full-page-1440.png'),
    fullPage: true,
  })

  await browser.close()

  console.log('\n🏁 AUDIT SUMMARY:')
  console.log(`   - Severe Console Errors: ${consoleErrors.length}`)
  if (consoleErrors.length === 0) {
    console.log('   ✅ 0 Console Errors!')
  }
}

runAudit().catch(console.error)
