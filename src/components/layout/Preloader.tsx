import React, { useEffect, useState, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { stopLenis, startLenis } from '../../lib/lenis'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { SITE_CONFIG } from '../../config/site'

interface PreloaderProps {
  onComplete?: () => void
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState<number>(0)
  const [isDone, setIsDone] = useState<boolean>(false)

  useEffect(() => {
    // Check session storage for repeat visits
    let hasLoadedBefore = false
    try {
      hasLoadedBefore = sessionStorage.getItem('unmissable_preloaded') === 'true'
    } catch {
      hasLoadedBefore = false
    }

    if (prefersReduced || hasLoadedBefore) {
      setIsDone(true)
      onComplete?.()
      return
    }

    stopLenis()

    let currentProgress = 0
    const startTime = performance.now()
    const maxDuration = 2000 // 2.0s maximum

    // Animate letters rise from line mask
    const letters = lettersRef.current?.querySelectorAll('.preloader-char')
    if (letters) {
      gsap.fromTo(
        letters,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: 'power4.out', delay: 0.1 }
      )
    }

    // Progress counter simulation synced with actual readiness
    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime
      const simulated = Math.min(100, Math.floor((elapsed / maxDuration) * 100))
      currentProgress = simulated
      setProgress(currentProgress)

      if (lineRef.current) {
        lineRef.current.style.width = `${currentProgress}%`
      }

      if (currentProgress >= 100) {
        clearInterval(interval)
        finishPreload()
      }
    }, 25)

    const finishPreload = () => {
      try {
        sessionStorage.setItem('unmissable_preloaded', 'true')
      } catch {
        // storage disabled or unavailable
      }

      // Exit choreography: wipe upward with expo.inOut
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 1.0,
          ease: 'power4.inOut',
          onComplete: () => {
            setIsDone(true)
            startLenis()
            onComplete?.()
          },
        })
      } else {
        setIsDone(true)
        startLenis()
        onComplete?.()
      }
    }

    return () => {
      clearInterval(interval)
      startLenis()
    }
  }, [prefersReduced, onComplete])

  if (isDone) return null

  const wordmarkChars = SITE_CONFIG.name.split('')

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999999] bg-[#08080A] flex flex-col justify-between p-8 md:p-14 select-none pointer-events-auto"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-[#9C978E] font-mono text-xs tracking-[0.14em] uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F] animate-pulse" />
          <span>{SITE_CONFIG.studioType}</span>
        </div>
        <span>NYC // LON</span>
      </div>

      {/* Center Wordmark with Mask Rise */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div ref={lettersRef} className="overflow-hidden flex items-baseline">
          {wordmarkChars.map((char, index) => (
            <span
              key={index}
              className="preloader-char inline-block font-display text-5xl md:text-8xl lg:text-9xl tracking-tight text-[#F1ECE2]"
            >
              {char}
            </span>
          ))}
        </div>
        <div className="mt-4 overflow-hidden">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9C978E]">
            {SITE_CONFIG.tagline}
          </p>
        </div>
      </div>

      {/* Bottom Progress Bar & Counter */}
      <div className="w-full">
        <div className="flex items-end justify-between font-mono text-xs text-[#9C978E] mb-3">
          <span className="tracking-[0.14em]">IGNITING WORLD ENVIRONMENT</span>
          <span className="text-[#F1ECE2] text-sm tabular-nums">
            {progress.toString().padStart(3, '0')}%
          </span>
        </div>
        <div className="w-full h-[1px] bg-[rgba(241,236,226,0.12)] relative overflow-hidden">
          <div
            ref={lineRef}
            className="absolute top-0 left-0 h-full bg-[#FF3B1F] transition-all duration-75 ease-out shadow-[0_0_8px_#FF3B1F]"
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </div>
  )
}
