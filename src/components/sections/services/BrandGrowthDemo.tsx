import React, { useEffect, useState } from 'react'

interface DemoProps {
  isActive: boolean
  isReducedMotion?: boolean
}

const PALETTE = [
  { name: 'Ink', hex: '#08080A', border: 'border-white/20' },
  { name: 'Bone', hex: '#F1ECE2', border: 'border-transparent' },
  { name: 'Signal', hex: '#FF3B1F', border: 'border-transparent' },
  { name: 'Amber', hex: '#FF9E2C', border: 'border-transparent' },
  { name: 'Indigo', hex: '#3D2BFF', border: 'border-transparent' },
]

export const BrandGrowthDemo: React.FC<DemoProps> = ({ isActive, isReducedMotion = false }) => {
  const [stage, setStage] = useState(isReducedMotion ? 3 : 0)

  useEffect(() => {
    if (isReducedMotion) {
      setStage(3)
      return
    }

    if (!isActive) {
      setStage(0)
      return
    }

    // Sequence stages:
    // 0: Grid drawing
    // 1: Monogram resolution
    // 2: Swatches appear
    // 3: Typography specimen resolves
    const t1 = setTimeout(() => setStage(1), 800)
    const t2 = setTimeout(() => setStage(2), 1600)
    const t3 = setTimeout(() => setStage(3), 2400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [isActive, isReducedMotion])

  return (
    <div 
      className="relative w-full h-full flex flex-col p-4 md:p-6 bg-[#0B0B0E] rounded-xl hairline-box overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Header with Illustrative Tag */}
      <div className="flex items-center justify-between pb-3 hairline-b mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3D2BFF] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9C978E]">
            IDENTITY ARCHITECTURE // GEOMETRIC MONOGRAM & DESIGN SYSTEM
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-[#3D2BFF]/30 bg-[#3D2BFF]/10 text-[#3D2BFF] font-medium tracking-wider">
          Illustrative
        </span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: SVG Construction Grid & Monogram */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-3 bg-[#101013]/60 rounded-lg border border-white/5 relative">
          <span className="font-mono text-[9px] text-[#9C978E] uppercase tracking-wider mb-1 self-start">
            Precision Grid Alignment
          </span>

          <div className="w-[170px] h-[170px] relative flex items-center justify-center">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 160 160">
              {/* Construction Circles */}
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(241,236,226,0.12)" strokeDasharray="3 3" />
              <circle cx="80" cy="80" r="45" fill="none" stroke="rgba(241,236,226,0.15)" strokeDasharray="2 2" />
              <circle cx="80" cy="80" r="22" fill="none" stroke="rgba(241,236,226,0.15)" />

              {/* Diagonal and Axis Rays */}
              <line x1="10" y1="80" x2="150" y2="80" stroke="rgba(241,236,226,0.1)" strokeWidth="0.8" />
              <line x1="80" y1="10" x2="80" y2="150" stroke="rgba(241,236,226,0.1)" strokeWidth="0.8" />
              <line x1="25" y1="25" x2="135" y2="135" stroke="rgba(241,236,226,0.08)" strokeDasharray="3 3" />
              <line x1="25" y1="135" x2="135" y2="25" stroke="rgba(241,236,226,0.08)" strokeDasharray="3 3" />

              {/* Monogram geometry: Modern architectural 'U' mark */}
              {stage >= 1 && (
                <g className="transition-all duration-700 ease-out">
                  <path
                    d="M 50 45 L 50 95 C 50 115, 110 115, 110 95 L 110 45 L 94 45 L 94 92 C 94 102, 66 102, 66 92 L 66 45 Z"
                    fill="url(#monogramGrad)"
                    stroke="#FF3B1F"
                    strokeWidth="1.5"
                    className="filter drop-shadow-[0_0_15px_rgba(255,59,31,0.4)]"
                  />
                  {/* Internal diamond accent */}
                  <polygon
                    points="80,55 88,68 80,81 72,68"
                    fill="#F1ECE2"
                    opacity="0.9"
                  />
                </g>
              )}

              <defs>
                <linearGradient id="monogramGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF3B1F" />
                  <stop offset="50%" stopColor="#FF9E2C" />
                  <stop offset="100%" stopColor="#3D2BFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex items-center justify-between w-full font-mono text-[9px] text-[#9C978E] mt-1 pt-1 border-t border-white/5">
            <span>Golden Ratio 1:1.618</span>
            <span className="text-[#F1ECE2]">Vector Master</span>
          </div>
        </div>

        {/* Right: Design System Swatches & Type Specimen */}
        <div className="md:col-span-6 flex flex-col h-full justify-between gap-3">
          {/* Swatches */}
          <div className="p-3 bg-[#101013]/60 rounded-lg border border-white/5">
            <span className="font-mono text-[9px] text-[#9C978E] uppercase tracking-wider block mb-2">
              Signature Palette Tokens
            </span>
            <div className="flex gap-2">
              {PALETTE.map((swatch, idx) => {
                const isVisible = stage >= 2
                return (
                  <div
                    key={swatch.name}
                    className={`flex-1 flex flex-col items-center gap-1 transition-all duration-500 ${
                      isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
                    }`}
                    style={{ transitionDelay: `${idx * 80}ms` }}
                  >
                    <div
                      className={`w-full h-8 rounded border ${swatch.border} shadow-sm`}
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span className="font-mono text-[8px] text-[#9C978E]">{swatch.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Typography Specimen */}
          <div
            className={`p-3 bg-[#141419] rounded-lg border border-white/10 flex items-center justify-between transition-all duration-700 ${
              stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2'
            }`}
          >
            <div>
              <span className="font-mono text-[9px] text-[#9C978E] uppercase tracking-wider block">
                Primary Type Pairing
              </span>
              <p className="font-display text-4xl text-[#F1ECE2] leading-none mt-1">
                Aa Bb Gg
              </p>
              <p className="font-mono text-[9px] text-[#9C978E] mt-1">
                Instrument Serif / JetBrains Mono
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                LOCKED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
