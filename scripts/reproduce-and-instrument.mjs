import puppeteer from 'puppeteer-core'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function instrument() {
  console.log('🔬 Reproducing and instrumenting current hero at http://127.0.0.1:5173/ ...')
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

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, 2000))

  // Inject animation frame logger
  const logResult = await page.evaluate(async () => {
    const logs = []
    let frameCount = 0
    let uncoveredFrames = 0
    const startTime = performance.now()

    return new Promise((resolve) => {
      function checkFrame(now) {
        frameCount++
        const scrollY = window.scrollY
        const stage = document.querySelector('.origin-center') || document.querySelector('section > div')
        const stageRect = stage ? stage.getBoundingClientRect() : null
        const pinSpacers = document.querySelectorAll('.pin-spacer').length
        const vh = window.innerHeight
        const vw = window.innerWidth

        // Check if stage covers viewport
        let covers = true
        if (stageRect) {
          if (stageRect.top > 0 || stageRect.left > 0 || stageRect.bottom < vh || stageRect.right < vw) {
            covers = false
            uncoveredFrames++
          }
        }

        if (!covers || frameCount % 60 === 0) {
          logs.push({
            frame: frameCount,
            timeMs: Math.round(now - startTime),
            scrollY,
            pinSpacers,
            stageRect: stageRect
              ? {
                  top: Math.round(stageRect.top),
                  left: Math.round(stageRect.left),
                  bottom: Math.round(stageRect.bottom),
                  right: Math.round(stageRect.right),
                  width: Math.round(stageRect.width),
                  height: Math.round(stageRect.height),
                }
              : null,
            coversViewport: covers,
          })
        }

        if (now - startTime < 6000) {
          // sample for 6 seconds in node script
          requestAnimationFrame(checkFrame)
        } else {
          resolve({ logs, frameCount, uncoveredFrames })
        }
      }
      requestAnimationFrame(checkFrame)
    })
  })

  console.log('Frames captured:', logResult.frameCount)
  console.log('Uncovered frames detected:', logResult.uncoveredFrames)
  console.log('Sample logs (first 5 and last 5):')
  console.log(logResult.logs.slice(0, 5))
  if (logResult.logs.length > 5) {
    console.log(logResult.logs.slice(-5))
  }

  // Check pin-spacer and scroll-trigger count
  const metrics = await page.evaluate(() => {
    const pinSpacers = document.querySelectorAll('.pin-spacer')
    const htmlOverflow = window.getComputedStyle(document.documentElement).overflowX
    const bodyOverflow = window.getComputedStyle(document.body).overflowX
    const heroSection = document.querySelector('section')
    return {
      pinSpacersCount: pinSpacers.length,
      pinSpacerHeight: pinSpacers[0] ? pinSpacers[0].style.height : 'none',
      pinSpacerPaddingBottom: pinSpacers[0] ? pinSpacers[0].style.paddingBottom : 'none',
      htmlOverflow,
      bodyOverflow,
      heroSectionHeight: heroSection ? heroSection.offsetHeight : 0,
      heroSectionNextSibling: heroSection?.nextElementSibling?.tagName,
      heroNextSiblingMarginTop: heroSection?.nextElementSibling
        ? window.getComputedStyle(heroSection.nextElementSibling).marginTop
        : 'none',
    }
  })

  console.log('DOM & GSAP Structure Inspection:', metrics)

  await browser.close()
}

instrument().catch(console.error)
