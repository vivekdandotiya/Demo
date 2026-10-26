import React from 'react'
import { Palette, Sparkles } from 'lucide-react'
import { StudioTheme } from '../themes'
import { PHOTOS } from '../../../assets/photos'

interface MoodboardWindowProps {
  theme: StudioTheme
  shiftTile: boolean
}

const MOODBOARD_PHOTOS = [
  PHOTOS['product-aeris'] || PHOTOS['abstract-neon'],
  PHOTOS['strategy-collab'] || PHOTOS['abstract-neon'],
  PHOTOS['architecture-glass'] || PHOTOS['abstract-neon'],
  PHOTOS['hands-craft'] || PHOTOS['abstract-neon'],
  PHOTOS['fashion-editorial'] || PHOTOS['abstract-neon'],
  PHOTOS['hospitality-luxury'] || PHOTOS['abstract-neon'],
]

export const MoodboardWindow: React.FC<MoodboardWindowProps> = ({
  theme,
  shiftTile,
}) => {
  return (
    <div
      className="relative w-[300px] h-[310px] rounded-lg bg-[#101013] border border-[rgba(241,236,226,0.14)] shadow-2xl flex flex-col overflow-hidden select-none"
      style={{
        boxShadow: `0 0 35px ${theme.accentGlow.replace('0.45', '0.05')}, 0 20px 45px rgba(0,0,0,0.65)`,
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
            <Palette className="w-3 h-3 text-[#3D2BFF]" />
            <span className="text-[#F1ECE2]">moodboard.ref</span>
          </span>
        </div>

        <div className="flex items-center gap-1 font-mono text-[8px] text-[#FF9E2C] uppercase tracking-wider">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Curated Tokens</span>
        </div>
      </div>

      {/* Grid of 6 Graded Photos */}
      <div className="flex-1 p-2 grid grid-cols-3 gap-1.5 bg-[#0B0B0E] overflow-hidden">
        {MOODBOARD_PHOTOS.map((url, i) => {
          // If shiftTile is true, index shifts by 1
          const activeIndex = shiftTile ? (i + 1) % MOODBOARD_PHOTOS.length : i
          const activeUrl = MOODBOARD_PHOTOS[activeIndex]

          return (
            <div
              key={i}
              className="relative rounded overflow-hidden border border-white/5 bg-[#141419] transition-all duration-700"
            >
              <img
                src={activeUrl}
                alt="Visual token"
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-[0.75] hover:filter-none transition-all duration-500"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-1 left-1 font-mono text-[7px] text-[#9C978E]">
                #{String(i + 1).padStart(2, '0')}
              </span>
            </div>
          )
        })}
      </div>

      {/* Color Chip Strip Footer */}
      <div className="h-8 px-2.5 bg-[#121217] border-t border-white/[0.06] flex items-center justify-between">
        <span className="font-mono text-[8px] text-[#9C978E] uppercase tracking-wider">
          Extracted Palette:
        </span>
        <div className="flex items-center gap-1.5">
          {theme.swatches.map((color, idx) => (
            <div
              key={idx}
              className="w-4 h-4 rounded-xs border border-white/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
