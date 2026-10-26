import React, { useEffect, useState } from 'react'

interface DemoProps {
  isActive: boolean
  isReducedMotion?: boolean
}

interface CalendarSlot {
  day: string
  tag: string
  color: string
  bg: string
  title: string
}

const SCHEDULE: CalendarSlot[] = [
  { day: 'MON', tag: 'ARTICLE', color: '#FF9E2C', bg: 'rgba(255, 158, 44, 0.15)', title: 'Topical Deep-Dive' },
  { day: 'TUE', tag: 'VIDEO', color: '#FF3B1F', bg: 'rgba(255, 59, 31, 0.15)', title: 'Executive Clip' },
  { day: 'WED', tag: 'EMAIL', color: '#3D2BFF', bg: 'rgba(61, 43, 255, 0.15)', title: 'Weekly Dispatch' },
  { day: 'THU', tag: 'SOCIAL', color: '#FF2E93', bg: 'rgba(255, 46, 147, 0.15)', title: 'Narrative Carousel' },
  { day: 'FRI', tag: 'REPORT', color: '#F1ECE2', bg: 'rgba(241, 236, 226, 0.12)', title: 'Proprietary Teardown' },
]

export const ContentStrategyDemo: React.FC<DemoProps> = ({ isActive, isReducedMotion = false }) => {
  const [filledIndex, setFilledIndex] = useState(isReducedMotion ? SCHEDULE.length : 0)
  const fullHeadline = 'The Death of Generic Positioning // Issue 48'
  const [typedHeadline, setTypedHeadline] = useState(isReducedMotion ? fullHeadline : '')

  useEffect(() => {
    if (isReducedMotion) {
      setFilledIndex(SCHEDULE.length)
      setTypedHeadline(fullHeadline)
      return
    }

    if (!isActive) {
      setFilledIndex(0)
      setTypedHeadline('')
      return
    }

    let currentSlot = 0
    // Fill calendar cells one by one
    const fillInterval = setInterval(() => {
      currentSlot++
      setFilledIndex(currentSlot)
      if (currentSlot >= SCHEDULE.length) {
        clearInterval(fillInterval)
      }
    }, 450)

    // Simultaneously type draft headline
    let charIdx = 0
    let typeInterval: any = null
    const typeDelay = setTimeout(() => {
      typeInterval = setInterval(() => {
        charIdx++
        setTypedHeadline(fullHeadline.slice(0, charIdx))
        if (charIdx >= fullHeadline.length) {
          clearInterval(typeInterval)
        }
      }, 50)
    }, 600)

    return () => {
      clearInterval(fillInterval)
      clearTimeout(typeDelay)
      clearInterval(typeInterval)
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
          <span className="w-2 h-2 rounded-full bg-[#8A2BE2] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9C978E]">
            EDITORIAL ENGINE // HIGH-DENSITY CONTENT PIPELINE
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-[#8A2BE2]/30 bg-[#8A2BE2]/10 text-[#8A2BE2] font-medium tracking-wider">
          Illustrative
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-4">
        {/* Weekly Editorial Calendar Grid */}
        <div className="p-3 bg-[#101013]/60 rounded-lg border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase text-[#9C978E] tracking-wider">
              Weekly Multi-Format Release Cadence
            </span>
            <span className="font-mono text-[9px] text-emerald-400">
              5/5 Channels Active
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {SCHEDULE.map((item, idx) => {
              const isFilled = idx < filledIndex
              return (
                <div
                  key={item.day}
                  className={`p-2 rounded border transition-all duration-500 flex flex-col justify-between min-h-[75px] ${
                    isFilled
                      ? 'border-white/15 bg-white/[0.03]'
                      : 'border-white/5 bg-transparent opacity-30'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#9C978E]">{item.day}</span>
                  {isFilled ? (
                    <div className="mt-1">
                      <span
                        className="inline-block px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider mb-1"
                        style={{ backgroundColor: item.bg, color: item.color }}
                      >
                        {item.tag}
                      </span>
                      <p className="font-mono text-[8px] text-[#F1ECE2]/80 truncate">
                        {item.title}
                      </p>
                    </div>
                  ) : (
                    <span className="font-mono text-[9px] text-[#9C978E]/40 italic">Queued</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Live Draft Typing Card */}
        <div className="p-3.5 bg-[#141419] rounded-lg border border-white/10 flex flex-col gap-2 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D2BFF]" />
              <span className="font-mono text-[10px] text-[#9C978E] uppercase tracking-wider">
                Active Longform Draft
              </span>
            </div>
            <span className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              READY FOR SYNDICATION
            </span>
          </div>

          {/* Typing Headline */}
          <div className="min-h-[38px] flex items-center">
            <h4 className="font-display text-base md:text-lg text-[#F1ECE2] italic font-light tracking-tight">
              "{typedHeadline}"
              {typedHeadline.length < fullHeadline.length && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-[#3D2BFF] align-middle animate-pulse" />
              )}
            </h4>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/5 gap-2 font-mono text-[9px] text-[#9C978E]">
            <div className="flex items-center gap-2">
              <span>FORMATS:</span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#F1ECE2]">Newsletter</span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#F1ECE2]">LinkedIn Lead</span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#F1ECE2]">Podcast Script</span>
            </div>
            <span className="text-amber-400">Zero AI Hallucination</span>
          </div>
        </div>
      </div>
    </div>
  )
}
