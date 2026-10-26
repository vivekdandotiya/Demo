import React, { useRef, useEffect } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { worldState } from '../../world/worldState'

export const Strip: React.FC = () => {
  const prefersReduced = useReducedMotion()
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  const capabilities = [
    'Search & SEO',
    'Paid Media',
    'Social Systems',
    'Content Strategy',
    'Brand Growth',
    'Conversion CRO',
    'Interactive WebGL',
    'Performance Creative',
  ]

  useEffect(() => {
    if (prefersReduced) return

    let xPos1 = 0
    let xPos2 = 0
    let isHovered = false

    const r1 = row1Ref.current
    const r2 = row2Ref.current
    if (!r1 || !r2) return

    const handleMouseEnter = () => { isHovered = true }
    const handleMouseLeave = () => { isHovered = false }

    r1.addEventListener('mouseenter', handleMouseEnter)
    r1.addEventListener('mouseleave', handleMouseLeave)
    r2.addEventListener('mouseenter', handleMouseEnter)
    r2.addEventListener('mouseleave', handleMouseLeave)

    const ticker = gsap.ticker.add(() => {
      if (isHovered) return

      // Speed is boosted proportionally by scroll velocity
      const velocityBoost = Math.min(Math.abs(worldState.scrollVelocity) * 0.08, 15)
      const baseSpeed1 = 1.2 + velocityBoost
      const baseSpeed2 = 1.0 + velocityBoost

      xPos1 -= baseSpeed1
      xPos2 += baseSpeed2

      // Wrap around seamlessly
      if (xPos1 <= -1000) xPos1 = 0
      if (xPos2 >= 0) xPos2 = -1000

      r1.style.transform = `translate3d(${xPos1}px, 0, 0)`
      r2.style.transform = `translate3d(${xPos2}px, 0, 0)`
    })

    return () => {
      gsap.ticker.remove(ticker)
      r1.removeEventListener('mouseenter', handleMouseEnter)
      r1.removeEventListener('mouseleave', handleMouseLeave)
      r2.removeEventListener('mouseenter', handleMouseEnter)
      r2.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [prefersReduced])

  if (prefersReduced) {
    return (
      <section className="py-16 hairline-b hairline-t bg-[#08080A]/90 px-6" aria-label="Core Capabilities">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6">
          {capabilities.map((item, idx) => (
            <span key={idx} className="font-display italic text-2xl text-[#9C978E]">
              {item} {idx < capabilities.length - 1 && '•'}
            </span>
          ))}
        </div>
      </section>
    )
  }

  const itemsDoubled = [...capabilities, ...capabilities, ...capabilities, ...capabilities]

  return (
    <section 
      className="py-12 md:py-20 hairline-b hairline-t bg-[#08080A]/70 overflow-hidden relative select-none"
      aria-label="Capabilities Marquee"
    >
      {/* Subtle indicator bar */}
      <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-[#9C978E]">
        <span>CAPABILITIES MATRIX</span>
        <span>VELOCITY DRIVEN</span>
      </div>

      {/* Row 1: Leftward Marquee */}
      <div className="relative overflow-hidden w-full whitespace-nowrap mb-3 md:mb-6">
        <div ref={row1Ref} className="inline-flex gap-8 md:gap-14 will-change-transform">
          {itemsDoubled.map((item, idx) => (
            <span
              key={`r1-${idx}`}
              className="font-display italic text-3xl md:text-6xl text-[#F1ECE2]/85 hover:text-[#FF3B1F] transition-colors duration-200 cursor-default flex items-center gap-8 md:gap-14"
            >
              <span>{item}</span>
              <span className="text-[#FF3B1F] text-xl md:text-3xl font-normal not-italic opacity-70">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Row 2: Rightward Marquee */}
      <div className="relative overflow-hidden w-full whitespace-nowrap">
        <div ref={row2Ref} className="inline-flex gap-8 md:gap-14 will-change-transform">
          {itemsDoubled.map((item, idx) => (
            <span
              key={`r2-${idx}`}
              className="font-display italic text-3xl md:text-6xl text-[#9C978E]/60 hover:text-[#FF9E2C] transition-colors duration-200 cursor-default flex items-center gap-8 md:gap-14"
            >
              <span>{item}</span>
              <span className="text-[#FF9E2C] text-xl md:text-3xl font-normal not-italic opacity-70">
                ❋
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
