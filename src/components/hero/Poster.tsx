import React from 'react'
import { PosterItem } from '../../content/posters'
import { PHOTOS } from '../../assets/photos'

export interface PosterProps {
  poster: PosterItem
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  priority?: boolean
}

export const Poster: React.FC<PosterProps> = ({
  poster,
  onMouseEnter,
  onMouseLeave,
  priority = false,
}) => {
  const photoUrl = PHOTOS[poster.photoKey]
  const isNineSixteen = poster.format === '9:16'

  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative w-full rounded-xl overflow-hidden hairline-dark bg-[#15171A] group transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] select-none shadow-[0_12px_36px_rgba(0,0,0,0.45)] ${
        isNineSixteen ? 'aspect-[9/16]' : 'aspect-[4/5]'
      }`}
    >
      {/* Background Photography with subtle grade */}
      <img
        src={photoUrl}
        alt={`${poster.brand} campaign poster`}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />

      {/* Cinematic dark gradient scrim for crystal clear readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D0F]/95 via-[#0C0D0F]/45 to-transparent" />

      {/* Poster Content Overlay */}
      <div className="relative z-10 w-full h-full p-4 sm:p-5 flex flex-col justify-between">
        {/* Top Header: Brand wordmark & Category tag */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0C0D0F]/70 backdrop-blur-md border border-white/10">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: poster.accent }}
            />
            <span className="font-display font-bold text-xs tracking-tight text-white">
              {poster.brand}
            </span>
          </div>

          <span className="font-body text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-black/40 text-[#A9A69E] backdrop-blur-sm">
            {poster.tag}
          </span>
        </div>

        {/* Bottom Lockup: Headline & Action Chip */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-[#F3F0E8] leading-[1.05] tracking-tight text-balance">
            {poster.headline}
          </h3>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-tight text-white/90 group-hover:text-[#C8F53C] transition-colors">
              <span>{poster.cta}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </span>

            <span className="font-mono text-[9px] uppercase tracking-widest text-[#A9A69E]/70">
              {poster.format}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
