import React from 'react'
import { SITE_CONFIG } from '../../config/site'

export const Value: React.FC = () => {
  return (
    <section id="value" className="relative py-24 md:py-36 px-6 md:px-10 hairline-b bg-[#08080A]/80" aria-label="Value Proposition">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Sticky Left Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 self-start space-y-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]" />
              <span>THE QUALITATIVE REALITY</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-[#F1ECE2] tracking-tight leading-[1.05]">
              What good marketing <span className="italic">actually changes.</span>
            </h2>
          </div>

          <p className="font-body text-base text-[#9C978E] leading-relaxed">
            Algorithms shift every month, but human desire and market leverage remain consistent. We replace frantic guesswork with foundational positioning that turns attention into compounded equity.
          </p>

          {/* ONE Visual Labeled "Illustrative": Smooth attention-over-time curve with generic axes Time & Impact */}
          <div className="p-6 rounded-xl hairline-box bg-[#101013] space-y-4">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#9C978E] uppercase tracking-[0.14em]">
              <span>ATTENTION PROFILE</span>
              <span className="text-[#FF3B1F] px-2 py-0.5 rounded border border-[#FF3B1F]/30 text-[10px]">
                Illustrative
              </span>
            </div>

            {/* Clean SVG Curve with generic axes */}
            <div className="w-full aspect-[2/1] relative">
              <svg viewBox="0 0 300 150" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Axes */}
                <line x1="30" y1="120" x2="280" y2="120" stroke="rgba(241,236,226,0.2)" strokeWidth="1" />
                <line x1="30" y1="20" x2="30" y2="120" stroke="rgba(241,236,226,0.2)" strokeWidth="1" />

                {/* Axis Labels */}
                <text x="275" y="136" fill="#9C978E" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">TIME →</text>
                <text x="20" y="25" fill="#9C978E" fontSize="9" fontFamily="JetBrains Mono" textAnchor="start">IMPACT ↑</text>

                {/* Flat linear tactics curve (fades away) */}
                <path
                  d="M30 110 Q90 90 150 105 T270 112"
                  fill="none"
                  stroke="#9C978E"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />

                {/* Exponential compounding curve (Unmissable approach) */}
                <path
                  d="M30 115 C80 112 140 100 200 65 C230 45 255 25 270 15"
                  fill="none"
                  stroke="#FF3B1F"
                  strokeWidth="2.5"
                />

                {/* Apex glow point */}
                <circle cx="270" cy="15" r="4" fill="#FF3B1F" />
                <circle cx="270" cy="15" r="8" fill="#FF3B1F" fillOpacity="0.3" />
              </svg>
            </div>

            <p className="font-mono text-[11px] text-[#9C978E] leading-normal">
              Solid curve: Compounded narrative infrastructure vs. dashed: disconnected campaign spikes.
            </p>
          </div>
        </div>

        {/* Right Column: Four Large Statements */}
        <div className="lg:col-span-7 flex flex-col divide-y divide-[rgba(241,236,226,0.12)]">
          {SITE_CONFIG.valuePoints.map((item, idx) => (
            <div key={item.id} className="py-10 md:py-14 first:pt-0 last:pb-0 group">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#FF3B1F] block mb-3">
                0{idx + 1} // LEVERAGE
              </span>
              <h3 className="font-display text-3xl md:text-5xl text-[#F1ECE2] group-hover:text-white transition-colors mb-4">
                {item.title}
              </h3>
              <p className="font-body text-base md:text-lg text-[#9C978E] leading-relaxed max-w-xl font-light">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
