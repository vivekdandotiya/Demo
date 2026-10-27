import React, { useState, useRef, useEffect } from 'react'
import { SITE_CONFIG } from '../../config/site'
import { SERVICES_CONTENT } from '../../content/services'
import { Button } from '../ui/Button'
import { Mail, Phone, MessageSquare, MapPin, CheckCircle } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface ContactProps {
  preSelectedService?: string
}

export const Contact: React.FC<ContactProps> = ({ preSelectedService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: preSelectedService || 'Not sure yet',
    budget: '',
    message: '',
    _gotcha: '', // Honeypot field
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const prefersReduced = useReducedMotion()
  const submitButtonRef = useRef<HTMLDivElement>(null)

  // Update pre-selected service when passed from Services explorer
  useEffect(() => {
    if (preSelectedService) {
      setFormData((prev) => ({ ...prev, service: preSelectedService }))
    }
  }, [preSelectedService])

  // Subtle magnetic effect on submit button for desktop
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return
    const btn = submitButtonRef.current
    if (!btn || window.matchMedia('(hover: none)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      const distance = Math.hypot(x, y)

      if (distance < 90) {
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`
      } else {
        btn.style.transform = ''
      }
    }

    const handleMouseLeave = () => {
      btn.style.transform = ''
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    btn.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      btn.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [prefersReduced])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = 'Please provide your name.'
    if (!formData.email.trim()) {
      errs.email = 'Please provide your work email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid work email address.'
    }
    if (!formData.message.trim()) errs.message = 'Please tell us what you want to grow.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check: if filled, silently reject bot
    if (formData._gotcha) {
      setIsSubmitted(true)
      return
    }

    if (!validate()) return

    setIsSubmitting(true)
    setStatusMessage('')

    const endpoint = SITE_CONFIG.formEndpoint

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            service: formData.service,
            budget: formData.budget,
            message: formData.message,
          }),
        })

        if (response.ok) {
          setIsSubmitted(true)
          setStatusMessage('Thank you. We have received your enquiry.')
        } else {
          setStatusMessage('Something went wrong submitting the form. Opening your email client instead...')
          composeMailto()
        }
      } catch (err) {
        setStatusMessage('Network error. Falling back to email...')
        composeMailto()
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Compose clean mailto link
      composeMailto()
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  const composeMailto = () => {
    const subject = encodeURIComponent(`Project Enquiry: ${formData.service} — ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
        `Work Email: ${formData.email}\n` +
        `Phone: ${formData.phone || 'N/A'}\n` +
        `Company: ${formData.company || 'N/A'}\n` +
        `Service Interest: ${formData.service}\n` +
        `Estimated Monthly Budget: ${formData.budget || 'N/A'}\n\n` +
        `Message:\n${formData.message}`
    )
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`
  }

  return (
    <section
      id="contact"
      className="relative w-full py-11 md:py-13 bg-[#0C0D0F] text-[#F3F0E8] z-20 rounded-t-[28px] -mt-7 shadow-[0_-12px_32px_rgba(0,0,0,0.35)]"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column (cols 1-5): Agency Contact Info */}
        <div className="lg:col-span-5 flex flex-col items-start">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-[#C8F53C] block mb-2">
            Start A Conversation
          </span>
          <h2
            id="contact-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl text-[#F3F0E8] tracking-tight mb-3"
          >
            Tell us what you want to grow.
          </h2>
          <p className="font-body text-sm sm:text-base text-[#A9A69E] leading-relaxed mb-4">
            Share a few details and we will get back to you.
          </p>

          {SITE_CONFIG.confirmationTime && (
            <p className="font-body text-xs text-[#C8F53C] mb-6 font-medium">
              ✦ {SITE_CONFIG.confirmationTime}
            </p>
          )}

          {/* Contact Details List */}
          <div className="flex flex-col gap-3.5 border-t border-white/10 pt-5 w-full">
            {SITE_CONFIG.email && (
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3 text-sm text-[#F3F0E8] hover:text-[#C8F53C] transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-[#C8F53C] group-hover:text-[#0C0D0F] transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <span>{SITE_CONFIG.email}</span>
              </a>
            )}

            {SITE_CONFIG.phone && (
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 text-sm text-[#F3F0E8] hover:text-[#C8F53C] transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-[#C8F53C] group-hover:text-[#0C0D0F] transition-colors">
                  <Phone className="w-4 h-4" />
                </span>
                <span>{SITE_CONFIG.phone}</span>
              </a>
            )}

            {SITE_CONFIG.whatsapp && (
              <a
                href={SITE_CONFIG.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[#F3F0E8] hover:text-[#C8F53C] transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-[#C8F53C] group-hover:text-[#0C0D0F] transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <span>Chat on WhatsApp</span>
              </a>
            )}

            {SITE_CONFIG.location && (
              <div className="flex items-center gap-3 text-sm text-[#A9A69E] pt-2">
                <span className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-white/50">
                  <MapPin className="w-4 h-4" />
                </span>
                <span>{SITE_CONFIG.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (cols 6-12): Working Form */}
        <div className="lg:col-span-7 bg-[#15171A] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl">
          {isSubmitted ? (
            <div
              className="py-12 flex flex-col items-center text-center gap-4"
              role="alert"
              aria-live="polite"
            >
              <div className="w-16 h-16 rounded-full bg-[#C8F53C]/10 text-[#C8F53C] flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[#F3F0E8]">
                Enquiry received.
              </h3>
              <p className="font-body text-sm text-[#A9A69E] max-w-md">
                {statusMessage ||
                  'Thank you for reaching out. We will review your requirements and respond within one business day.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    service: 'Not sure yet',
                    budget: '',
                    message: '',
                    _gotcha: '',
                  })
                }}
                className="mt-4 text-xs font-mono uppercase tracking-wider text-[#C8F53C] hover:underline"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {/* Aria-live status region for screen readers */}
              <div aria-live="polite" className="sr-only">
                {Object.values(errors).join(' ')}
              </div>

              {/* Honeypot field (hidden from screen reader & users) */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={formData._gotcha}
                onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
                className="hidden"
                aria-hidden="true"
              />

              {/* Name & Work Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className="font-body text-xs font-semibold uppercase tracking-wider text-[#A9A69E]"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: '' })
                    }}
                    placeholder="Jane Doe"
                    className={`h-12 px-4 rounded-xl bg-[#0C0D0F] border text-sm text-[#F3F0E8] placeholder:text-[#5A584F] focus-visible:outline-2 focus-visible:outline-[#C8F53C] ${
                      errors.name ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-xs text-red-400">{errors.name}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-email"
                    className="font-body text-xs font-semibold uppercase tracking-wider text-[#A9A69E]"
                  >
                    Work Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: '' })
                    }}
                    placeholder="jane@company.com"
                    className={`h-12 px-4 rounded-xl bg-[#0C0D0F] border text-sm text-[#F3F0E8] placeholder:text-[#5A584F] focus-visible:outline-2 focus-visible:outline-[#C8F53C] ${
                      errors.email ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-400">{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-phone"
                    className="font-body text-xs font-semibold uppercase tracking-wider text-[#A9A69E]"
                  >
                    Phone (Optional)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+44 20 7946 0912"
                    className="h-12 px-4 rounded-xl bg-[#0C0D0F] border border-white/10 text-sm text-[#F3F0E8] placeholder:text-[#5A584F] focus-visible:outline-2 focus-visible:outline-[#C8F53C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-company"
                    className="font-body text-xs font-semibold uppercase tracking-wider text-[#A9A69E]"
                  >
                    Company Name
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Ltd"
                    className="h-12 px-4 rounded-xl bg-[#0C0D0F] border border-white/10 text-sm text-[#F3F0E8] placeholder:text-[#5A584F] focus-visible:outline-2 focus-visible:outline-[#C8F53C]"
                  />
                </div>
              </div>

              {/* Service Interest & Monthly Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-service"
                    className="font-body text-xs font-semibold uppercase tracking-wider text-[#A9A69E]"
                  >
                    Service Interest
                  </label>
                  <select
                    id="contact-service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="h-12 px-4 rounded-xl bg-[#0C0D0F] border border-white/10 text-sm text-[#F3F0E8] focus-visible:outline-2 focus-visible:outline-[#C8F53C]"
                  >
                    {SERVICES_CONTENT.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-budget"
                    className="font-body text-xs font-semibold uppercase tracking-wider text-[#A9A69E]"
                  >
                    Monthly Budget (Optional)
                  </label>
                  <select
                    id="contact-budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="h-12 px-4 rounded-xl bg-[#0C0D0F] border border-white/10 text-sm text-[#F3F0E8] focus-visible:outline-2 focus-visible:outline-[#C8F53C]"
                  >
                    <option value="">Select budget range...</option>
                    {SITE_CONFIG.budgetRanges.map((range, idx) => (
                      <option key={idx} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="font-body text-xs font-semibold uppercase tracking-wider text-[#A9A69E]"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value })
                    if (errors.message) setErrors({ ...errors, message: '' })
                  }}
                  placeholder="Tell us about your brand, current challenges, and goals..."
                  className={`p-4 rounded-xl bg-[#0C0D0F] border text-sm text-[#F3F0E8] placeholder:text-[#5A584F] focus-visible:outline-2 focus-visible:outline-[#C8F53C] resize-none ${
                    errors.message ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.message && (
                  <span className="text-xs text-red-400">{errors.message}</span>
                )}
              </div>

              {/* Submit Button with subtle magnetic container */}
              <div ref={submitButtonRef} className="pt-2 will-change-transform inline-block">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                  ariaLabel="Submit enquiry"
                >
                  {isSubmitting ? 'Sending...' : 'Send enquiry'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
