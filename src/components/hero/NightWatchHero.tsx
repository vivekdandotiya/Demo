import React, { useEffect, useRef, useState } from 'react'
import { HERO_CONTENT } from '../../content/hero'
import { HERO_CONFIG } from '../../config/hero'
import { SITE_CONFIG } from '../../config/site'
import { Button } from '../ui/Button'
import { CampaignWall } from './CampaignWall'
import { scrollToTarget } from '../../lib/lenis'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { solveHomography, getMatrix3d, interpolateQuad, Point } from '../../lib/homography'

import masterWebp from '../../assets/photos/night-watch-master.webp'

// Virtual source coordinates (1600 x 1000 px) for CampaignWall
const SRC_POINTS: Point[] = [
  { x: 0, y: 0 },
  { x: HERO_CONFIG.screenDimensions.width, y: 0 },
  { x: HERO_CONFIG.screenDimensions.width, y: HERO_CONFIG.screenDimensions.height },
  { x: 0, y: HERO_CONFIG.screenDimensions.height },
]

export const NightWatchHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinWrapperRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<HTMLDivElement>(null)
  const plateGroupRef = useRef<HTMLDivElement>(null)
  const screenWrapperRef = useRef<HTMLDivElement>(null)
  const screenTransformRef = useRef<HTMLDivElement>(null)
  const textDeckRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const highlightBarRef = useRef<HTMLSpanElement>(null)
  const highlightTextRef = useRef<HTMLSpanElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const starsCanvasRef = useRef<HTMLCanvasElement>(null)

  const prefersReduced = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  // Track viewport resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900)
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Canvas Stars Animation (twinkling night sky)
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

    const starCount = isMobile ? 120 : 260
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.6),
      r: Math.random() * 1.1 + 0.5,
      baseAlpha: Math.random() * 0.45 + 0.35,
      speed: Math.random() * 0.0018 + 0.0008,
      phase: Math.random() * Math.PI * 2,
      isCool: Math.random() > 0.45,
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
          const alpha = Math.max(0.12, Math.min(1, s.baseAlpha + 0.35 * Math.sin(t * s.speed + s.phase)))
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

  // GSAP ScrollTrigger Sequence & Homography Mapping
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return

    const container = containerRef.current
    const pinWrapper = pinWrapperRef.current
    const stage = stageRef.current
    const camera = cameraRef.current
    const plateGroup = plateGroupRef.current
    const screenWrapper = screenWrapperRef.current
    const screenTransform = screenTransformRef.current
    const textDeck = textDeckRef.current
    const line1 = line1Ref.current
    const line2 = line2Ref.current
    const bar = highlightBarRef.current
    const highlightText = highlightTextRef.current
    const eyebrow = eyebrowRef.current
    const subtext = subtextRef.current
    const ctas = ctasRef.current
    const caption = captionRef.current

    if (!container || !pinWrapper || !stage || !camera || !screenTransform) return

    // Compute Stage Dimensions (16:9 box centered covering viewport)
    const updateMetrics = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      let width = vw
      let height = (vw * 9) / 16
      if (height < vh) {
        height = vh
        width = (vh * 16) / 9
      }
      // On mobile (narrow aspect ratio), offset stage so subject/laptop is centered
      let left = (vw - width) / 2
      if (vw < 900) {
        left = (vw - width) * 0.65
      }
      const top = (vh - height) / 2

      stage.style.width = `${width}px`
      stage.style.height = `${height}px`
      stage.style.left = `${left}px`
      stage.style.top = `${top}px`

      return { vw, vh, width, height, left, top }
    }

    let metrics = updateMetrics()
    const onResize = () => {
      metrics = updateMetrics()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize, { passive: true })

    const ctx = gsap.context(() => {
      // 1. Initial Intro Timeline (text reveal at top of page)
      const introTl = gsap.timeline({ delay: 0.15 })

      if (eyebrow) {
        introTl.fromTo(eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1)
      }
      if (line1 && line2) {
        introTl.fromTo([line1, line2], { yPercent: 110 }, { yPercent: 0, duration: 1.0, stagger: 0.12, ease: 'power4.out' }, 0.25)
      }
      if (bar) {
        introTl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power3.out', transformOrigin: 'left center' }, 0.8)
      }
      if (highlightText) {
        introTl.to(highlightText, { color: '#0C0D0F', duration: 0.35, ease: 'power2.out' }, 0.9)
      }
      if (subtext) {
        introTl.fromTo(subtext, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.95)
      }
      if (ctas) {
        introTl.fromTo(ctas, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.1)
      }
      if (caption) {
        introTl.fromTo(caption, { opacity: 0 }, { opacity: 0.8, duration: 0.8, ease: 'power2.out' }, 1.25)
      }

      // 2. Ambient camera breathe (scale 1.00 -> 1.025 over 14s)
      const ambientTween = gsap.to(stage, {
        scale: 1.025,
        duration: 7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // 3. Pointer parallax (subtle shift based on mouse)
      const quickX = gsap.quickTo(camera, 'x', { duration: 0.8, ease: 'power2.out' })
      const quickY = gsap.quickTo(camera, 'y', { duration: 0.8, ease: 'power2.out' })
      const onMouseMove = (e: MouseEvent) => {
        if (window.scrollY > window.innerHeight * 0.5) return
        const nx = (e.clientX / window.innerWidth - 0.5) * 2
        const ny = (e.clientY / window.innerHeight - 0.5) * 2
        quickX(nx * 14)
        quickY(ny * 8)
      }
      window.addEventListener('mousemove', onMouseMove, { passive: true })

      // Initial homography computation for laptop screen
      const computeHomography = (progress: number) => {
        const { width: sw, height: sh, left: sLeft, top: sTop, vw, vh } = metrics
        const quad = HERO_CONFIG.screenQuad

        // Stage screen quad corners in pixels
        const qScreen: Point[] = [
          { x: (quad.topLeft.x / 100) * sw, y: (quad.topLeft.y / 100) * sh },
          { x: (quad.topRight.x / 100) * sw, y: (quad.topRight.y / 100) * sh },
          { x: (quad.bottomRight.x / 100) * sw, y: (quad.bottomRight.y / 100) * sh },
          { x: (quad.bottomLeft.x / 100) * sw, y: (quad.bottomLeft.y / 100) * sh },
        ]

        // Viewport corners mapped back into stage space
        const qViewportInStage: Point[] = [
          { x: -sLeft, y: -sTop },
          { x: -sLeft + vw, y: -sTop },
          { x: -sLeft + vw, y: -sTop + vh },
          { x: -sLeft, y: -sTop + vh },
        ]

        let currentQuad = qScreen

        if (progress > 0.7) {
          const t = Math.min(1, Math.max(0, (progress - 0.7) / 0.22)) // 0.70 to 0.92
          const easeT = gsap.parseEase('power2.inOut')(t)
          currentQuad = interpolateQuad(qScreen, qViewportInStage, easeT)
        }

        const hom = solveHomography(SRC_POINTS, currentQuad)
        screenTransform.style.transform = getMatrix3d(hom)
      }

      // Initial homography setup
      computeHomography(0)

      // 4. Main Pinned Scroll Sequence
      const pinDistance = isMobile ? '+=150%' : '+=175%'

      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: pinDistance,
        pin: pinWrapper,
        pinSpacing: true,
        scrub: 0.7,
        onUpdate: (self) => {
          const p = self.progress

          // Pause ambient breathe once user begins scrolling
          if (p > 0.02) {
            ambientTween.pause()
          } else {
            ambientTween.resume()
          }

          // A. Camera Push-In toward Laptop Screen (Screen center: ~58.4% x, ~73.9% y)
          // Progress: 0.04 to 0.70: scale 1.0 -> 3.2
          if (p <= 0.7) {
            const zoomP = Math.max(0, (p - 0.04) / 0.66)
            const zoomScale = 1 + zoomP * 2.2 // 1.0 to 3.2
            camera.style.transformOrigin = '58.4% 73.9%'
            camera.style.transform = `scale(${zoomScale.toFixed(4)})`
          } else {
            camera.style.transformOrigin = '58.4% 73.9%'
            camera.style.transform = `scale(3.2)`
          }

          // B. Text Exit: fades up and out between 0.45 and 0.65
          if (textDeck) {
            if (p < 0.45) {
              textDeck.style.opacity = '1'
              textDeck.style.transform = 'translateY(0px)'
            } else if (p <= 0.68) {
              const textP = (p - 0.45) / 0.23
              textDeck.style.opacity = `${(1 - textP).toFixed(3)}`
              textDeck.style.transform = `translateY(${(-textP * 40).toFixed(1)}px)`
            } else {
              textDeck.style.opacity = '0'
            }
          }

          // C. Screen Homography Interpolation & Plate Fade
          computeHomography(p)

          // Background plates fade to ink black between 0.72 and 0.90
          if (plateGroup) {
            if (p < 0.72) {
              plateGroup.style.opacity = '1'
            } else if (p <= 0.91) {
              const fadeP = (p - 0.72) / 0.19
              plateGroup.style.opacity = `${(1 - fadeP).toFixed(3)}`
            } else {
              plateGroup.style.opacity = '0'
            }
          }

          // Pointer events toggle inside live screen at end
          if (screenWrapper) {
            screenWrapper.style.pointerEvents = p >= 0.92 ? 'auto' : 'none'
          }
        },
      })

      return () => {
        st.kill()
        ambientTween.kill()
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onResize)
      }
    }, container)

    return () => ctx.revert()
  }, [prefersReduced, isMobile])

  // Reduced motion fallback (accessible static layout)
  if (prefersReduced) {
    return (
      <section
        ref={containerRef}
        className="relative w-full min-h-[100svh] bg-[#0C0D0F] overflow-hidden flex flex-col justify-center pt-24 pb-12"
        aria-label="Introduction"
      >
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
            <CampaignWall inScreen={true} columnsCount={3} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#06090E] overflow-hidden"
      aria-label="Introduction"
    >
      {/* Pinned Viewport Container */}
      <div
        ref={pinWrapperRef}
        className="relative w-full h-screen overflow-hidden bg-[#06090E] select-none"
      >
        {/* Stage Wrapper: strictly maintains 16:9 cinematic aspect ratio centered */}
        <div
          ref={stageRef}
          className="absolute origin-center will-change-transform pointer-events-none"
          style={{ width: '100vw', height: '56.25vw' }}
        >
          {/* Camera Group: translates & zooms toward laptop during scroll scrub */}
          <div
            ref={cameraRef}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            {/* Base Mountain Landscape Plate & Stars */}
            <div ref={plateGroupRef} className="absolute inset-0 w-full h-full">
              {/* Deep Navy / Teal Night Sky Gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 60% at 50% 15%, #0B1726 0%, #06090E 80%)',
                }}
              />

              {/* Stars Canvas Layer */}
              <canvas
                ref={starsCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Master Cinematic 16:9 Photographic Plate */}
              <img
                src={masterWebp}
                alt="Young man at rock desk on mountain plateau at night facing laptop"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                decoding="sync"
              />

              {/* Drifting Mist Layer A (Far ridge band, 65s loop) */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen overflow-hidden"
                style={{
                  background:
                    'radial-gradient(circle 800px at 50% 55%, rgba(180, 215, 235, 0.22) 0%, transparent 70%)',
                  animation: 'mistDriftA 65s linear infinite',
                }}
              />

              {/* Drifting Mist Layer B (Mid ridge band, 95s loop reverse) */}
              <div
                className="absolute inset-0 pointer-events-none opacity-15 mix-blend-screen overflow-hidden"
                style={{
                  background:
                    'radial-gradient(circle 650px at 70% 60%, rgba(160, 205, 230, 0.18) 0%, transparent 75%)',
                  animation: 'mistDriftB 95s linear infinite reverse',
                }}
              />

              {/* Screen Glow Rim Reflection on Hood & Shoulders */}
              <div
                className="absolute pointer-events-none z-20"
                style={{
                  left: '52%',
                  top: '60%',
                  width: '26%',
                  height: '30%',
                  background:
                    'radial-gradient(circle at 45% 55%, rgba(184, 230, 248, 0.16) 0%, rgba(184, 230, 248, 0.04) 45%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
            </div>

            {/* Live Homography Screen Quad (Virtual 1600x1000 CampaignWall mapped to laptop screen) */}
            <div
              ref={screenWrapperRef}
              className="absolute inset-0 pointer-events-none z-30 overflow-visible"
            >
              <div
                ref={screenTransformRef}
                className="absolute top-0 left-0 overflow-hidden shadow-[0_0_30px_rgba(184,230,248,0.25)] border border-cyan-200/20 bg-[#0C0D0F]"
                style={{
                  width: `${HERO_CONFIG.screenDimensions.width}px`,
                  height: `${HERO_CONFIG.screenDimensions.height}px`,
                  transformOrigin: '0 0',
                  willChange: 'transform',
                }}
              >
                {/* 3 Loop Columns Campaign Wall inside virtual laptop screen */}
                <CampaignWall inScreen={true} columnsCount={3} speedMultiplier={1.0} />
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Vignette Overlay & Subtle Grain */}
        <div
          className="absolute inset-0 pointer-events-none z-35"
          style={{
            background:
              'radial-gradient(circle at 60% 60%, transparent 50%, rgba(6, 9, 14, 0.75) 100%)',
          }}
        />

        {/* Editorial Headline Overlay (Upper-Left 40% Sky) */}
        <div
          ref={textDeckRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-40 flex flex-col justify-start pt-20 md:pt-0 md:justify-center px-6 md:px-12 lg:px-20 max-w-4xl"
        >
          <div className="pointer-events-auto flex flex-col items-start pt-2 md:pt-12">
            {/* Eyebrow */}
            <div ref={eyebrowRef} className="mb-2 md:mb-4">
              <span className="font-body text-xs md:text-sm font-semibold uppercase tracking-[0.08em] text-[#C8F53C] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F53C] animate-pulse" />
                {HERO_CONTENT.eyebrow}
              </span>
            </div>

            {/* H1 Headline (Calibrated to 2-3 lines so subtext sits high above the fold) */}
            <h1 className="font-display font-extrabold text-[clamp(2.0rem,5.2vw,5.0rem)] leading-[0.98] tracking-tight-title text-[#F3F0E8] mb-3 md:mb-5 text-balance">
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
              className="font-body text-xs sm:text-base lg:text-lg text-[#D1CECA] max-w-[52ch] leading-relaxed mb-4 md:mb-6 text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            >
              {HERO_CONTENT.subtext}
            </p>

            {/* Action CTAs */}
            <div
              ref={ctasRef}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto mb-2 md:mb-3"
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

            {/* Caption */}
            <p
              ref={captionRef}
              className="font-body text-xs text-[#A9A69E]/80 tracking-wide mt-1"
            >
              Concept project, illustrative • Live campaigns running below
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
