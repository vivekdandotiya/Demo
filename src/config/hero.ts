export interface HeroConfig {
  screenCenter: {
    x: number
    y: number
  }
}

/**
 * Screen center percentage coordinates of the laptop screen
 * used as the unified transform-origin for all camera zoom and bloom layers.
 */
export const HERO_CONFIG: HeroConfig = {
  screenCenter: {
    x: 59.4,
    y: 72.8,
  },
}
