import { memo, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Frame50.module.css'

const Frame50 = () => {
	const location = useLocation()
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isAtBottom, setIsAtBottom] = useState(false)
	const [hasScrolled, setHasScrolled] = useState(false)
	const [footerVisible, setFooterVisible] = useState(false)

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
			// For Events page, hide scroll display after 50vh
			const fiftyVh = window.innerHeight * 0.5 // 50vh
			
			// Check if scrolled down enough to start transition (just before sliding page at 100vh)
			const slidingPageStart = window.innerHeight // 100vh
			const triggerPoint = slidingPageStart - 200 // 200px before sliding page
			const midwayPoint = slidingPageStart * 0.25 // 25% to pull-up page
			
			// For Events page: hide after 50vh, for other pages use original logic
			if (window.location.pathname === '/events') {
				if (window.scrollY > fiftyVh) {
					setHasScrolled(true)
					setIsCollapsed(true)
				} else {
					setHasScrolled(false)
					setIsCollapsed(false)
				}
			} else {
				// Original logic for other pages
				if (window.scrollY > triggerPoint) {
					setHasScrolled(true)
					setIsCollapsed(true)
				} else {
					setHasScrolled(false)
					setIsCollapsed(false)
				}
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
	}, [isAtBottom])

	// Observe footer and fade out indicator when footer is visible
	useEffect(() => {
		const footerEl = document.getElementById('site-footer')
		if (!footerEl) return
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					setFooterVisible(entry.isIntersecting)
				}
			},
			{
				root: null,
				rootMargin: '0px 0px -20% 0px',
				threshold: [0, 0.01, 0.1]
			}
		)
		observer.observe(footerEl)
		return () => observer.disconnect()
	}, [])


	return (
		<>
			{/* Variant 1 - Centered (fades out when scrolling). */}
			<div 
				className={`${styles.component16} ${styles.variant1} ${footerVisible ? styles.fadeOut : hasScrolled ? styles.fadeOut : styles.fadeIn}`}
				onClick={scrollToTop}
				style={{ cursor: 'pointer' }}
			>
				<div className={styles.component16Child} />
				<img 
					className={styles.vectorIcon} 
					alt="" 
					src="/arrow-pointing-to-up-svgrepo-com.svg" 
				/>
				<div className={styles.scroll}>SCROLL</div>
			</div>

			{/* Variant 2 - Right aligned (fades in when scrolling, no text, bouncy) */}
			<div 
				className={`${styles.component16} ${styles.variant2} ${footerVisible ? styles.fadeOut : hasScrolled ? styles.fadeInBouncy : styles.fadeOut}`}
				onClick={scrollToTop}
				style={{ cursor: 'pointer' }}
			>
				<div className={styles.component16Child} />
				<img 
					className={`${styles.vectorIcon} ${isAtBottom ? styles.rotateUp : ''}`} 
					alt="" 
					src="/arrow-pointing-to-up-svgrepo-com.svg" 
				/>
			</div>
		</>
	)
}

export default memo(Frame50)


