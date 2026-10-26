import React, { useState } from 'react'
import { SITE_CONFIG } from '../../config/site'

export const Faq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section id="faq" className="relative py-28 md:py-40 px-6 md:px-10 hairline-b bg-[#08080A]/95 overflow-hidden select-none" aria-label="Frequently Asked Questions">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#9C978E] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]" />
            <span>CLARITY FIRST // FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-display text-4xl md:text-7xl text-[#F1ECE2] tracking-tight">
            Straight answers. <span className="italic">No agency spin.</span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-[rgba(241,236,226,0.12)] hairline-t hairline-b">
          {SITE_CONFIG.faq.map((item, idx) => {
            const isOpen = openIdx === idx
            const answerId = `faq-answer-${idx}`
            const buttonId = `faq-btn-${idx}`

            return (
              <div key={idx} className="py-6 md:py-8">
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="w-full flex items-center justify-between text-left gap-6 group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF3B1F]"
                >
                  <span className="font-display text-2xl md:text-3xl text-[#F1ECE2] group-hover:text-[#FF3B1F] transition-colors">
                    {item.question}
                  </span>
                  <span className={`w-8 h-8 rounded-full border border-[rgba(241,236,226,0.2)] flex items-center justify-center font-mono text-sm text-[#F1ECE2] group-hover:border-[#FF3B1F] transition-all flex-shrink-0 ${
                    isOpen ? 'rotate-45 border-[#FF3B1F] text-[#FF3B1F]' : ''
                  }`}>
                    +
                  </span>
                </button>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'max-h-96 opacity-100 pt-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="font-body text-base md:text-lg text-[#9C978E] leading-relaxed font-light">
                    {item.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
