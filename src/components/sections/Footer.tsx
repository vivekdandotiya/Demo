import React, { useRef } from 'react'
import { SITE_CONFIG } from '../../config/site'
import { scrollToTarget } from '../../lib/lenis'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const handleCharHover = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (prefersReduced) return
    const el = e.currentTarget
    
    // Scatter physics simulation
    const randomX = (Math.random() - 0.5) * 60
    const randomY = -20 - Math.random() * 40
    const randomRot = (Math.random() - 0.5) * 30

    gsap.to(el, {
      x: randomX,
      y: randomY,
      rotate: randomRot,
      color: '#FF3B1F',
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        // Spring reform
        gsap.to(el, {
          x: 0,
          y: 0,
          rotate: 0,
          color: '#F1ECE2',
          duration: 1.0,
          ease: 'elastic.out(1, 0.4)',
          delay: 0.15,
        })
      },
    })
  }

  const handleBackToTop = () => {
    scrollToTarget(0, { duration: 1.4 })
  }

  return (
    <footer className="relative bg-[#08080A] pt-20 overflow-hidden select-none" aria-label="Site Footer">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 hairline-b pb-16">
          {/* Brand Info & Mission */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-display text-3xl tracking-tight text-[#F1ECE2]">
              {SITE_CONFIG.name}
            </span>
            <p className="font-body text-sm text-[#9C978E] max-w-sm leading-relaxed">
              From invisible to unmissable. High-conviction brand positioning, technical search systems, and cinematic digital campaigns for market leaders.
            </p>
            <div className="font-mono text-xs text-[#9C978E] pt-2">
              <span>OFFICES: {SITE_CONFIG.location}</span>
            </div>
          </div>

          {/* Nav links column */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs uppercase tracking-[0.14em]">
            <p className="text-[#FF3B1F] mb-4">SITEMAP</p>
            <ul className="space-y-2.5">
              {SITE_CONFIG.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToTarget(link.href)
                    }}
                    className="text-[#9C978E] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Column */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs uppercase tracking-[0.14em]">
            <p className="text-[#FF3B1F] mb-4">DISPATCHES</p>
            <ul className="space-y-2.5">
              {SITE_CONFIG.socials.map((soc) => (
                <li key={soc.name}>
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9C978E] hover:text-white transition-colors flex items-center justify-between group max-w-[180px]"
                  >
                    <span>{soc.name}</span>
                    <span className="text-[#FF3B1F] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Back to top button */}
          <div className="md:col-span-2 flex flex-col justify-between items-start md:items-end">
            <button
              type="button"
              onClick={handleBackToTop}
              className="px-5 py-3 rounded-full border border-[rgba(241,236,226,0.18)] bg-[#101013] text-[#F1ECE2] font-mono text-xs uppercase tracking-[0.14em] hover:border-[#FF3B1F] hover:text-[#FF3B1F] transition-all flex items-center gap-2"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <span>↑</span>
            </button>

            <span className="font-mono text-[11px] text-[#9C978E] mt-6 md:mt-0">
              © {currentYear} {SITE_CONFIG.name}
            </span>
          </div>
        </div>
      </div>

      {/* Giant Kinetic Wordmark Bleeding off bottom edge */}
      <div 
        ref={wordmarkRef}
        className="w-full flex items-center justify-center overflow-hidden border-t border-[rgba(241,236,226,0.08)] py-4 select-none cursor-crosshair"
        aria-hidden="true"
      >
        <div className="flex items-baseline justify-center tracking-[-0.05em] leading-none text-[#F1ECE2]/85 text-[14vw] font-display whitespace-nowrap">
          {SITE_CONFIG.name.split('').map((char, index) => (
            <span
              key={index}
              onMouseEnter={handleCharHover}
              className="inline-block transition-transform will-change-transform px-[0.02em]"
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
