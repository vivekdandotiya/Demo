import React from 'react'
import { SITE_CONFIG } from '../../config/site'
import { scrollToTarget } from '../../lib/lenis'
import { ArrowUp } from 'lucide-react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full bg-[#0C0D0F] text-[#F3F0E8] py-12 hairline-dark-t z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col gap-8">
        {/* Top Grid: Wordmark & Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Brand Info (cols 1-5) */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(0)
              }}
              className="flex items-center gap-2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C8F53C]"
              aria-label={`${SITE_CONFIG.name} home`}
            >
              <span className="w-3.5 h-3.5 bg-[#C8F53C] rounded-sm group-hover:rotate-45 transition-transform duration-300" />
              <span className="font-display font-bold text-2xl text-[#F3F0E8]">
                {SITE_CONFIG.name}
              </span>
            </a>

            <p className="font-body text-sm text-[#A9A69E] max-w-sm leading-relaxed">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {/* Quick Nav Links (cols 6-8) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-[#A9A69E]">
              Navigation
            </span>
            <ul className="space-y-2">
              {SITE_CONFIG.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToTarget(link.href)
                    }}
                    className="font-body text-sm text-[#F3F0E8] hover:text-[#C8F53C] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToTarget('#contact')
                  }}
                  className="font-body text-sm text-[#F3F0E8] hover:text-[#C8F53C] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Connect / Socials (cols 9-12) */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-[#A9A69E]">
              Connect
            </span>
            <ul className="space-y-2">
              {SITE_CONFIG.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-[#F3F0E8] hover:text-[#C8F53C] transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Location & Back-to-Top */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-[#A9A69E]">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {currentYear} {SITE_CONFIG.name}. All rights reserved.</span>
            <span>•</span>
            <span>{SITE_CONFIG.location}</span>
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="flex items-center gap-2 hover:text-[#C8F53C] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C8F53C]"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
