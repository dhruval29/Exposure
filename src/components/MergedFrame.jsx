import React, { useEffect, useRef, useState } from 'react'
import styles from './MergedFrame.module.css'

const MergedFrame = () => {
	const frame1Ref = useRef(null)
	const frame2Ref = useRef(null)
	const frame3Ref = useRef(null)

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
				<p className={styles.weUseThe}>Chasing the stories worth remembering.</p>
				<p className={styles.weUseThe}>Living the moments you'll spend</p>
				<p className={styles.weUseThe}>a lifetime returning to.</p>
				</div>
				<div className={styles.frame1SubText}>
					For the ones who wander with purpose and stumble into magic. We explore what moves us, document what matters, and share what stays with you long after you've returned home.
				</div>
                    <div className={styles.frame1Image1Container}>
                        <img className={styles.frame1Image1} src="/assets/images/Sliding Page/Desktop Merged Frame/CNV_0557 (1).jpg" alt="Storytelling image" />
                    </div>
                    <div className={styles.frame1Image2Container}>
                        <img className={styles.frame1Image2} src="/assets/images/Sliding Page/Desktop Merged Frame/RUDR (2).jpg" alt="Inspiration image" />
                    </div>
				</div>
				<div className={styles.frame2Section}>
					<div className={styles.frame2TextContainer}>
						<p className={styles.weUseThe}>We use the power of</p>
						<p className={styles.weUseThe}>{` storytelling to fire `}</p>
						<p className={styles.weUseThe}>{` the imagination, `}</p>
					</div>
                    <div className={styles.frame2Image3Container}>
                        <img className={styles.frame2Image3} src="/assets/images/Sliding Page/Desktop Merged Frame/IMG_28041.JPG" alt="Creative process" />
                    </div>
				</div>
				<div className={styles.frame3Section}>
					<div className={styles.frame3Image2Container}>
						<img className={styles.frame3Image2} src="/assets/images/Sliding Page/Desktop Merged Frame/IMG_20241227_151324.jpg" alt="Creative inspiration" />
					</div>
                    <div className={styles.frame3Image3Container}>
                        <img className={styles.frame3Image3} src="/assets/images/Sliding Page/Desktop Merged Frame/DSC_8925 (1).jpg" alt="Imagination spark" />
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
						{createAnimatedWords("Chasing the stories worth remembering.", 0, 0)}
					</p>
					<p className={styles.weUseThe}>
						{createAnimatedWords("Living the moments you'll spend", 0, 1)}
					</p>
					<p className={styles.weUseThe}>
						{createAnimatedWords("a lifetime returning to.", 0, 2)}
					</p>
				</div>
				<div ref={frame1SubTextRef} className={styles.frame1SubText}>
					For the ones who wander with purpose and stumble into magic. We explore what moves us, document what matters, and share what stays with you long after you've returned home.
				</div>
                <div className={styles.frame1Image1Container}>
                    <picture>
                        <source media="(max-width: 768px)" srcSet="/assets/images/Sliding Page/Desktop Merged Frame/CNV_0557 (1).jpg" />
                        <source media="(max-width: 1200px)" srcSet="/assets/images/Sliding Page/Desktop Merged Frame/CNV_0557 (1).jpg" />
                        <img className={styles.frame1Image1} src="/assets/images/Sliding Page/Desktop Merged Frame/CNV_0557 (1).jpg" alt="Storytelling image" />
                    </picture>
                </div>
                <div className={styles.frame1Image2Container}>
                    <picture>
                        <source media="(max-width: 768px)" srcSet="/assets/images/Sliding Page/Desktop Merged Frame/RUDR (2)-sm.webp" />
                        <source media="(max-width: 1200px)" srcSet="/assets/images/Sliding Page/Desktop Merged Frame/RUDR (2)-md.webp" />
                        <img className={styles.frame1Image2} src="/assets/images/Sliding Page/Desktop Merged Frame/RUDR (2).webp" alt="Inspiration image" />
                    </picture>
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
					We frame the stories that matter most—
					quiet glances, loud celebrations,<br />
					and everything in between. These are the
					moments you’ll want to revisit,
					remember, and relive.
				</div>
                <div className={styles.frame2Image3Container}>
                    <picture>
						<source media="(max-width: 768px)" srcSet="/assets/images/Sliding Page/Desktop Merged Frame/ABC_6161-2 (1).jpg" />
						<source media="(max-width: 1200px)" srcSet="/assets/images/Sliding Page/Desktop Merged Frame/ABC_6161-2 (1).jpg" />
						<img className={styles.frame2Image3} src="/assets/images/Sliding Page/Desktop Merged Frame/ABC_6161-2 (1).jpg" alt="Creative process" />
                    </picture>
                </div>
			</div>

			{/* Frame 3 Content - Bottom Section (200vh to 300vh) */}
			<div ref={frame3Ref} className={styles.frame3Section}>
				<div className={styles.frame3Image2Container}>
					<picture>
						<source media="(max-width: 768px)" srcSet="/assets/images/Sliding Page/Desktop Merged Frame/IMG_20241227_151324.jpg" />
						<source media="(max-width: 1200px)" srcSet="/assets/images/Sliding Page/Desktop Merged Frame/IMG_20241227_151324.jpg" />
						<img className={styles.frame3Image2} src="/assets/images/Sliding Page/Desktop Merged Frame/IMG_20241227_151324.jpg" alt="Creative inspiration" />
					</picture>
				</div>
                <div className={styles.frame3Image3Container}>
					<picture>
						<source media="(max-width: 768px)" srcSet="/assets/images/Sliding Page/Desktop Merged Frame/DSC_8925 (1)-md.webp" />
						<source media="(max-width: 1200px)" srcSet="/assets/images/Sliding Page/Desktop Merged Frame/DSC_8925 (1)-md.webp" />
						<img className={styles.frame3Image3} src="/assets/images/Sliding Page/Desktop Merged Frame/DSC_8925 (1)-md.webp" alt="Imagination spark" />
					</picture>
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
