import React, { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { SITE_CONFIG } from '../../config/site'
import { scrollToTarget } from '../../lib/lenis'
import { MagneticButton } from '../ui/MagneticButton'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { StudioWall } from '../studio/StudioWall'

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinWrapperRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const scanBar1Ref = useRef<HTMLDivElement>(null)
  const scanBar2Ref = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const ctaGroupRef = useRef<HTMLDivElement>(null)

  const [localTime, setLocalTime] = useState('')
  const [heroScrollProgress, setHeroScrollProgress] = useState(0)
  const prefersReduced = useReducedMotion()

  // Live local-time clock with guaranteed high contrast
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setLocalTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Scan Reveal Entrance & Shine Pass
  useEffect(() => {
    const pinWrapper = pinWrapperRef.current
    const headline = headlineRef.current
    const line1 = line1Ref.current
    const line2 = line2Ref.current
    const bar1 = scanBar1Ref.current
    const bar2 = scanBar2Ref.current
    if (!pinWrapper || !headline || !line1 || !line2) return

    if (prefersReduced) {
      gsap.set([line1, line2, subtextRef.current, ctaGroupRef.current], {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0 0% 0 0)',
      })
      if (bar1) bar1.style.display = 'none'
      if (bar2) bar2.style.display = 'none'
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.35,
        onComplete: () => {
          gsap.set([line1, line2], { clearProps: 'transform,clipPath' })
          if (bar1) bar1.style.opacity = '0'
          if (bar2) bar2.style.opacity = '0'
          ScrollTrigger.refresh()
        },
      })

      // LINE 1 Wipe: left to right (inset(0 100% 0 0) to inset(0 0 0 0), 1.5s, power3.inOut)
      tl.fromTo(
        line1,
        { clipPath: 'inset(0 100% 0 0)', y: 14, opacity: 1 },
        {
          clipPath: 'inset(0 0% 0 0)',
          y: 0,
          duration: 1.5,
          ease: 'power3.inOut',
          onUpdate: function () {
            const p = this.progress()
            if (bar1) {
              bar1.style.left = `${p * 100}%`
              bar1.style.opacity = p > 0.01 && p < 0.99 ? '1' : '0'
            }
          },
        }
      )

      // LINE 2 Wipe: starts 0.25s after line 1
      tl.fromTo(
        line2,
        { clipPath: 'inset(0 100% 0 0)', y: 14, opacity: 1 },
        {
          clipPath: 'inset(0 0% 0 0)',
          y: 0,
          duration: 1.5,
          ease: 'power3.inOut',
          onUpdate: function () {
            const p = this.progress()
            if (bar2) {
              bar2.style.left = `${p * 100}%`
              bar2.style.opacity = p > 0.01 && p < 0.99 ? '1' : '0'
            }
          },
        },
        '-=1.25'
      )

      // Subtext line-by-line mask rise
      const subtextLines = subtextRef.current?.querySelectorAll('.subtext-line')
      if (subtextLines && subtextLines.length > 0) {
        tl.fromTo(
          subtextLines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.7'
        )
      }

      // CTAs fade in
      if (ctaGroupRef.current) {
        tl.fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
      }

      // Shine Pass: soft highlight passes over headline text in 1.4s
      const headlineSpans = headline.querySelectorAll('.headline-text-1, .headline-text-2')
      tl.fromTo(
        headlineSpans,
        { backgroundPosition: '-150% 0' },
        {
          backgroundPosition: '150% 0',
          duration: 1.4,
          ease: 'power2.inOut',
        },
        '+=0.1'
      )

      // Repeat shine every 10 seconds while hero is in view
      const shineInterval = setInterval(() => {
        gsap.fromTo(
          headlineSpans,
          { backgroundPosition: '-150% 0' },
          {
            backgroundPosition: '150% 0',
            duration: 1.4,
            ease: 'power2.inOut',
          }
        )
      }, 10000)

      // Scroll Exit: Camera dollies forward into design window on desktop (pinned 80vh)
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: '+=80%',
          pin: pinWrapper,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress
            setHeroScrollProgress(p)

            if (line1Ref.current) {
              line1Ref.current.style.transform = `translateY(-${p * 75}px)`
              line1Ref.current.style.opacity = `${Math.max(0, 1.0 - p * 1.5)}`
            }
            if (line2Ref.current) {
              line2Ref.current.style.transform = `translateY(-${p * 100}px)`
              line2Ref.current.style.opacity = `${Math.max(0, 1.0 - p * 1.8)}`
            }
            if (subtextRef.current) {
              subtextRef.current.style.opacity = `${Math.max(0, 1.0 - p * 2.2)}`
            }
            if (ctaGroupRef.current) {
              ctaGroupRef.current.style.opacity = `${Math.max(0, 1.0 - p * 2.5)}`
            }
          },
          onLeave: () => clearInterval(shineInterval),
        })
      })

      return () => {
        clearInterval(shineInterval)
        mm.revert()
      }
    })

    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <div ref={containerRef} className="relative w-full min-h-screen min-[900px]:h-[180vh]">
      <div
        ref={pinWrapperRef}
        className="relative w-full min-h-screen min-[900px]:h-screen flex flex-col justify-between p-4 md:p-8 overflow-hidden select-none bg-[#08080A]"
      >
        {/* Frame Inset Border */}
        <div 
          className="pointer-events-none absolute inset-3 md:inset-4 border border-[rgba(241,236,226,0.12)] z-30"
          aria-hidden="true"
        />

        {/* 3D Live Studio Wall Background */}
        <div className="absolute inset-0 z-10 pointer-events-auto">
          <StudioWall mode="hero" scrollProgress={heroScrollProgress} />
        </div>

        {/* Content Column: Sits in left 45% of viewport on calm ground */}
        <div className="relative z-20 flex flex-col items-start justify-center my-auto px-4 md:px-12 lg:px-16 text-left max-w-4xl pt-28 md:pt-36">
          
          {/* Eyebrow Label: Clearly spaced beneath nav */}
          <div className="overflow-hidden mb-4 md:mb-5">
            <span className="inline-block font-mono text-[11px] md:text-xs tracking-[0.24em] uppercase text-[#FF3B1F] font-semibold">
              CREATIVE DIGITAL MARKETING STUDIO
            </span>
          </div>

          {/* Explicit Block Line Headline (No word splitting, layout cannot collapse) */}
          <h1
            ref={headlineRef}
            aria-label="Be impossible to ignore."
            className="font-display text-[clamp(2.5rem,6.5vw,6.5rem)] leading-[0.92] tracking-tight-title text-[#F1ECE2] pb-2 will-change-transform"
          >
            {/* Line 1: Explicit block container */}
            <span
              ref={line1Ref}
              className="headline-line-1 block relative overflow-hidden whitespace-nowrap"
            >
              <span
                className="headline-text-1 block"
                style={{
                  backgroundImage: 'linear-gradient(105deg, #F1ECE2 0%, #F1ECE2 40%, #FFFFFF 50%, #FF9E2C 56%, #F1ECE2 65%, #F1ECE2 100%)',
                  backgroundSize: '250% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Be impossible
              </span>
              {/* Vertical 2px Signal Scanning Light Bar */}
              <div
                ref={scanBar1Ref}
                className="absolute top-0 bottom-0 w-[2px] bg-[#FF3B1F] shadow-[0_0_12px_#FF3B1F,0_0_4px_#FFF] pointer-events-none opacity-0"
                aria-hidden="true"
              />
            </span>

            {/* Line 2: Explicit block container */}
            <span
              ref={line2Ref}
              className="headline-line-2 block relative overflow-hidden whitespace-nowrap mt-2"
            >
              <span
                className="headline-text-2 block"
                style={{
                  backgroundImage: 'linear-gradient(105deg, #F1ECE2 0%, #F1ECE2 40%, #FFFFFF 50%, #FF9E2C 56%, #F1ECE2 65%, #F1ECE2 100%)',
                  backgroundSize: '250% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                to{' '}
                {/* Italic "ignore." with signal underline on hover */}
                <em className="group/ignore relative inline not-italic italic cursor-default">
                  <span>ignore.</span>
                  <span
                    className="absolute bottom-1 left-0 w-full h-[2px] bg-[#FF3B1F] origin-left scale-x-0 group-hover/ignore:scale-x-100 transition-transform duration-500 ease-out pointer-events-none"
                    aria-hidden="true"
                  />
                </em>
              </span>
              {/* Vertical 2px Signal Scanning Light Bar */}
              <div
                ref={scanBar2Ref}
                className="absolute top-0 bottom-0 w-[2px] bg-[#FF3B1F] shadow-[0_0_12px_#FF3B1F,0_0_4px_#FFF] pointer-events-none opacity-0"
                aria-hidden="true"
              />
            </span>
          </h1>

          {/* Subtext: Plain text on dark ground, NO box/pill, max 50ch, 80% opacity, 4.5:1 contrast */}
          <div className="relative mt-6 md:mt-8 max-w-[50ch]">
            <p
              ref={subtextRef}
              className="hero-subtext font-body text-base md:text-xl text-[#F1ECE2]/80 font-normal leading-relaxed [text-wrap:balance]"
            >
              <span className="block overflow-hidden">
                <span className="subtext-line inline-block">
                  Most brands are invisible. We engineer high-velocity positioning,
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="subtext-line inline-block">
                  paid performance, and interactive campaigns that make you
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="subtext-line inline-block">
                  impossible to look away from.
                </span>
              </span>
            </p>
          </div>

          {/* Action CTAs: Primary Signal Red Pill + Secondary Outlined Pill */}
          <div
            ref={ctaGroupRef}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4 z-40"
          >
            {/* Primary Signal Red Pill */}
            <MagneticButton
              href={SITE_CONFIG.bookingUrl}
              target="_blank"
              variant="pill"
              className="px-8 py-4 text-xs font-mono tracking-[0.14em] font-semibold bg-[#FF3B1F] text-white border-transparent hover:bg-white hover:text-black shadow-[0_0_35px_rgba(255,59,31,0.4)]"
              ariaLabel="Book a discovery call"
            >
              <span>Book a discovery call</span>
              <span className="text-sm font-sans">→</span>
            </MagneticButton>

            {/* Secondary Outlined Pill with Bone text & light sweep */}
            <MagneticButton
              onClick={() => scrollToTarget('#services')}
              variant="pill"
              className="px-8 py-4 text-xs font-mono tracking-[0.14em] border border-[rgba(241,236,226,0.3)] bg-transparent text-[#F1ECE2] hover:border-[#FF3B1F] hover:text-white light-sweep-container"
              ariaLabel="Explore the services section"
            >
              <span>Explore services</span>
              <span className="text-xs opacity-75">↓</span>
            </MagneticButton>
          </div>

          {/* Mobile Studio Pipeline: 2 Windows (Design & Phone) Below CTAs */}
          <div className="block min-[900px]:hidden mt-8 mb-6 w-full max-w-sm mx-auto">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#FF3B1F] uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F] animate-pulse" />
              <span>LIVE PIPELINE // DESIGN TO FEED</span>
            </div>
            <StudioWall mode="mobile" />
          </div>
        </div>

        {/* Bottom Labels: Fully visible, well padded inside frame with 4.5:1 contrast */}
        <div className="relative z-30 flex items-end justify-between px-3 md:px-6 pb-2 md:pb-4 font-mono text-[11px] md:text-xs text-[#F1ECE2] tracking-[0.14em] uppercase">
          {/* Scroll Cue bottom-left */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-[1.5px] bg-[rgba(241,236,226,0.3)] overflow-hidden">
              <div className="absolute inset-0 bg-[#FF3B1F] animate-[moveRight_2s_ease-in-out_infinite]" />
            </div>
            <span className="font-medium text-[#F1ECE2]">SCROLL TO EXPLORE</span>
          </div>

          {/* Live UTC Clock bottom-right */}
          <div className="flex items-center gap-2 tabular-nums font-medium text-[#F1ECE2]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span>UTC {localTime || '12:00:00'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
