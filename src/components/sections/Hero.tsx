import React, { useEffect, useRef } from 'react'
import { HERO_CONTENT } from '../../content/hero'
import { SITE_CONFIG } from '../../config/site'
import { CampaignWall } from '../hero/CampaignWall'
import { Button } from '../ui/Button'
import { scrollToTarget } from '../../lib/lenis'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const highlightBarRef = useRef<HTMLSpanElement>(null)
  const highlightTextRef = useRef<HTMLSpanElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const ctaGroupRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const wallWrapperRef = useRef<HTMLDivElement>(null)

  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return

    const container = containerRef.current
    const line1 = line1Ref.current
    const line2 = line2Ref.current
    const bar = highlightBarRef.current
    const highlightText = highlightTextRef.current
    const eyebrow = eyebrowRef.current
    const subtext = subtextRef.current
    const ctas = ctaGroupRef.current
    const caption = captionRef.current
    const wallWrapper = wallWrapperRef.current

    if (!container || !line1 || !line2 || !bar || !highlightText) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          gsap.set([line1, line2], { clearProps: 'transform' })
        },
      })

      // 1. Wall reveal: clip-path wipe from bottom + settle from translateY 40px
      if (wallWrapper) {
        tl.fromTo(
          wallWrapper,
          { clipPath: 'inset(100% 0% 0% 0%)', y: 40, opacity: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power4.out',
          },
          0
        )
      }

      // 2. Eyebrow fade in
      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          0.2
        )
      }

      // 3. H1 lines rise out of overflow-hidden masks (stagger 0.12s, 1s, power4.out)
      tl.fromTo(
        [line1, line2],
        { yPercent: 110 },
        { yPercent: 0, duration: 1.0, stagger: 0.12, ease: 'power4.out' },
        0.3
      )

      // 4. Lime highlighter bar draws behind "scroll past" (scaleX 0 to 1, 0.7s)
      tl.fromTo(
        bar,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: 'power3.out', transformOrigin: 'left center' },
        0.85
      )

      // Highlight text turns ink
      tl.to(
        highlightText,
        { color: '#0C0D0F', duration: 0.35, ease: 'power2.out' },
        0.95
      )

      // 5. Subtext fades up
      if (subtext) {
        tl.fromTo(
          subtext,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          1.0
        )
      }

      // 6. CTAs rise
      if (ctas) {
        tl.fromTo(
          ctas,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          1.15
        )
      }

      // 7. Caption fades
      if (caption) {
        tl.fromTo(
          caption,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.out' },
          1.3
        )
      }
    }, container)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100svh] bg-[#0C0D0F] overflow-hidden flex flex-col justify-center pt-20 pb-10 md:pt-24 md:pb-12"
      aria-label="Introduction"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Content (occupies columns 1-7 on desktop) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-20">
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="mb-3 md:mb-4">
            <span className="font-body text-xs md:text-sm font-semibold uppercase tracking-[0.08em] text-[#C8F53C] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8F53C]" />
              {HERO_CONTENT.eyebrow}
            </span>
          </div>

          {/* H1 Headline (Explicit block lines, cannot collapse) */}
          <h1 className="font-display font-extrabold text-[clamp(2.8rem,7vw,6.4rem)] leading-[0.95] tracking-tight-title text-[#F3F0E8] mb-5 md:mb-6 text-balance">
            <span className="block overflow-hidden pb-1">
              <span ref={line1Ref} className="line block will-change-transform">
                {HERO_CONTENT.line1}
              </span>
            </span>

            <span className="block overflow-hidden pt-0.5 pb-2">
              <span ref={line2Ref} className="line block will-change-transform">
                {HERO_CONTENT.line2Part1}
                <span className="relative inline-block px-2.5 py-0.5 rounded-sm">
                  {/* Lime highlighter bar */}
                  <span
                    ref={highlightBarRef}
                    className="absolute inset-0 bg-[#C8F53C] rounded-sm -z-0 will-change-transform"
                    aria-hidden="true"
                  />
                  {/* Highlight text */}
                  <span
                    ref={highlightTextRef}
                    className="relative z-10 text-[#0C0D0F] font-extrabold"
                  >
                    {HERO_CONTENT.line2Highlight}
                  </span>
                </span>
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="font-body text-base md:text-lg text-[#A9A69E] max-w-[60ch] leading-relaxed mb-6 md:mb-8 text-balance"
          >
            {HERO_CONTENT.subtext}
          </p>

          {/* Action CTAs */}
          <div
            ref={ctaGroupRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-3"
          >
            <Button
              href={SITE_CONFIG.bookingUrl}
              variant="primary"
              ariaLabel="Book a strategy call"
            >
              {HERO_CONTENT.ctaPrimary}
            </Button>

            <Button
              onClick={() => scrollToTarget('#services')}
              variant="secondary"
              ariaLabel="See our services"
            >
              {HERO_CONTENT.ctaSecondary}
            </Button>
          </div>

          {/* Tiny muted caption */}
          <p
            ref={captionRef}
            className="font-body text-xs text-[#A9A69E]/75 tracking-wide mt-1"
          >
            {HERO_CONTENT.sampleCaption}
          </p>
        </div>

        {/* Right Column (desktop): Occupies columns 8-12, hosts Campaign Wall */}
        <div className="hidden lg:block lg:col-span-5 relative h-[580px] w-full">
          <div ref={wallWrapperRef} className="w-full h-full relative">
            <CampaignWall />
          </div>
        </div>
      </div>

      {/* Mobile Campaign Wall Band (< 900px): Rendered below headline and CTAs */}
      <div className="block lg:hidden mt-6 w-full h-[40svh] relative overflow-hidden">
        <CampaignWall />
      </div>
    </section>
  )
}
