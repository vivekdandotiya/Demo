import { useState, useEffect } from 'react'

export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })

  useEffect(() => {
    const check = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isTouch
}
