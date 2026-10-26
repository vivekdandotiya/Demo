import React, { useEffect, useRef, useState } from 'react'

interface DemoProps {
  isActive: boolean
  isReducedMotion?: boolean
}

export const PaidAdvertisingDemo: React.FC<DemoProps> = ({ isActive, isReducedMotion = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [curveProgress, setCurveProgress] = useState(isReducedMotion ? 1 : 0)

  useEffect(() => {
    if (isReducedMotion) {
      setCurveProgress(1)
      return
    }

    if (!isActive) {
      setCurveProgress(0)
      return
    }

    // Animate the curve line from 0 to 1
    let start: number | null = null
    const duration = 2800

    const animCurve = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start
      const p = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - p, 3)
      setCurveProgress(eased)
      if (p < 1 && isActive) {
        requestAnimationFrame(animCurve)
      }
    }
    const frameId = requestAnimationFrame(animCurve)

    return () => cancelAnimationFrame(frameId)
  }, [isActive, isReducedMotion])

  // Canvas funnel particle stream
  useEffect(() => {
    if (isReducedMotion || !isActive) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = 180)
    const h = (canvas.height = 240)

    interface FunnelDot {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      alpha: number
    }

    const dots: FunnelDot[] = []
    const colors = ['#FF3B1F', '#FF9E2C', '#F1ECE2', '#FF2E93']

    for (let i = 0; i < 40; i++) {
      dots.push({
        x: w / 2 + (Math.random() - 0.5) * 120,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: 1.2 + Math.random() * 1.6,
        size: 1.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.3 + Math.random() * 0.7,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h)

      // Draw Funnel Contour
      ctx.strokeStyle = 'rgba(241, 236, 226, 0.12)'
      ctx.lineWidth = 1
      ctx.beginPath()
      // Left funnel slope
      ctx.moveTo(20, 20)
      ctx.lineTo(75, 160)
      ctx.lineTo(75, 220)
      // Right funnel slope
      ctx.moveTo(160, 20)
      ctx.lineTo(105, 160)
      ctx.lineTo(105, 220)
      ctx.stroke()

      // Update & render dots
      dots.forEach((dot) => {
        dot.y += dot.vy

        // Guide dots into the neck as they travel downward
        const neckY = 160
        if (dot.y < neckY) {
          const ratio = dot.y / neckY
          const allowedWidth = (1 - ratio) * 130 + ratio * 28
          const targetX = w / 2
          dot.x += (targetX - dot.x) * 0.05
          if (Math.abs(dot.x - targetX) > allowedWidth / 2) {
            dot.x = targetX + Math.sign(dot.x - targetX) * (allowedWidth / 2)
          }
        } else {
          // Inside spout: narrow stream
          dot.x += (w / 2 - dot.x) * 0.15
          dot.vy = 3.2 // accelerated exit
        }

        // Reset if reached bottom
        if (dot.y > h) {
          dot.y = 10
          dot.x = w / 2 + (Math.random() - 0.5) * 120
          dot.vy = 1.2 + Math.random() * 1.5
        }

        // Draw Dot
        ctx.fillStyle = dot.color
        ctx.globalAlpha = dot.alpha
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1.0
      animId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animId)
  }, [isActive, isReducedMotion])

  return (
    <div 
      className="relative w-full h-full flex flex-col p-4 md:p-6 bg-[#0B0B0E] rounded-xl hairline-box overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Header with Illustrative Tag */}
      <div className="flex items-center justify-between pb-3 hairline-b mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF9E2C] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9C978E]">
            PAID ATTRIBUTION // CONVERSION FUNNEL & EFFICIENCY
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-[#FF9E2C]/30 bg-[#FF9E2C]/10 text-[#FF9E2C] font-medium tracking-wider">
          Illustrative
        </span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: Narrowing Funnel */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative p-2 bg-[#101013]/50 rounded-lg border border-white/5">
          <span className="font-mono text-[9px] text-[#9C978E] uppercase tracking-wider mb-1">
            Media Spend Filter
          </span>
          <canvas ref={canvasRef} className="w-[160px] h-[190px]" />
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]" />
            <span className="font-mono text-[10px] text-[#F1ECE2]">Qualified Pipeline</span>
          </div>
        </div>

        {/* Right: Cost-Efficiency Curve Line */}
        <div className="md:col-span-7 flex flex-col h-full justify-between p-3 bg-[#101013]/50 rounded-lg border border-white/5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] uppercase text-[#9C978E] tracking-wider">
              Compounding Acquisition Line
            </span>
            <span className="font-mono text-[10px] text-emerald-400">
              Optimal CAC Frontier
            </span>
          </div>

          {/* SVG Line Graph */}
          <div className="relative flex-1 w-full flex flex-col justify-end">
            <svg className="w-full h-[150px] overflow-visible" viewBox="0 0 260 140">
              {/* Background hairline grid */}
              <line x1="30" y1="20" x2="250" y2="20" stroke="rgba(241,236,226,0.06)" strokeDasharray="3 3" />
              <line x1="30" y1="60" x2="250" y2="60" stroke="rgba(241,236,226,0.06)" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="250" y2="100" stroke="rgba(241,236,226,0.06)" strokeDasharray="3 3" />

              {/* Axes */}
              <line x1="30" y1="10" x2="30" y2="120" stroke="rgba(241,236,226,0.3)" strokeWidth="1" />
              <line x1="30" y1="120" x2="255" y2="120" stroke="rgba(241,236,226,0.3)" strokeWidth="1" />

              {/* Labels */}
              <text x="18" y="15" fill="#9C978E" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">
                Efficiency ↑
              </text>
              <text x="250" y="132" fill="#9C978E" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end">
                Week →
              </text>

              {/* Gradient defs */}
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF3B1F" />
                  <stop offset="50%" stopColor="#FF9E2C" />
                  <stop offset="100%" stopColor="#3D2BFF" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF9E2C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FF3B1F" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Curve Path: Swoops smoothly down/compounds up */}
              {/* Total path length ~ 260 */}
              <path
                d="M 35 110 C 80 105, 110 85, 150 45 C 190 15, 220 25, 245 28"
                fill="none"
                stroke="url(#curveGradient)"
                strokeWidth="2.5"
                strokeDasharray="260"
                strokeDashoffset={260 * (1 - curveProgress)}
              />

              {/* Frontier Active Dot */}
              {curveProgress > 0.05 && (
                <circle
                  cx={35 + (245 - 35) * curveProgress}
                  cy={110 - (110 - 28) * Math.pow(curveProgress, 1.4)}
                  r="4"
                  fill="#FF3B1F"
                  className="filter drop-shadow-[0_0_8px_#FF3B1F]"
                />
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono text-[9px] text-[#9C978E]">
            <span>Channel: Meta + Search Arbitrage</span>
            <span className="text-[#F1ECE2]">Algorithmic Pacing Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
