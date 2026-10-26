import React, { useRef, useEffect } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const CAPABILITIES = [
  'SEO',
  'Paid media',
  'Social media',
  'Content',
  'Branding',
  'Conversion',
]

export const Marquee: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return

    const track = trackRef.current
    if (!track) return

    const tween = gsap.to(track, {
      xPercent: -50,
      repeat: -1,
      duration: 22,
      ease: 'none',
    })

    tweenRef.current = tween

    return () => {
      tween.kill()
    }
  }, [prefersReduced])

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0.2, duration: 0.4 })
    }
  }

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6 })
    }
  }

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-4 sm:py-5 bg-[#C8F53C] text-[#0C0D0F] overflow-hidden select-none z-30"
      aria-label="Core Capabilities"
    >
      {prefersReduced ? (
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-x-8 gap-y-2 font-display font-bold text-xl sm:text-2xl uppercase tracking-tight">
          {CAPABILITIES.map((cap, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>{cap}</span>
              {i < CAPABILITIES.length - 1 && <span className="opacity-40">/</span>}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex w-max will-change-transform" ref={trackRef}>
          {/* Repeat sequence 4 times for seamless infinite ribbon */}
          {[0, 1, 2, 3].map((setIdx) => (
            <div key={setIdx} className="flex items-center shrink-0 pr-8">
              {CAPABILITIES.map((cap, i) => (
                <span
                  key={`${setIdx}-${i}`}
                  className="flex items-center font-display font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight uppercase"
                >
                  <span className="px-6">{cap}</span>
                  <span className="opacity-35 select-none font-normal">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
