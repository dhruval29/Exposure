import React, { useLayoutEffect, useRef } from 'react'
import styles from './Frame36.module.css'
import instagramIcon from '../assets/instagram-svgrepo-com.svg'
import youtubeIcon from '../assets/youtube-svgrepo-com.svg'
import linkedinIcon from '../assets/linkedin-svgrepo-com.svg'
import markIcon from '../assets/svgviewer-output.svg'
import copyrightC from '../assets/©.svg'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Frame36 = () => {
  const rootRef = useRef(null)
  const loveRef = useRef(null)
  const locationRef = useRef(null)
  const brandRef = useRef(null)
  const playedRef = useRef(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current
      if (!root) return

      const targets = [loveRef.current, locationRef.current, brandRef.current].filter(Boolean)

      gsap.set(targets, { opacity: 0, yPercent: 30, rotateX: -15, transformPerspective: 600, transformOrigin: '50% 50%' })

      const play = () => {
        if (playedRef.current) return
        playedRef.current = true
        gsap.to(targets, {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power4.out'
        })
        if (brandRef.current) {
          gsap.timeline()
            .fromTo(brandRef.current, { yPercent: 0 }, { yPercent: -8, duration: 0.25, ease: 'power2.out' })
            .to(brandRef.current, { yPercent: 0, duration: 0.4, ease: 'power3.out' })
        }
      }

      // Primary: trigger when section top meets viewport top
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        once: true,
        onEnter: () => {
          setTimeout(() => play(), 500)
        }
      })

      // Fallback: if the section is brought into view via transform (slide pull), fire when intersecting
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
              setTimeout(() => play(), 500)
              io.disconnect()
            }
          })
        }, { threshold: [0.15, 0.3, 0.5] })
        io.observe(root)
      }
    })
    return () => ctx.revert()
  }, [])
  const handleInstagramClick = () => {
    window.open('https://instagram.com/exposureexplorers', '_blank', 'noopener,noreferrer')
  }

  const handleYouTubeClick = () => {
    window.open('https://youtube.com/@exposureexplorers', '_blank', 'noopener,noreferrer')
  }

  const handleLinkedInClick = () => {
    window.open('https://linkedin.com/company/exposureexplorers', '_blank', 'noopener,noreferrer')
  }

  const handleMarkClick = () => {
    // Add your mark/logo click handler here
    console.log('Mark clicked')
  }


  return (
    <div ref={rootRef} className={styles.withLoveFromGoaParent}>
      <b ref={loveRef} className={styles.withLoveFromContainer}>
        <p className={styles.withLove}>Contact</p>
        <p className={styles.fromGoa}>
          <span className={styles.withLoveFromGoaParent_fromGoa}>Us</span>
          <span className={styles.span}>.</span>
        </p>
      </b>
      <div ref={locationRef} className={styles.nationalInstituteOfContainer}>
        <p className={styles.fromGoa}>National Institute of Technology, Goa</p>
        <p className={styles.fromGoa}>South Goa ,India</p>
      </div>
      <button 
        className={styles.instagramSvgrepoCom2Icon} 
        onClick={handleInstagramClick}
        aria-label="Visit our Instagram"
        title="Follow us on Instagram"
      >
        <img alt="Instagram" src={instagramIcon} />
      </button>
      <button 
        className={styles.youtubeSvgrepoCom2Icon} 
        onClick={handleYouTubeClick}
        aria-label="Visit our YouTube"
        title="Subscribe to our YouTube"
      >
        <img alt="YouTube" src={youtubeIcon} />
      </button>
      <button 
        className={styles.linkedinSvgrepoCom12} 
        onClick={handleLinkedInClick}
        aria-label="Visit our LinkedIn"
        title="Connect with us on LinkedIn"
      >
        <img alt="LinkedIn" src={linkedinIcon} />
      </button>
      <button 
        className={styles.svgviewerOutput2Icon} 
        onClick={handleMarkClick}
        aria-label="Mark"
        title="Mark"
      >
        <img alt="Mark" src={markIcon} />
      </button>
      <img className={styles.copyrightIcon} alt="Copyright" src={copyrightC} />
      <div ref={brandRef} className={styles.exposureExplorers}>
        <p className={styles.fromGoa}>{`EXPOSURE `}</p>
        <p className={styles.fromGoa}>EXPLORERS</p>
      </div>
    </div>
  )
}

export default Frame36


