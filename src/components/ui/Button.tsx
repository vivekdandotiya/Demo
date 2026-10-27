import React from 'react'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'secondary-paper' | 'ghost'
  children: React.ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  ariaLabel?: string
  disabled?: boolean
  showArrow?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  href,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  disabled = false,
  showArrow = true,
}) => {
  const isPrimary = variant === 'primary'
  const isSecondary = variant === 'secondary'
  const isSecondaryPaper = variant === 'secondary-paper'

  const baseClasses =
    'relative inline-flex items-center justify-center h-14 px-8 rounded-full font-body font-semibold text-[15px] tracking-tight transition-all duration-300 select-none group cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed'

  let variantClasses = ''
  if (isPrimary) {
    variantClasses =
      'bg-[#C8F53C] text-[#0C0D0F] hover:shadow-[0_4px_20px_rgba(200,245,60,0.35)] focus-visible:outline-2 focus-visible:outline-[#C8F53C] focus-visible:outline-offset-3'
  } else if (isSecondary) {
    variantClasses =
      'border border-white/30 text-[#F3F0E8] hover:border-[#C8F53C] hover:text-[#C8F53C] bg-transparent focus-visible:outline-2 focus-visible:outline-[#C8F53C] focus-visible:outline-offset-3'
  } else if (isSecondaryPaper) {
    variantClasses =
      'border border-[#0C0D0F]/30 text-[#0C0D0F] hover:border-[#0C0D0F] hover:bg-[#0C0D0F]/5 bg-transparent focus-visible:outline-2 focus-visible:outline-[#0C0D0F] focus-visible:outline-offset-3'
  } else {
    variantClasses = 'text-inherit hover:opacity-75 focus-visible:outline-2 focus-visible:outline-current'
  }

  const content = (
    <>
      {/* Rolling text container with exact line-height and absolute duplicate to prevent peek/clipping */}
      <span className="relative block overflow-hidden h-[1.3em] leading-[1.3em]">
        <span className="block transform transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full leading-[1.3em]">
          {children}
        </span>
        <span
          className="block absolute top-full left-0 right-0 transform transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full leading-[1.3em]"
          aria-hidden="true"
        >
          {children}
        </span>
      </span>

      {showArrow && (
        <span
          className="ml-2.5 inline-block transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={`${baseClasses} ${variantClasses} ${className}`}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}
