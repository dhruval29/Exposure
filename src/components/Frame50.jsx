import { memo, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Frame50.module.css'

const Frame50 = () => {
	const location = useLocation()
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isAtBottom, setIsAtBottom] = useState(false)
	const [hasScrolled, setHasScrolled] = useState(false)
	const [showMore, setShowMore] = useState(false)
	const [typedSuffix, setTypedSuffix] = useState('')

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
			const midwayPoint = slidingPageStart * 0.25 // 25% to pull-up page
			
			// Both slide to right and collapse happen simultaneously
			if (window.scrollY > triggerPoint) {
				setHasScrolled(true)
				setIsCollapsed(true)
			} else {
				setHasScrolled(false)
				setIsCollapsed(false)
			}

			// Midway typing/resize trigger for centered variant
			// Keep expanded state once triggered; only shrink when user scrolls back above midway
			if (window.scrollY > midwayPoint) {
				if (!showMore) setShowMore(true)
			} else if (showMore) {
				setShowMore(false)
			}

			// Check if we've reached 75% through the contact us page (ZoomReveal section)
			// The contact us page now starts at: 100vh + 2768px + 60vh (new section)
			// ZoomReveal section height: 100vh + 55% = 155vh
			// Rotate at 75% through: start + (155vh * 0.75)
			const slidingHeight = 2768
			const newSectionHeight = window.innerHeight * 0.6 // 60vh
			const contactUsStart = window.innerHeight + slidingHeight + newSectionHeight
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
	}, [isAtBottom, showMore])

	// Typing effect for the "MORE" suffix when showMore is active
	useEffect(() => {
		const fullSuffix = 'MORE'
		if (!showMore) {
			setTypedSuffix('')
			return
		}
		setTypedSuffix('')
		let index = 0
		const interval = setInterval(() => {
			index += 1
			setTypedSuffix(fullSuffix.slice(0, index))
			if (index >= fullSuffix.length) {
				clearInterval(interval)
			}
		}, 60)
		return () => clearInterval(interval)
	}, [showMore])

	// Reverse typing effect for hiding "MORE" text when collapsing
	useEffect(() => {
		if (!hasScrolled) return
		
		const fullSuffix = 'MORE'
		let index = fullSuffix.length
		const interval = setInterval(() => {
			index -= 1
			setTypedSuffix(fullSuffix.slice(0, index))
			if (index <= 0) {
				clearInterval(interval)
			}
		}, 40) // Slightly faster for hiding
		return () => clearInterval(interval)
	}, [hasScrolled])

	return (
		<div 
			className={`${styles.component16} ${styles.variant1} ${showMore ? styles.expanded : ''} ${hasScrolled ? styles.collapsed : ''}`}
			onClick={scrollToTop}
			style={{ cursor: 'pointer' }}
		>
			<div className={styles.component16Child} />
			<img 
				className={`${styles.vectorIcon} ${isAtBottom ? styles.rotateUp : ''}`} 
				alt="" 
				src="/arrow-pointing-to-up-svgrepo-com.svg" 
			/>
			<div className={styles.scroll}>SCROLL<span className={`${styles.moreSuffix} ${typedSuffix ? styles.hasContent : ''}`}>{typedSuffix}</span></div>
		</div>
	)
}

export default memo(Frame50)


