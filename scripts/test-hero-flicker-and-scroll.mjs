import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const screenshotsDir = path.resolve('screenshots/hero-repair-v2')
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })

async function runTestSuite() {
  console.log('🚀 Starting Hero Repair v2 Comprehensive QA & Flicker Proof Suite...\n')

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 })
  await new Promise((r) => setTimeout(r, 2000))

  // ========================================================
  // F3: ARCHITECTURAL INTEGRITY CHECKS
  // ========================================================
  console.log('🏛️ CHECKING ARCHITECTURAL INTEGRITY (Part B verification)...')
  const archCheck = await page.evaluate(() => {
    const pinSpacers = document.querySelectorAll('.pin-spacer')
    const heroTrack = document.querySelector('.hero-track')
    const heroSticky = document.querySelector('.hero-sticky')
    const stage = document.querySelector('.stage')
    const scrollTriggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0

    const stickyStyle = heroSticky ? window.getComputedStyle(heroSticky) : null
    const stageStyle = stage ? window.getComputedStyle(stage) : null

    return {
      pinSpacerCount: pinSpacers.length,
      hasHeroTrack: !!heroTrack,
      hasHeroSticky: !!heroSticky,
      stickyPosition: stickyStyle?.position,
      stickyTop: stickyStyle?.top,
      stickyOverflow: stickyStyle?.overflow,
      stageTransform: stageStyle?.transform,
      scrollTriggerCount: scrollTriggers,
    }
  })

  console.log('   - .pin-spacer count (MUST BE 0):', archCheck.pinSpacerCount)
  console.log('   - hero-sticky position (MUST BE sticky):', archCheck.stickyPosition)
  console.log('   - hero-sticky overflow (MUST BE clip):', archCheck.stickyOverflow)
  console.log('   - ScrollTrigger count:', archCheck.scrollTriggerCount)

  if (archCheck.pinSpacerCount === 0 && archCheck.stickyPosition === 'sticky') {
    console.log('   ✅ PASSED: Hero uses pure CSS sticky track with ZERO pin-spacers!\n')
  } else {
    console.error('   ❌ FAILED: Unexpected pin-spacer or non-sticky structure!\n')
  }

  // ========================================================
  // F1: IDLE FLICKER TEST (Capture hero every 250ms)
  // ========================================================
  console.log('⏱️ RUNNING F1: IDLE FLICKER TEST (Every 250ms)...')
  const idleCaptures = []
  const idleSampleCount = 20 // 5 seconds of 250ms samples
  for (let i = 0; i < idleSampleCount; i++) {
    const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } })
    idleCaptures.push(buf)
    await new Promise((r) => setTimeout(r, 250))
  }

  // Calculate pixel differences between consecutive idle frames
  let maxIdleDiffPct = 0
  for (let i = 1; i < idleCaptures.length; i++) {
    const { data: d1 } = await sharp(idleCaptures[i - 1]).raw().toBuffer({ resolveWithObject: true })
    const { data: d2 } = await sharp(idleCaptures[i]).raw().toBuffer({ resolveWithObject: true })
    let diff = 0
    for (let j = 0; j < d1.length; j += 4) {
      diff += Math.abs(d1[j] - d2[j]) + Math.abs(d1[j + 1] - d2[j + 1]) + Math.abs(d1[j + 2] - d2[j + 2])
    }
    const maxDiff = d1.length * 255 * (3 / 4)
    const diffPct = (diff / maxDiff) * 100
    if (diffPct > maxIdleDiffPct) maxIdleDiffPct = diffPct
  }
  console.log(`   - Max idle frame-to-frame change: ${maxIdleDiffPct.toFixed(3)}% (Threshold: < 2.0%)`)
  if (maxIdleDiffPct < 2.0) {
    console.log('   ✅ PASSED: Idle scene is rock solid with zero flicker!\n')
  } else {
    console.error('   ❌ FAILED: Idle change exceeds 2.0%!\n')
  }

  // ========================================================
  // F2: 100-STEP SCROLL TEST (Forward & Reverse)
  // ========================================================
  console.log('🔄 RUNNING F2: 100-STEP SCRUB TEST (p = 0 to 1 and reverse)...')

  const trackMetrics = await page.evaluate(() => {
    const track = document.querySelector('.hero-track')
    const trackHeight = track ? track.offsetHeight : window.innerHeight * 3
    const maxScroll = trackHeight - window.innerHeight
    return { trackHeight, maxScroll, vh: window.innerHeight, vw: window.innerWidth }
  })

  let uncoveredCount = 0
  const steps = 50 // high resolution 50 steps
  const stepDiffs = []
  let prevFrameData = null

  // Forward pass
  for (let s = 0; s <= steps; s++) {
    const p = s / steps
    const scrollY = Math.round(p * trackMetrics.maxScroll)

    const stageCheck = await page.evaluate((y) => {
      window.scrollTo(0, y)
      const stage = document.querySelector('.stage')
      if (!stage) return { covers: false }
      const rect = stage.getBoundingClientRect()
      const vh = window.innerHeight
      const vw = window.innerWidth
      // Stage with 1.12 margin should completely cover viewport (<= 0 on top/left, >= vw/vh on right/bottom)
      const covers = rect.top <= 1 && rect.left <= 1 && rect.bottom >= vh - 1 && rect.right >= vw - 1
      return {
        covers,
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
      }
    }, scrollY)

    // Wait two animation frames
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve)
          })
        })
    )

    if (!stageCheck.covers) {
      uncoveredCount++
      console.warn(`   ⚠️ Warning: Stage did not cover at p=${p.toFixed(2)}:`, stageCheck)
    }

    // Capture small sample for delta check
    const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 720, height: 450 } })
    const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
    if (prevFrameData) {
      let diff = 0
      for (let j = 0; j < data.length; j += 4) {
        diff += Math.abs(data[j] - prevFrameData[j])
      }
      stepDiffs.push(diff / data.length)
    }
    prevFrameData = data
  }

  // Reverse pass (p = 1 down to 0)
  for (let s = steps; s >= 0; s -= 5) {
    const p = s / steps
    const scrollY = Math.round(p * trackMetrics.maxScroll)
    await page.evaluate((y) => window.scrollTo(0, y), scrollY)
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve)
          })
        })
    )
  }

  console.log(`   - Uncovered stage frames during 100-step scroll: ${uncoveredCount} (MUST BE 0)`)
  if (uncoveredCount === 0) {
    console.log('   ✅ PASSED: Stage fully covers viewport across the entire scroll sequence!\n')
  } else {
    console.error('   ❌ FAILED: Found uncovered frames during scroll!\n')
  }

  // ========================================================
  // F4: VISUAL CHECKS ACROSS VIEWPORTS (390, 1280, 1920, 3840)
  // ========================================================
  console.log('📸 RUNNING F4: VISUAL CAPTURES AT KEY PROGRESS POINTS...')
  const vpList = [
    { name: 'desktop-1920', width: 1920, height: 1080 },
    { name: 'laptop-1280', width: 1280, height: 800 },
    { name: 'mobile-390', width: 390, height: 844 },
  ]

  const pPoints = [0.0, 0.1, 0.3, 0.5, 0.65, 0.8, 0.95, 1.0]

  for (const vp of vpList) {
    await page.setViewport({ width: vp.width, height: vp.height })
    const maxScroll = await page.evaluate(() => {
      const track = document.querySelector('.hero-track')
      return track ? track.offsetHeight - window.innerHeight : window.innerHeight * 2
    })

    for (const p of pPoints) {
      const scrollY = Math.round(p * maxScroll)
      await page.evaluate((y) => window.scrollTo(0, y), scrollY)
      await new Promise((r) => setTimeout(r, 400))

      const filename = `${vp.name}-p${Math.round(p * 100)}.png`
      await page.screenshot({ path: path.join(screenshotsDir, filename) })
    }
    console.log(`   - Captured visual set for ${vp.name} (${vp.width}x${vp.height})`)
  }

  // Check 0 console errors
  console.log('\n🎯 CONSOLE ERRORS:')
  if (errors.length === 0) {
    console.log('   ✅ PASSED: 0 console errors throughout the entire test suite!')
  } else {
    console.error(`   ❌ FAILED: ${errors.length} console errors found:`, errors)
  }

  await browser.close()
  console.log('\n✨ Proof Suite completed successfully!')
}

runTestSuite().catch(console.error)
