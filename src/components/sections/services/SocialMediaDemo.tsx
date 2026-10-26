import React, { useEffect, useState } from 'react'

interface DemoProps {
  isActive: boolean
  isReducedMotion?: boolean
}

interface FloatingBubble {
  id: number
  icon: string
  x: number
  y: number
  opacity: number
}

export const SocialMediaDemo: React.FC<DemoProps> = ({ isActive, isReducedMotion = false }) => {
  const [scrollY, setScrollY] = useState(0)
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([])

  useEffect(() => {
    if (isReducedMotion || !isActive) return

    // Feed scroll cycle
    const scrollInterval = setInterval(() => {
      setScrollY((prev) => (prev + 1) % 180)
    }, 40)

    // Floating reaction bubbles generator
    const icons = ['❤️', '✦', '💬', '🔥', '↗']
    let bubbleId = 0
    const bubbleInterval = setInterval(() => {
      const newBubble: FloatingBubble = {
        id: bubbleId++,
        icon: icons[Math.floor(Math.random() * icons.length)],
        x: 60 + (Math.random() - 0.5) * 40,
        y: 160,
        opacity: 1,
      }
      setBubbles((prev) => [...prev.slice(-8), newBubble])
    }, 600)

    // Update bubbles position
    const moveInterval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - 2.5, opacity: b.opacity - 0.025 }))
          .filter((b) => b.opacity > 0)
      )
    }, 30)

    return () => {
      clearInterval(scrollInterval)
      clearInterval(bubbleInterval)
      clearInterval(moveInterval)
    }
  }, [isActive, isReducedMotion])

  return (
    <div 
      className="relative w-full h-full flex flex-col p-4 md:p-6 bg-[#0B0B0E] rounded-xl hairline-box overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Header with Illustrative Tag */}
      <div className="flex items-center justify-between pb-3 hairline-b mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF2E93] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9C978E]">
            COMMUNITY ENGINE // FEED & AUDIENCE CLUSTER
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-[#FF2E93]/30 bg-[#FF2E93]/10 text-[#FF2E93] font-medium tracking-wider">
          Illustrative
        </span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: Phone Device Frame */}
        <div className="md:col-span-6 flex justify-center">
          <div className="relative w-[190px] h-[240px] rounded-2xl border-2 border-white/20 bg-[#0E0E12] overflow-hidden shadow-2xl p-2.5 flex flex-col">
            {/* Phone Notch */}
            <div className="w-16 h-2.5 bg-black/60 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Scrolling Feed Container */}
            <div className="relative flex-1 overflow-hidden">
              <div
                className="flex flex-col gap-2 transition-transform duration-75 ease-linear"
                style={{
                  transform: isReducedMotion ? 'none' : `translateY(-${scrollY}px)`,
                }}
              >
                {/* 3 repeating cards so scroll is continuous */}
                {[0, 1].map((setIndex) => (
                  <React.Fragment key={setIndex}>
                    {/* Post Card 1: Video Reel */}
                    <div className="p-2 rounded-lg bg-[#18181F] border border-white/5 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#FF3B1F]" />
                        <span className="font-mono text-[9px] text-[#F1ECE2]">unmissable.co</span>
                      </div>
                      <div className="h-14 rounded bg-gradient-to-tr from-[#FF3B1F]/30 to-[#8A2BE2]/20 flex items-center justify-center relative">
                        <span className="text-xs text-white/90">▶ 0:42</span>
                      </div>
                      <span className="font-body text-[9px] text-[#9C978E] line-clamp-1">
                        Why high-status brands reject generic performance ads.
                      </span>
                    </div>

                    {/* Post Card 2: Strategic Carousel */}
                    <div className="p-2 rounded-lg bg-[#18181F] border border-white/5 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#FF9E2C]" />
                        <span className="font-mono text-[9px] text-[#F1ECE2]">unmissable.co</span>
                      </div>
                      <div className="p-2 rounded bg-white/[0.03] border border-white/5 font-display text-xs text-[#F1ECE2] italic leading-tight">
                        "If you speak to everybody, you convert nobody."
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono text-[#9C978E]">
                        <span>4.2k Shares</span>
                        <span className="text-[#FF2E93]">✦ Save</span>
                      </div>
                    </div>

                    {/* Post Card 3: Cultural Moment */}
                    <div className="p-2 rounded-lg bg-[#18181F] border border-white/5 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#3D2BFF]" />
                        <span className="font-mono text-[9px] text-[#F1ECE2]">unmissable.co</span>
                      </div>
                      <div className="h-10 rounded bg-[#101013] border border-white/5 p-1.5 flex items-center justify-between">
                        <span className="font-mono text-[9px] text-[#F1ECE2]">Live Drop</span>
                        <span className="text-[9px] text-emerald-400 font-mono">100% Sold</span>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Floating Reaction Bubbles */}
              {bubbles.map((b) => (
                <div
                  key={b.id}
                  className="absolute pointer-events-none text-xs transform -translate-x-1/2 -translate-y-1/2 filter drop-shadow-md"
                  style={{
                    left: `${b.x}px`,
                    top: `${b.y}px`,
                    opacity: b.opacity,
                  }}
                >
                  {b.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Network Node Cluster Graph */}
        <div className="md:col-span-6 flex flex-col h-full justify-between p-3 bg-[#101013]/50 rounded-lg border border-white/5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] uppercase text-[#9C978E] tracking-wider">
              Network Density Graph
            </span>
            <span className="font-mono text-[9px] text-[#FF2E93]">
              Compounding Reach
            </span>
          </div>

          <div className="relative flex-1 w-full h-[150px] flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 140">
              {/* Interconnecting Edges */}
              <line x1="100" y1="70" x2="40" y2="35" stroke="rgba(255, 46, 147, 0.4)" strokeWidth="1" />
              <line x1="100" y1="70" x2="160" y2="40" stroke="rgba(255, 46, 147, 0.4)" strokeWidth="1" />
              <line x1="100" y1="70" x2="35" y2="105" stroke="rgba(255, 59, 31, 0.4)" strokeWidth="1" />
              <line x1="100" y1="70" x2="165" y2="100" stroke="rgba(255, 158, 44, 0.4)" strokeWidth="1" />
              <line x1="100" y1="70" x2="100" y2="20" stroke="rgba(255, 46, 147, 0.5)" strokeWidth="1" />
              <line x1="100" y1="70" x2="100" y2="120" stroke="rgba(61, 43, 255, 0.4)" strokeWidth="1" />

              {/* Cross secondary edges */}
              <line x1="40" y1="35" x2="100" y2="20" stroke="rgba(241, 236, 226, 0.15)" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="160" y1="40" x2="100" y2="20" stroke="rgba(241, 236, 226, 0.15)" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="35" y1="105" x2="100" y2="120" stroke="rgba(241, 236, 226, 0.15)" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="165" y1="100" x2="100" y2="120" stroke="rgba(241, 236, 226, 0.15)" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Peripheral Nodes */}
              <circle cx="40" cy="35" r="5" fill="#FF9E2C" opacity="0.8" />
              <circle cx="160" cy="40" r="6" fill="#FF2E93" opacity="0.8" />
              <circle cx="35" cy="105" r="5" fill="#FF3B1F" opacity="0.8" />
              <circle cx="165" cy="100" r="7" fill="#3D2BFF" opacity="0.8" />
              <circle cx="100" cy="20" r="4.5" fill="#F1ECE2" opacity="0.9" />
              <circle cx="100" cy="120" r="5" fill="#FF2E93" opacity="0.8" />

              {/* Central Nucleus (Your Brand) */}
              <circle cx="100" cy="70" r="14" fill="#FF3B1F" className="animate-pulse" />
              <circle cx="100" cy="70" r="8" fill="#F1ECE2" />
              <text x="100" y="73" fill="#08080A" fontSize="7" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                HUB
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono text-[9px] text-[#9C978E]">
            <span>Community Flywheel</span>
            <span className="text-[#F1ECE2]">Self-Sustaining Organic Reach</span>
          </div>
        </div>
      </div>
    </div>
  )
}
