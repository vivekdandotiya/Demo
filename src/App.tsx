import React, { useState, useEffect } from 'react'
import { initLenis } from './lib/lenis'
import { Header } from './components/layout/Header'
import { Hero } from './components/sections/Hero'
import { Marquee } from './components/sections/Marquee'
import { Services } from './components/sections/Services'
import { Process } from './components/sections/Process'
import { Work } from './components/sections/Work'
import { Proof } from './components/sections/Proof'
import { Faq } from './components/sections/Faq'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/layout/Footer'

export const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('')

  useEffect(() => {
    const lenis = initLenis()

    return () => {
      lenis?.destroy()
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#0C0D0F] text-[#F3F0E8] overflow-x-clip selection:bg-[#C8F53C] selection:text-[#0C0D0F]">
      {/* Accessible skip to main content */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* 1. Header (Sticky, transparent over hero, ink with blur on scroll) */}
      <Header />

      {/* Semantic Main Content Container */}
      <main id="main-content">
        {/* 2. Hero: The Campaign Wall */}
        <Hero />

        {/* 3. Capability Marquee Strip (Lime) */}
        <Marquee />

        {/* 4. Services Explorer (Paper background, interactive) */}
        <Services onQuoteService={(serviceName) => setSelectedService(serviceName)} />

        {/* 5. Process (Ink background, 4 steps & 3 commitments) */}
        <Process />

        {/* 6. Selected Work (Paper background, editorial cards with modal dialog) */}
        <Work />

        {/* 7. Proof (Conditional: only renders if proof data is non-empty) */}
        <Proof />

        {/* 8. FAQ (Paper 2 background, 5 questions accordion) */}
        <Faq />

        {/* 9. Contact (Ink background, working form & agency details) */}
        <Contact preSelectedService={selectedService} />
      </main>

      {/* 10. Footer (Compact ink) */}
      <Footer />
    </div>
  )
}

export default App
