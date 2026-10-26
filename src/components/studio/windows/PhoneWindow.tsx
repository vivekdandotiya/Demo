import React from 'react'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react'
import { StudioTheme } from '../themes'

interface PhoneWindowProps {
  theme: StudioTheme
  isPostPublished: boolean
  floatingHeartsCount: number
  showComments: boolean
}

export const PhoneWindow: React.FC<PhoneWindowProps> = ({
  theme,
  isPostPublished,
  floatingHeartsCount,
  showComments,
}) => {
  return (
    <div
      className="relative w-[230px] h-[340px] rounded-[24px] bg-[#0E0E12] border-2 border-[rgba(241,236,226,0.22)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden select-none"
      style={{
        boxShadow: `0 0 45px ${theme.accentGlow.replace('0.45', '0.12')}, 0 25px 60px rgba(0,0,0,0.85)`,
      }}
    >
      {/* Top Phone Notch / Dynamic Island */}
      <div className="pt-2 px-3 flex items-center justify-between z-20 shrink-0">
        <span className="font-mono text-[9px] text-[#9C978E] font-semibold">09:41</span>
        <div className="w-14 h-3.5 bg-black rounded-full flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-1.5 rounded-xs bg-[#F1ECE2]/80" />
        </div>
      </div>

      {/* Social Post Feed Header */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-white/[0.05] z-10 shrink-0">
        <div className="flex items-center gap-2">
          {/* Avatar Initials Circle */}
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] font-bold text-white shadow-sm"
            style={{ backgroundColor: theme.accentColor }}
          >
            {theme.avatarInitials}
          </div>
          <div>
            <p className="font-mono text-[10px] text-[#F1ECE2] font-semibold leading-tight">
              {theme.handle}
            </p>
            <p className="font-mono text-[7px] text-[#9C978E]">Sponsored // Global</p>
          </div>
        </div>
        <MoreHorizontal className="w-3.5 h-3.5 text-[#9C978E]" />
      </div>

      {/* Main Post Media (Slides in on Publish) */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {isPostPublished ? (
          <div className="relative w-full h-full flex flex-col justify-between p-2.5 bg-cover bg-center transition-all duration-700 animate-in fade-in" style={{ backgroundImage: `url(${theme.photoUrl})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
            
            <div className="relative z-10 flex justify-between items-center">
              <span className="font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-black/60 text-[#F1ECE2]">
                {theme.brandName}
              </span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
            </div>

            <div className="relative z-10">
              <h5 className="font-display text-sm text-white font-medium italic">
                "{theme.headline}"
              </h5>
              <p className="font-mono text-[7px] text-[#F1ECE2]/80 mt-0.5 truncate">
                {theme.subhead}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-[#9C978E]/60 gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-wider">
              Awaiting Feed Publish
            </span>
            <span className="w-2 h-2 rounded-full bg-white/20 animate-ping" />
          </div>
        )}

        {/* Floating Heart Reactions */}
        {floatingHeartsCount > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
            {Array.from({ length: floatingHeartsCount }).map((_, i) => (
              <div
                key={i}
                className="absolute text-[#FF3B1F] animate-bounce"
                style={{
                  left: `${25 + (i * 12) % 60}%`,
                  bottom: `${15 + (i * 15)}%`,
                  opacity: Math.max(0.2, 1 - i * 0.12),
                  transform: `scale(${0.8 + (i % 3) * 0.2})`,
                  transition: 'all 0.8s ease-out',
                }}
              >
                <Heart className="w-4 h-4 fill-[#FF3B1F]" />
              </div>
            ))}
          </div>
        )}

        {/* Pop-in Comment Bubbles */}
        {showComments && (
          <div className="absolute bottom-2 inset-x-2 z-20 flex flex-col gap-1 pointer-events-none">
            {theme.comments.map((c, i) => (
              <div
                key={i}
                className="px-2 py-1 rounded bg-black/85 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[8px] text-[#F1ECE2] shadow-lg animate-in slide-in-from-bottom duration-300"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <span className="font-mono font-bold text-[#FF9E2C]">@{c.user}:</span>
                <span className="font-body truncate">{c.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Social Engagement Action Icons (NO numbers, only icons) */}
      <div className="p-2.5 bg-[#121217] border-t border-white/[0.06] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Heart className={`w-4 h-4 transition-colors ${isPostPublished ? 'text-[#FF3B1F] fill-[#FF3B1F]' : 'text-[#9C978E]'}`} />
          <MessageCircle className="w-4 h-4 text-[#9C978E]" />
          <Send className="w-4 h-4 text-[#9C978E]" />
        </div>
        <Bookmark className="w-4 h-4 text-[#9C978E]" />
      </div>

      {/* Home Navigation Indicator Bar */}
      <div className="pb-1 pt-0.5 flex justify-center bg-[#121217]">
        <div className="w-20 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  )
}
