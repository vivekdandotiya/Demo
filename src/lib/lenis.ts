import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenisInstance: Lenis | null = null

export function initLenis(): Lenis | null {
  if (typeof window === 'undefined') return null

  // If reduced motion is requested, do not initialize smooth scroll
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return null

  if (lenisInstance) return lenisInstance

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  })

  lenisInstance = lenis

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function stopLenis() {
  lenisInstance?.stop()
}

export function startLenis() {
  lenisInstance?.start()
}

export function scrollToTarget(target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.4,
    })
  } else {
    if (typeof target === 'string') {
      const el = document.querySelector(target)
      el?.scrollIntoView({ behavior: 'smooth' })
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' })
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
