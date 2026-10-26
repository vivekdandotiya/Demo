import React, { useState, useEffect, useRef } from 'react'
import { SELECTED_WORK, WorkProject } from '../../content/work'
import { PHOTOS } from '../../assets/photos'
import { SITE_CONFIG } from '../../config/site'
import { X, ArrowRight } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export const Work: React.FC = () => {
  const [activeProject, setActiveProject] = useState<WorkProject | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isHoveringWork, setIsHoveringWork] = useState(false)

  const modalCloseRef = useRef<HTMLButtonElement>(null)
  const prefersReduced = useReducedMotion()

  // Track cursor position for the "View" bubble (desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Handle modal keyboard accessibility & scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeProject) {
        setActiveProject(null)
      }
    }

    if (activeProject) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
      setTimeout(() => modalCloseRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeProject])

  return (
    <section
      id="work"
      className="relative w-full py-14 md:py-16 bg-[#F3F0E8] text-[#0C0D0F] on-paper z-20"
      aria-labelledby="work-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4 border-b border-[#0C0D0F]/12 pb-4">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-[#5A584F] block mb-1.5">
              Case Studies & Creative Concepts
            </span>
            <h2
              id="work-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0C0D0F] tracking-tight"
            >
              Selected work.
            </h2>
          </div>

          {SITE_CONFIG.showSampleWorkNote && (
            <p className="font-body text-xs text-[#5A584F] tracking-wide">
              Sample concepts shown until client case studies are added.
            </p>
          )}
        </div>

        {/* ========================================================
            EDITORIAL ROW (3 Projects with varied aspect ratios & offsets)
            ======================================================== */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringWork(true)}
          onMouseLeave={() => setIsHoveringWork(false)}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start"
        >
          {/* Floating "View" Cursor Bubble for desktop hover */}
          {isHoveringWork && !prefersReduced && (
            <div
              className="pointer-events-none hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-[#0C0D0F] text-[#C8F53C] font-body text-xs font-bold shadow-xl fixed z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
                position: 'absolute',
              }}
              aria-hidden="true"
            >
              View
            </div>
          )}

          {SELECTED_WORK.map((project, idx) => {
            // Distinct vertical offsets for editorial cadence:
            const offsetClass = idx === 0 ? 'mt-0' : idx === 1 ? 'md:mt-8' : 'md:mt-2'

            // Aspect ratio mapping
            const aspectClass =
              project.aspectRatio === '4:3'
                ? 'aspect-[4/3]'
                : project.aspectRatio === '4:5'
                ? 'aspect-[4/5]'
                : 'aspect-[3/2]'

            return (
              <article
                key={project.id}
                onClick={() => setActiveProject(project)}
                className={`group cursor-pointer flex flex-col gap-4 ${offsetClass}`}
              >
                {/* Image Container */}
                <div
                  className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-[#0C0D0F] shadow-sm border border-[#0C0D0F]/10`}
                >
                  <img
                    src={PHOTOS[project.photoKey]}
                    alt={`${project.name} creative direction`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />

                  {/* Dark subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                  {/* Category Chip */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#0C0D0F]/85 text-[#C8F53C] font-mono text-[11px] font-semibold backdrop-blur-sm border border-white/10">
                      {project.category}
                    </span>
                  </div>

                  {/* Arrow Indicator inside visual */}
                  <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#C8F53C] text-[#0C0D0F] flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                {/* Card Typography */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-extrabold text-2xl text-[#0C0D0F] group-hover:text-[#5A584F] transition-colors">
                      {project.name}
                    </h3>
                    <span className="text-xs font-mono text-[#5A584F]">
                      0{idx + 1}
                    </span>
                  </div>

                  <p className="font-body text-sm text-[#5A584F] leading-relaxed line-clamp-2">
                    {project.strategy}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* ========================================================
          ACCESSIBLE MODAL DIALOG (Challenge, Approach, Channels)
          ======================================================== */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#0C0D0F]/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#F3F0E8] text-[#0C0D0F] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto border border-[#0C0D0F]/15"
          >
            {/* Close Button */}
            <button
              ref={modalCloseRef}
              type="button"
              onClick={() => setActiveProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#E8E4D9] text-[#0C0D0F] hover:bg-[#0C0D0F] hover:text-[#C8F53C] transition-colors focus-visible:outline-2 focus-visible:outline-[#0C0D0F]"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5A584F] block mb-2">
                {activeProject.category} // Concept Brief
              </span>
              <h3
                id="modal-project-title"
                className="font-display font-extrabold text-3xl sm:text-4xl text-[#0C0D0F]"
              >
                {activeProject.name}
              </h3>
              <p className="font-body text-base text-[#5A584F] mt-2 italic">
                "{activeProject.strategy}"
              </p>
            </div>

            {/* Project Image */}
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#0C0D0F] mb-8">
              <img
                src={PHOTOS[activeProject.photoKey]}
                alt={activeProject.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Brief Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#0C0D0F]/12 pt-6">
              <div>
                <h4 className="font-display font-bold text-lg text-[#0C0D0F] mb-2">
                  The Commercial Challenge
                </h4>
                <p className="font-body text-sm text-[#5A584F] leading-relaxed">
                  {activeProject.challenge}
                </p>
              </div>

              <div>
                <h4 className="font-display font-bold text-lg text-[#0C0D0F] mb-2">
                  The Strategic Approach
                </h4>
                <p className="font-body text-sm text-[#5A584F] leading-relaxed">
                  {activeProject.approach}
                </p>
              </div>
            </div>

            {/* Channels & Results */}
            <div className="mt-6 pt-6 border-t border-[#0C0D0F]/12 flex flex-col gap-4">
              <div>
                <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-[#5A584F] mb-2">
                  Active Channels
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProject.channels.map((ch, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-[#E8E4D9] text-[#0C0D0F] font-body text-xs font-medium"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Render results ONLY if provided in data */}
              {activeProject.results && activeProject.results.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-[#5A584F] mb-2">
                    Verified Outcomes
                  </h4>
                  <ul className="list-disc list-inside text-sm text-[#0C0D0F] space-y-1">
                    {activeProject.results.map((res, rIdx) => (
                      <li key={rIdx}>{res}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
