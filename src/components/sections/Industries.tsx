import React, { useState } from 'react'
import { SITE_CONFIG, IndustryItem } from '../../config/site'
import { getPhoto } from '../../assets/photos'

export const Industries: React.FC = () => {
  const [activeIndustry, setActiveIndustry] = useState<IndustryItem>(SITE_CONFIG.industries[0])

  return (
    <section id="industries" className="relative py-28 md:py-40 px-6 md:px-10 hairline-b bg-[#08080A] overflow-hidden select-none" aria-label="Industries We Grow">
      {/* Background Full-Bleed Photo with Liquid Transition */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {SITE_CONFIG.industries.map((ind) => {
          const isActive = activeIndustry.id === ind.id
          return (
            <div
              key={ind.id}
              className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? 'opacity-22 scale-100 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]' : 'opacity-0 scale-105 [clip-path:polygon(0_0,100%_0,100%_0,0_0)]'
              }`}
            >
              <img
                src={getPhoto(ind.photoKey)}
                alt=""
                className="w-full h-full object-cover filter brightness-75 contrast-125"
              />
              <div className="absolute inset-0 photo-scrim-radial" />
            </div>
          )
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]" />
              <span>MARKET VERTICALS // PROVEN THESIS</span>
            </div>
            <h2 className="font-display text-4xl md:text-7xl text-[#F1ECE2] tracking-tight">
              Industries <span className="italic">we accelerate.</span>
            </h2>
          </div>
          <p className="max-w-md font-body text-sm md:text-base text-[#9C978E] leading-relaxed">
            Hover or tap any sector to view our tailored narrative architecture and acquisition channels.
          </p>
        </div>

        {/* Interactive Industry List & Detail Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Interactive Large Serif Rows */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-[rgba(241,236,226,0.12)]">
            {SITE_CONFIG.industries.map((ind, idx) => {
              const isActive = activeIndustry.id === ind.id
              return (
                <div
                  key={ind.id}
                  onMouseEnter={() => setActiveIndustry(ind)}
                  onClick={() => setActiveIndustry(ind)}
                  className={`py-6 md:py-8 cursor-pointer transition-all duration-300 flex items-center justify-between group ${
                    isActive ? 'pl-4 border-l-2 border-[#FF3B1F]' : 'hover:pl-2'
                  }`}
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-xs text-[#9C978E]">0{idx + 1}</span>
                    <h3
                      className={`font-display text-3xl md:text-5xl transition-colors duration-200 ${
                        isActive ? 'text-[#FF3B1F] italic' : 'text-[#F1ECE2] group-hover:text-white'
                      }`}
                    >
                      {ind.name}
                    </h3>
                  </div>

                  <span
                    className={`font-mono text-xs tracking-widest uppercase transition-opacity ${
                      isActive ? 'opacity-100 text-[#FF3B1F]' : 'opacity-0 group-hover:opacity-60 text-[#9C978E]'
                    }`}
                  >
                    INSPECT →
                  </span>
                </div>
              )
            })}
          </div>

          {/* Right: Active Industry Editorial Showcase Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-36 rounded-2xl hairline-box bg-[#101013]/90 backdrop-blur-md p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#FF3B1F] mb-3">
              <span>ACTIVE SECTOR THESIS</span>
            </div>

            <h4 className="font-display text-3xl md:text-4xl text-[#F1ECE2] mb-3">
              {activeIndustry.name}
            </h4>

            <p className="font-display italic text-lg md:text-xl text-[#FF9E2C] mb-6">
              "{activeIndustry.lead}"
            </p>

            <p className="font-body text-sm md:text-base text-[#9C978E] leading-relaxed mb-8">
              {activeIndustry.narrative}
            </p>

            <div className="hairline-t pt-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9C978E] block mb-3">
                DEPLOYED ACTIVATION CHANNELS
              </span>
              <div className="flex flex-wrap gap-2">
                {activeIndustry.channels.map((ch, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full border border-[rgba(241,236,226,0.15)] bg-[#08080A] font-mono text-xs text-[#F1ECE2]"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
