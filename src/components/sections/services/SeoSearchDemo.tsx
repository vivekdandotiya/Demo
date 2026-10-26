import React, { useState, useEffect } from 'react'

interface DemoProps {
  isActive: boolean
  isReducedMotion?: boolean
}

interface SearchResult {
  id: string
  name: string
  url: string
  desc: string
  isYourBrand?: boolean
}

const INITIAL_RESULTS: SearchResult[] = [
  { id: 'c1', name: 'Competitor Alpha Corp', url: 'alpha-market.com/platform', desc: 'Standard generic cloud architecture offering.' },
  { id: 'c2', name: 'Competitor Beta Systems', url: 'beta-systems.io/enterprise', desc: 'Legacy enterprise marketing tools & features.' },
  { id: 'c3', name: 'Competitor Gamma Solutions', url: 'gamma-global.net/suite', desc: 'Traditional digital search directory.' },
  { id: 'c4', name: 'Competitor Delta Group', url: 'delta-holdings.co/products', desc: 'Fragmented paid & organic solutions.' },
  { id: 'c5', name: 'Competitor Epsilon Media', url: 'epsilon-digital.com/services', desc: 'Outdated category listing.' },
  { id: 'yb', name: 'Your Brand // Unmissable Category Leader', url: 'yourbrand.com/authority', desc: 'High-intent search authority & semantic AI recall.', isYourBrand: true },
]

export const SeoSearchDemo: React.FC<DemoProps> = ({ isActive, isReducedMotion = false }) => {
  const queryText = 'enterprise search authority architecture'
  const [typedQuery, setTypedQuery] = useState(isReducedMotion ? queryText : '')
  const [items, setItems] = useState<SearchResult[]>(() => {
    if (isReducedMotion) {
      // In reduced motion, Your Brand is already #1
      const copy = [...INITIAL_RESULTS]
      const yb = copy.pop()!
      return [yb, ...copy]
    }
    return INITIAL_RESULTS
  })
  const [isClimbing, setIsClimbing] = useState(false)
  const [isRankOne, setIsRankOne] = useState(isReducedMotion)

  useEffect(() => {
    if (isReducedMotion) return
    if (!isActive) {
      setTypedQuery('')
      setItems(INITIAL_RESULTS)
      setIsClimbing(false)
      setIsRankOne(false)
      return
    }

    let charIndex = 0
    let timer: any = null
    let climbTimeout: any = null
    let loopTimeout: any = null

    // Step 1: Type query
    const typeInterval = setInterval(() => {
      charIndex++
      setTypedQuery(queryText.slice(0, charIndex))
      if (charIndex >= queryText.length) {
        clearInterval(typeInterval)

        // Step 2: Pause, then trigger FLIP climb
        climbTimeout = setTimeout(() => {
          setIsClimbing(true)
          
          // Reorder: Move 'Your Brand' to position 0
          setTimeout(() => {
            setItems(() => {
              const copy = [...INITIAL_RESULTS]
              const yb = copy.pop()!
              return [yb, ...copy]
            })
            setIsRankOne(true)
          }, 400)

          // Step 3: Loop after 5s
          loopTimeout = setTimeout(() => {
            setTypedQuery('')
            setItems(INITIAL_RESULTS)
            setIsClimbing(false)
            setIsRankOne(false)
          }, 5000)
        }, 800)
      }
    }, 45)

    return () => {
      clearInterval(typeInterval)
      clearTimeout(timer)
      clearTimeout(climbTimeout)
      clearTimeout(loopTimeout)
    }
  }, [isActive, isReducedMotion])

  return (
    <div 
      className="relative w-full h-full flex flex-col p-4 md:p-6 bg-[#0B0B0E] rounded-xl hairline-box overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Illustrative Tag */}
      <div className="flex items-center justify-between pb-3 hairline-b mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF3B1F] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9C978E]">
            ENGINE REORDER // LIVE SERP SIMULATION
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-[#FF3B1F]/30 bg-[#FF3B1F]/10 text-[#FF3B1F] font-medium tracking-wider">
          Illustrative
        </span>
      </div>

      {/* Simulated Search Input */}
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-[#141419] border border-white/10 mb-3 shadow-inner">
        <svg className="w-4 h-4 text-[#9C978E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="font-mono text-xs md:text-sm text-[#F1ECE2] flex-1 truncate">
          {typedQuery}
          {typedQuery.length < queryText.length && (
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#FF3B1F] align-middle animate-pulse" />
          )}
        </span>
        <span className="font-mono text-[10px] text-[#9C978E] px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
          ENTER
        </span>
      </div>

      {/* SERP Results List */}
      <div className="relative flex-1 flex flex-col gap-1.5 overflow-hidden">
        {items.map((res, idx) => {
          const isYb = res.isYourBrand
          return (
            <div
              key={res.id}
              className={`transition-all duration-700 ease-out flex items-center justify-between px-3 py-2 rounded-md ${
                isYb
                  ? isRankOne
                    ? 'bg-[#FF3B1F]/15 border border-[#FF3B1F] shadow-[0_0_20px_rgba(255,59,31,0.25)]'
                    : 'bg-white/[0.04] border border-white/10'
                  : 'bg-[#101013]/60 border border-white/[0.04] opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`font-mono text-xs font-semibold ${isYb ? 'text-[#FF3B1F]' : 'text-[#9C978E]'}`}>
                  #{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-mono text-xs truncate font-medium ${isYb ? 'text-[#F1ECE2]' : 'text-[#9C978E]'}`}>
                      {res.name}
                    </p>
                    {isYb && isRankOne && (
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#FF3B1F] text-white font-bold tracking-wider">
                        ★ TOP RANK
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-[#9C978E]/70 truncate">
                    {res.url}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-right">
                <span className={`font-mono text-[10px] ${isYb ? 'text-emerald-400' : 'text-[#9C978E]'}`}>
                  {isYb ? '+94% Share' : 'Standard'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
