import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const greenInput = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\5aac943b-d610-418f-99fe-4d6449177283\\night_watch_figure_greenscreen_1793091446082.jpg'
const outputPng = path.resolve('src/assets/photos/night-watch-figure.png')
const outputWebp = path.resolve('src/assets/photos/night-watch-figure.webp')

async function keyFigure() {
  console.log('Keying chroma green background...')
  const { data, info } = await sharp(greenInput)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info // channels = 4 (RGBA)
  const pixelCount = width * height

  for (let i = 0; i < pixelCount; i++) {
    const idx = i * channels
    const r = data[idx]
    const g = data[idx + 1]
    const b = data[idx + 2]

    // Chroma green detection
    // Solid green: g > 110, and significantly greater than r and b
    const isGreen = g > 110 && g > r * 1.35 && g > b * 1.35
    const isSoftGreen = g > 90 && g > r * 1.15 && g > b * 1.15

    if (isGreen) {
      data[idx + 3] = 0 // completely transparent
    } else if (isSoftGreen) {
      // Soft transition / feather
      const diff = g - Math.max(r, b)
      const alpha = Math.max(0, Math.min(255, 255 - diff * 3))
      data[idx + 3] = alpha
      // Despill green fringe
      data[idx + 1] = Math.min(g, Math.max(r, b))
    } else {
      // Despill any lingering green fringe on dark edges
      if (g > Math.max(r, b) * 1.1) {
        data[idx + 1] = Math.round(Math.max(r, b) * 0.95)
      }
    }
  }

  // Save keyed PNG
  await sharp(data, { raw: { width, height, channels } })
    .png({ quality: 90 })
    .toFile(outputPng)

  // Save keyed WebP
  await sharp(data, { raw: { width, height, channels } })
    .webp({ quality: 85, alphaQuality: 90 })
    .toFile(outputWebp)

  console.log('Saved keyed figure to:', outputPng, outputWebp)
}

keyFigure().catch(console.error)
