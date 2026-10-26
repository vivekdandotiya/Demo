import React from 'react'
import { SITE_CONFIG } from '../../config/site'
import { scrollToTarget } from '../../lib/lenis'
import { MagneticButton } from '../ui/MagneticButton'

export const Packages: React.FC = () => {
  return (
    <section id="packages" className="relative py-28 md:py-40 px-6 md:px-10 hairline-b bg-[#08080A]/90 overflow-hidden select-none" aria-label="Engagement Models and Packages">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]" />
              <span>ENGAGEMENT MODELS // NO HIDDEN FEES</span>
            </div>
            <h2 className="font-display text-4xl md:text-7xl text-[#F1ECE2] tracking-tight">
              Three ways <span className="italic">to collaborate.</span>
            </h2>
          </div>
          <p className="max-w-md font-body text-sm md:text-base text-[#9C978E] leading-relaxed">
            Transparent milestone and retainer frameworks designed around business milestones, not arbitrary hours.
          </p>
        </div>

        {/* 3 Packages Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SITE_CONFIG.packages.map((pkg, idx) => {
            const isFeatured = idx === 1 // Growth partnership is flagship
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-8 md:p-10 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'border-2 border-[#FF3B1F] bg-[#101013] shadow-[0_0_60px_rgba(255,59,31,0.18)]'
                    : 'hairline-box bg-[#0c0c0e] hover:border-[rgba(241,236,226,0.3)]'
                }`}
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-6 font-mono text-xs">
                  <span className={`px-3 py-1 rounded-full uppercase tracking-[0.14em] text-[10px] ${
                    isFeatured
                      ? 'bg-[#FF3B1F] text-white'
                      : 'border border-[rgba(241,236,226,0.18)] text-[#9C978E]'
                  }`}>
                    {pkg.badge}
                  </span>
                  <span className="text-[#9C978E]">{pkg.timeframe}</span>
                </div>

                {/* Title & Desc */}
                <div className="mb-8">
                  <h3 className="font-display text-3xl md:text-4xl text-[#F1ECE2] mb-3">
                    {pkg.name}
                  </h3>
                  <p className="font-body text-sm text-[#9C978E] leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                {/* Deliverables List */}
                <div className="hairline-t pt-6 mb-8 flex-1">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#FF3B1F] block mb-4">
                    SCOPE INCLUDED
                  </span>
                  <ul className="space-y-3 font-body text-sm text-[#F1ECE2]/85">
                    {pkg.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-[#FF3B1F] font-mono text-xs mt-0.5">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing / Commitment model */}
                <div className="hairline-t pt-6 mt-auto">
                  <div className="font-mono text-xs text-[#9C978E] mb-4">
                    <span>STRUCTURE: </span>
                    <span className="text-[#F1ECE2]">{pkg.commitment}</span>
                  </div>

                  <MagneticButton
                    onClick={() => scrollToTarget('#contact')}
                    variant="pill"
                    className={`w-full py-4 text-xs font-mono tracking-[0.14em] ${
                      isFeatured
                        ? 'bg-[#FF3B1F] text-white border-transparent hover:bg-white hover:text-black'
                        : 'border border-[rgba(241,236,226,0.2)] bg-[#101013] text-[#F1ECE2] hover:border-[#FF3B1F]'
                    }`}
                  >
                    <span>{pkg.ctaText}</span>
                    <span>→</span>
                  </MagneticButton>
                </div>
              </div>
            )
          })}
        </div>

        {/* Optional Social Proof Slot (Clearly marked placeholder, hidden by default per config) */}
        {SITE_CONFIG.showTestimonialsSlot && (
          <div className="mt-20 p-8 rounded-xl hairline-box bg-[#101013] text-center border-dashed border-[rgba(241,236,226,0.2)]">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF3B1F] block mb-2">
              SOCIAL PROOF SLOT [PLACEHOLDER]
            </span>
            <p className="font-display italic text-2xl text-[#9C978E]">
              "Your client testimonials, case metrics, and verified review embeds go here."
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
