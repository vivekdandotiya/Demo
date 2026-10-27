import React, { useEffect, useRef, useState } from 'react'
import { HERO_CONTENT } from '../../content/hero'
import { HERO_CONFIG } from '../../config/hero'
import { SITE_CONFIG } from '../../config/site'
import { Button } from '../ui/Button'
import { CampaignWall } from './CampaignWall'
import { scrollToTarget } from '../../lib/lenis'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

import masterWebp from '../../assets/photos/night-watch-master.webp'

export const NightWatchHero: React.FC = () => {
  const trackRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const masterPlateRef = useRef<HTMLDivElement>(null)
  const screenGlowRef = useRef<HTMLDivElement>(null)
  const darkOverlayRef = useRef<HTMLDivElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)
  const wallWrapperRef = useRef<HTMLDivElement>(null)

  const textDeckRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const highlightBarRef = useRef<HTMLSpanElement>(null)
  const highlightTextRef = useRef<HTMLSpanElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)
  const starsCanvasRef = useRef<HTMLCanvasElement>(null)

  const prefersReduced = useReducedMotion()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track viewport width for mobile layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900)
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // B4: Preload image and decode before making hero visible (no lazy loads, no src swaps)
  useEffect(() => {
    const img = new Image()
    img.src = masterWebp
    img
      .decode()
      .then(() => setIsLoaded(true))
      .catch(() => setIsLoaded(true))
  }, [])

  // Twinkling stars canvas (ambient background)
  useEffect(() => {
    const canvas = starsCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth)
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth || window.innerWidth
      height = canvas.height = canvas.offsetHeight || window.innerHeight
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const starCount = isMobile ? 90 : 180
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.55),
      r: Math.random() * 1.0 + 0.5,
      baseAlpha: Math.random() * 0.4 + 0.3,
      speed: Math.random() * 0.0016 + 0.0008,
      phase: Math.random() * Math.PI * 2,
      isCool: Math.random() > 0.4,
    }))

    let t = 0
    let isVisible = true
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    observer.observe(canvas)

    const render = () => {
      if (isVisible) {
        t += 16
        ctx.clearRect(0, 0, width, height)
        for (const s of stars) {
          const alpha = Math.max(0.1, Math.min(1, s.baseAlpha + 0.25 * Math.sin(t * s.speed + s.phase)))
          ctx.fillStyle = s.isCool ? `rgba(215, 235, 255, ${alpha})` : `rgba(255, 250, 240, ${alpha})`
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      animId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobile])

  // Master GSAP ScrollTrigger Sequence on CSS Sticky Track (Parts B, C, D, E)
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined' || !isLoaded) return

    const track = trackRef.current
    const camera = cameraRef.current
    const drift = driftRef.current
    const parallax = parallaxRef.current
    const masterPlate = masterPlateRef.current
    const screenGlow = screenGlowRef.current
    const darkOverlay = darkOverlayRef.current
    const bloom = bloomRef.current
    const wallWrapper = wallWrapperRef.current

    const textDeck = textDeckRef.current
    const line1 = line1Ref.current
    const line2 = line2Ref.current
    const bar = highlightBarRef.current
    const highlightText = highlightTextRef.current
    const eyebrow = eyebrowRef.current
    const subtext = subtextRef.current
    const ctas = ctasRef.current
    const scrollCue = scrollCueRef.current

    if (
      !track ||
      !camera ||
      !drift ||
      !parallax ||
      !masterPlate ||
      !bloom ||
      !wallWrapper ||
      !textDeck
    ) {
      return
    }

    const { x: originX, y: originY } = HERO_CONFIG.screenCenter // 59.4% 72.8%

    const ctx = gsap.context(() => {
      // 1. Ambient Breathing Loop (B3 & B6: Owned exclusively by driftRef, scale 1.00 -> 1.02 over 16s sine)
      const breathingTween = gsap.to(drift, {
        scale: 1.02,
        duration: 8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // 2. Pointer Parallax (B3: Owned exclusively by parallaxRef)
      const quickX = gsap.quickTo(parallax, 'x', { duration: 0.8, ease: 'power2.out' })
      const quickY = gsap.quickTo(parallax, 'y', { duration: 0.8, ease: 'power2.out' })
      const onMouseMove = (e: MouseEvent) => {
        if (window.scrollY > window.innerHeight * 0.5) return
        const nx = (e.clientX / window.innerWidth - 0.5) * 2
        const ny = (e.clientY / window.innerHeight - 0.5) * 2
        quickX(nx * 12)
        quickY(ny * 7)
      }
      window.addEventListener('mousemove', onMouseMove, { passive: true })

      // 3. Text Reveal Timeline (fires when p >= 0.04, reverses when returning to top)
      let textRevealed = false
      const revealTl = gsap.timeline({ paused: true })

      revealTl.set(textDeck, { visibility: 'visible', opacity: 1 })
      if (eyebrow) {
        revealTl.fromTo(
          eyebrow,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          0
        )
      }
      if (line1 && line2) {
        revealTl.fromTo(
          [line1, line2],
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' },
          0.1
        )
      }
      if (bar) {
        revealTl.fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.55, ease: 'power3.out', transformOrigin: 'left center' },
          0.5
        )
      }
      if (highlightText) {
        revealTl.to(highlightText, { color: '#0C0D0F', duration: 0.3, ease: 'power2.out' }, 0.6)
      }
      if (subtext) {
        revealTl.fromTo(
          subtext,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          0.65
        )
      }
      if (ctas) {
        revealTl.fromTo(
          ctas,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          0.75
        )
      }

      // 4. Master Scrubbed Scroll Timeline (Part E: p = 0 to 1)
      const masterTl = gsap.timeline({ paused: true })

      // Guarantee initial states with xPercent / yPercent
      gsap.set(bloom, { xPercent: -50, yPercent: -50, scale: 0.01, opacity: 0 })
      gsap.set(wallWrapper, { opacity: 0, scale: 1.08 })

      // [p = 0.00 -> 0.04]: Idle scene, scroll cue fades out
      if (scrollCue) {
        masterTl.to(scrollCue, { opacity: 0, duration: 0.04, ease: 'none' }, 0.01)
      }

      // [p = 0.04 -> 0.45]: Slow camera push (1.00 -> 1.50) + slight roll (0 -> -0.6deg)
      masterTl.to(
        camera,
        {
          scale: 1.5,
          rotation: -0.6,
          ease: 'power1.inOut',
          duration: 0.41,
        },
        0.04
      )

      if (screenGlow) {
        masterTl.to(
          screenGlow,
          {
            opacity: 1.6,
            duration: 0.41,
            ease: 'power1.inOut',
          },
          0.04
        )
      }

      // [p = 0.45 -> 0.62]: Text lifts and fades out; camera push accelerates to 2.6x; plates darken
      masterTl.to(
        textDeck,
        {
          opacity: 0,
          y: -35,
          duration: 0.17,
          ease: 'power2.in',
        },
        0.45
      )

      masterTl.to(
        camera,
        {
          scale: 2.6,
          rotation: -0.8,
          duration: 0.17,
          ease: 'power2.in',
        },
        0.45
      )

      if (darkOverlay) {
        masterTl.to(
          darkOverlay,
          {
            opacity: 0.35,
            duration: 0.17,
            ease: 'power1.inOut',
          },
          0.45
        )
      }

      // [p = 0.55 -> 0.82]: THE LIGHT — radial-gradient bloom floods viewport
      masterTl.to(
        bloom,
        {
          scale: 1.0,
          opacity: 1.0,
          duration: 0.25,
          ease: 'power2.inOut',
        },
        0.55
      )

      masterTl.to(
        camera,
        {
          scale: 3.2,
          duration: 0.27,
          ease: 'power1.out',
        },
        0.55
      )

      // [p = 0.72 -> 0.95]: CampaignWall fades up (opacity 0 -> 1, scale 1.08 -> 1.0); bloom fades out
      masterTl.to(
        wallWrapper,
        {
          opacity: 1,
          scale: 1.0,
          duration: 0.22,
          ease: 'power2.out',
        },
        0.72
      )

      masterTl.to(
        bloom,
        {
          opacity: 0,
          duration: 0.17,
          ease: 'power2.out',
        },
        0.78
      )

      masterTl.to(
        masterPlate,
        {
          opacity: 0,
          duration: 0.16,
          ease: 'power2.inOut',
        },
        0.76
      )

      // 5. ScrollTrigger: Drives master timeline progress on CSS sticky track
      const st = ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress

          // Toggle text reveal on scroll threshold
          if (p >= 0.04 && !textRevealed) {
            textRevealed = true
            revealTl.play()
          } else if (p < 0.02 && textRevealed) {
            textRevealed = false
            revealTl.reverse()
          }

          // Scrub master timeline
          masterTl.progress(p)

          // Toggle pointer events on wall when settled
          if (wallWrapper) {
            wallWrapper.style.pointerEvents = p >= 0.92 ? 'auto' : 'none'
          }
        },
      })

      return () => {
        st.kill()
        masterTl.kill()
        revealTl.kill()
        breathingTween.kill()
        window.removeEventListener('mousemove', onMouseMove)
      }
    }, track)

    return () => ctx.revert()
  }, [prefersReduced, isLoaded, isMobile])

  // Reduced motion fallback (accessible static layout)
  if (prefersReduced) {
    return (
      <section className="relative w-full min-h-[100svh] bg-[#0C0D0F] overflow-hidden flex flex-col justify-center pt-24 pb-12" aria-label="Introduction">
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left z-20">
            <span className="font-body text-xs md:text-sm font-semibold uppercase tracking-[0.08em] text-[#C8F53C] flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8F53C]" />
              {HERO_CONTENT.eyebrow}
            </span>
            <h1 className="font-display font-extrabold text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-tight-title text-[#F3F0E8] mb-5 text-balance">
              <span className="block">{HERO_CONTENT.line1}</span>
              <span className="block">
                {HERO_CONTENT.line2Part1}
                <span className="bg-[#C8F53C] text-[#0C0D0F] px-2 py-0.5 rounded-sm">
                  {HERO_CONTENT.line2Highlight}
                </span>
              </span>
            </h1>
            <p className="font-body text-base md:text-lg text-[#A9A69E] max-w-[55ch] leading-relaxed mb-6">
              {HERO_CONTENT.subtext}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-3">
              <Button href={SITE_CONFIG.bookingUrl} variant="primary" ariaLabel="Book a strategy call">
                {HERO_CONTENT.ctaPrimary}
              </Button>
              <Button onClick={() => scrollToTarget('#services')} variant="secondary" ariaLabel="See our services">
                {HERO_CONTENT.ctaSecondary}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5 relative h-[480px] w-full rounded-2xl overflow-hidden border border-white/10">
            <img src={masterWebp} alt="Meridian night scene" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <CampaignWall inScreen={false} columnsCount={3} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={trackRef}
      className={`hero-track relative w-full bg-[#06090E] transition-opacity duration-500 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ height: isMobile ? 'calc(100svh + 170svh)' : 'calc(100svh + 200svh)' }}
      aria-label="Introduction"
    >
      {/* B1: CSS Sticky Container (No pin-spacer, No JS pin, overflow clip) */}
      <div
        ref={stickyRef}
        className="hero-sticky sticky top-0 w-full h-[100svh] overflow-clip bg-[#06090E] select-none"
      >
        {/* B2: CSS-only Cover Stage with 1.12 margin & Solid Ink Base */}
        <div
          className="stage absolute left-1/2 top-1/2 pointer-events-none select-none bg-[#06090E]"
          style={{
            width: 'max(100vw, calc(100svh * 16 / 9))',
            height: 'max(100svh, calc(100vw * 9 / 16))',
            transform: 'translate(-50%, -50%) scale(1.12)',
          }}
        >
          {/* B3: Camera Wrapper (Owned strictly by master scroll timeline) */}
          <div
            ref={cameraRef}
            className="camera absolute inset-0 w-full h-full will-change-transform"
            style={{ transformOrigin: '59.4% 72.8%' }}
          >
            {/* B3: Drift Wrapper (Owned strictly by ambient breathing tween) */}
            <div
              ref={driftRef}
              className="drift absolute inset-0 w-full h-full will-change-transform"
              style={{ transformOrigin: '59.4% 72.8%' }}
            >
              {/* B3: Parallax Wrapper (Owned strictly by mouse pointer) */}
              <div
                ref={parallaxRef}
                className="parallax absolute inset-0 w-full h-full will-change-transform"
              >
                {/* Layer 1: Sky Gradient & Stars */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background:
                      'radial-gradient(ellipse 90% 60% at 50% 15%, #0B1726 0%, #06090E 80%)',
                  }}
                >
                  <canvas
                    ref={starsCanvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                </div>

                {/* Layer 2: Master Plate (Mountain ridges, misty atmosphere, rock desk, hooded figure) */}
                <div ref={masterPlateRef} className="absolute inset-0 w-full h-full">
                  <img
                    src={masterWebp}
                    alt="Young man in hoodie at rock desk on mountain plateau facing glowing laptop"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="sync"
                  />

                  {/* Gentle CSS Drifting Mist Bands across ridges */}
                  <div
                    className="hero-mist-a absolute inset-0 pointer-events-none opacity-20 mix-blend-screen overflow-hidden"
                    style={{
                      background:
                        'radial-gradient(circle 800px at 50% 55%, rgba(180, 215, 235, 0.22) 0%, transparent 70%)',
                    }}
                  />
                  <div
                    className="hero-mist-b absolute inset-0 pointer-events-none opacity-15 mix-blend-screen overflow-hidden"
                    style={{
                      background:
                        'radial-gradient(circle 650px at 70% 60%, rgba(160, 205, 230, 0.18) 0%, transparent 75%)',
                    }}
                  />

                  {/* C3: Screen Glow Layer (Soft breathing radial gradient centered on screen: 59.4% 72.8%) */}
                  <div
                    ref={screenGlowRef}
                    className="hero-glow-pulse absolute pointer-events-none"
                    style={{
                      left: '59.4%',
                      top: '72.8%',
                      transform: 'translate(-50%, -50%)',
                      width: '42%',
                      height: '42%',
                      background:
                        'radial-gradient(circle at center, rgba(184, 230, 248, 0.30) 0%, rgba(184, 230, 248, 0.08) 45%, transparent 70%)',
                      filter: 'blur(24px)',
                    }}
                  />
                </div>

                {/* Darkening overlay during camera push (p: 0.45 -> 0.62) */}
                <div
                  ref={darkOverlayRef}
                  className="absolute inset-0 bg-[#06090E] pointer-events-none opacity-0"
                />

                {/* D3: Fine Film Grain Overlay to unify all photo layers */}
                <div className="hero-grain absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay" />
              </div>
            </div>
          </div>

          {/* E: THE LIGHT — Radial bloom expanding from screen center (59.4% 72.8%) */}
          <div
            ref={bloomRef}
            className="absolute pointer-events-none z-20 will-change-transform"
            style={{
              left: '59.4%',
              top: '72.8%',
              width: '320vmax',
              height: '320vmax',
              opacity: 0,
              background:
                'radial-gradient(circle at center, #D9EEFF 0%, #89C0EA 28%, #4A8EC2 55%, transparent 80%)',
            }}
          />

          {/* E: Full-Bleed CampaignWall fading up behind/through the bloom */}
          <div
            ref={wallWrapperRef}
            className="absolute inset-0 w-full h-full z-25 bg-[#0C0D0F] opacity-0 pointer-events-none will-change-transform"
            style={{ transformOrigin: 'center center' }}
          >
            <CampaignWall fullBleed={true} columnsCount={5} speedMultiplier={1.0} />

            {/* Bottom Caption */}
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
              <p className="font-body text-xs text-[#A9A69E] tracking-wide">
                Sample creative concepts
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            OVERLAY UI (Above Stage)
            ======================================================== */}

        {/* 1. Headline & CTAs (Hidden at p=0, revealed on first scroll at p=0.04) */}
        <div
          ref={textDeckRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-30 flex flex-col justify-start pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 md:px-12 lg:px-20 max-w-4xl"
          style={{ visibility: 'hidden', opacity: 0 }}
        >
          <div className="pointer-events-auto flex flex-col items-start p-5 sm:p-6 md:p-8 rounded-2xl bg-[#06090E]/60 backdrop-blur-[4px] border border-white/10 shadow-2xl">
            {/* Eyebrow */}
            <div ref={eyebrowRef} className="mb-2 md:mb-3">
              <span className="font-body text-xs md:text-sm font-semibold uppercase tracking-[0.08em] text-[#C8F53C] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F53C] animate-pulse" />
                {HERO_CONTENT.eyebrow}
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="font-display font-extrabold text-[clamp(1.6rem,4.5vw,4.6rem)] leading-[1.0] tracking-tight-title text-[#F3F0E8] mb-3 md:mb-4 text-balance">
              <span className="block overflow-hidden pb-1">
                <span ref={line1Ref} className="line block will-change-transform">
                  {HERO_CONTENT.line1}
                </span>
              </span>

              <span className="block overflow-hidden pt-0.5 pb-1">
                <span ref={line2Ref} className="line block will-change-transform">
                  {HERO_CONTENT.line2Part1}
                  <span className="relative inline-block px-2 py-0.5 rounded-sm">
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
              className="font-body text-xs sm:text-base lg:text-lg text-[#D1CECA] max-w-[50ch] leading-relaxed mb-4 md:mb-6 text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            >
              {HERO_CONTENT.subtext}
            </p>

            {/* Action CTAs */}
            <div
              ref={ctasRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto"
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
          </div>
        </div>

        {/* 2. Scroll Cue (Visible at p=0, fades out upon scrolling) */}
        <div
          ref={scrollCueRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30 transition-opacity duration-300"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.16em] text-[#A9A69E]/70 font-medium">
            Scroll to explore
          </span>
          <div className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-[#C8F53C] animate-bounce" />
          </div>
        </div>

        {/* 3. Skip Intro Pill (Inter 12px, bottom-left, visible on focus/hover) */}
        <button
          type="button"
          onClick={() => scrollToTarget('#services')}
          className="absolute bottom-6 left-6 z-35 font-body text-xs text-[#A9A69E] hover:text-[#F3F0E8] bg-[#0C0D0F]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 opacity-60 hover:opacity-100 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-[#C8F53C] transition-all cursor-pointer"
          aria-label="Skip intro to services"
        >
          Skip intro ↓
        </button>
      </div>
    </section>
  )
}

export default NightWatchHero
