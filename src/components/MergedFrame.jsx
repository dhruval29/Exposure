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

	// Text animation refs - now for individual words
	const textWordRefs = useRef([])
	const frame1SubTextRef = useRef(null)
	const frame2TextRef = useRef(null)
	const frame2SubTextRef = useRef(null)
	const frame3SubTextRef = useRef(null)

	// Add error boundary state
	const [hasError, setHasError] = useState(false)

	// Helper function to split text into animated words with frame-specific timing
	const createAnimatedWords = (text, frameIndex = 0, lineIndex = 0) => {
		const words = text.split(' ')
		return words.map((word, index) => (
			<span 
				key={index}
				ref={(el) => (textWordRefs.current.push(el))} 
				className={styles.animatedWord}
				data-frame={frameIndex}
				data-line={lineIndex}
				data-word-index={index}
			>
				{word}
			</span>
		))
	}

	// Image parallax with Intersection Observer
	useEffect(() => {
		const imageRefs = [img1Ref, img2Ref, img3Ref, img4Ref, img5Ref]
		const parallaxSpeeds = [0.06, 0.06, 0.06, 0.03, 0.06]
		const scaleValues = [1.02, 1.02, 1.02, 1.01, 1.02]
		
		const imageObservers = imageRefs.map((imgRef, index) => {
			if (!imgRef.current) return null
			
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							// Start parallax animation when image comes into view
							const startScrollY = window.scrollY
							const handleScroll = () => {
								const currentScrollY = window.scrollY
								const relativeScroll = Math.max(0, currentScrollY - startScrollY)
								const offset = relativeScroll * parallaxSpeeds[index]
								
								gsap.set(imgRef.current, {
									y: offset,
									scale: scaleValues[index],
									transformOrigin: 'center center',
									force3D: true
								})
							}
							
							// Add scroll listener for this specific image
							window.addEventListener('scroll', handleScroll, { passive: true })
							
							// Store cleanup function
							imgRef.current._cleanup = () => {
								window.removeEventListener('scroll', handleScroll)
							}
						} else {
							// Clean up when image leaves view
							if (imgRef.current && imgRef.current._cleanup) {
								imgRef.current._cleanup()
								imgRef.current._cleanup = null
							}
						}
					})
				},
				{
					threshold: 0.1, // Trigger when 10% visible
					rootMargin: '0px 0px -100px 0px' // Start before fully visible
				}
			)
			
			observer.observe(imgRef.current)
			return observer
		})

		return () => {
			imageObservers.forEach(observer => {
				if (observer) observer.disconnect()
			})
			// Clean up any remaining scroll listeners
			imageRefs.forEach(imgRef => {
				if (imgRef.current && imgRef.current._cleanup) {
					imgRef.current._cleanup()
				}
			})
		}
	}, [])

	// Text animation intersection observer - frame-based timing
	useEffect(() => {
		const textObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Get frame, line, and word index from data attributes
						const frameIndex = parseInt(entry.target.dataset.frame)
						const lineIndex = parseInt(entry.target.dataset.line)
						const wordIndex = parseInt(entry.target.dataset.wordIndex)
						
						if (!isNaN(frameIndex) && !isNaN(lineIndex) && !isNaN(wordIndex)) {
							// Calculate cumulative delay: line offset + word offset (quicker timing)
							const lineOffset = lineIndex * 250 // Reduced for faster line-by-line animation
							const wordOffset = wordIndex * 25 // Reduced for faster word-by-word animation
							
							// Make Frame 3 (frameIndex 2) appear earlier by reducing its delay
							const frameDelay = frameIndex === 2 ? -400 : 0 // Frame 3 starts 400ms earlier
							const totalDelay = Math.max(0, lineOffset + wordOffset + frameDelay)
							
                            setTimeout(() => {
                                entry.target.classList.add(styles.play)
                                // Stop observing this element after animation starts
                                textObserver.unobserve(entry.target)
                            }, totalDelay)
						}
					}
				})
			},
			{ 
				threshold: 0.2, // Trigger when 20% visible (faster triggering)
				rootMargin: '0px 0px -150px 0px' // Trigger 150px before fully visible (earlier)
			}
		)

		// Observe all word elements
		textWordRefs.current.forEach((element) => {
			if (element) {
				textObserver.observe(element)
			}
		})

		return () => {
			textObserver.disconnect()
		}
	}, [])

	// Subtext reveal intersection observer
	useEffect(() => {
		const elements = [frame1SubTextRef.current, frame2SubTextRef.current, frame3SubTextRef.current].filter(Boolean)
		if (elements.length === 0) return

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add(styles.subTextReveal)
						observer.unobserve(entry.target)
					}
				})
			},
			{ threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
		)

		elements.forEach((el) => observer.observe(el))

		return () => observer.disconnect()
	}, [])


	// Removed lorem container animation

	// Error fallback
	if (hasError) {
		return (
			<div className={styles.mergedFrameParent}>
				<div className={styles.frame1Section}>
				<div className={styles.weUseTheContainer}>
					<p className={styles.weUseThe}>Hola, explorer. Stories worth chasing.</p>
					<p className={styles.weUseThe}>Places worth losing yourself in.</p>
					<p className={styles.weUseThe}>Moments that rewrite what you thought</p>
					<p className={styles.weUseThe}>you knew.</p>
				</div>
				<div className={styles.frame1SubText}>
					For the ones who wander with purpose and stumble into magic. We explore what moves us, document what matters, and share what stays with you long after you've returned home.
				</div>
                    <div className={styles.frame1Image1Container}>
                        <img className={styles.frame1Image1} src="/assets/images/Sliding Page/Desktop Merged Frame/Gemini_Generated_Image_j9982tj9982tj998.webp" alt="Storytelling image" />
                    </div>
                    <div className={styles.frame1Image2Container}>
                        <img className={styles.frame1Image2} src="/assets/images/Sliding Page/Desktop Merged Frame/RUDR (2).webp" alt="Inspiration image" />
                    </div>
				</div>
				<div className={styles.frame2Section}>
					<div className={styles.frame2TextContainer}>
						<p className={styles.weUseThe}>We use the power of</p>
						<p className={styles.weUseThe}>{` storytelling to fire `}</p>
						<p className={styles.weUseThe}>{` the imagination, `}</p>
					</div>
                    <div className={styles.frame2Image3Container}>
                        <img className={styles.frame2Image3} src="/assets/images/Sliding Page/Desktop Merged Frame/DSC_6125 (1).jpg" alt="Creative process" />
                    </div>
				</div>
				<div className={styles.frame3Section}>
					<div className={styles.frame3Image2Container}>
						<img className={styles.frame3Image2} src="/assets/images/Sliding Page/7.webp" alt="Creative inspiration" />
					</div>
                    <div className={styles.frame3Image3Container}>
                        <img className={styles.frame3Image3} src="/assets/images/Sliding Page/Desktop Merged Frame/DSC_8925 (1).webp" alt="Imagination spark" />
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
					<p className={styles.weUseThe}>
						{createAnimatedWords("Hola, explorer. Stories worth chasing.", 0, 0)}
					</p>
					<p className={styles.weUseThe}>
						{createAnimatedWords("Places worth losing yourself in.", 0, 1)}
					</p>
					<p className={styles.weUseThe}>
						{createAnimatedWords("Moments that rewrite what you thought", 0, 2)}
					</p>
					<p className={styles.weUseThe}>
						{createAnimatedWords("you knew.", 0, 3)}
					</p>
				</div>
				<div ref={frame1SubTextRef} className={styles.frame1SubText}>
					For the ones who wander with purpose and stumble into magic. We explore what moves us, document what matters, and share what stays with you long after you've returned home.
				</div>
                <div className={styles.frame1Image1Container}>
                    <img ref={img1Ref} className={styles.frame1Image1} src="/assets/images/Sliding Page/Desktop Merged Frame/Gemini_Generated_Image_j9982tj9982tj998.webp" alt="Storytelling image" />
                </div>
                <div className={styles.frame1Image2Container}>
                    <img ref={img2Ref} className={styles.frame1Image2} src="/assets/images/Sliding Page/Desktop Merged Frame/RUDR (2).webp" alt="Inspiration image" />
                </div>
			</div>

			{/* Frame 2 Content - Middle Section (100vh to 200vh) */}
			<div ref={frame2Ref} className={styles.frame2Section}>
				<div ref={frame2TextRef} className={styles.frame2TextContainer}>
					<p className={styles.weUseThe}>
						{createAnimatedWords("We freeze time, find beauty, and give", 1, 0)}
					</p>
					<p className={styles.weUseThe}>
						{createAnimatedWords("memories a home", 1, 1)}
					</p>
				</div>
				<div ref={frame2SubTextRef} className={styles.frame2SubText}>
					We frame the stories<br />
					that matter most
				</div>
                <div className={styles.frame2Image3Container}>
                    <img ref={img3Ref} className={styles.frame2Image3} src="/assets/images/Sliding Page/Desktop Merged Frame/DSC_6125 (1).jpg" alt="Creative process" />
                </div>
			</div>

			{/* Frame 3 Content - Bottom Section (200vh to 300vh) */}
			<div ref={frame3Ref} className={styles.frame3Section}>
				<div className={styles.frame3Image2Container}>
					<img ref={img4Ref} className={styles.frame3Image2} src="/assets/images/Sliding Page/7.webp" alt="Creative inspiration" />
				</div>
                <div className={styles.frame3Image3Container}>
                    <img ref={img5Ref} className={styles.frame3Image3} src="/assets/images/Sliding Page/Desktop Merged Frame/DSC_8925 (1).webp" alt="Imagination spark" />
                </div>
				<div className={styles.frame3TextContainer}>
					<p className={styles.weUseThe}>
						{createAnimatedWords("We frame the love,", 2, 0)}
					</p>
					<p className={styles.weUseThe}>
						{createAnimatedWords("laughter, and", 2, 1)}
					</p>
					<p className={styles.weUseThe}>
						{createAnimatedWords("everything in between", 2, 2)}
					</p>
				</div>
				<div ref={frame3SubTextRef} className={styles.frame3SubText}>
					We capture the fleeting moments<br />
					and give them a timeless<br />
					home
				</div>
			</div>
		</div>
	)
}

export default MergedFrame
