import React from 'react'
import { CheckCircle2, MessageSquare, Clock } from 'lucide-react'

interface NoteCardsProps {
  showApproved: boolean
  showScheduledToast: boolean
}

export const NoteCards: React.FC<NoteCardsProps> = ({
  showApproved,
  showScheduledToast,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible" aria-hidden="true">
      {/* Sticky Note 1: Headline Approval */}
      <div className="absolute -top-3 left-[42%] transform -rotate-3 p-2 rounded-md bg-[#16161D]/90 backdrop-blur-md border border-[rgba(241,236,226,0.18)] shadow-xl flex items-center gap-2 max-w-[170px]">
        <div className="w-5 h-5 rounded-full bg-[#3D2BFF] flex items-center justify-center font-mono text-[8px] font-bold text-white shrink-0">
          S
        </div>
        <div className="leading-tight">
          <p className="font-mono text-[7px] text-[#9C978E]">Sam, Copy</p>
          <p className="font-body text-[8px] text-[#F1ECE2] font-medium">
            "Love this headline lockup."
          </p>
        </div>
      </div>

      {/* Sticky Note 2: Approved Stamp (Pops up during measure phase) */}
      <div
        className={`absolute bottom-6 left-[18%] transform rotate-2 p-2 rounded-md bg-[#121614]/95 backdrop-blur-md border border-emerald-500/40 shadow-xl flex items-center gap-2 transition-all duration-500 ${
          showApproved
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-90 translate-y-2'
        }`}
      >
        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <div className="leading-tight">
          <p className="font-mono text-[7px] text-emerald-400 font-bold uppercase tracking-wider">
            Approved for Campaign
          </p>
          <p className="font-mono text-[7px] text-[#9C978E]">By Maya, Design</p>
        </div>
      </div>

      {/* Status Toast: Scheduled for Thu */}
      <div
        className={`absolute top-[48%] right-2 transform -translate-y-1/2 p-2 rounded-md bg-[#1C1814]/95 backdrop-blur-md border border-[#FF9E2C]/40 shadow-2xl flex items-center gap-2 transition-all duration-500 ${
          showScheduledToast
            ? 'opacity-100 scale-100 translate-x-0'
            : 'opacity-0 scale-90 translate-x-4'
        }`}
      >
        <div className="w-5 h-5 rounded-full bg-[#FF9E2C] flex items-center justify-center text-black shrink-0">
          <Clock className="w-3.5 h-3.5" />
        </div>
        <div className="leading-tight">
          <p className="font-mono text-[7px] text-[#FF9E2C] font-bold uppercase tracking-wider">
            Scheduled for Thu 10:00
          </p>
          <p className="font-mono text-[7px] text-[#9C978E]">Synchronized Queue</p>
        </div>
      </div>
    </div>
  )
}
