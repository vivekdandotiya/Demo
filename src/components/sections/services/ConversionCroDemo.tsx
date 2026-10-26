import React, { useEffect, useState } from 'react'

interface DemoProps {
  isActive: boolean
  isReducedMotion?: boolean
}

export const ConversionCroDemo: React.FC<DemoProps> = ({ isActive, isReducedMotion = false }) => {
  const [cursorPos, setCursorPos] = useState(isReducedMotion ? { x: 195, y: 155 } : { x: 50, y: 50 })
  const [isClicked, setIsClicked] = useState(isReducedMotion)
  const [showWinner, setShowWinner] = useState(isReducedMotion)

  useEffect(() => {
    if (isReducedMotion) {
      setCursorPos({ x: 195, y: 155 })
      setIsClicked(true)
      setShowWinner(true)
      return
    }

    if (!isActive) {
      setCursorPos({ x: 50, y: 50 })
      setIsClicked(false)
      setShowWinner(false)
      return
    }

    // Step 1: Move cursor from (50, 50) to Variant B's CTA (~195, 155)
    const tMove = setTimeout(() => {
      setCursorPos({ x: 195, y: 155 })
    }, 600)

    // Step 2: Click CTA
    const tClick = setTimeout(() => {
      setIsClicked(true)
    }, 1800)

    // Step 3: Reveal Winner Tag
    const tWin = setTimeout(() => {
      setShowWinner(true)
    }, 2200)

    // Step 4: Loop
    const tLoop = setTimeout(() => {
      setCursorPos({ x: 50, y: 50 })
      setIsClicked(false)
      setShowWinner(false)
    }, 6500)

    return () => {
      clearTimeout(tMove)
      clearTimeout(tClick)
      clearTimeout(tWin)
      clearTimeout(tLoop)
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
          <span className="w-2 h-2 rounded-full bg-[#FF3B1F] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9C978E]">
            CONVERSION TESTING // BAYESIAN A/B WIREFRAME HEATMAP
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-[#FF3B1F]/30 bg-[#FF3B1F]/10 text-[#FF3B1F] font-medium tracking-wider">
          Illustrative
        </span>
      </div>

      <div className="relative flex-1 grid grid-cols-2 gap-4 items-center">
        {/* Wireframe Variant A */}
        <div className="h-[210px] rounded-lg border border-white/5 bg-[#101013]/50 p-3 flex flex-col justify-between opacity-50 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
            <span className="font-mono text-[9px] text-[#9C978E]">VARIANT A (CONTROL)</span>
            <span className="font-mono text-[8px] text-[#9C978E]/60">Baseline</span>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-3/4 rounded bg-white/10" />
            <div className="h-2 w-full rounded bg-white/5" />
            <div className="h-2 w-4/5 rounded bg-white/5" />
          </div>

          <div className="space-y-2">
            <div className="h-10 rounded border border-dashed border-white/10 flex items-center justify-center">
              <span className="font-mono text-[8px] text-[#9C978E]">Hero Graphic</span>
            </div>
            <div className="h-6 rounded bg-white/10 flex items-center justify-center">
              <span className="font-mono text-[8px] text-[#9C978E]">Standard CTA</span>
            </div>
          </div>

          <div className="font-mono text-[8px] text-[#9C978E] text-center pt-1 border-t border-white/5">
            Conversion: Baseline
          </div>
        </div>

        {/* Wireframe Variant B (Challenger with Heatmap) */}
        <div className="h-[210px] rounded-lg border border-[#FF3B1F]/50 bg-[#121217] p-3 flex flex-col justify-between relative overflow-hidden shadow-[0_0_30px_rgba(255,59,31,0.15)]">
          {/* Heatmap Bloom Layer */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
            style={{
              background:
                'radial-gradient(circle at 65% 75%, rgba(255,59,31,0.45) 0%, rgba(255,158,44,0.3) 30%, rgba(61,43,255,0.15) 55%, transparent 75%)',
            }}
          />

          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-mono text-[9px] text-[#FF3B1F] font-bold">VARIANT B (OPTIMIZED)</span>
            {showWinner && (
              <span className="font-mono text-[8px] uppercase px-1.5 py-0.5 rounded bg-[#FF3B1F] text-white font-bold animate-pulse">
                ★ B WINS (+41.8%)
              </span>
            )}
          </div>

          <div className="relative z-10 space-y-2">
            <div className="h-4 w-4/5 rounded bg-gradient-to-r from-[#FF3B1F] to-[#FF9E2C]" />
            <div className="h-2 w-full rounded bg-white/15" />
            <div className="h-2 w-5/6 rounded bg-white/15" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="h-10 rounded border border-white/15 bg-white/[0.02] flex items-center justify-center">
              <span className="font-mono text-[8px] text-[#F1ECE2]">Frictionless Form</span>
            </div>
            {/* Clickable CTA with ripple */}
            <div
              className={`h-7 rounded flex items-center justify-center transition-transform duration-150 ${
                isClicked
                  ? 'bg-white text-black scale-95 shadow-[0_0_15px_#FF3B1F]'
                  : 'bg-[#FF3B1F] text-white'
              }`}
            >
              <span className="font-mono text-[9px] font-bold">Unmissable CTA →</span>
            </div>
          </div>

          <div className="relative z-10 font-mono text-[8px] text-emerald-400 font-bold text-center pt-1 border-t border-white/10">
            Statistical Confidence: 99.4%
          </div>
        </div>

        {/* Simulated Travelling Cursor */}
        <div
          className="absolute z-30 pointer-events-none transition-all duration-1000 ease-out"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          <svg className="w-5 h-5 text-white filter drop-shadow-md" viewBox="0 0 24 24" fill="white">
            <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.879z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
