import React, { useState, useEffect, useRef } from 'react'
import { SITE_CONFIG } from '../../config/site'
import { scrollToTarget } from '../../lib/lenis'
import { Button } from '../ui/Button'
import { Menu, X } from 'lucide-react'

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isOverPaper, setIsOverPaper] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const lastScrollYRef = useRef(0)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Scroll detection & section tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      setScrollProgress(Math.min(1, Math.max(0, currentScrollY / maxScroll)))

      const heroEl = document.querySelector('section')
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight

      // Solid backdrop after scrolling past top of hero
      setIsScrolled(currentScrollY > 60)

      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > heroHeight * 0.8) {
        if (currentScrollY > lastScrollYRef.current + 10) {
          setIsVisible(false)
        } else if (currentScrollY < lastScrollYRef.current - 10) {
          setIsVisible(true)
        }
      } else {
        setIsVisible(true)
      }

      lastScrollYRef.current = currentScrollY

      // Bug Fix: Only show an active nav link after its section is actually reached
      if (currentScrollY < heroHeight * 0.6) {
        setActiveSection('')
      } else {
        const sections = ['services', 'process', 'work', 'faq', 'contact']
        let currentActive = ''
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId)
          if (el) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= 240 && rect.bottom >= 120) {
              currentActive = sectionId
              break
            }
          }
        }
        setActiveSection(currentActive)
      }

      // Check if header is currently over paper background
      const paperSections = document.querySelectorAll('.on-paper')
      let overPaper = false
      paperSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect()
        if (rect.top <= 50 && rect.bottom >= 50) {
          overPaper = true
        }
      })
      setIsOverPaper(overPaper)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll & handle Esc key when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
      setTimeout(() => closeButtonRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen])

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    scrollToTarget(href)
    menuButtonRef.current?.focus()
  }

  // Header dynamic theme classes based on background
  const textColorClass = isOverPaper && isScrolled ? 'text-[#0C0D0F]' : 'text-[#F3F0E8]'
  const textMutedClass = isOverPaper && isScrolled ? 'text-[#5A584F]' : 'text-[#A9A69E]'
  const bgClass = !isScrolled
    ? 'bg-transparent py-5'
    : isOverPaper
    ? 'bg-[#F3F0E8]/94 backdrop-blur-md border-b border-[#0C0D0F]/10 py-3.5 shadow-sm'
    : 'bg-[#0C0D0F]/92 backdrop-blur-md border-b border-white/10 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${bgClass}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Wordmark with small lime square mark */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(0)
              }}
              className="flex items-center gap-2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C8F53C]"
              aria-label={`${SITE_CONFIG.name} home`}
            >
              {/* Lime square SVG mark */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 transition-transform duration-300 group-hover:rotate-45"
                aria-hidden="true"
              >
                <rect width="14" height="14" rx="2" fill="#C8F53C" />
              </svg>

              <span className={`font-display font-bold text-xl md:text-2xl tracking-tight ${textColorClass}`}>
                {SITE_CONFIG.name}
              </span>
            </a>

            {/* Desktop "Skip intro" link */}
            <button
              type="button"
              onClick={() => scrollToTarget('#services')}
              className={`hidden min-[900px]:inline-block font-mono text-[11px] tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity cursor-pointer ${textMutedClass}`}
              aria-label="Skip hero intro to services"
            >
              Skip intro ↓
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden min-[900px]:flex items-center gap-8"
            aria-label="Main Navigation"
          >
            {SITE_CONFIG.navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget(link.href)
                  }}
                  className={`relative font-body text-sm font-medium transition-colors duration-200 py-1 ${
                    isActive
                      ? 'text-[#C8F53C] font-semibold'
                      : `${textMutedClass} hover:${textColorClass}`
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8F53C] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </a>
              )
            })}
          </nav>

          {/* Right Action: Pill CTA "Book a call" (Lime) */}
          <div className="hidden min-[900px]:block">
            <Button
              href={SITE_CONFIG.bookingUrl}
              variant="primary"
              className="!h-10 !px-5 !text-xs uppercase tracking-wider"
              showArrow={false}
              ariaLabel="Book a strategy call"
            >
              Book a call
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`min-[900px]:hidden p-2 -mr-2 ${textColorClass} hover:text-[#C8F53C] transition-colors focus-visible:outline-2 focus-visible:outline-[#C8F53C]`}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* 2px lime scroll progress line under header */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-[#C8F53C] transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
          aria-hidden="true"
        />
      </header>

      {/* Mobile Menu Panel (< 900px) with focus trap & accessible dialog */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 min-[900px]:hidden bg-[#0C0D0F] flex flex-col justify-between p-8"
        >
          {/* Header row in mobile menu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-[#C8F53C] rounded-sm" />
              <span className="font-display font-bold text-xl text-[#F3F0E8]">
                {SITE_CONFIG.name}
              </span>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                menuButtonRef.current?.focus()
              }}
              className="p-2 -mr-2 text-[#F3F0E8] hover:text-[#C8F53C] focus-visible:outline-2 focus-visible:outline-[#C8F53C]"
              aria-label="Close menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Nav links stack */}
          <nav className="flex flex-col gap-6 py-8">
            {SITE_CONFIG.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="font-display font-bold text-4xl text-[#F3F0E8] hover:text-[#C8F53C] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('#contact')
              }}
              className="font-display font-bold text-4xl text-[#F3F0E8] hover:text-[#C8F53C] transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Mobile CTA */}
          <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
            <Button
              href={SITE_CONFIG.bookingUrl}
              variant="primary"
              className="w-full text-center"
              ariaLabel="Book a strategy call"
            >
              Book a call
            </Button>
            <p className="font-body text-xs text-[#A9A69E] text-center">
              {SITE_CONFIG.location} • {SITE_CONFIG.email}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
