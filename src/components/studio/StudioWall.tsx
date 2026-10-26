import React, { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { useTier } from '../../hooks/useTier'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIsTouch } from '../../hooks/useIsTouch'
import { DesignWindow } from './windows/DesignWindow'
import { CalendarWindow } from './windows/CalendarWindow'
import { PhoneWindow } from './windows/PhoneWindow'
import { MoodboardWindow } from './windows/MoodboardWindow'
import { AnalyticsWindow } from './windows/AnalyticsWindow'
import { NoteCards } from './windows/NoteCards'
import { Cursors } from './Cursors'
import {
  createStudioTimeline,
  INITIAL_TIMELINE_STATE,
  StudioTimelineState,
} from './timeline'

interface StudioWallProps {
  mode?: 'hero' | 'finalCta' | 'mobile'
  scrollProgress?: number
}

export const StudioWall: React.FC<StudioWallProps> = ({
  mode = 'hero',
  scrollProgress = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wall3dRef = useRef<HTMLDivElement>(null)
  const designWinRef = useRef<HTMLDivElement>(null)
  const calendarWinRef = useRef<HTMLDivElement>(null)
  const phoneWinRef = useRef<HTMLDivElement>(null)
  const moodboardWinRef = useRef<HTMLDivElement>(null)
  const analyticsWinRef = useRef<HTMLDivElement>(null)

  const { tier } = useTier()
  const prefersReduced = useReducedMotion()
  const isTouch = useIsTouch()

  const [timelineState, setTimelineState] = useState<StudioTimelineState>(
    INITIAL_TIMELINE_STATE
  )
  const [visitorTag, setVisitorTag] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  })

  // 1. Initialize and Manage the Master Timeline
  useEffect(() => {
    const controller = createStudioTimeline((newState) => {
      setTimelineState(newState)
    }, prefersReduced)

    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !document.hidden) {
            controller.play()
          } else {
            controller.pause()
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(container)

    const onVisibilityChange = () => {
      if (document.hidden) {
        controller.pause()
      } else {
        controller.play()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      controller.kill()
    }
  }, [prefersReduced])

  // 2. Interactive Pointer Parallax (Eased lerp ~0.06 via quickTo)
  useEffect(() => {
    if (prefersReduced || isTouch || mode === 'finalCta' || mode === 'mobile') return
    const wall = wall3dRef.current
    if (!wall) return

    const rotXTo = gsap.quickTo(wall, 'rotationX', { duration: 0.8, ease: 'power2.out' })
    const rotYTo = gsap.quickTo(wall, 'rotationY', { duration: 0.8, ease: 'power2.out' })

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const normX = (e.clientX / innerWidth - 0.5) * 2 // -1 to 1
      const normY = (e.clientY / innerHeight - 0.5) * 2

      // Base: rotateY(-14deg) rotateX(6deg) with +/- 5.5deg mouse tilt
      const targetRotY = -14 + normX * 5.5
      const targetRotX = 6 - normY * 4.5

      rotYTo(targetRotY)
      rotXTo(targetRotX)

      // Check if visitor is hovering over the wall container
      const rect = wall.getBoundingClientRect()
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        setVisitorTag({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          visible: true,
        })
      } else {
        setVisitorTag((prev) => ({ ...prev, visible: false }))
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [prefersReduced, isTouch, mode])

  // 3. Scroll Transition: "Dive Into The Artboard"
  const diveScale = mode === 'hero' ? 1.0 + scrollProgress * 1.8 : 0.85
  const diveTranslateZ = mode === 'hero' ? scrollProgress * 650 : -150
  const peripheralOpacity = mode === 'hero' ? Math.max(0, 1.0 - scrollProgress * 2.2) : 0.45

  const { theme } = timelineState

  // ========================================================
  // MOBILE STANDALONE MODE (< 900px, Below Headline)
  // ========================================================
  if (mode === 'mobile') {
    return (
      <div className="w-full flex flex-col items-center gap-4 select-none" aria-hidden="true">
        {/* Design Window Scaled */}
        <div className="w-full flex justify-center overflow-hidden">
          <div className="transform scale-[0.64] xs:scale-[0.68] sm:scale-75 origin-top shrink-0 -my-6">
            <DesignWindow
              theme={theme}
              activeSwatchIndex={timelineState.activeSwatchIndex}
              isExporting={timelineState.isExporting}
              zoomPercent={timelineState.zoomPercent}
              typedText={timelineState.typedText}
              isShapeDrawn={timelineState.isShapeDrawn}
              isPhotoDropped={timelineState.isPhotoDropped}
              isHandlesVisible={timelineState.isHandlesVisible}
            />
          </div>
        </div>

        {/* Phone Window Scaled */}
        <div className="w-full flex justify-end pr-2 -mt-4">
          <div className="transform scale-[0.82] sm:scale-90 origin-top-right shrink-0">
            <PhoneWindow
              theme={theme}
              isPostPublished={timelineState.isPostPublished}
              floatingHeartsCount={timelineState.floatingHeartsCount}
              showComments={timelineState.showComments}
            />
          </div>
        </div>

        <div className="font-mono text-[8px] text-[#9C978E] uppercase tracking-widest text-center mt-2">
          Concept project, illustrative
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${
        mode === 'finalCta' ? 'opacity-35 scale-90' : ''
      }`}
      aria-hidden="true"
    >
      {/* ========================================================
          DESKTOP 3D TILTED WALL (>= 900px)
          ======================================================== */}
      <div className="hidden min-[900px]:block absolute inset-0">
        {/* CSS 3D Perspective Stage */}
        <div
          className="w-full h-full flex items-center justify-end pr-4 lg:pr-12 2xl:pr-28"
          style={{
            perspective: '1600px',
            perspectiveOrigin: '70% 50%',
          }}
        >
          {/* Main Tilted Wall Container */}
          <div
            ref={wall3dRef}
            className="relative w-[840px] h-[640px] 2xl:scale-125 2xl:origin-right transition-transform will-change-transform transform-gpu pointer-events-auto"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(-14deg) rotateX(6deg) scale(${diveScale}) translateZ(${diveTranslateZ}px)`,
            }}
          >
            {/* 1. MOODBOARD WINDOW (Left, translateZ -180px) */}
            <div
              ref={moodboardWinRef}
              className="absolute top-10 -left-24 transition-opacity duration-300"
              style={{
                transform: 'translate3d(0, 0, -180px)',
                opacity: peripheralOpacity * 0.75,
              }}
            >
              <MoodboardWindow
                theme={theme}
                shiftTile={timelineState.shiftMoodboard}
              />
            </div>

            {/* 2. ANALYTICS WINDOW (Bottom Center, translateZ -50px) */}
            {tier === 1 && (
              <div
                ref={analyticsWinRef}
                className="absolute -bottom-8 left-16 transition-opacity duration-300"
                style={{
                  transform: 'translate3d(0, 0, -50px)',
                  opacity: peripheralOpacity * 0.85,
                }}
              >
                <AnalyticsWindow
                  theme={theme}
                  curveProgress={timelineState.curveProgress}
                />
              </div>
            )}

            {/* 3. DESIGN WINDOW (Center Stage, translateZ +20px) */}
            <div
              ref={designWinRef}
              className="absolute top-16 left-28 z-20 transition-transform duration-200 hover:-translate-y-2 hover:border-white/30"
              style={{
                transform: 'translate3d(0, 0, 20px)',
              }}
            >
              <DesignWindow
                theme={theme}
                activeSwatchIndex={timelineState.activeSwatchIndex}
                isExporting={timelineState.isExporting}
                zoomPercent={timelineState.zoomPercent}
                typedText={timelineState.typedText}
                isShapeDrawn={timelineState.isShapeDrawn}
                isPhotoDropped={timelineState.isPhotoDropped}
                isHandlesVisible={timelineState.isHandlesVisible}
              />
            </div>

            {/* 4. CONTENT CALENDAR WINDOW (Upper Right, translateZ +80px) */}
            <div
              ref={calendarWinRef}
              className="absolute -top-4 right-2 z-25 transition-opacity duration-300"
              style={{
                transform: 'translate3d(0, 0, 80px)',
                opacity: peripheralOpacity,
              }}
            >
              <CalendarWindow
                theme={theme}
                thuStatus={timelineState.thuStatus}
              />
            </div>

            {/* 5. PHONE (Lower Right Foreground, translateZ +160px) */}
            <div
              ref={phoneWinRef}
              className="absolute -bottom-10 right-10 z-30 transition-opacity duration-300"
              style={{
                transform: 'translate3d(0, 0, 160px)',
                opacity: peripheralOpacity,
                filter: tier === 1 && !prefersReduced ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))' : 'none',
              }}
            >
              <PhoneWindow
                theme={theme}
                isPostPublished={timelineState.isPostPublished}
                floatingHeartsCount={timelineState.floatingHeartsCount}
                showComments={timelineState.showComments}
              />
            </div>

            {/* 6. FLYING THUMBNAIL CARD (During Schedule phase) */}
            {timelineState.flyingCard.visible && (
              <div
                className="absolute z-50 w-28 h-36 rounded border border-[#FF3B1F] bg-[#101013] overflow-hidden shadow-[0_0_25px_#FF3B1F] pointer-events-none transition-transform"
                style={{
                  transform: `translate3d(${timelineState.flyingCard.x}px, ${timelineState.flyingCard.y}px, 140px) scale(${timelineState.flyingCard.scale})`,
                  opacity: timelineState.flyingCard.opacity,
                }}
              >
                <img
                  src={theme.photoUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 7. SMALL NOTE CARDS & STATUS TOAST (translateZ +190px) */}
            {peripheralOpacity > 0.2 && (
              <div
                style={{
                  transform: 'translate3d(0, 0, 190px)',
                }}
              >
                <NoteCards
                  showApproved={timelineState.showApproved}
                  showScheduledToast={timelineState.showScheduledToast}
                />
              </div>
            )}

            {/* 8. TEAMMATE CURSORS (Maya, Arjun, Sam) (translateZ +220px) */}
            {!prefersReduced && peripheralOpacity > 0.3 && (
              <div
                style={{
                  transform: 'translate3d(0, 0, 220px)',
                }}
              >
                <Cursors state={timelineState.cursors} />
              </div>
            )}

            {/* 9. VISITOR "YOU" CURSOR TAG */}
            {visitorTag.visible && !isTouch && (
              <div
                className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
                style={{
                  left: `${visitorTag.x}px`,
                  top: `${visitorTag.y}px`,
                  transform: 'translate3d(0, 0, 240px)',
                }}
              >
                <div className="px-2 py-0.5 rounded-full bg-white text-black font-mono text-[9px] font-bold shadow-xl flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B1F]" />
                  <span>You</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          CONFIDENTIAL INLINE TAG & SCRIM
          ======================================================== */}
      {/* Concept Project Tag */}
      <div className="hidden min-[900px]:block absolute bottom-6 right-8 z-30 font-mono text-[9px] text-[#9C978E] uppercase tracking-widest bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
        Concept project, illustrative
      </div>

      {/* Feathered Scrim Gradient: Keeps left 40% calm and guarantees >= 4.5:1 text contrast */}
      <div
        className="hidden min-[900px]:block absolute inset-y-0 left-0 w-[55%] pointer-events-none z-20"
        style={{
          background:
            'linear-gradient(90deg, #08080A 0%, #08080A 60%, rgba(8,8,10,0.85) 80%, transparent 100%)',
        }}
      />
    </div>
  )
}
