import React, { useEffect, useRef } from 'react'
import { PROCESS_STEPS, COMMITMENTS } from '../../content/process'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export const Process: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const hairlinesRef = useRef<(HTMLDivElement | null)[]>([])
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return

    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      // Draw in hairlines above columns on enter (scaleX 0 to 1, stagger 0.12s)
      hairlinesRef.current.forEach((line, idx) => {
        if (!line) return
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 85%',
              once: true,
            },
            delay: idx * 0.12,
          }
        )
      })
    }, container)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      id="process"
      ref={containerRef}
      className="relative w-full py-14 md:py-16 bg-[#0C0D0F] text-[#F3F0E8] z-20"
      aria-labelledby="process-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="mb-8 md:mb-10">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-[#C8F53C] block mb-2">
            Disciplined Execution
          </span>
          <h2
            id="process-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#F3F0E8] tracking-tight"
          >
            How we partner with you.
          </h2>
        </div>

        {/* 4 Process Columns in one row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-8 md:mb-10">
          {PROCESS_STEPS.map((step, idx) => (
            <div key={step.number} className="flex flex-col relative pt-5">
              {/* Hairline above each column that draws in */}
              <div
                ref={(el) => {
                  hairlinesRef.current[idx] = el
                }}
                className="absolute top-0 left-0 right-0 h-[1px] bg-white/20 will-change-transform"
                aria-hidden="true"
              />

              {/* Big lime numeral */}
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#C8F53C] mb-3">
                {step.number}
              </span>

              {/* Step Title */}
              <h3 className="font-display font-bold text-xl text-[#F3F0E8] mb-1.5">
                {step.title}
              </h3>

              {/* Two lines of clear text */}
              <p className="font-body text-sm text-[#A9A69E] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Row of Three Commitments separated by hairlines */}
        <div className="border-t border-b border-white/12 py-5 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/12">
          {COMMITMENTS.map((commitment, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 py-4 md:py-2 ${
                idx === 0 ? 'md:pr-8' : idx === 1 ? 'md:px-8' : 'md:pl-8'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full bg-[#C8F53C] flex-shrink-0"
                aria-hidden="true"
              />
              <p className="font-body text-sm sm:text-base font-medium text-[#F3F0E8]/90">
                {commitment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
