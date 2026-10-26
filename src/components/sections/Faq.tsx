import React, { useState } from 'react'
import { FAQ_CONTENT } from '../../content/faq'
import { ChevronDown } from 'lucide-react'

export const Faq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="relative w-full py-14 md:py-16 bg-[#E8E4D9] text-[#0C0D0F] on-paper z-20"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (cols 1-4): Title & Subhead */}
        <div className="lg:col-span-4 flex flex-col items-start">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-[#5A584F] block mb-2">
            Questions & Honest Answers
          </span>
          <h2
            id="faq-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl text-[#0C0D0F] tracking-tight mb-3"
          >
            Clear terms.
            <br />
            No surprises.
          </h2>
          <p className="font-body text-sm text-[#5A584F] leading-relaxed max-w-sm">
            Everything you need to know about our engagement models, realistic timelines, and working cadence before booking a call.
          </p>
        </div>

        {/* Right Column (cols 5-12): Accordion List */}
        <div className="lg:col-span-8 flex flex-col divide-y divide-[#0C0D0F]/15 border-y border-[#0C0D0F]/15">
          {FAQ_CONTENT.map((item, idx) => {
            const isOpen = openIdx === idx

            return (
              <div key={idx} className="py-1">
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0C0D0F]"
                >
                  <span className="font-display font-bold text-lg sm:text-xl text-[#0C0D0F] group-hover:text-[#5A584F] transition-colors pr-6">
                    {item.question}
                  </span>

                  <span
                    className={`w-7 h-7 rounded-full border border-[#0C0D0F]/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#0C0D0F] text-[#C8F53C]' : 'text-[#0C0D0F]'
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </button>

                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                  hidden={!isOpen}
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'pb-4 pt-1' : 'h-0'
                  }`}
                >
                  <p className="font-body text-sm sm:text-base text-[#5A584F] leading-relaxed max-w-2xl">
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
