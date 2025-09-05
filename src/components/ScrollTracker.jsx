import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ScrollTrigger from 'gsap/ScrollTrigger'

const boxStyle = {
	position: 'fixed',
	top: 10,
	right: 10,
	maxWidth: 360,
	maxHeight: '80vh',
	overflow: 'auto',
	padding: '10px 12px',
	borderRadius: 8,
	background: 'rgba(0,0,0,0.8)',
	color: '#fff',
	fontFamily: 'monospace',
	fontSize: 12,
	lineHeight: 1.4,
	zIndex: 10000,
	boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
}

const headerStyle = { fontWeight: 700, marginBottom: 6 }
const rowStyle = { display: 'flex', justifyContent: 'space-between', gap: 8 }
const hrStyle = { border: 0, borderTop: '1px solid rgba(255,255,255,0.15)', margin: '8px 0' }

const ScrollTracker = ({ defaultVisible = true }) => {
	const location = useLocation()
	const [visible, setVisible] = useState(defaultVisible)
	const rafRef = useRef(0)
	const [data, setData] = useState({
		scrollY: 0,
		innerHeight: 0,
		docHeight: 0,
		progress: []
	})

	// Hide on gallery page
	if (location.pathname === '/gallery') {
		return null
	}

	useEffect(() => {
		const onKey = (e) => {
			if (e.key.toLowerCase() === 'd') setVisible(v => !v)
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [])

	useEffect(() => {
		const loop = () => {
			const scrollY = Math.round(window.scrollY)
			const innerHeight = window.innerHeight
			const docHeight = Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight
			)

			let progress = []
			try {
				if (ScrollTrigger) {
					progress = ScrollTrigger.getAll().map((t, i) => ({
						id: t.vars?.id || `trigger-${i+1}`,
						start: t.start,
						end: t.end,
						progress: Number(t.progress || 0).toFixed(3),
						pinned: !!t.pin,
						trigger: t.trigger && t.trigger.tagName ? t.trigger.tagName.toLowerCase() : 'node'
					}))
				}
			} catch {}

			setData({ scrollY, innerHeight, docHeight, progress })
			rafRef.current = requestAnimationFrame(loop)
		}
		rafRef.current = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(rafRef.current)
	}, [])

	if (!visible) return null

	return (
		<div style={boxStyle} aria-live="polite">
			<div style={headerStyle}>Scroll Tracker (press "D" to toggle)</div>
			<div style={rowStyle}><span>scrollY</span><span>{data.scrollY}px</span></div>
			<div style={rowStyle}><span>viewport</span><span>{data.innerHeight}px</span></div>
			<div style={rowStyle}><span>document</span><span>{data.docHeight}px</span></div>
			<hr style={hrStyle} />
			<div style={{ marginBottom: 4, opacity: 0.8 }}>ScrollTriggers: {data.progress.length}</div>
			{data.progress.map((p, idx) => (
				<div key={idx} style={{ marginBottom: 6 }}>
					<div>{p.id} [{p.trigger}] {p.pinned ? '(pin)' : ''}</div>
					<div style={{ opacity: 0.8 }}>start: {Math.round(p.start)} | end: {Math.round(p.end)} | prog: {p.progress}</div>
				</div>
			))}
		</div>
	)
}

export default ScrollTracker


