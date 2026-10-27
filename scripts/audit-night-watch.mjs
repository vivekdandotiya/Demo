import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const screenshotsDir = path.resolve('screenshots/night-watch')
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
]

async function runAudit() {
  console.log('🚀 Starting Comprehensive Night Watch Hero & Site QA Audit...')
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
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 })
  await new Promise((r) => setTimeout(r, 2000))

  const scrollMetrics = await page.evaluate(() => {
    const scrollHeight = document.documentElement.scrollHeight
    const innerHeight = window.innerHeight
    const ratio = scrollHeight / innerHeight
    return { scrollHeight, innerHeight, ratio }
  })

  console.log('\n📊 SCROLL BUDGET AUDIT (1440x900):')
  console.log(`   - Scroll Height: ${scrollMetrics.scrollHeight}px`)
  console.log(`   - Viewport Height: ${scrollMetrics.innerHeight}px`)
  console.log(`   - Ratio (Budget <= 7.5x): ${scrollMetrics.ratio.toFixed(2)}x`)
  if (scrollMetrics.ratio <= 7.5) {
    console.log('   ✅ PASSED: Scroll budget is within hard rule (<= 7.5x)!')
  } else {
    console.error('   ❌ FAILED: Scroll budget exceeds 7.5x!')
  }

  // 2. Check Bugs Fixes:
  console.log('\n🔍 VERIFYING BUG FIXES:')

  // Bug 1: "Book a call" button duplicate text roll
  const buttonCheck = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('a, button')).filter((el) =>
      el.textContent?.includes('Book a')
    )
    if (btns.length === 0) return { found: false }
    const btn = btns[0]
    const overflowHidden = window.getComputedStyle(btn.querySelector('span') || btn).overflow
    return { found: true, overflowHidden }
  })
  console.log('   - Button text roll overflow protection:', buttonCheck)

  // Bug 2: H1 wrapping and fold clearance at 1920x1080
  await page.setViewport({ width: 1920, height: 1080 })
  await new Promise((r) => setTimeout(r, 600))
  const foldCheck = await page.evaluate(() => {
    const h1 = document.querySelector('h1')
    const ctas = document.querySelector('a[href*="cal.com"], a[href*="calendly"]')
    const vh = window.innerHeight
    if (!h1 || !ctas) return { valid: false }
    const h1Rect = h1.getBoundingClientRect()
    const ctasRect = ctas.getBoundingClientRect()
    return {
      valid: true,
      h1Bottom: Math.round(h1Rect.bottom),
      ctasBottom: Math.round(ctasRect.bottom),
      viewportHeight: vh,
      ctaAboveFold: ctasRect.bottom < vh,
    }
  })
  console.log('   - 1920x1080 Fold Clearance:', foldCheck)

  // Bug 3: Nav active section at top
  const navCheck = await page.evaluate(() => {
    window.scrollTo(0, 0)
    const activeLink = document.querySelector('nav a.text-\\[\\#C8F53C\\], nav button.text-\\[\\#C8F53C\\]')
    return { hasActiveAtTop: !!activeLink, text: activeLink?.textContent }
  })
  console.log('   - Nav active state at top of page (should be false):', navCheck)

  // 3. Test Viewports & Capture Hero Initial Frames
  console.log('\n📱 RESPONSIVE VIEWPORT HERO AUDIT:')
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height })
    await page.evaluate(() => window.scrollTo(0, 0))
    await new Promise((r) => setTimeout(r, 800))

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })

    console.log(
      `   - ${vp.name} (${vp.width}x${vp.height}): Overflow: ${
        overflow ? '❌ DETECTED' : '✅ NONE'
      }`
    )

    await page.screenshot({
      path: path.join(screenshotsDir, `${vp.name}-hero-top.png`),
    })
  }

  // 4. Scrub Sequence at 1440x900 (p = 0.0, 0.25, 0.55, 0.75, 0.88, 1.0)
  console.log('\n🎬 SCRUB SEQUENCE AUDIT (1440x900):')
  await page.setViewport({ width: 1440, height: 900 })
  const pinMax = 900 * 2.0 // +=200% pin distance is ~1800px

  const scrubSteps = [
    { label: 'p0-initial', scrollY: 0 },
    { label: 'p25-pushin', scrollY: Math.round(pinMax * 0.25) },
    { label: 'p55-camera-accelerate', scrollY: Math.round(pinMax * 0.55) },
    { label: 'p75-homography-flatten', scrollY: Math.round(pinMax * 0.75) },
    { label: 'p88-screen-fullbleed', scrollY: Math.round(pinMax * 0.88) },
    { label: 'p100-marquee-handoff', scrollY: Math.round(pinMax * 1.05) },
  ]

  for (const step of scrubSteps) {
    await page.evaluate((y) => window.scrollTo(0, y), step.scrollY)
    await new Promise((r) => setTimeout(r, 600))
    await page.screenshot({
      path: path.join(screenshotsDir, `scrub-${step.label}.png`),
    })
    console.log(`   - Captured scrub frame: ${step.label} at scrollY: ${step.scrollY}px`)
  }

  // 5. Scroll down to Services and Work sections to verify image reveal & paper stack
  console.log('\n📄 SECTION TRANSITIONS & WORK AUDIT:')
  await page.evaluate(() => {
    document.getElementById('services')?.scrollIntoView()
  })
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({
    path: path.join(screenshotsDir, 'section-services.png'),
  })

  await page.evaluate(() => {
    document.getElementById('work')?.scrollIntoView()
  })
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({
    path: path.join(screenshotsDir, 'section-work.png'),
  })

  await page.evaluate(() => {
    document.getElementById('contact')?.scrollIntoView()
  })
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({
    path: path.join(screenshotsDir, 'section-contact.png'),
  })

  console.log('\n🎯 CONSOLE ERRORS AUDIT:')
  if (consoleErrors.length === 0) {
    console.log('   ✅ PASSED: 0 console errors detected throughout the entire run!')
  } else {
    console.error(`   ❌ FAILED: ${consoleErrors.length} console errors found:`, consoleErrors)
  }

  await browser.close()
  console.log('\n✨ Audit completed successfully!')
}

runAudit().catch(console.error)
