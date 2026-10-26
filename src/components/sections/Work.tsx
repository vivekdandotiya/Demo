import React, { useRef, useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { SITE_CONFIG, Project } from '../../config/site'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { stopLenis, startLenis } from '../../lib/lenis'
import { worldState } from '../../world/worldState'
import { MagneticButton } from '../ui/MagneticButton'
import { getPhoto } from '../../assets/photos'

export const Work: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const prefersReduced = useReducedMotion()
  const lastActiveTriggerRef = useRef<HTMLElement | null>(null)

  // Pinned Horizontal Journey on desktop
  useEffect(() => {
    if (prefersReduced || window.innerWidth < 1024) return

    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - window.innerWidth + 120

      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth * 1.2}`,
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress
          gsap.set(track, { x: -progress * totalWidth })

          const velocity = self.getVelocity() / 300
          worldState.scrollVelocity = velocity

          const cards = track.querySelectorAll('.project-card')
          cards.forEach((card, index) => {
            const parallax = 0.88 + (index % 4) * 0.08
            const skewY = Math.max(-12, Math.min(12, velocity * 0.15 * parallax))
            const rotateZ = Math.max(-6, Math.min(6, velocity * 0.06 * parallax))
            const scaleY = 1.0 - Math.min(0.08, Math.abs(velocity) * 0.002)

            gsap.to(card, {
              skewY,
              rotateZ,
              scaleY,
              duration: 0.25,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          })
        },
      })
    })

    return () => ctx.revert()
  }, [prefersReduced])

  useEffect(() => {
    if (activeProject) {
      stopLenis()
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setActiveProject(null)
          lastActiveTriggerRef.current?.focus()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      startLenis()
      document.body.style.overflow = ''
    }
  }, [activeProject])

  const openProject = (project: Project, e: React.MouseEvent<HTMLElement>) => {
    lastActiveTriggerRef.current = e.currentTarget
    setActiveProject(project)
  }

  return (
    <section id="work" ref={containerRef} className="relative py-24 md:py-36 hairline-b overflow-hidden select-none" aria-label="Selected Work">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]" />
            <span>SIGNATURE 03 // VELOCITY WARP GALLERY</span>
          </div>
          <h2 className="font-display text-4xl md:text-7xl text-[#F1ECE2] tracking-tight">
            Selected work. <span className="italic">Built to disrupt.</span>
          </h2>
        </div>
        <div className="font-mono text-xs text-[#9C978E] max-w-sm">
          <span className="text-[#FF3B1F] mr-1.5">✦</span>
          <span>Concept projects: photo-led key visuals illustrative of our narrative architecture and creative execution. Not client claims.</span>
        </div>
      </div>

      {/* Desktop Horizontal Pinned Track / Mobile Vertical Stack */}
      <div className="w-full">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row gap-8 lg:gap-14 px-6 md:px-10 lg:pl-16 will-change-transform"
        >
          {SITE_CONFIG.projects.map((project, index) => {
            const isHovered = hoveredIdx === index
            const photoSrc = getPhoto(project.photoKey)

            return (
              <article
                key={project.id}
                data-cursor="view"
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={(e) => openProject(project, e)}
                className="project-card group relative w-full lg:w-[480px] xl:w-[540px] flex-shrink-0 cursor-pointer rounded-xl hairline-box bg-[#101013] overflow-hidden transition-all duration-300 transform-gpu hover:shadow-[0_0_60px_rgba(255,59,31,0.25)] focus-within:ring-2 focus-within:ring-[#FF3B1F] light-sweep-container"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveProject(project)
                  }
                }}
                aria-label={`View ${project.title} concept brief`}
              >
                {/* Visual artwork container combining Real Photo + Typographic Overlay */}
                <div className="relative aspect-[16/10] w-full bg-[#08080A] overflow-hidden">
                  <img
                    src={photoSrc}
                    alt={`${project.title} concept visual`}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isHovered ? 'scale-105 filter-none brightness-105' : 'scale-100 photo-dull-to-live'
                    }`}
                    loading="lazy"
                  />

                  {/* Editorial Photo Scrim with subtle gradient overlay */}
                  <div className="absolute inset-0 photo-scrim" />

                  {/* Artwork internal brand title */}
                  <div className="absolute bottom-4 left-6 z-10">
                    <span className="font-display text-4xl text-[#F1ECE2] drop-shadow-md block">
                      {project.title}
                    </span>
                    <span className="font-mono text-[10px] text-[#FF3B1F] tracking-[0.16em] uppercase">
                      {project.category}
                    </span>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#08080A]/85 border border-[rgba(241,236,226,0.18)] font-mono text-[10px] tracking-[0.14em] uppercase text-[#9C978E] z-10 backdrop-blur-sm">
                    {project.badge}
                  </div>
                </div>

                {/* Editorial Metadata Card */}
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs text-[#9C978E] mb-3">
                      <span>{project.year}</span>
                      <span className="text-[#FF9E2C] tracking-[0.14em] uppercase">{project.clientType}</span>
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl text-[#F1ECE2] group-hover:text-white transition-colors mb-2">
                      {project.tagline}
                    </h3>

                    <p className="font-body text-sm text-[#9C978E] leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="hairline-t pt-4 mt-6 flex items-center justify-between font-mono text-xs text-[#F1ECE2]">
                    <span className="flex items-center gap-2 text-[#9C978E] group-hover:text-[#FF3B1F] transition-colors">
                      <span>INSPECT CONCEPT BRIEF</span>
                      <span>→</span>
                    </span>
                    <span className="text-[11px] text-[#9C978E]">{project.badge}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Concept Brief Fullscreen Liquid Overlay Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="brief-title"
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl hairline-box bg-[#101013] p-6 md:p-12 text-[#F1ECE2] shadow-[0_0_100px_rgba(255,59,31,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[rgba(241,236,226,0.2)] flex items-center justify-center text-[#9C978E] hover:text-white hover:border-[#FF3B1F] transition-colors focus-visible:outline-2 focus-visible:outline-[#FF3B1F]"
              aria-label="Close concept brief"
            >
              ✕
            </button>

            {/* Photo Hero Banner inside Modal */}
            <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden mb-8 relative hairline-box">
              <img
                src={getPhoto(activeProject.photoKey)}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 photo-scrim" />
              <div className="absolute bottom-4 left-6">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF3B1F]/30 text-[#FF3B1F] border border-[#FF3B1F]/50 font-mono text-[10px] tracking-[0.14em] uppercase inline-block mb-1">
                  {activeProject.badge}
                </span>
                <h4 className="font-display text-3xl md:text-5xl text-[#F1ECE2]">
                  {activeProject.title}
                </h4>
              </div>
            </div>

            <p className="font-mono text-xs text-[#9C978E] uppercase tracking-[0.14em] mb-4">
              CLIENT ARCHETYPE: {activeProject.clientType} // {activeProject.year}
            </p>

            <p className="font-body text-xl text-[#F1ECE2] font-light leading-relaxed mb-8 italic">
              "{activeProject.tagline}"
            </p>

            <div className="space-y-6 hairline-t pt-6">
              <div>
                <h5 className="font-mono text-xs uppercase tracking-[0.14em] text-[#FF3B1F] mb-2">
                  THE STRATEGIC CHALLENGE
                </h5>
                <p className="font-body text-sm md:text-base text-[#9C978E] leading-relaxed">
                  {activeProject.challenge}
                </p>
              </div>

              <div>
                <h5 className="font-mono text-xs uppercase tracking-[0.14em] text-[#FF9E2C] mb-2">
                  THE EXECUTION STRATEGY
                </h5>
                <p className="font-body text-sm md:text-base text-[#9C978E] leading-relaxed">
                  {activeProject.strategy}
                </p>
              </div>

              <div>
                <h5 className="font-mono text-xs uppercase tracking-[0.14em] text-[#F1ECE2] mb-3">
                  ACTIVATION CHANNELS
                </h5>
                <div className="flex flex-wrap gap-2">
                  {activeProject.channels.map((chan, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full border border-[rgba(241,236,226,0.15)] bg-[#08080A] font-mono text-xs text-[#F1ECE2]"
                    >
                      {chan}
                    </span>
                  ))}
                </div>
              </div>

              {/* Illustrative Telemetry Callout */}
              <div className="p-4 rounded-xl hairline-box bg-[#08080A] mt-4 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] text-[#9C978E] block uppercase tracking-[0.12em]">
                    {activeProject.metricsLabel}
                  </span>
                  <span className="font-body text-sm text-[#F1ECE2]">
                    {activeProject.metricsContext}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#FF3B1F] uppercase border border-[#FF3B1F]/30 px-2 py-0.5 rounded">
                  MODEL ONLY
                </span>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="mt-8 pt-6 hairline-t flex flex-col sm:flex-row items-center justify-between gap-4">
              <MagneticButton
                href={SITE_CONFIG.bookingUrl}
                target="_blank"
                variant="pill"
                className="w-full sm:w-auto bg-[#FF3B1F] text-white border-transparent hover:bg-white hover:text-black"
              >
                <span>Discuss a similar project</span>
                <span>→</span>
              </MagneticButton>

              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="font-mono text-xs uppercase tracking-[0.14em] text-[#9C978E] hover:text-white"
              >
                Close brief [ESC]
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
