import React from 'react'
import { LineChart, Activity } from 'lucide-react'
import { StudioTheme } from '../themes'

interface AnalyticsWindowProps {
  theme: StudioTheme
  curveProgress: number
}

export const AnalyticsWindow: React.FC<AnalyticsWindowProps> = ({
  theme,
  curveProgress,
}) => {
  return (
    <div
      className="relative w-[310px] h-[190px] rounded-lg bg-[#101013] border border-[rgba(241,236,226,0.14)] shadow-2xl flex flex-col overflow-hidden select-none"
      style={{
        boxShadow: `0 0 35px ${theme.accentGlow.replace('0.45', '0.06')}, 0 15px 35px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Title Bar */}
      <div className="h-7 px-3 bg-[#141419] border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
          </div>
          <span className="font-mono text-[9px] text-[#9C978E] ml-1 tracking-wide flex items-center gap-1">
            <LineChart className="w-3 h-3 text-[#FF3B1F]" />
            <span className="text-[#F1ECE2]">performance.metric</span>
          </span>
        </div>

        <span className="font-mono text-[8px] uppercase px-1.5 py-0.5 rounded border border-[#FF3B1F]/30 bg-[#FF3B1F]/10 text-[#FF3B1F] font-medium tracking-wider">
          Illustrative
        </span>
      </div>

      {/* Main Graph Body */}
      <div className="flex-1 p-3 bg-[#0B0B0E] flex flex-col justify-between">
        <div className="flex items-center justify-between font-mono text-[8px] text-[#9C978E]">
          <span className="flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-emerald-400" />
            <span>Telemetry: Real-Time</span>
          </span>
          <span className="text-[#F1ECE2]">Optimal Trajectory</span>
        </div>

        {/* Self-drawing SVG Curve */}
        <div className="relative w-full h-[85px] flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 240 75">
            {/* Grid Lines */}
            <line x1="25" y1="10" x2="235" y2="10" stroke="rgba(241,236,226,0.06)" strokeDasharray="3 3" />
            <line x1="25" y1="35" x2="235" y2="35" stroke="rgba(241,236,226,0.06)" strokeDasharray="3 3" />
            <line x1="25" y1="60" x2="235" y2="60" stroke="rgba(241,236,226,0.06)" strokeDasharray="3 3" />

            {/* Axes */}
            <line x1="25" y1="5" x2="25" y2="65" stroke="rgba(241,236,226,0.2)" strokeWidth="1" />
            <line x1="25" y1="65" x2="238" y2="65" stroke="rgba(241,236,226,0.2)" strokeWidth="1" />

            {/* Generic Labels (No numbers) */}
            <text x="18" y="12" fill="#9C978E" fontSize="7" fontFamily="JetBrains Mono" textAnchor="end">
              Impact ↑
            </text>
            <text x="235" y="73" fill="#9C978E" fontSize="7" fontFamily="JetBrains Mono" textAnchor="end">
              Time →
            </text>

            {/* Gradient definition */}
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF3B1F" />
                <stop offset="60%" stopColor="#FF9E2C" />
                <stop offset="100%" stopColor="#3D2BFF" />
              </linearGradient>
            </defs>

            {/* Compounding Curve Path */}
            <path
              d="M 28 60 C 70 58, 110 48, 150 25 C 185 8, 210 12, 230 10"
              fill="none"
              stroke="url(#analyticsGrad)"
              strokeWidth="2.5"
              strokeDasharray="230"
              strokeDashoffset={230 * (1 - curveProgress)}
              className="transition-all duration-300"
            />

            {/* Glowing Leading Dot */}
            {curveProgress > 0.05 && (
              <circle
                cx={28 + (230 - 28) * curveProgress}
                cy={60 - (60 - 10) * Math.pow(curveProgress, 1.3)}
                r="3.5"
                fill="#FF3B1F"
                className="filter drop-shadow-[0_0_8px_#FF3B1F]"
              />
            )}
          </svg>
        </div>

        {/* Generic Metric Summary Line */}
        <div className="pt-1 border-t border-white/[0.05] flex items-center justify-between font-mono text-[8px]">
          <span className="text-[#9C978E]">{theme.metrics.stat1Label}</span>
          <span className="text-emerald-400 font-semibold">{theme.metrics.stat1Val}</span>
          <span className="text-[#9C978E]">{theme.metrics.stat2Label}</span>
          <span className="text-[#FF9E2C] font-semibold">{theme.metrics.stat2Val}</span>
        </div>
      </div>
    </div>
  )
}
