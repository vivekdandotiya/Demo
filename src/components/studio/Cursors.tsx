import React from 'react'

export interface TeammateCursorState {
  maya: { x: number; y: number; clicking: boolean; visible: boolean }
  arjun: { x: number; y: number; clicking: boolean; visible: boolean }
  sam: { x: number; y: number; clicking: boolean; visible: boolean; greeting: boolean }
  visitorOverWall: boolean
}

interface CursorsProps {
  state: TeammateCursorState
}

export const Cursors: React.FC<CursorsProps> = ({ state }) => {
  const { maya, arjun, sam } = state

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-visible" aria-hidden="true">
      {/* 1. Maya, Design (Signal Red-Orange #FF3B1F) */}
      {maya.visible && (
        <div
          className="absolute transition-transform duration-75 ease-out will-change-transform"
          style={{
            transform: `translate3d(${maya.x}px, ${maya.y}px, 60px)`,
          }}
        >
          {/* Click Ripple */}
          {maya.clicking && (
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full border-2 border-[#FF3B1F] animate-ping pointer-events-none" />
          )}

          {/* Cursor Arrow */}
          <svg className="w-4 h-4 text-[#FF3B1F] filter drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.879z" />
          </svg>

          {/* Label Pill */}
          <div className="ml-3.5 -mt-1 px-1.5 py-0.5 rounded-full bg-[#FF3B1F] text-white font-mono text-[8px] font-bold tracking-wider flex items-center gap-1 shadow-md whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-black/40 flex items-center justify-center text-[7px]">
              M
            </span>
            <span>Maya, Design</span>
          </div>
        </div>
      )}

      {/* 2. Arjun, Strategy (Amber #FF9E2C) */}
      {arjun.visible && (
        <div
          className="absolute transition-transform duration-75 ease-out will-change-transform"
          style={{
            transform: `translate3d(${arjun.x}px, ${arjun.y}px, 80px)`,
          }}
        >
          {/* Click Ripple */}
          {arjun.clicking && (
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full border-2 border-[#FF9E2C] animate-ping pointer-events-none" />
          )}

          {/* Cursor Arrow */}
          <svg className="w-4 h-4 text-[#FF9E2C] filter drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.879z" />
          </svg>

          {/* Label Pill */}
          <div className="ml-3.5 -mt-1 px-1.5 py-0.5 rounded-full bg-[#FF9E2C] text-black font-mono text-[8px] font-bold tracking-wider flex items-center gap-1 shadow-md whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-black/30 text-white flex items-center justify-center text-[7px]">
              A
            </span>
            <span>Arjun, Strategy</span>
          </div>
        </div>
      )}

      {/* 3. Sam, Copy (Indigo #3D2BFF) */}
      {sam.visible && (
        <div
          className="absolute transition-transform duration-75 ease-out will-change-transform"
          style={{
            transform: `translate3d(${sam.x}px, ${sam.y}px, 50px)`,
          }}
        >
          {/* Click Ripple */}
          {sam.clicking && (
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full border-2 border-[#3D2BFF] animate-ping pointer-events-none" />
          )}

          {/* Greeting Bubble if nearby visitor */}
          {sam.greeting && (
            <div className="absolute -top-6 left-3 px-2 py-0.5 rounded-full bg-white text-black font-mono text-[8px] font-bold shadow-xl animate-bounce">
              Hi! 👋
            </div>
          )}

          {/* Cursor Arrow */}
          <svg className="w-4 h-4 text-[#3D2BFF] filter drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.879z" />
          </svg>

          {/* Label Pill */}
          <div className="ml-3.5 -mt-1 px-1.5 py-0.5 rounded-full bg-[#3D2BFF] text-white font-mono text-[8px] font-bold tracking-wider flex items-center gap-1 shadow-md whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-black/40 flex items-center justify-center text-[7px]">
              S
            </span>
            <span>Sam, Copy</span>
          </div>
        </div>
      )}
    </div>
  )
}
