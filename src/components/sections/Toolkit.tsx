import React from 'react'
import { SITE_CONFIG } from '../../config/site'

export const Toolkit: React.FC = () => {
  return (
    <section className="relative py-20 md:py-32 px-6 md:px-10 hairline-b bg-[#08080A]/85 overflow-hidden select-none" aria-label="Toolkit & Channels">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]" />
              <span>DISTRIBUTION INFRASTRUCTURE // NO LOGOS</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-[#F1ECE2] tracking-tight">
              Toolkit & <span className="italic">channels mastered.</span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs text-[#9C978E] leading-relaxed">
            We maintain platform neutrality. Media channels are selected purely based on unit economics and audience concentration.
          </p>
        </div>

        {/* 4 Categorized Columns with Crisp Minimalist Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_CONFIG.toolkitChannels.map((group, idx) => (
            <div
              key={idx}
              className="p-6 md:p-8 rounded-xl hairline-box bg-[#101013] hover:border-[#FF3B1F]/40 transition-colors"
            >
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#FF3B1F] block mb-4">
                0{idx + 1} // {group.category}
              </span>
              <ul className="space-y-3 font-mono text-xs text-[#F1ECE2]/90">
                {group.channels.map((ch, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="text-[#FF9E2C] text-[10px]">✦</span>
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
