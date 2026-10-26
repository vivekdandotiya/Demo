import React, { useRef, useEffect } from 'react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useIsTouch } from '../../hooks/useIsTouch'
import { triggerShockwave } from '../../world/worldState'

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  href?: string
  className?: string
  variant?: 'circle' | 'pill'
  isShockwave?: boolean
  ariaLabel?: string
  target?: string
  rel?: string
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  variant = 'pill',
  isShockwave = false,
  ariaLabel,
  target,
  rel,
}) => {
  const buttonRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const hoverFillRef = useRef<HTMLSpanElement>(null)
  const prefersReduced = useReducedMotion()
  const isTouch = useIsTouch()

  useEffect(() => {
    if (prefersReduced || isTouch) return

    const btn = buttonRef.current
    if (!btn) return

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' })
    const textXTo = textRef.current ? gsap.quickTo(textRef.current, 'x', { duration: 0.4, ease: 'power3.out' }) : null
    const textYTo = textRef.current ? gsap.quickTo(textRef.current, 'y', { duration: 0.4, ease: 'power3.out' }) : null

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY)
      const maxDist = variant === 'circle' ? 140 : 80

      if (dist < maxDist) {
        const pull = 0.35
        const offsetX = (e.clientX - centerX) * pull
        const offsetY = (e.clientY - centerY) * pull
        xTo(offsetX)
        yTo(offsetY)
        textXTo?.(offsetX * 0.4)
        textYTo?.(offsetY * 0.4)
      } else {
        xTo(0)
        yTo(0)
        textXTo?.(0)
        textYTo?.(0)
      }
    }

    const handleMouseLeave = () => {
      xTo(0)
      yTo(0)
      textXTo?.(0)
      textYTo?.(0)
    }

    const handleMouseEnter = (e: MouseEvent) => {
      if (!hoverFillRef.current) return
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      gsap.set(hoverFillRef.current, {
        top: y,
        left: x,
        scale: 0,
        opacity: 1,
      })
      gsap.to(hoverFillRef.current, {
        scale: 2.5,
        duration: 0.5,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    btn.addEventListener('mouseleave', handleMouseLeave)
    btn.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      btn.removeEventListener('mouseleave', handleMouseLeave)
      btn.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [prefersReduced, isTouch, variant])

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isShockwave) {
      const rect = e.currentTarget.getBoundingClientRect()
      const normX = (rect.left + rect.width / 2) / window.innerWidth
      const normY = 1.0 - (rect.top + rect.height / 2) / window.innerHeight
      triggerShockwave(normX, normY)
    }
    onClick?.(e)
  }

  const baseClasses = `
    relative inline-flex items-center justify-center font-mono uppercase tracking-[0.12em] 
    cursor-pointer overflow-hidden transition-all duration-300 select-none group focus-visible:outline-2 
    focus-visible:outline-offset-4 focus-visible:outline-[#FF3B1F]
  `

  const shapeClasses = variant === 'circle'
    ? 'w-48 h-48 md:w-56 md:h-56 rounded-full border border-[rgba(241,236,226,0.2)] bg-[#101013] text-[#F1ECE2] hover:border-[#FF3B1F] shadow-[0_0_50px_rgba(255,59,31,0.2)]'
    : 'px-7 py-3.5 rounded-full border border-[rgba(241,236,226,0.18)] bg-[#101013]/80 backdrop-blur-sm text-[#F1ECE2] hover:border-[#FF3B1F] text-xs'

  const content = (
    <>
      <span 
        ref={hoverFillRef}
        className="absolute w-full h-full rounded-full bg-[#FF3B1F] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 opacity-0 z-0"
        aria-hidden="true"
      />
      <span 
        ref={textRef} 
        className="relative z-10 flex items-center justify-center gap-2 pointer-events-none group-hover:text-white transition-colors duration-200"
      >
        {children}
      </span>
    </>
  )

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        onClick={handleClick}
        aria-label={ariaLabel}
        className={`${baseClasses} ${shapeClasses} ${className}`}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`${baseClasses} ${shapeClasses} ${className}`}
    >
      {content}
    </button>
  )
}
