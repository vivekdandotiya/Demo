import React, { useEffect, useState } from 'react'
import { worldState } from './worldState'

export const WorldCanvas: React.FC = () => {
  const [toneInvert, setToneInvert] = useState(0)

  useEffect(() => {
    let animId: number
    const checkTone = () => {
      if (Math.abs(worldState.toneInvert - toneInvert) > 0.01) {
        setToneInvert(worldState.toneInvert)
      }
      animId = requestAnimationFrame(checkTone)
    }
    animId = requestAnimationFrame(checkTone)
    return () => cancelAnimationFrame(animId)
  }, [toneInvert])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-500 ease-out"
      style={{
        backgroundColor: toneInvert > 0.05 ? '#F1ECE2' : '#08080A',
      }}
      aria-hidden="true"
    >
      {/* Subtle calm ambient radial lighting */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(circle at 68% 42%, rgba(255, 158, 44, 0.08) 0%, rgba(255, 59, 31, 0.04) 35%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(61, 43, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}
