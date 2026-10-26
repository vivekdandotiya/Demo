import React from 'react'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { StudioTheme } from '../themes'

interface CalendarWindowProps {
  theme: StudioTheme
  thuStatus: 'draft' | 'scheduled' | 'published'
  thuSlotRef?: React.RefObject<HTMLDivElement | null>
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export const CalendarWindow: React.FC<CalendarWindowProps> = ({
  theme,
  thuStatus,
  thuSlotRef,
}) => {
  return (
    <div
      className="relative w-[340px] h-[260px] rounded-lg bg-[#101013] border border-[rgba(241,236,226,0.14)] shadow-2xl flex flex-col overflow-hidden select-none"
      style={{
        boxShadow: `0 0 35px ${theme.accentGlow.replace('0.45', '0.06')}, 0 15px 40px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Title Bar */}
      <div className="h-8 px-3 bg-[#141419] border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
          </div>
          <span className="font-mono text-[10px] text-[#9C978E] ml-1 tracking-wide flex items-center gap-1.5">
            <CalendarIcon className="w-3 h-3 text-[#FF9E2C]" />
            <span className="text-[#F1ECE2]">content-calendar.plan</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/5 text-[#9C978E]">
            Week 42
          </span>
        </div>
      </div>

      {/* Week Grid Header */}
      <div className="grid grid-cols-7 border-b border-white/[0.06] bg-[#121217] py-1.5 px-2 font-mono text-[9px] text-center text-[#9C978E]">
        {DAYS.map((d, i) => (
          <span
            key={d}
            className={`font-semibold ${i === 3 ? 'text-[#FF3B1F]' : ''}`}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Time Slots Content */}
      <div className="flex-1 p-2 grid grid-cols-7 gap-1 bg-[#0B0B0E] overflow-hidden">
        {/* Mon */}
        <div className="border border-white/5 rounded p-1 flex flex-col justify-between bg-white/[0.01]">
          <span className="font-mono text-[8px] text-[#9C978E]">09:00</span>
          <div className="p-1 rounded bg-white/5 border border-white/5">
            <span className="font-mono text-[7px] text-[#9C978E] block truncate">
              Stories
            </span>
            <span className="inline-block mt-0.5 text-[6px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400">
              Live
            </span>
          </div>
        </div>

        {/* Tue */}
        <div className="border border-white/5 rounded p-1 flex flex-col justify-between bg-white/[0.01]">
          <span className="font-mono text-[8px] text-[#9C978E]">14:00</span>
          <div className="p-1 rounded bg-white/5 border border-white/5">
            <span className="font-mono text-[7px] text-[#9C978E] block truncate">
              Teardown
            </span>
            <span className="inline-block mt-0.5 text-[6px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400">
              Done
            </span>
          </div>
        </div>

        {/* Wed */}
        <div className="border border-white/5 rounded p-1 flex flex-col justify-between bg-white/[0.01]">
          <span className="font-mono text-[8px] text-[#9C978E]">11:00</span>
          <div className="p-1 rounded bg-white/5 border border-white/5">
            <span className="font-mono text-[7px] text-[#9C978E] block truncate">
              Reel
            </span>
            <span className="inline-block mt-0.5 text-[6px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400">
              Done
            </span>
          </div>
        </div>

        {/* Thu (Active Target Slot) */}
        <div
          ref={thuSlotRef}
          className={`calendar-thu-slot border rounded p-1 flex flex-col justify-between transition-all duration-500 ${
            thuStatus === 'published'
              ? 'border-emerald-500/50 bg-emerald-500/10'
              : thuStatus === 'scheduled'
              ? 'border-[#FF9E2C]/50 bg-[#FF9E2C]/10'
              : 'border-[#FF3B1F]/40 bg-[#FF3B1F]/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] font-semibold text-[#FF3B1F]">
              10:00
            </span>
            <Clock className="w-2.5 h-2.5 text-[#FF9E2C]" />
          </div>

          {/* Slot Post Card */}
          <div className="p-1 rounded bg-[#101013] border border-white/10 flex flex-col gap-1 shadow-md">
            <div className="w-full h-8 rounded overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${theme.photoUrl})` }} />
            <span className="font-mono text-[7px] text-[#F1ECE2] font-medium truncate">
              {theme.brandName}
            </span>

            {/* Status Chip */}
            <span
              className={`font-mono text-[6px] uppercase px-1 py-0.5 rounded font-bold tracking-wider text-center transition-colors duration-300 ${
                thuStatus === 'published'
                  ? 'bg-emerald-500 text-black font-extrabold'
                  : thuStatus === 'scheduled'
                  ? 'bg-[#FF9E2C] text-black font-bold'
                  : 'bg-white/10 text-[#9C978E]'
              }`}
            >
              {thuStatus === 'published'
                ? '● Published'
                : thuStatus === 'scheduled'
                ? '★ Scheduled'
                : '○ Draft'}
            </span>
          </div>
        </div>

        {/* Fri */}
        <div className="border border-white/5 rounded p-1 flex flex-col justify-between bg-white/[0.01]">
          <span className="font-mono text-[8px] text-[#9C978E]">16:00</span>
          <div className="p-1 rounded bg-white/5 border border-white/5">
            <span className="font-mono text-[7px] text-[#9C978E] block truncate">
              Newsletter
            </span>
            <span className="inline-block mt-0.5 text-[6px] font-mono px-1 rounded bg-white/10 text-[#9C978E]">
              Draft
            </span>
          </div>
        </div>

        {/* Sat */}
        <div className="border border-white/5 rounded p-1 flex flex-col justify-between opacity-40">
          <span className="font-mono text-[8px] text-[#9C978E]">--:--</span>
          <span className="font-mono text-[7px] text-[#9C978E] italic text-center">Off</span>
        </div>

        {/* Sun */}
        <div className="border border-white/5 rounded p-1 flex flex-col justify-between opacity-40">
          <span className="font-mono text-[8px] text-[#9C978E]">--:--</span>
          <span className="font-mono text-[7px] text-[#9C978E] italic text-center">Off</span>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="h-6 px-3 bg-[#141419] border-t border-white/[0.06] flex items-center justify-between font-mono text-[8px] text-[#9C978E]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Queue Sync: Continuous</span>
        </div>
        <span>Multi-Platform Dispatch</span>
      </div>
    </div>
  )
}
