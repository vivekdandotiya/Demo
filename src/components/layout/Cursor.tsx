import React, { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIsTouch } from '../../hooks/useIsTouch'

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const viewTextRef = useRef<HTMLSpanElement>(null)
  
  const prefersReduced = useReducedMotion()
  const isTouch = useIsTouch()
  
  // Bug fix: Keep cursor hidden until the first pointermove
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'view' | 'hidden'>('hidden')
  const hasMovedRef = useRef(false)

  useEffect(() => {
    if (prefersReduced || isTouch) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // QuickTo setters for fluid tracking
    const dotXTo = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
    const dotYTo = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })
    const ringXTo = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power3.out' })
    const ringYTo = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power3.out' })

    const onMouseMove = (e: MouseEvent) => {
      if (!hasMovedRef.current) {
        hasMovedRef.current = true
        // Position directly without animation on first move
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
        setCursorState('default')
      }

      dotXTo(e.clientX)
      dotYTo(e.clientY)
      ringXTo(e.clientX)
      ringYTo(e.clientY)

      const target = e.target as HTMLElement | null
      if (!target) return

      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'
      const isWorkPlane = target.closest('[data-cursor="view"]')
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-magnetic]')

      if (isInput) {
        setCursorState('hidden')
      } else if (isWorkPlane) {
        setCursorState('view')
      } else if (isInteractive) {
        setCursorState('hover')
      } else {
        setCursorState('default')
      }
    }

    const onMouseLeave = () => {
      setCursorState('hidden')
    }

    const onMouseEnter = () => {
      if (hasMovedRef.current) {
        setCursorState('default')
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [prefersReduced, isTouch])

  if (prefersReduced || isTouch) return null

  const getRingStyles = () => {
    switch (cursorState) {
      case 'hidden':
        return 'opacity-0 scale-0 pointer-events-none'
      case 'hover':
        return 'w-14 h-14 -ml-7 -mt-7 border-[#FF3B1F] bg-[#FF3B1F]/15 scale-110 opacity-100'
      case 'view':
        return 'w-22 h-22 -ml-11 -mt-11 border-[#FF3B1F] bg-[#FF3B1F] scale-100 text-[#F1ECE2] opacity-100'
      case 'default':
      default:
        return 'w-8 h-8 -ml-4 -mt-4 border-[rgba(241,236,226,0.35)] bg-transparent scale-100 opacity-100'
    }
  }

  const getDotStyles = () => {
    if (cursorState === 'hidden' || cursorState === 'view') {
      return 'opacity-0 scale-0'
    }
    if (cursorState === 'hover') {
      return 'w-2.5 h-2.5 -ml-1.25 -mt-1.25 bg-[#FF3B1F] scale-110 opacity-100'
    }
    return 'w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-[#F1ECE2] scale-100 opacity-100'
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999999] overflow-hidden" aria-hidden="true">
      {/* Precision Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full transition-transform duration-100 ease-out will-change-transform ${getDotStyles()}`}
      />
      {/* Trailing Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border transition-all duration-200 ease-out flex items-center justify-center will-change-transform ${getRingStyles()}`}
      >
        <span
          ref={viewTextRef}
          className={`font-mono text-[10px] font-bold tracking-[0.16em] uppercase text-black transition-opacity duration-150 ${
            cursorState === 'view' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          VIEW
        </span>
      </div>
    </div>
  )
}
