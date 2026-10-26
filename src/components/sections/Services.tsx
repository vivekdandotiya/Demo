import React, { useState, useEffect, useRef } from 'react'
import { SERVICES_CONTENT, ServiceItem } from '../../content/services'
import { PHOTOS } from '../../assets/photos'
import { Button } from '../ui/Button'
import { scrollToTarget } from '../../lib/lenis'
import { gsap } from '../../lib/gsap'
import { Check, ChevronDown } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface ServicesProps {
  onQuoteService?: (serviceName: string) => void
}

export const Services: React.FC<ServicesProps> = ({ onQuoteService }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [mobileOpenIdx, setMobileOpenIdx] = useState<number | null>(0)

  const activeService = SERVICES_CONTENT[activeIndex]
  const prefersReduced = useReducedMotion()

  const panelRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLImageElement>(null)
  const photoWrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressTweenRef = useRef<gsap.core.Tween | null>(null)

  // 7s Auto-advance with progress bar (paused on hover, focus, manual selection)
  useEffect(() => {
    if (prefersReduced || isPaused) {
      if (progressTweenRef.current) progressTweenRef.current.pause()
      return
    }

    const bar = progressBarRef.current
    if (bar) {
      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' })
      progressTweenRef.current = gsap.to(bar, {
        scaleX: 1,
        duration: 7,
        ease: 'none',
        onComplete: () => {
          setActiveIndex((prev) => (prev + 1) % SERVICES_CONTENT.length)
        },
      })
    }

    return () => {
      if (progressTweenRef.current) progressTweenRef.current.kill()
    }
  }, [activeIndex, isPaused, prefersReduced])

  // Transition animation when activeIndex changes
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return

    const photoWrapper = photoWrapperRef.current
    const photo = photoRef.current
    const content = contentRef.current

    if (!photoWrapper || !photo || !content) return

    const ctx = gsap.context(() => {
      // Photo clip-path wipe from bottom + inner scale 1.15 to 1
      gsap.fromTo(
        photoWrapper,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.inOut' }
      )
      gsap.fromTo(
        photo,
        { scale: 1.15 },
        { scale: 1, duration: 0.75, ease: 'power3.out' }
      )

      // Content text rising out of mask
      const textElements = content.querySelectorAll('.panel-reveal')
      gsap.fromTo(
        textElements,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power3.out' }
      )
    }, panelRef)

    return () => ctx.revert()
  }, [activeIndex, prefersReduced])

  const handleSelectService = (idx: number) => {
    setActiveIndex(idx)
    setIsPaused(true) // pause auto-advance on manual user selection
  }

  // Keyboard navigation across tablist (Up/Down, Home/End)
  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const total = SERVICES_CONTENT.length
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (idx + 1) % total
      handleSelectService(next)
      document.getElementById(`service-tab-${next}`)?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (idx - 1 + total) % total
      handleSelectService(prev)
      document.getElementById(`service-tab-${prev}`)?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      handleSelectService(0)
      document.getElementById(`service-tab-0`)?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      handleSelectService(total - 1)
      document.getElementById(`service-tab-${total - 1}`)?.focus()
    }
  }

  const handleQuoteClick = (service: ServiceItem) => {
    onQuoteService?.(service.name)
    scrollToTarget('#contact')
    setTimeout(() => {
      const nameInput = document.getElementById('contact-name')
      nameInput?.focus()
    }, 400)
  }

  return (
    <section
      id="services"
      className="relative w-full py-14 md:py-16 bg-[#F3F0E8] text-[#0C0D0F] on-paper z-20"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-[#5A584F] block mb-1.5">
              Capabilities & Working Services
            </span>
            <h2
              id="services-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0C0D0F] tracking-tight leading-tight"
            >
              Services designed for revenue.
            </h2>
          </div>

          <p className="font-body text-sm md:text-base text-[#5A584F] max-w-md">
            Click any discipline below to view exact deliverables, strategic focus, and production workflows.
          </p>
        </div>

        {/* ========================================================
            DESKTOP VIEW (>= 900px): INTERACTIVE SERVICES EXPLORER
            ======================================================== */}
        <div
          className="hidden min-[900px]:grid grid-cols-12 gap-8 items-start"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left 40% (cols 1-5): Vertical list of 6 services */}
          <div
            role="tablist"
            aria-label="Services list"
            aria-orientation="vertical"
            className="col-span-5 flex flex-col divide-y divide-[#0C0D0F]/12 border-y border-[#0C0D0F]/12"
          >
            {SERVICES_CONTENT.map((service, idx) => {
              const isActive = activeIndex === idx
              return (
                <button
                  key={service.id}
                  id={`service-tab-${idx}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={`service-panel-${idx}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleSelectService(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`group relative py-3.5 px-3 text-left transition-all duration-200 flex items-center justify-between cursor-pointer rounded-lg ${
                    isActive ? 'bg-[#E8E4D9]/60' : 'hover:bg-[#E8E4D9]/30'
                  }`}
                >
                  {/* Left indicator bar for active row */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-[#C8F53C] rounded-r"
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex items-center gap-3.5 pl-1.5">
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isActive ? 'text-[#0C0D0F]' : 'text-[#5A584F]'
                      }`}
                    >
                      {service.number}
                    </span>
                    <span
                      className={`font-display text-lg md:text-xl transition-colors ${
                        isActive
                          ? 'font-extrabold text-[#0C0D0F]'
                          : 'font-bold text-[#0C0D0F]/75 group-hover:text-[#0C0D0F]'
                      }`}
                    >
                      {service.name}
                    </span>
                  </div>

                  <span
                    className={`font-body text-base transition-transform duration-200 ${
                      isActive ? 'translate-x-1 text-[#0C0D0F]' : 'text-[#5A584F] group-hover:translate-x-1'
                    }`}
                  >
                    →
                  </span>

                  {/* Auto-advance progress line on active item */}
                  {isActive && (
                    <div
                      ref={progressBarRef}
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8F53C]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Right 60% (cols 6-12): Detail panel for active service */}
          <div
            ref={panelRef}
            id={`service-panel-${activeIndex}`}
            role="tabpanel"
            aria-labelledby={`service-tab-${activeIndex}`}
            className="col-span-7 bg-[#E8E4D9]/40 border border-[#0C0D0F]/12 rounded-2xl p-5 lg:p-6 flex flex-col gap-5"
          >
            {/* Top Photo (16:9 aspect ratio) with clip-path wipe reveal */}
            <div
              ref={photoWrapperRef}
              className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#0C0D0F] shadow-sm will-change-transform"
            >
              <img
                ref={photoRef}
                src={PHOTOS[activeService.photoKey]}
                alt={activeService.name}
                className="w-full h-full object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-[#0C0D0F]/80 text-[#C8F53C] font-mono text-[11px] font-semibold backdrop-blur-sm">
                Chapter {activeService.number} // {activeService.name}
              </span>
            </div>

            {/* Content text */}
            <div ref={contentRef} className="flex flex-col gap-4">
              <h3 className="panel-reveal font-display font-extrabold text-2xl lg:text-3xl text-[#0C0D0F] tracking-tight">
                {activeService.promise}
              </h3>

              <p className="panel-reveal font-body text-base text-[#5A584F] leading-relaxed max-w-xl">
                {activeService.description}
              </p>

              {/* 2-column checklist of 4 deliverables */}
              <div className="pt-2">
                <span className="panel-reveal font-body text-xs font-semibold uppercase tracking-wider text-[#5A584F] block mb-3">
                  Core Deliverables
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeService.deliverables.map((item, dIdx) => (
                    <div
                      key={dIdx}
                      className="panel-reveal flex items-center gap-2.5 font-body text-sm text-[#0C0D0F] font-medium"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#C8F53C] text-[#0C0D0F] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="panel-reveal flex flex-wrap items-center gap-4 pt-4 border-t border-[#0C0D0F]/12 mt-2">
                <Button
                  onClick={() => handleQuoteClick(activeService)}
                  variant="primary"
                  className="!h-12 !px-6 !text-sm"
                  ariaLabel={`Get a quote for ${activeService.name}`}
                >
                  Get a quote for {activeService.name}
                </Button>

                <Button
                  onClick={() => scrollToTarget('#process')}
                  variant="secondary-paper"
                  className="!h-12 !px-6 !text-sm"
                  showArrow={false}
                  ariaLabel="See how we work"
                >
                  See how we work
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            MOBILE VIEW (< 900px): ACCORDION LAYOUT
            ======================================================== */}
        <div className="min-[900px]:hidden flex flex-col divide-y divide-[#0C0D0F]/12 border-y border-[#0C0D0F]/12">
          {SERVICES_CONTENT.map((service, idx) => {
            const isOpen = mobileOpenIdx === idx
            return (
              <div key={service.id} className="py-2">
                <button
                  type="button"
                  onClick={() => setMobileOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full py-4 flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[#5A584F]">
                      {service.number}
                    </span>
                    <span className="font-display font-bold text-xl text-[#0C0D0F]">
                      {service.name}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-[#5A584F] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#0C0D0F]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="pb-6 pt-2 flex flex-col gap-4">
                    <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#0C0D0F]">
                      <img
                        src={PHOTOS[service.photoKey]}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#0C0D0F]">
                      {service.promise}
                    </h3>
                    <p className="font-body text-sm text-[#5A584F]">
                      {service.description}
                    </p>

                    <div className="flex flex-col gap-2 pt-2">
                      <span className="font-body text-xs font-semibold uppercase tracking-wider text-[#5A584F]">
                        Deliverables
                      </span>
                      {service.deliverables.map((item, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center gap-2 text-sm text-[#0C0D0F]"
                        >
                          <Check className="w-3.5 h-3.5 text-[#0C0D0F] flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => handleQuoteClick(service)}
                        variant="primary"
                        className="w-full !h-12 !text-sm"
                      >
                        Get a quote for {service.name}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
