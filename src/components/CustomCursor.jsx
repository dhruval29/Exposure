import React, { useEffect, useRef } from 'react'
import cursorSvg from '../../W/Cursor.svg'

const CustomCursor = () => {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const move = (e) => {
      node.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 24,
        height: 24,
        transform: 'translate(-9999px, -9999px)',
        backgroundImage: `url(${cursorSvg})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        pointerEvents: 'none',
        zIndex: 100000,
        translate: '-2px -2px'
      }}
    />
  )
}

export default CustomCursor


