import React from 'react'
import { SITE_CONFIG } from '../../config/site'
import { getPhoto } from '../../assets/photos'

export const WhyUs: React.FC = () => {
  return (
    <section id="why-us" className="relative py-28 md:py-40 px-6 md:px-10 hairline-b bg-[#08080A]/95 overflow-hidden select-none" aria-label="Why Choose Unmissable">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]" />
              <span>THE 4 PILLARS // OPERATING SYSTEM</span>
            </div>
            <h2 className="font-display text-4xl md:text-7xl text-[#F1ECE2] tracking-tight">
              Why brands switch <span className="italic">to Unmissable.</span>
            </h2>
          </div>
          <p className="max-w-md font-body text-sm md:text-base text-[#9C978E] leading-relaxed">
            Four structural principles that replace agency theatre with genuine economic advantage.
          </p>
        </div>

        {/* 4 Pillars: Photo + Type Asymmetric Alternating Layout */}
        <div className="space-y-16 md:space-y-24">
          {SITE_CONFIG.whyUsPillars.map((pillar, idx) => {
            const isEven = idx % 2 === 1
            const photoSrc = getPhoto(pillar.photoKey)

            return (
              <div
                key={pillar.number}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Photo Column */}
                <div
                  className={`lg:col-span-5 relative aspect-[16/11] rounded-2xl overflow-hidden hairline-box bg-[#101013] group light-sweep-container ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <img
                    src={photoSrc}
                    alt={pillar.title}
                    className="w-full h-full object-cover photo-dull-to-live"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 photo-scrim" />
                  <span className="absolute bottom-4 left-6 font-mono text-xs text-[#FF3B1F] tracking-[0.16em] uppercase">
                    PILLAR {pillar.number} // PROOF
                  </span>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-3 font-mono text-xs text-[#FF3B1F] uppercase tracking-[0.16em]">
                    <span>0{idx + 1}</span>
                    <span>•</span>
                    <span>PRINCIPLE</span>
                  </div>

                  <h3 className="font-display text-4xl md:text-6xl text-[#F1ECE2] tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="font-display italic text-xl md:text-2xl text-[#FF9E2C]">
                    "{pillar.tagline}"
                  </p>

                  <p className="font-body text-base md:text-lg text-[#9C978E] leading-relaxed max-w-xl font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
