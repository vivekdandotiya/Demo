import React, { useState, useEffect, useRef } from 'react'
import { SITE_CONFIG } from '../../config/site'
import { scrollToTarget, stopLenis, startLenis } from '../../lib/lenis'
import { MagneticButton } from '../ui/MagneticButton'

export const Nav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lastScrollY = useRef(0)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)

  // Curated 5 Core Navigation Links
  const primaryNavLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Approach', href: '#approach' },
    { label: 'Packages', href: '#packages' },
    { label: 'Contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 80) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      if (currentScrollY > 200 && currentScrollY > lastScrollY.current + 10) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current - 10 || currentScrollY <= 200) {
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY

      const sections = ['services', 'work', 'approach', 'packages', 'contact']
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 250 && rect.bottom >= 250) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      stopLenis()
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false)
          menuTriggerRef.current?.focus()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      startLenis()
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleNavLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    scrollToTarget(href)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 transform ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'py-3 bg-[#08080A]/90 backdrop-blur-md hairline-b'
            : 'py-5 md:py-7 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Brand Logo with breathing signal dot */}
          <a
            href="#"
            onClick={(e) => handleNavLink(e, '#')}
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label={`${SITE_CONFIG.name} Homepage`}
          >
            <span className="font-display text-2xl md:text-3xl tracking-tight text-[#F1ECE2] group-hover:text-white transition-colors">
              {SITE_CONFIG.name}
            </span>
            <span 
              className="w-2 h-2 rounded-full bg-[#FF3B1F] shadow-[0_0_8px_#FF3B1F] animate-[pulse_4s_ease-in-out_infinite]" 
              aria-hidden="true" 
            />
          </a>

          {/* Center: High-Contrast Ink Pill Backdrop for 5 Links */}
          <nav 
            className="hidden md:flex items-center" 
            aria-label="Main Navigation"
          >
            <div className="px-6 py-2.5 rounded-full bg-[#101013]/90 backdrop-blur-md border border-[rgba(241,236,226,0.16)] shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex items-center gap-7">
              {primaryNavLinks.map((link) => {
                const sectionId = link.href.replace('#', '')
                const isActive = activeSection === sectionId
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavLink(e, link.href)}
                    className={`relative font-mono text-[13px] uppercase tracking-[0.14em] font-medium transition-colors duration-200 hover:text-[#FF3B1F] ${
                      isActive ? 'text-[#FF3B1F]' : 'text-[#F1ECE2]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span 
                        className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#FF3B1F]" 
                        aria-hidden="true" 
                      />
                    )}
                  </a>
                )
              })}
            </div>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <MagneticButton
              href={SITE_CONFIG.bookingUrl}
              target="_blank"
              variant="pill"
              className="text-xs px-6 py-3 font-mono tracking-[0.12em] bg-[#101013] border border-[rgba(241,236,226,0.22)] text-[#F1ECE2] hover:border-[#FF3B1F]"
              ariaLabel="Book a discovery call with Unmissable"
            >
              <span>Start a project</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F] group-hover:bg-white" />
            </MagneticButton>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            ref={menuTriggerRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 rounded-full border border-[rgba(241,236,226,0.18)] bg-[#101013] text-[#F1ECE2] focus-visible:outline-2 focus-visible:outline-[#FF3B1F]"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span
              className={`w-5 h-[1.5px] bg-[#F1ECE2] transition-transform duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-[3.5px]' : '-translate-y-1'
              }`}
            />
            <span
              className={`w-5 h-[1.5px] bg-[#F1ECE2] transition-transform duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-[2px]' : 'translate-y-1'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 bg-[#08080A] flex flex-col justify-between p-8 md:hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto [clip-path:circle(150%_at_90%_5%)]'
            : 'opacity-0 pointer-events-none [clip-path:circle(0%_at_90%_5%)]'
        }`}
        aria-hidden={!mobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="pt-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF3B1F] mb-6">
            NAVIGATION
          </p>
          <div className="flex flex-col gap-6">
            {primaryNavLinks.map((link, idx) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavLink(e, link.href)}
                className="font-display text-4xl text-[#F1ECE2] hover:text-[#FF3B1F] transition-colors"
                style={{ transitionDelay: `${idx * 40}ms` }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Menu Footer */}
        <div className="hairline-t pt-6 flex flex-col gap-4">
          <a
            href={SITE_CONFIG.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 text-center rounded-full bg-[#FF3B1F] text-[#F1ECE2] font-mono text-xs uppercase tracking-[0.14em] font-medium"
          >
            Start a project
          </a>
          <div className="flex items-center justify-between text-xs font-mono text-[#9C978E]">
            <span>{SITE_CONFIG.email}</span>
            <span>{SITE_CONFIG.location.split('/')[0]}</span>
          </div>
        </div>
      </div>
    </>
  )
}
