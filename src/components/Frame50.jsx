import { memo, useState, useEffect } from 'react'
import styles from './Frame50.module.css'

const Frame50 = () => {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isAtBottom, setIsAtBottom] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			// Check if scrolled down enough to collapse
			if (window.scrollY > 100) {
				setIsCollapsed(true)
			} else {
				setIsCollapsed(false)
			}

			// Check if at bottom of page - only trigger when actually at bottom
			const scrollTop = window.scrollY
			const windowHeight = window.innerHeight
			const documentHeight = document.documentElement.scrollHeight
			const scrolledToBottom = scrollTop + windowHeight >= documentHeight - 10

			// Only update isAtBottom if we're actually at the bottom
			if (scrolledToBottom && !isAtBottom) {
				setIsAtBottom(true)
			} else if (!scrolledToBottom && isAtBottom) {
				setIsAtBottom(false)
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [isAtBottom])

	return (
		<div className={`${styles.component16} ${isCollapsed ? styles.collapsed : ''}`}>
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


