import React, { useEffect, useRef, useState } from 'react'
import textPng from '../../W/Text.png'

const TextCursorOverlay = ({ selector = '#headline-reveal, #headline-reveal *' }) => {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const onMove = (e) => {
      node.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const onOver = (e) => {
      if (e.target.closest && e.target.closest(selector)) {
        setActive(true)
      }
    }
    const onOut = (e) => {
      if (!document.elementFromPoint(e.clientX, e.clientY)?.closest(selector)) {
        setActive(false)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousemove', onOver, { passive: true })
    window.addEventListener('mouseout', onOut, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousemove', onOver)
      window.removeEventListener('mouseout', onOut)
    }
  }, [selector])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 64,
        height: 64,
        transform: 'translate(-9999px, -9999px)',
        backgroundImage: `url(${textPng})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        pointerEvents: 'none',
        zIndex: 100000,
        translate: '-8px -8px',
        opacity: active ? 1 : 0
      }}
    />
  )
}

export default TextCursorOverlay


