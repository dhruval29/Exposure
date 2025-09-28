import React, { useEffect, useRef, useState } from 'react'
import styles from './MergedFrame.module.css'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MergedFrame = () => {
	const frame1Ref = useRef(null)
	const frame2Ref = useRef(null)
	const frame3Ref = useRef(null)
	const img1Ref = useRef(null)
	const img2Ref = useRef(null)
	const img3Ref = useRef(null)
	const img4Ref = useRef(null)
	const img5Ref = useRef(null)

	// Add error boundary state
	const [hasError, setHasError] = useState(false)

	useEffect(() => {
		const triggers = []
		let isMounted = true

		// Enhanced scroll-based parallax with varying speeds and directions
		const handleScroll = () => {
			if (!isMounted) return

			const scrollY = window.scrollY
			const windowHeight = window.innerHeight
			
			// Calculate parallax offsets based on scroll position
			// The sliding page starts at 100vh, so we need to account for that
			const slidingPageStart = windowHeight // 100vh
			const relativeScroll = Math.max(0, scrollY - slidingPageStart)
			
			// Apply doubled parallax effects to all images for more noticeable movement
			// All images now have doubled parallax values
			if (img1Ref.current) {
				const offset = relativeScroll * 0.06 // Doubled speed
				gsap.set(img1Ref.current, { 
					y: offset, 
					scale: 1.02, // Doubled scaling
					transformOrigin: 'center center' 
				})
			}
			if (img2Ref.current) {
				const offset = relativeScroll * 0.06 // Doubled speed
				gsap.set(img2Ref.current, { 
					y: offset, 
					scale: 1.02, // Doubled scaling
					transformOrigin: 'center center' 
				})
			}
			if (img3Ref.current) {
				const offset = relativeScroll * 0.06 // Doubled speed
				gsap.set(img3Ref.current, { 
					y: offset, 
					scale: 1.02, // Doubled scaling
					transformOrigin: 'center center' 
				})
			}
			if (img4Ref.current) {
				const offset = relativeScroll * 0.03 // Doubled speed for frame3Image2
				gsap.set(img4Ref.current, { 
					y: offset, 
					scale: 1.01, // Doubled scaling for frame3Image2
					transformOrigin: 'center center' 
				})
			}
			if (img5Ref.current) {
				const offset = relativeScroll * 0.06 // Doubled speed
				gsap.set(img5Ref.current, { 
					y: offset, 
					scale: 1.02, // Doubled scaling
					transformOrigin: 'center center' 
				})
			}
			
			// Text containers remain static - no parallax applied
		}

		// Throttled scroll handler for better performance
		let scrollTimeout = null
		const throttledScroll = () => {
			if (scrollTimeout) return
			scrollTimeout = setTimeout(() => {
				handleScroll()
				scrollTimeout = null
			}, 16) // ~60fps
		}

		try {
			// Add scroll listener
			window.addEventListener('scroll', throttledScroll, { passive: true })
			
			// Initial call
			handleScroll()

			// Also setup a listener for window resize
			const handleResize = () => {
				if (isMounted) {
					handleScroll()
				}
			}
			window.addEventListener('resize', handleResize)

			return () => {
				isMounted = false
				window.removeEventListener('scroll', throttledScroll)
				window.removeEventListener('resize', handleResize)
				if (scrollTimeout) {
					clearTimeout(scrollTimeout)
				}
			}
		} catch (error) {
			console.error('Error in MergedFrame useEffect:', error)
			setHasError(true)
		}
	}, [])

	// Error fallback
	if (hasError) {
		return (
			<div className={styles.mergedFrameParent}>
				<div className={styles.frame1Section}>
					<div className={styles.weUseTheContainer}>
						<p className={styles.weUseThe}>We use the power of storytelling to</p>
						<p className={styles.weUseThe}>fire the imagination, stir the soul,</p>
						<p className={styles.weUseThe}>and ultimately inspire people.</p>
					</div>
					<div className={styles.frame1Image1Container}>
						<img className={styles.frame1Image1} src="/assets/images/Sliding Page/1.webp" alt="Storytelling image" />
					</div>
					<div className={styles.frame1Image2Container}>
						<img className={styles.frame1Image2} src="/assets/images/Sliding Page/2.webp" alt="Inspiration image" />
					</div>
				</div>
				<div className={styles.frame2Section}>
					<div className={styles.frame2TextContainer}>
						<p className={styles.weUseThe}>We use the power of</p>
						<p className={styles.weUseThe}>{` storytelling to fire `}</p>
						<p className={styles.weUseThe}>{` the imagination, `}</p>
					</div>
					<div className={styles.frame2Image3Container}>
						<img className={styles.frame2Image3} src="/assets/images/Sliding Page/5.webp" alt="Creative process" />
					</div>
					<div className={styles.frame2LoremContainer}>
						<p className={styles.weUseThe}>{`dgLorem ipsum dolor sit amet, `}</p>
						<p className={styles.weUseThe}>{`consectetur adipiscing elit, sed do `}</p>
					</div>
				</div>
				<div className={styles.frame3Section}>
					<div className={styles.frame3Image2Container}>
						<img className={styles.frame3Image2} src="/assets/images/Sliding Page/7.webp" alt="Creative inspiration" />
					</div>
					<div className={styles.frame3Image3Container}>
						<img className={styles.frame3Image3} src="/assets/images/Sliding Page/8.webp" alt="Imagination spark" />
					</div>
					<div className={styles.frame3TextContainer}>
						<p className={styles.weUseThe}>We use the power of</p>
						<p className={styles.weUseThe}>{` storytelling to fire `}</p>
						<p className={styles.weUseThe}>{` the imagination, `}</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.mergedFrameParent}>
			{/* Frame 1 Content - Top Section (0vh to 100vh) */}
			<div ref={frame1Ref} className={styles.frame1Section}>
				<div className={styles.weUseTheContainer}>
					<p className={styles.weUseThe}>We use the power of storytelling to</p>
					<p className={styles.weUseThe}>fire the imagination, stir the soul,</p>
					<p className={styles.weUseThe}>and ultimately inspire people.</p>
				</div>
				<div className={styles.frame1Image1Container}>
					<img ref={img1Ref} className={styles.frame1Image1} src="/assets/images/Sliding Page/1.webp" alt="Storytelling image" />
				</div>
				<div className={styles.frame1Image2Container}>
					<img ref={img2Ref} className={styles.frame1Image2} src="/assets/images/Sliding Page/2.webp" alt="Inspiration image" />
				</div>
			</div>

			{/* Frame 2 Content - Middle Section (100vh to 200vh) */}
			<div ref={frame2Ref} className={styles.frame2Section}>
				<div className={styles.frame2TextContainer}>
					<p className={styles.weUseThe}>We use the power of</p>
					<p className={styles.weUseThe}>{` storytelling to fire `}</p>
					<p className={styles.weUseThe}>{` the imagination, `}</p>
				</div>
				<div className={styles.frame2Image3Container}>
					<img ref={img3Ref} className={styles.frame2Image3} src="/assets/images/Sliding Page/5.webp" alt="Creative process" />
				</div>
				<div className={styles.frame2LoremContainer}>
					<p className={styles.weUseThe}>{`dgLorem ipsum dolor sit amet, `}</p>
					<p className={styles.weUseThe}>{`consectetur adipiscing elit, sed do `}</p>
				</div>
			</div>

			{/* Frame 3 Content - Bottom Section (200vh to 300vh) */}
			<div ref={frame3Ref} className={styles.frame3Section}>
				<div className={styles.frame3Image2Container}>
					<img ref={img4Ref} className={styles.frame3Image2} src="/assets/images/Sliding Page/7.webp" alt="Creative inspiration" />
				</div>
				<div className={styles.frame3Image3Container}>
					<img ref={img5Ref} className={styles.frame3Image3} src="/assets/images/Sliding Page/8.webp" alt="Imagination spark" />
				</div>
				<div className={styles.frame3TextContainer}>
					<p className={styles.weUseThe}>We use the power of</p>
					<p className={styles.weUseThe}>{` storytelling to fire `}</p>
					<p className={styles.weUseThe}>{` the imagination, `}</p>
				</div>
			</div>
		</div>
	)
}

export default MergedFrame
