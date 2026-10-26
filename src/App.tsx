import React, { useEffect } from 'react'
import { initLenis } from './lib/lenis'
import { WorldCanvas } from './world/WorldCanvas'
import { Grain } from './components/layout/Grain'
import { Cursor } from './components/layout/Cursor'
import { Preloader } from './components/layout/Preloader'
import { Nav } from './components/layout/Nav'
import { ProgressBar } from './components/layout/ProgressBar'
import { Hero } from './components/sections/Hero'
import { Strip } from './components/sections/Strip'
import { Services } from './components/sections/Services'
import { Work } from './components/sections/Work'
import { Studio } from './components/sections/Studio'
import { Industries } from './components/sections/Industries'
import { Approach } from './components/sections/Approach'
import { WhyUs } from './components/sections/WhyUs'
import { Value } from './components/sections/Value'
import { Toolkit } from './components/sections/Toolkit'
import { Packages } from './components/sections/Packages'
import { Faq } from './components/sections/Faq'
import { FinalCta } from './components/sections/FinalCta'
import { Footer } from './components/sections/Footer'
import { KineticDivider } from './components/ui/KineticDivider'

export const App: React.FC = () => {
  useEffect(() => {
    const lenis = initLenis()

    return () => {
      lenis?.destroy()
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#08080A] text-[#F1ECE2] overflow-x-hidden">
      {/* Accessible skip link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Global Scroll Progress Line */}
      <ProgressBar />

      {/* Persistent WebGL Dull-to-Live World Canvas */}
      <WorldCanvas />

      {/* Cinema Film Grain */}
      <Grain />

      {/* Custom Precision Cursor */}
      <Cursor />

      {/* Preloader with wordmark mask-rise and ignition sync */}
      <Preloader />

      {/* Fixed Navigation */}
      <Nav />

      {/* Main Semantic Page Content */}
      <main id="main-content" className="relative z-10">
        {/* Signature 1: Hero with Lens & Layered Photo Fragments */}
        <Hero />

        {/* Velocity-boosted marquee strip */}
        <Strip />

        {/* Signature 2: Physics Services Stage */}
        <Services />

        {/* Kinetic Divider 1 */}
        <KineticDivider
          word="STANDARDS"
          subline="WHERE ART DIRECTION MEETS CONVERSION CAPITAL"
        />

        {/* Signature 3: Velocity Warp Selected Work with Real Photography */}
        <Work />

        {/* New: Studio & Craft Editorial Photo Mosaic */}
        <Studio />

        {/* New: Industries We Grow (Interactive full-bleed photo reel) */}
        <Industries />

        {/* Signature 4: Approach Fly-Through with Bone-White Tonal Shock */}
        <Approach />

        {/* New: Why Us (4 Operating Pillars with Photo-Type Compositions) */}
        <WhyUs />

        {/* Value Section (Qualitative Leverage + Compounding Curve) */}
        <Value />

        {/* New: Toolkit & Channels (Distribution Quadrants) */}
        <Toolkit />

        {/* New: Packages & Engagement Models */}
        <Packages />

        {/* Kinetic Divider 2 */}
        <KineticDivider
          word="UNMISSABLE"
          subline="FROM INVISIBLE TO PERMANENTLY UNMISSABLE"
        />

        {/* New: FAQ Accordion */}
        <Faq />

        {/* Signature 5: The Bloom, Full-Bleed Atmosphere, Magnetic CTA & Proposal Form */}
        <FinalCta />
      </main>

      {/* Global Semantic Footer */}
      <Footer />
    </div>
  )
}

export default App
