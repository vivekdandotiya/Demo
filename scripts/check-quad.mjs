import sharp from 'sharp'

const W = 1376
const H = 768

// Precise screen glass corners
const tl = { x: (54.85 * W) / 100, y: (65.90 * H) / 100 }
const tr = { x: (63.85 * W) / 100, y: (64.20 * H) / 100 }
const br = { x: (62.80 * W) / 100, y: (80.80 * H) / 100 }
const bl = { x: (55.60 * W) / 100, y: (80.80 * H) / 100 }

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}" fill="rgba(200, 245, 60, 0.4)" stroke="#C8F53C" stroke-width="2"/>
  <circle cx="${tl.x}" cy="${tl.y}" r="4" fill="red" />
  <circle cx="${tr.x}" cy="${tr.y}" r="4" fill="blue" />
  <circle cx="${br.x}" cy="${br.y}" r="4" fill="green" />
  <circle cx="${bl.x}" cy="${bl.y}" r="4" fill="yellow" />
</svg>
`

async function run() {
  await sharp('src/assets/photos/night-watch-master.jpg')
    .composite([{ input: Buffer.from(svg) }])
    .toFile('scripts/quad-check.jpg')

  await sharp('scripts/quad-check.jpg')
    .extract({
      left: Math.round(W * 0.5),
      top: Math.round(H * 0.55),
      width: Math.round(W * 0.2),
      height: Math.round(H * 0.35),
    })
    .toFile('scripts/quad-check-crop.jpg')
}

run().catch(console.error)
