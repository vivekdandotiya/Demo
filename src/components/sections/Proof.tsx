import React from 'react'
import { PROOF_DATA } from '../../content/proof'

export const Proof: React.FC = () => {
  const hasLogos = PROOF_DATA.logos && PROOF_DATA.logos.length > 0
  const hasTestimonials = PROOF_DATA.testimonials && PROOF_DATA.testimonials.length > 0
  const hasStats = PROOF_DATA.stats && PROOF_DATA.stats.length > 0

  // If all arrays are empty, render nothing as required by client specification
  if (!hasLogos && !hasTestimonials && !hasStats) {
    return null
  }

  return (
    <section
      id="proof"
      className="relative w-full py-16 bg-[#0C0D0F] text-[#F3F0E8] z-20 border-t border-white/10"
      aria-label="Client Verification"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col gap-12">
        {hasLogos && (
          <div className="flex flex-wrap items-center justify-center gap-10">
            {PROOF_DATA.logos.map((logo, idx) => (
              <img
                key={idx}
                src={logo.logoUrl}
                alt={logo.name}
                className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        )}

        {hasStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/10 py-10">
            {PROOF_DATA.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <span className="font-display font-extrabold text-4xl sm:text-5xl text-[#C8F53C]">
                  {stat.prefix}
                  {stat.value}
                  {stat.suffix}
                </span>
                <span className="font-body text-xs text-[#A9A69E] uppercase tracking-wider mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {hasTestimonials && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROOF_DATA.testimonials.map((test, idx) => (
              <blockquote
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between"
              >
                <p className="font-body text-base text-[#F3F0E8] leading-relaxed italic mb-4">
                  "{test.quote}"
                </p>
                <footer className="font-body text-xs text-[#A9A69E]">
                  <cite className="font-bold text-[#F3F0E8] not-italic block">
                    {test.author}
                  </cite>
                  <span>
                    {test.role}, {test.company}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
