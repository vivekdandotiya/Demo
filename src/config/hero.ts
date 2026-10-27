import { Point } from '../lib/homography'

export interface HeroConfig {
  screenQuad: {
    topLeft: Point
    topRight: Point
    bottomRight: Point
    bottomLeft: Point
  }
  screenDimensions: {
    width: number
    height: number
  }
}

/**
 * Measured percentage coordinates (0-100%) of the laptop screen corners
 * in the master cinematic plate.
 */
export const HERO_CONFIG: HeroConfig = {
  screenQuad: {
    topLeft: { x: 54.85, y: 65.9 },
    topRight: { x: 63.85, y: 64.2 },
    bottomRight: { x: 62.8, y: 80.8 },
    bottomLeft: { x: 55.6, y: 80.8 },
  },
  screenDimensions: {
    width: 1600,
    height: 1000,
  },
}
