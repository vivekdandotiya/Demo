import { solveHomography, getMatrix3d, interpolateQuad } from '../src/lib/homography.ts'

const w = 1920
const h = 1080
const src = [
  { x: 0, y: 0 },
  { x: 1600, y: 0 },
  { x: 1600, y: 1000 },
  { x: 0, y: 1000 },
]
const dst = [
  { x: 0.5485 * w, y: 0.6590 * h },
  { x: 0.6385 * w, y: 0.6420 * h },
  { x: 0.6280 * w, y: 0.8080 * h },
  { x: 0.5560 * w, y: 0.8080 * h },
]

const hom = solveHomography(src, dst)
console.log('Homography:', hom)
console.log('matrix3d:', getMatrix3d(hom))

// Verify back-mapping
for (const p of src) {
  const denom = hom.h20 * p.x + hom.h21 * p.y + 1
  const x = (hom.h00 * p.x + hom.h01 * p.y + hom.h02) / denom
  const y = (hom.h10 * p.x + hom.h11 * p.y + hom.h12) / denom
  console.log(`Src (${p.x}, ${p.y}) -> Dst (${x.toFixed(2)}, ${y.toFixed(2)})`)
}
