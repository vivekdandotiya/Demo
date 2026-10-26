import React from 'react'
import { SITE_CONFIG } from '../../config/site'
import { getPhoto } from '../../assets/photos'

export const Studio: React.FC = () => {
  return (
    <section id="studio" className="relative py-28 md:py-40 px-6 md:px-10 hairline-b bg-[#08080A]/90 overflow-hidden select-none" aria-label="Our Studio and Craft">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]" />
              <span>THE STUDIO // WORKING STYLE & CRAFT</span>
            </div>
            <h2 className="font-display text-4xl md:text-7xl text-[#F1ECE2] tracking-tight">
              An atelier of <span className="italic">relentless standards.</span>
            </h2>
          </div>
          <div className="max-w-md font-body text-sm md:text-base text-[#9C978E] leading-relaxed">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#FF3B1F] mb-1">
              TEAM ARCHITECTURE [PLACEHOLDER]
            </p>
            <p>{SITE_CONFIG.teamPlaceholder}</p>
          </div>
        </div>

        {/* Editorial Photo Mosaic Grid (Asymmetric Editorial Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch">
          {/* Tile 1: Large Left Production Card */}
          <div className="md:col-span-7 group relative rounded-2xl hairline-box bg-[#101013] overflow-hidden light-sweep-container flex flex-col justify-between p-6 md:p-10 min-h-[460px]">
            <img
              src={getPhoto('studio-production')}
              alt="Studio production set"
              className="absolute inset-0 w-full h-full object-cover photo-dull-to-live"
              loading="lazy"
            />
            <div className="absolute inset-0 photo-scrim" />
            
            <div className="relative z-10 font-mono text-xs text-[#9C978E] uppercase tracking-[0.16em] flex items-center justify-between">
              <span>01 // PRODUCTION INTEGRITY</span>
              <span className="text-[#FF3B1F]">NEW YORK & LONDON</span>
            </div>

            <div className="relative z-10 max-w-lg mt-auto">
              <h3 className="font-display text-3xl md:text-5xl text-[#F1ECE2] mb-3 leading-tight">
                Cinema-grade execution meets data-driven precision.
              </h3>
              <p className="font-body text-sm md:text-base text-[#9C978E] leading-relaxed">
                We believe brand affinity is built in the nuances: custom audio design, lighting that honors material physics, and words calibrated to withstand buyer cynicism.
              </p>
            </div>
          </div>

          {/* Right Column (2 Staggered Tiles) */}
          <div className="md:col-span-5 flex flex-col gap-6 md:gap-8">
            {/* Tile 2: Team Collaboration */}
            <div className="group relative rounded-2xl hairline-box bg-[#101013] overflow-hidden light-sweep-container p-6 md:p-8 flex-1 min-h-[220px] flex flex-col justify-between">
              <img
                src={getPhoto('strategy-collab')}
                alt="Strategy sprint collaboration"
                className="absolute inset-0 w-full h-full object-cover photo-dull-to-live"
                loading="lazy"
              />
              <div className="absolute inset-0 photo-scrim" />

              <div className="relative z-10 font-mono text-xs text-[#9C978E] uppercase tracking-[0.14em]">
                02 // DIRECT COLLABORATION
              </div>

              <div className="relative z-10 mt-auto">
                <h4 className="font-display text-2xl md:text-3xl text-[#F1ECE2] mb-1">
                  Cross-disciplinary war rooms.
                </h4>
                <p className="font-body text-xs md:text-sm text-[#9C978E]">
                  Strategists and creative directors work side-by-side with media buyers. Zero silos.
                </p>
              </div>
            </div>

            {/* Tile 3: Urban Scale Billboards */}
            <div className="group relative rounded-2xl hairline-box bg-[#101013] overflow-hidden light-sweep-container p-6 md:p-8 flex-1 min-h-[220px] flex flex-col justify-between">
              <img
                src={getPhoto('billboard-city')}
                alt="City advertising billboard"
                className="absolute inset-0 w-full h-full object-cover photo-dull-to-live"
                loading="lazy"
              />
              <div className="absolute inset-0 photo-scrim" />

              <div className="relative z-10 font-mono text-xs text-[#9C978E] uppercase tracking-[0.14em]">
                03 // CULTURAL AMPLITUDE
              </div>

              <div className="relative z-10 mt-auto">
                <h4 className="font-display text-2xl md:text-3xl text-[#F1ECE2] mb-1">
                  Built for the physical and digital stream.
                </h4>
                <p className="font-body text-xs md:text-sm text-[#9C978E]">
                  From Times Square LED placements to 6-inch OLED feeds, your message retains undeniable presence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
