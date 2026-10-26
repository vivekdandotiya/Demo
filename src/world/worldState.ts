export interface Point2D {
  x: number
  y: number
  set?: (x: number, y: number) => void
}

export interface WorldState {
  time: number
  live: number // 0 (dull) to 1 (live)
  cursor: Point2D
  targetCursor: Point2D
  cursorVelocity: number
  scrollVelocity: number
  scrollProgress: number
  section: number
  toneInvert: number // 0 = dark ink, 1 = bone white approach corridor
  lensRadius: number
  lensIntensity: number
  shockwaveCenter: Point2D
  shockwaveProgress: number // 0 to 1
  reducedMotion: boolean
  isHoveringWork: boolean
  hoveredWorkIndex: number
  morphState: number
  scanX: number
}

function createPoint(x: number, y: number): Point2D {
  return {
    x,
    y,
    set(newX: number, newY: number) {
      this.x = newX
      this.y = newY
    },
  }
}

export const worldState: WorldState = {
  time: 0,
  live: 0.0,
  cursor: createPoint(0.68, 0.42),
  targetCursor: createPoint(0.68, 0.42),
  cursorVelocity: 0,
  scrollVelocity: 0,
  scrollProgress: 0,
  section: 0,
  toneInvert: 0.0,
  lensRadius: 0.22,
  lensIntensity: 1.0,
  shockwaveCenter: createPoint(0.5, 0.5),
  shockwaveProgress: 0.0,
  reducedMotion: false,
  isHoveringWork: false,
  hoveredWorkIndex: -1,
  morphState: 0.0,
  scanX: -1.0,
}

export function triggerShockwave(xNormalized: number, yNormalized: number) {
  worldState.shockwaveCenter.x = xNormalized
  worldState.shockwaveCenter.y = yNormalized
  worldState.shockwaveProgress = 0.001
}
