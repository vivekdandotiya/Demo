import React, { useRef, useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { SITE_CONFIG } from '../../config/site'
import { MagneticButton } from '../ui/MagneticButton'
import { worldState, triggerShockwave } from '../../world/worldState'
import { getPhoto } from '../../assets/photos'
import { StudioWall } from '../studio/StudioWall'

export const FinalCta: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  // Working validated contact form state
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    budget: '$10k - $25k',
    message: '',
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          worldState.live = Math.max(0.3, self.progress * 1.0)
        },
      })
    })

    return () => ctx.revert()
  }, [])

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(SITE_CONFIG.email)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = SITE_CONFIG.email
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      window.location.href = `mailto:${SITE_CONFIG.email}`
    }
  }

  const handleBloomClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const normX = (rect.left + rect.width / 2) / window.innerWidth
    const normY = 1.0 - (rect.top + rect.height / 2) / window.innerHeight
    triggerShockwave(normX, normY)

    setTimeout(() => {
      window.open(SITE_CONFIG.bookingUrl, '_blank', 'noopener,noreferrer')
    }, 280)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setFormError('Please complete all required fields.')
      return
    }

    setFormError('')
    setFormSubmitted(true)

    // Compose validated mailto link
    const subject = encodeURIComponent(`Growth Inquiry from ${formState.name} (${formState.company || 'Direct'})`)
    const body = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\nCompany: ${formState.company}\nBudget Range: ${formState.budget}\n\nProject Scope & Goals:\n${formState.message}`
    )

    // Open user's email client with prefilled mailto
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`
  }

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-28 md:py-48 px-6 md:px-10 hairline-b overflow-hidden select-none"
      aria-label="Get in Touch"
    >
      {/* Full-Bleed Atmosphere with Studio Wall Callback in Dimmed Pull-Back State */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <img
          src={getPhoto('cta-bloom-bg')}
          alt=""
          className="w-full h-full object-cover filter brightness-40 contrast-125 opacity-40"
        />
        {/* Studio Wall Callback behind Scrim */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 scale-90">
          <StudioWall mode="finalCta" />
        </div>
        <div className="absolute inset-0 photo-scrim-radial" />
        <div className="absolute inset-0 bg-[#08080A]/85 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-20">
        {/* Signal Tag */}
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#FF3B1F] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FF3B1F] shadow-[0_0_10px_#FF3B1F] animate-ping" />
          <span>SIGNATURE 05 // THE BLOOM & PROPOSAL STAGE</span>
        </div>

        {/* Climax Headline */}
        <h2 className="font-display text-5xl md:text-8xl lg:text-9xl tracking-tight text-[#F1ECE2] leading-[0.92] mb-8">
          Let’s make something <br />
          <span className="italic text-white">worth noticing.</span>
        </h2>

        {/* Subline */}
        <p className="font-body text-lg md:text-2xl text-[#9C978E] max-w-2xl mx-auto font-light leading-relaxed mb-14">
          Tell us where you want to go. We'll tell you honestly how we'd get there.
        </p>

        {/* Large ~200px Circular Magnetic CTA Button */}
        <div className="my-6">
          <MagneticButton
            variant="circle"
            onClick={handleBloomClick}
            isShockwave={true}
            ariaLabel="Book a discovery call"
            className="group"
          >
            <div className="flex flex-col items-center justify-center p-4">
              <span className="font-mono text-[11px] md:text-xs tracking-[0.18em] text-[#F1ECE2] group-hover:text-black font-semibold text-center leading-tight">
                BOOK A<br />DISCOVERY CALL
              </span>
              <span className="text-[#FF3B1F] group-hover:text-black text-xl mt-1 transition-transform group-hover:translate-x-1">
                ↗
              </span>
            </div>
          </MagneticButton>
        </div>

        {/* Working Validated Proposal Form */}
        <div className="w-full max-w-2xl mt-16 p-8 md:p-12 rounded-2xl hairline-box bg-[#101013]/90 backdrop-blur-md text-left shadow-2xl">
          <div className="flex items-center justify-between mb-8 pb-4 hairline-b">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#FF3B1F] block">
                DIRECT INQUIRY
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-[#F1ECE2]">
                Request a confidential proposal
              </h3>
            </div>
            <span className="font-mono text-xs text-[#9C978E]">NO DEAD FORMS</span>
          </div>

          {formSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FF3B1F]/20 border border-[#FF3B1F] flex items-center justify-center mx-auto text-[#FF3B1F] text-xl">
                ✓
              </div>
              <h4 className="font-display text-3xl text-[#F1ECE2]">Inquiry Composed</h4>
              <p className="font-body text-sm text-[#9C978E] max-w-md mx-auto">
                Your default mail client has been launched with your validated parameters addressed directly to {SITE_CONFIG.email}.
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="font-mono text-xs uppercase tracking-[0.14em] text-[#FF3B1F] underline mt-4"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {formError && (
                <div className="p-3 rounded bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-[0.12em] text-[#9C978E] mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-lg bg-[#08080A] border border-[rgba(241,236,226,0.15)] text-[#F1ECE2] text-sm focus:border-[#FF3B1F] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-[0.12em] text-[#9C978E] mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#08080A] border border-[rgba(241,236,226,0.15)] text-[#F1ECE2] text-sm focus:border-[#FF3B1F] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-[0.12em] text-[#9C978E] mb-2">
                    Company / Website
                  </label>
                  <input
                    type="text"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-3 rounded-lg bg-[#08080A] border border-[rgba(241,236,226,0.15)] text-[#F1ECE2] text-sm focus:border-[#FF3B1F] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-[0.12em] text-[#9C978E] mb-2">
                    Estimated Budget Tier
                  </label>
                  <select
                    value={formState.budget}
                    onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#08080A] border border-[rgba(241,236,226,0.15)] text-[#F1ECE2] text-sm focus:border-[#FF3B1F] focus:outline-none transition-colors"
                  >
                    <option value="$10k - $25k">$10k - $25k (Sprint scope)</option>
                    <option value="$25k - $50k">$25k - $50k (Growth Partnership)</option>
                    <option value="$50k+">$50k+ (Enterprise campaign)</option>
                    <option value="Advisory Audit">Advisory Audit only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.12em] text-[#9C978E] mb-2">
                  What are you looking to achieve? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Outline your timeline, current obstacles, and where you need immediate momentum..."
                  className="w-full px-4 py-3 rounded-lg bg-[#08080A] border border-[rgba(241,236,226,0.15)] text-[#F1ECE2] text-sm focus:border-[#FF3B1F] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 hairline-t">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FF3B1F] text-white font-mono text-xs uppercase tracking-[0.14em] font-medium hover:bg-white hover:text-black transition-all shadow-[0_0_25px_rgba(255,59,31,0.3)]"
                >
                  Generate Mailto Proposal →
                </button>
                <span className="font-mono text-[11px] text-[#9C978E]">
                  Direct delivery to {SITE_CONFIG.email}
                </span>
              </div>
            </form>
          )}
        </div>

        {/* Email Copy & Direct Mailto */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
          <a
            href={`mailto:${SITE_CONFIG.email}?subject=Partnership%20Inquiry%20via%20Unmissable`}
            className="px-5 py-2.5 rounded-full border border-[rgba(241,236,226,0.18)] bg-[#101013] text-[#F1ECE2] hover:border-[#FF3B1F] transition-colors"
          >
            {SITE_CONFIG.email}
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="px-5 py-2.5 rounded-full border border-[rgba(241,236,226,0.18)] bg-[#101013] text-[#9C978E] hover:text-white hover:border-[#FF3B1F] transition-all flex items-center gap-2"
            aria-live="polite"
          >
            {copied ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-white">Email copied to clipboard!</span>
              </>
            ) : (
              <>
                <span>Copy email</span>
                <span className="text-[10px] opacity-60">⎘</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
