import React, { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface KineticDividerProps {
  word: string
  subline?: string
}

export const KineticDivider: React.FC<KineticDividerProps> = ({ word, subline }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress
          const scale = 0.85 + p * 0.35
          const skewX = (p - 0.5) * -14
          const xOffset = (p - 0.5) * -120

          gsap.set(text, {
            scale,
            skewX,
            x: xOffset,
            transformPerspective: 800,
          })
        },
      })
    })

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <div
      ref={containerRef}
      className="w-full py-16 md:py-28 overflow-hidden hairline-b hairline-t bg-[#08080A]/60 flex flex-col items-center justify-center select-none"
      aria-hidden="true"
    >
      <h2
        ref={textRef}
        className="font-display uppercase text-[12vw] md:text-[14vw] leading-none tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-[rgba(241,236,226,0.1)] via-[rgba(255,59,31,0.35)] to-[rgba(241,236,226,0.1)] whitespace-nowrap will-change-transform"
      >
        {word}
      </h2>
      {subline && (
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#9C978E] mt-2">
          {subline}
        </p>
      )}
    </div>
  )
}
