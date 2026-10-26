import { useState, useEffect } from 'react'

export type PerformanceTier = 1 | 2 | 3

export function useTier(): { tier: PerformanceTier; dpr: number; fps: number } {
  const [tier, setTier] = useState<PerformanceTier>(() => {
    if (typeof window === 'undefined') return 2
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 3

    // Check basic WebGL support
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) return 3
    } catch {
      return 3
    }

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const hardwareConcurrency = navigator.hardwareConcurrency || 4

    if (isMobile) {
      return hardwareConcurrency >= 6 ? 2 : 3
    }

    return hardwareConcurrency >= 4 ? 1 : 2
  })

  const [dpr, setDpr] = useState<number>(() => {
    if (typeof window === 'undefined') return 1
    const rawDpr = window.devicePixelRatio || 1
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    if (isMobile) return Math.min(rawDpr, 1.0)
    return Math.min(rawDpr, 1.5)
  })

  const [fps, setFps] = useState<number>(60)

  useEffect(() => {
    if (tier === 3) return

    let frameCount = 0
    let lastTime = performance.now()
    let lowFpsCount = 0
    let animId: number

    const probe = (now: number) => {
      frameCount++
      if (now - lastTime >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / (now - lastTime))
        setFps(currentFps)
        frameCount = 0
        lastTime = now

        if (currentFps < 28) {
          lowFpsCount++
          if (lowFpsCount >= 3) {
            // Downgrade tier gracefully if FPS drops consistently
            setTier((prev) => (prev === 1 ? 2 : 3))
            setDpr((prev) => Math.max(0.75, prev * 0.75))
            lowFpsCount = 0
          }
        } else {
          lowFpsCount = Math.max(0, lowFpsCount - 1)
        }
      }
      animId = requestAnimationFrame(probe)
    }

    animId = requestAnimationFrame(probe)
    return () => cancelAnimationFrame(animId)
  }, [tier])

  return { tier, dpr, fps }
}
