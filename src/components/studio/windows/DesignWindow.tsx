import React from 'react'
import {
  MousePointer2,
  Square,
  Type,
  Image as ImageIcon,
  PenTool,
  Layers,
  ZoomIn,
  Sparkles,
} from 'lucide-react'
import { StudioTheme } from '../themes'

interface DesignWindowProps {
  theme: StudioTheme
  activeSwatchIndex: number
  isExporting: boolean
  zoomPercent: number
  typedText: string
  isShapeDrawn: boolean
  isPhotoDropped: boolean
  isHandlesVisible: boolean
  artboardRef?: React.RefObject<HTMLDivElement | null>
  exportBtnRef?: React.RefObject<HTMLButtonElement | null>
}

export const DesignWindow: React.FC<DesignWindowProps> = ({
  theme,
  activeSwatchIndex,
  isExporting,
  zoomPercent,
  typedText,
  isShapeDrawn,
  isPhotoDropped,
  isHandlesVisible,
  artboardRef,
  exportBtnRef,
}) => {
  return (
    <div
      className="relative w-[540px] h-[370px] rounded-lg bg-[#101013] border border-[rgba(241,236,226,0.14)] shadow-[0_20px_50px_rgba(0,0,0,0.65)] flex flex-col overflow-hidden select-none"
      style={{
        boxShadow: `0 0 40px ${theme.accentGlow.replace('0.45', '0.08')}, 0 20px 50px rgba(0,0,0,0.7)`,
      }}
    >
      {/* Window Title Bar */}
      <div className="h-9 px-3 bg-[#141419] border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Three Window Controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
          </div>
          <span className="font-mono text-[11px] text-[#9C978E] ml-2 tracking-wide flex items-center gap-1.5">
            <span className="text-[#F1ECE2] font-medium">summer-launch.studio</span>
            <span className="text-[10px] text-[#9C978E]/60">// v4.2</span>
          </span>
        </div>

        {/* Top Right Tool Bar Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-mono text-[10px] text-[#9C978E] bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
            <ZoomIn className="w-3 h-3" />
            <span className="design-zoom-label font-semibold text-[#F1ECE2]">
              {Math.round(zoomPercent)}%
            </span>
          </div>
          <button
            ref={exportBtnRef}
            type="button"
            className={`design-export-btn px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1 ${
              isExporting
                ? 'bg-[#FF3B1F] text-white shadow-[0_0_15px_#FF3B1F] scale-105'
                : 'bg-white/[0.08] text-[#F1ECE2] hover:bg-white/[0.15]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#FF9E2C]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: Left Tool Rail + Center Canvas + Right Inspector Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tool Rail */}
        <div className="w-10 bg-[#121217] border-r border-white/[0.06] flex flex-col items-center py-2 gap-3 shrink-0">
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center bg-white/10 text-white border border-white/10"
            title="Select tool"
          >
            <MousePointer2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center text-[#9C978E] hover:text-white hover:bg-white/5 transition-colors"
            title="Frame"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center text-[#9C978E] hover:text-white hover:bg-white/5 transition-colors"
            title="Type"
          >
            <Type className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center text-[#9C978E] hover:text-white hover:bg-white/5 transition-colors"
            title="Media"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded flex items-center justify-center text-[#9C978E] hover:text-white hover:bg-white/5 transition-colors"
            title="Pen"
          >
            <PenTool className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Canvas with 4:5 Artboard */}
        <div className="flex-1 bg-[#09090C] p-4 flex items-center justify-center overflow-hidden relative">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #F1ECE2 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* 4:5 Artboard Container */}
          <div
            ref={artboardRef}
            className="design-artboard relative w-[210px] h-[262px] rounded-sm overflow-hidden shadow-2xl transition-colors duration-500 border border-white/10 flex flex-col justify-between p-3.5"
            style={{
              backgroundColor: theme.artboardBg,
            }}
          >
            {/* SVG Vector Circle Guide Shape */}
            <svg
              className="absolute -top-10 -right-10 w-44 h-44 pointer-events-none"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={theme.accentColor}
                strokeWidth="1.2"
                strokeDasharray="251"
                strokeDashoffset={isShapeDrawn ? 0 : 251}
                className="transition-all duration-1000 ease-out"
                style={{ opacity: 0.65 }}
              />
              <circle
                cx="50"
                cy="50"
                r="28"
                fill="none"
                stroke="rgba(241,236,226,0.18)"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
            </svg>

            {/* Artboard Header Brand Pill */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] font-semibold text-[#F1ECE2]/70">
                {theme.brandName}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
            </div>

            {/* Artboard Hero Photo Frame */}
            <div
              className={`relative z-10 my-1 w-full h-[120px] rounded overflow-hidden border border-white/10 transition-all duration-700 ${
                isPhotoDropped ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <img
                src={theme.photoUrl}
                alt={theme.brandName}
                className="w-full h-full object-cover filter contrast-110 saturate-[0.95]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Artboard Headline with Typing & Blinking Caret */}
            <div className="relative z-10">
              <h4 className="font-display text-lg text-[#F1ECE2] leading-[1.05] tracking-tight">
                {typedText}
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-[#FF3B1F] align-middle animate-pulse" />
              </h4>
              <p className="font-mono text-[8px] text-[#9C978E] mt-1 truncate">
                {theme.subhead}
              </p>
            </div>

            {/* Selection Handles (Visible during design phase) */}
            {isHandlesVisible && (
              <div
                className="absolute inset-2 pointer-events-none border border-[#FF3B1F]/60"
                aria-hidden="true"
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#FF3B1F]" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#FF3B1F]" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#FF3B1F]" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#FF3B1F]" />
              </div>
            )}
          </div>
        </div>

        {/* Right Inspector Panel: Layers + Color Swatches + Typography Spec */}
        <div className="w-40 bg-[#121217] border-l border-white/[0.06] flex flex-col p-2.5 justify-between shrink-0 font-mono text-[9px]">
          {/* Layers List */}
          <div>
            <div className="flex items-center gap-1 text-[#9C978E] uppercase tracking-wider mb-2 pb-1 border-b border-white/[0.06]">
              <Layers className="w-3 h-3" />
              <span>Layers</span>
            </div>
            <div className="space-y-1">
              <div className="p-1 rounded bg-[#FF3B1F]/15 border border-[#FF3B1F]/40 text-[#F1ECE2] flex items-center justify-between">
                <span>✦ Headline Text</span>
                <span className="text-[8px] text-[#FF3B1F]">Active</span>
              </div>
              <div className="p-1 rounded bg-white/[0.02] border border-white/5 text-[#9C978E] flex items-center justify-between">
                <span>Product Frame</span>
                <span className="text-[8px]">Img</span>
              </div>
              <div className="p-1 rounded bg-white/[0.02] border border-white/5 text-[#9C978E] flex items-center justify-between">
                <span>Accent Ring</span>
                <span className="text-[8px]">Svg</span>
              </div>
              <div className="p-1 rounded bg-white/[0.02] border border-white/5 text-[#9C978E] flex items-center justify-between">
                <span>Canvas Fill</span>
                <span className="text-[8px]">Rect</span>
              </div>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="py-2 border-t border-white/[0.06]">
            <span className="text-[#9C978E] uppercase tracking-wider block mb-1.5">
              Swatches
            </span>
            <div className="flex items-center gap-1.5">
              {theme.swatches.map((color, idx) => (
                <div
                  key={color}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    activeSwatchIndex === idx
                      ? 'scale-115 border-white ring-2 ring-[#FF3B1F]/60'
                      : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Typography Specimen */}
          <div className="pt-2 border-t border-white/[0.06]">
            <span className="text-[#9C978E] uppercase tracking-wider block mb-1">
              Font Specimen
            </span>
            <div className="px-1.5 py-1 rounded bg-white/[0.04] border border-white/10 text-[#F1ECE2] truncate">
              Instrument Serif
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
