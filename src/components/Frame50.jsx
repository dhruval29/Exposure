import { memo, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Frame50.module.css'

const Frame50 = () => {
	const location = useLocation()
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isAtBottom, setIsAtBottom] = useState(false)
	const [hasScrolled, setHasScrolled] = useState(false)

	// Hide on gallery page
	if (location.pathname === '/gallery') {
		return null
	}

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	}

	useEffect(() => {
		const handleScroll = () => {
			// Check if scrolled down enough to start transition (just before sliding page at 100vh)
			const slidingPageStart = window.innerHeight // 100vh
			const triggerPoint = slidingPageStart - 200 // 200px before sliding page
			
			// Both slide to right and collapse happen simultaneously
			if (window.scrollY > triggerPoint) {
				setHasScrolled(true)
				setIsCollapsed(true)
			} else {
				setHasScrolled(false)
				setIsCollapsed(false)
			}

			// Check if we've reached 75% through the contact us page (ZoomReveal section)
			// The contact us page starts at: 100vh + 2768px
			// ZoomReveal section height: 100vh + 55% = 155vh
			// Rotate at 75% through: start + (155vh * 0.75)
			const slidingHeight = 2768
			const contactUsStart = window.innerHeight + slidingHeight
			const zoomRevealHeight = window.innerHeight * 1.55 // 100vh + 55%
			const rotationPoint = contactUsStart + (zoomRevealHeight * 0.75) // 75% through
			const scrollTop = window.scrollY
			
			// Check if we're at or past 75% through the contact us page
			const reachedContactUs = scrollTop >= rotationPoint - 200

			// Only update isAtBottom if we've reached the contact us page
			if (reachedContactUs && !isAtBottom) {
				setIsAtBottom(true)
			} else if (!reachedContactUs && isAtBottom) {
				setIsAtBottom(false)
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [isAtBottom])

	return (
		<div 
			className={`${styles.component16} ${isCollapsed ? styles.collapsed : ''} ${hasScrolled ? styles.movedToRight : styles.centered}`}
			onClick={scrollToTop}
			style={{ cursor: 'pointer' }}
		>
			<div className={styles.component16Child} />
			<img 
				className={`${styles.vectorIcon} ${isAtBottom ? styles.rotateUp : ''}`} 
				alt="" 
				src="/arrow-pointing-to-up-svgrepo-com.svg" 
			/>
			<div className={styles.scroll}>SCROLL</div>
		</div>
	)
}

export default memo(Frame50)


