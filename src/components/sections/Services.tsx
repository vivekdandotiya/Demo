import React, { useEffect, useRef, useState } from 'react'
import { SITE_CONFIG, Service } from '../../config/site'
import { PHOTOS } from '../../assets/photos'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { getLenis } from '../../lib/lenis'
import { SeoSearchDemo } from './services/SeoSearchDemo'
import { PaidAdvertisingDemo } from './services/PaidAdvertisingDemo'
import { SocialMediaDemo } from './services/SocialMediaDemo'
import { ContentStrategyDemo } from './services/ContentStrategyDemo'
import { BrandGrowthDemo } from './services/BrandGrowthDemo'
import { ConversionCroDemo } from './services/ConversionCroDemo'

const CHAPTER_PHOTOS: Record<string, string> = {
  'seo-search': PHOTOS['analytics-dashboard'],
  'paid-advertising': PHOTOS['billboard-city'],
  'social-media': PHOTOS['camera-operator'],
  'content-strategy': PHOTOS['whiteboard-session'],
  'brand-growth': PHOTOS['hands-craft'],
  'conversion-optimization': PHOTOS['design-laptop'],
}

export const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinTrackRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const [activeChapter, setActiveChapter] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileActiveMap, setMobileActiveMap] = useState<Record<number, boolean>>({})

  const services = SITE_CONFIG.services

  // Desktop ScrollTrigger Pinning
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return

    const container = containerRef.current
    const pinTrack = pinTrackRef.current
    if (!container || !pinTrack) return

    // Only enable desktop pinning on screens >= 900px
    const mm = gsap.matchMedia()

    mm.add('(min-width: 900px)', () => {
      const totalChapters = services.length

      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${totalChapters * 100}%`,
        pin: pinTrack,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const prog = self.progress
          setScrollProgress(prog)
          const newIdx = Math.min(totalChapters - 1, Math.floor(prog * totalChapters))
          setActiveChapter(newIdx)
        },
      })

      return () => {
        st.kill()
      }
    })

    return () => {
      mm.revert()
    }
  }, [prefersReduced, services.length])

  // Mobile IntersectionObserver for individual chapter activation
  useEffect(() => {
    if (typeof window === 'undefined') return

    const cards = document.querySelectorAll('.mobile-chapter-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-chapter-index'))
          if (!isNaN(idx)) {
            setMobileActiveMap((prev) => ({
              ...prev,
              [idx]: entry.isIntersecting,
            }))
          }
        })
      },
      { threshold: 0.3 }
    )

    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  // Jump directly to chapter
  const jumpToChapter = (idx: number) => {
    if (prefersReduced || window.innerWidth < 900) {
      const el = document.getElementById(`service-chapter-${idx}`)
      el?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    const container = containerRef.current
    if (!container) return
    const totalChapters = services.length
    const rect = container.getBoundingClientRect()
    const containerTop = window.scrollY + rect.top
    const pinDistance = window.innerHeight * totalChapters
    const targetScroll = containerTop + (idx / totalChapters) * pinDistance + 10

    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 1.2 })
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  // Render the demo for a given service index
  const renderDemo = (idx: number, isActive: boolean) => {
    switch (idx) {
      case 0:
        return <SeoSearchDemo isActive={isActive} isReducedMotion={prefersReduced} />
      case 1:
        return <PaidAdvertisingDemo isActive={isActive} isReducedMotion={prefersReduced} />
      case 2:
        return <SocialMediaDemo isActive={isActive} isReducedMotion={prefersReduced} />
      case 3:
        return <ContentStrategyDemo isActive={isActive} isReducedMotion={prefersReduced} />
      case 4:
        return <BrandGrowthDemo isActive={isActive} isReducedMotion={prefersReduced} />
      case 5:
        return <ConversionCroDemo isActive={isActive} isReducedMotion={prefersReduced} />
      default:
        return null
    }
  }

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative bg-[#08080A] text-[#F1ECE2] hairline-b"
      aria-label="Services Chapters"
    >
      {/* ========================================================
          DESKTOP VIEW (>= 900px): PINNED CHAPTER FILM RUN
          ======================================================== */}
      {!prefersReduced ? (
        <div className="services-desktop-stage">
          <div ref={pinTrackRef} className="h-screen w-full flex flex-col justify-between p-8 lg:p-12 overflow-hidden">
            {/* Stage Header */}
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B1F] animate-pulse" />
                  <span>SIGNATURE 02 // SERVICE CHAPTERS</span>
                </div>
                <h2 className="font-display text-4xl lg:text-5xl text-[#F1ECE2] tracking-tight">
                  Six instruments. <span className="italic">Zero noise.</span>
                </h2>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs text-[#9C978E]">
                <span>CHAPTER {String(activeChapter + 1).padStart(2, '0')} / 06</span>
                <span className="text-[#FF3B1F]">● LIVE RUNNING</span>
              </div>
            </div>

            {/* Pinned Stage Body (Left Rail + Left Text + Right Stage) */}
            <div className="flex-1 grid grid-cols-12 gap-8 items-center py-6 min-h-0">
              {/* Left Rail: Slim Vertical Progress Line */}
              <div className="col-span-1 flex flex-col items-center justify-between h-[380px] relative">
                {/* Background track line */}
                <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[2px] bg-white/10 rounded-full" />
                {/* Active fill line */}
                <div
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-[2px] bg-[#FF3B1F] rounded-full transition-all duration-300 ease-out"
                  style={{
                    height: `${Math.max(6, scrollProgress * 100)}%`,
                  }}
                />

                {/* 6 Chapter Index Buttons */}
                {services.map((svc, idx) => {
                  const isActive = activeChapter === idx
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => jumpToChapter(idx)}
                      aria-label={`Jump to chapter ${svc.number}: ${svc.title}`}
                      aria-current={isActive ? 'step' : undefined}
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#FF3B1F] ${
                        isActive
                          ? 'bg-[#FF3B1F] text-white font-bold scale-110 shadow-[0_0_15px_rgba(255,59,31,0.5)]'
                          : 'bg-[#101013] text-[#9C978E] border border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {svc.number}
                    </button>
                  )
                })}
              </div>

              {/* Left Column: Chapter Description & Deliverables */}
              <div className="col-span-5 flex flex-col justify-center pr-4">
                {services.map((svc, idx) => {
                  if (activeChapter !== idx) return null

                  // Split title to italicize the keyword
                  const words = svc.title.split(' ')
                  const isLastItalic = true

                  return (
                    <div
                      key={svc.id}
                      className="animate-in fade-in duration-500 flex flex-col gap-5"
                    >
                      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: svc.color }} />
                        <span>CAPABILITY {svc.number} // SPECIFICATION</span>
                      </div>

                      <h3 className="font-display text-4xl lg:text-6xl text-[#F1ECE2] leading-[1.05] tracking-tight">
                        {words.map((w, wIdx) => {
                          const isItalic = isLastItalic && (w === svc.italicWord || wIdx === words.length - 1)
                          return (
                            <span key={wIdx} className={isItalic ? 'italic font-normal text-[#FF3B1F]' : ''}>
                              {w}{' '}
                            </span>
                          )
                        })}
                      </h3>

                      <p className="font-body text-base lg:text-lg text-[#F1ECE2]/80 leading-relaxed font-light">
                        "{svc.shortPromise}"
                      </p>

                      <div className="pt-4 border-t border-white/10">
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#9C978E] block mb-3">
                          CORE DELIVERABLES
                        </span>
                        <ul className="space-y-2.5 font-body text-sm text-[#F1ECE2]/90">
                          {svc.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2.5">
                              <span className="text-[#FF3B1F] font-mono text-xs mt-0.5">✦</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <a
                          href={SITE_CONFIG.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#F1ECE2] hover:text-[#FF3B1F] transition-colors py-2 group"
                        >
                          <span className="underline underline-offset-4 decoration-[#FF3B1F]">
                            Talk about your growth
                          </span>
                          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Right: Large Visual Stage (~55% width, sharp corners, hairline border) */}
              <div className="col-span-6 relative h-[420px] lg:h-[480px] rounded-xl hairline-box overflow-hidden bg-[#101013]/90 shadow-2xl">
                {services.map((svc, idx) => {
                  const isActive = activeChapter === idx
                  const photoUrl = CHAPTER_PHOTOS[svc.id]

                  return (
                    <div
                      key={svc.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      {/* Duotone Background Photo */}
                      {photoUrl && (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
                          style={{
                            backgroundImage: `url(${photoUrl})`,
                            filter: 'grayscale(100%) contrast(135%) brightness(28%)',
                          }}
                        />
                      )}

                      {/* Studio Scrim Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/95 via-[#08080A]/60 to-[#08080A]/85" />

                      {/* Interactive Animated Demo Layer */}
                      <div className="relative z-10 w-full h-full p-4 lg:p-6 flex items-center justify-center">
                        {renderDemo(idx, isActive)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Scrubber & Section Indicator */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px] text-[#9C978E]">
              <span>SCROLL DOWN TO PROGRESS CHAPTERS</span>
              <div className="flex gap-1.5">
                {services.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeChapter === idx ? 'w-6 bg-[#FF3B1F]' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ========================================================
          MOBILE VIEW (< 900px) & REDUCED MOTION: STACKED CHAPTERS
          ======================================================== */}
      <div className={`px-6 py-20 max-w-5xl mx-auto services-mobile-stage ${prefersReduced ? '!block' : ''}`}>
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3B1F]" />
            <span>SIGNATURE 02 // SERVICE CHAPTERS</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-[#F1ECE2] tracking-tight">
            Six instruments. <span className="italic">Zero noise.</span>
          </h2>
          <p className="mt-3 font-body text-sm text-[#9C978E] max-w-xl">
            Watch each strategic discipline in active execution. Every demonstration is labeled illustrative and built with pure mathematical clarity.
          </p>
        </div>

        {/* Stacked Chapters */}
        <div className="flex flex-col gap-16">
          {services.map((svc, idx) => {
            const isCardActive = mobileActiveMap[idx] || prefersReduced
            const photoUrl = CHAPTER_PHOTOS[svc.id]

            return (
              <div
                key={svc.id}
                id={`service-chapter-${idx}`}
                data-chapter-index={idx}
                className="mobile-chapter-card p-6 md:p-8 rounded-2xl hairline-box bg-[#101013]/70 flex flex-col gap-6"
              >
                {/* Chapter Heading */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#FF3B1F]">
                    <span>CHAPTER {svc.number}</span>
                    <span>//</span>
                    <span className="text-[#9C978E] uppercase">{svc.italicWord}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#9C978E]">0{idx + 1} / 06</span>
                </div>

                <div>
                  <h3 className="font-display text-3xl md:text-4xl text-[#F1ECE2] mb-2">
                    {svc.title}
                  </h3>
                  <p className="font-body text-base text-[#F1ECE2]/80 italic">
                    "{svc.shortPromise}"
                  </p>
                </div>

                {/* Mobile Demo Stage */}
                <div className="relative w-full h-[320px] rounded-xl hairline-box overflow-hidden bg-[#08080A]">
                  {photoUrl && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${photoUrl})`,
                        filter: 'grayscale(100%) contrast(135%) brightness(25%)',
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/95 via-[#08080A]/70 to-[#08080A]/85" />
                  <div className="relative z-10 w-full h-full p-3 flex items-center justify-center">
                    {renderDemo(idx, isCardActive)}
                  </div>
                </div>

                {/* Deliverables List */}
                <div className="pt-2">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#9C978E] block mb-2">
                    DELIVERABLES
                  </span>
                  <ul className="space-y-2 font-body text-sm text-[#F1ECE2]/90">
                    {svc.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-[#FF3B1F] font-mono text-xs mt-0.5">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Booking Link */}
                <div className="pt-2 border-t border-white/5">
                  <a
                    href={SITE_CONFIG.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#FF3B1F] hover:text-white transition-colors"
                  >
                    <span>Talk about your growth</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Screen Reader Full Catalog Accessibility */}
      <div className="sr-only" aria-label="Services Detailed Accessible Catalog">
        <h3>Services and Strategic Capabilities</h3>
        <ul>
          {services.map((svc) => (
            <li key={`sr-${svc.id}`}>
              <h4>{svc.number} - {svc.title}</h4>
              <p>{svc.shortPromise}</p>
              <ul>
                {svc.deliverables.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
