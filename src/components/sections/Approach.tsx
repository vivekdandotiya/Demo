import React, { useRef, useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { SITE_CONFIG } from '../../config/site'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { worldState } from '../../world/worldState'
import { getPhoto } from '../../assets/photos'

export const Approach: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinWrapperRef = useRef<HTMLDivElement>(null)
  const [currentStageIdx, setCurrentStageIdx] = useState(0)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const container = containerRef.current
    const pinWrapper = pinWrapperRef.current
    if (!container || !pinWrapper) return

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 1024

      if (!isMobile) {
        ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: '+=350%',
          pin: pinWrapper,
          pinSpacing: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress
            worldState.toneInvert = Math.sin(p * Math.PI) * 0.95

            const stageIdx = Math.min(3, Math.floor(p * 4))
            setCurrentStageIdx(stageIdx)

            const stages = pinWrapper.querySelectorAll('.approach-stage-item')
            stages.forEach((stage, idx) => {
              const stageProgress = (p * 4) - idx
              const distFromCenter = stageProgress - 0.5
              const scale = Math.max(0.6, 1.2 - Math.abs(distFromCenter) * 0.8)
              const opacity = Math.max(0.05, 1.0 - Math.abs(distFromCenter) * 1.4)
              const yOffset = distFromCenter * -80

              gsap.set(stage, {
                scale,
                opacity,
                y: yOffset,
                rotateX: distFromCenter * 15,
                transformPerspective: 1000,
              })
            })
          },
          onLeave: () => {
            worldState.toneInvert = 0.0
          },
          onLeaveBack: () => {
            worldState.toneInvert = 0.0
          },
        })
      }
    })

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section id="approach" ref={containerRef} className="relative w-full hairline-b" aria-label="Our Strategic Approach">
      <div
        ref={pinWrapperRef}
        className={`relative w-full ${
          prefersReduced ? 'py-24' : 'lg:h-screen flex flex-col justify-between p-6 md:p-14 overflow-hidden'
        } transition-colors duration-700`}
      >
        {/* Top telemetry bar */}
        <div className="relative z-20 flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3B1F] animate-pulse" />
            <span>SIGNATURE 04 // 3D CAMERA CORRIDOR</span>
          </div>
          <div className="flex items-center gap-2">
            <span>STAGE</span>
            <span className="text-[#FF3B1F] font-bold text-sm">
              0{currentStageIdx + 1} / 04
            </span>
          </div>
        </div>

        {/* Center Stage Presentation */}
        {!prefersReduced ? (
          <div className="relative z-20 my-auto w-full max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[460px]">
            {SITE_CONFIG.approach.map((step, idx) => {
              const isActive = currentStageIdx === idx
              const photoSrc = getPhoto(step.photoKey)

              return (
                <div
                  key={step.step}
                  className={`approach-stage-item absolute w-full flex flex-col items-center text-center transition-all duration-300 will-change-transform ${
                    isActive ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                >
                  {/* Subtle photo texture badge behind each stage title */}
                  <div className="w-28 h-20 md:w-36 md:h-24 rounded-lg overflow-hidden hairline-box mb-4 shadow-xl opacity-90">
                    <img
                      src={photoSrc}
                      alt=""
                      className="w-full h-full object-cover filter brightness-90 contrast-125"
                    />
                  </div>

                  <span className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-[#FF3B1F] block mb-2">
                    PHASE {step.step}
                  </span>

                  <h3 className="font-display text-6xl md:text-9xl text-[#08080A] tracking-tight mb-4 drop-shadow-sm">
                    {step.title}
                  </h3>

                  <p className="font-display italic text-2xl md:text-4xl text-[#08080A]/90 max-w-2xl mx-auto mb-6">
                    "{step.subhead}"
                  </p>

                  <p className="font-body text-base md:text-lg text-[#101013]/80 max-w-xl mx-auto leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          /* Reduced Motion / Fallback Layout */
          <div className="max-w-5xl mx-auto space-y-16 px-6">
            {SITE_CONFIG.approach.map((step) => (
              <div key={step.step} className="hairline-b pb-12 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-48 h-32 rounded-lg overflow-hidden hairline-box flex-shrink-0">
                  <img
                    src={getPhoto(step.photoKey)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#FF3B1F] block mb-2">
                    PHASE {step.step}
                  </span>
                  <h3 className="font-display text-5xl md:text-7xl text-[#F1ECE2] mb-3">
                    {step.title}
                  </h3>
                  <p className="font-display italic text-2xl text-[#9C978E] mb-4">
                    "{step.subhead}"
                  </p>
                  <p className="font-body text-base text-[#9C978E] leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Stepper Timeline */}
        <div className="relative z-20 w-full max-w-3xl mx-auto hidden lg:flex items-center justify-between font-mono text-xs text-[#101013] uppercase tracking-[0.14em]">
          {SITE_CONFIG.approach.map((s, idx) => (
            <div
              key={s.step}
              className={`flex items-center gap-2 transition-all duration-300 ${
                currentStageIdx === idx
                  ? 'text-[#FF3B1F] font-bold scale-110'
                  : 'text-[#101013]/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{s.step} {s.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
