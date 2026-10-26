import React, { useEffect, useRef } from 'react'
import { CAMPAIGN_POSTERS, PosterItem } from '../../content/posters'
import { Poster } from './Poster'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface CampaignWallProps {
  onPosterHover?: (isHovered: boolean) => void
}

export const CampaignWall: React.FC<CampaignWallProps> = ({ onPosterHover }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const columnsRef = useRef<(HTMLDivElement | null)[]>([])
  const tweensRef = useRef<gsap.core.Tween[]>([])
  const prefersReduced = useReducedMotion()

  // Distribute 12 campaign posters across 5 columns
  const col1 = [CAMPAIGN_POSTERS[0], CAMPAIGN_POSTERS[1], CAMPAIGN_POSTERS[2], CAMPAIGN_POSTERS[3]]
  const col2 = [CAMPAIGN_POSTERS[4], CAMPAIGN_POSTERS[5], CAMPAIGN_POSTERS[6], CAMPAIGN_POSTERS[7]]
  const col3 = [CAMPAIGN_POSTERS[8], CAMPAIGN_POSTERS[9], CAMPAIGN_POSTERS[10], CAMPAIGN_POSTERS[11]]
  const col4 = [CAMPAIGN_POSTERS[1], CAMPAIGN_POSTERS[4], CAMPAIGN_POSTERS[7], CAMPAIGN_POSTERS[10]]
  const col5 = [CAMPAIGN_POSTERS[2], CAMPAIGN_POSTERS[5], CAMPAIGN_POSTERS[8], CAMPAIGN_POSTERS[11]]

  const columnsData: { items: PosterItem[]; duration: number; direction: 'up' | 'down' }[] = [
    { items: col1, duration: 32, direction: 'down' },
    { items: col2, duration: 24, direction: 'up' },
    { items: col3, duration: 36, direction: 'down' },
    { items: col4, duration: 28, direction: 'up' },
    { items: col5, duration: 40, direction: 'down' },
  ]

  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return

    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      // Gentle parallax with pointer (up to 16px)
      const xTo = gsap.quickTo(container, 'x', { duration: 0.8, ease: 'power2.out' })
      const yTo = gsap.quickTo(container, 'y', { duration: 0.8, ease: 'power2.out' })

      const handlePointerMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window
        const normX = (e.clientX / innerWidth - 0.5) * 32
        const normY = (e.clientY / innerHeight - 0.5) * 32
        xTo(normX)
        yTo(normY)
      }

      window.addEventListener('pointermove', handlePointerMove, { passive: true })

      // Animate each column endless vertical loop
      columnsRef.current.forEach((colEl, idx) => {
        if (!colEl) return
        const config = columnsData[idx]
        const isUp = config.direction === 'up'

        // Endless loop via translateY
        const tween = gsap.fromTo(
          colEl,
          { yPercent: isUp ? 0 : -50 },
          {
            yPercent: isUp ? -50 : 0,
            duration: config.duration,
            ease: 'none',
            repeat: -1,
          }
        )

        tweensRef.current.push(tween)
      })

      return () => {
        window.removeEventListener('pointermove', handlePointerMove)
      }
    }, container)

    return () => {
      ctx.revert()
      tweensRef.current = []
    }
  }, [prefersReduced])

  const handleMouseEnterColumn = (colIdx: number) => {
    if (prefersReduced) return
    const tween = tweensRef.current[colIdx]
    if (tween) {
      gsap.to(tween, { timeScale: 0, duration: 0.4, ease: 'power2.out' })
    }
    onPosterHover?.(true)
  }

  const handleMouseLeaveColumn = (colIdx: number) => {
    if (prefersReduced) return
    const tween = tweensRef.current[colIdx]
    if (tween) {
      gsap.to(tween, { timeScale: 1, duration: 0.6, ease: 'power2.inOut' })
    }
    onPosterHover?.(false)
  }

  return (
    <div
      ref={containerRef}
      className="campaign-wall-stage absolute -inset-y-24 -right-16 md:-right-24 lg:-right-32 w-[140%] max-w-[1400px] pointer-events-auto select-none"
      style={{
        transform: 'rotate(-7deg) scale(1.15)',
        transformOrigin: 'center center',
      }}
    >
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 h-[160svh] overflow-hidden hero-wall-mask">
        {columnsData.map((col, colIdx) => (
          <div
            key={colIdx}
            className={`flex flex-col gap-4 md:gap-5 will-change-transform ${
              colIdx === 3 ? 'hidden sm:flex' : ''
            } ${colIdx === 4 ? 'hidden lg:flex' : ''}`}
            onMouseEnter={() => handleMouseEnterColumn(colIdx)}
            onMouseLeave={() => handleMouseLeaveColumn(colIdx)}
          >
            <div
              ref={(el) => {
                columnsRef.current[colIdx] = el
              }}
              className="flex flex-col gap-4 md:gap-5"
            >
              {/* Double items for seamless infinite translateY loop */}
              {[...col.items, ...col.items].map((poster, pIdx) => (
                <Poster
                  key={`${colIdx}-${pIdx}-${poster.id}`}
                  poster={poster}
                  priority={colIdx < 2 && pIdx === 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
