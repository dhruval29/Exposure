import React from 'react'
import styles from './Frame36.module.css'
import instagramIcon from '../assets/instagram-svgrepo-com.svg'
import youtubeIcon from '../assets/youtube-svgrepo-com.svg'
import linkedinIcon from '../assets/linkedin-svgrepo-com.svg'
import markIcon from '../assets/svgviewer-output.svg'
import copyrightC from '../assets/©.svg'

const Frame36 = () => {
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
    <div className={styles.withLoveFromGoaParent}>
      <b className={styles.withLoveFromContainer}>
        <p className={styles.withLove}>With Love,</p>
        <p className={styles.fromGoa}>
          <span className={styles.withLoveFromGoaParent_fromGoa}>From Goa</span>
          <span className={styles.span}>.</span>
        </p>
      </b>
      <div className={styles.nationalInstituteOfContainer}>
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
      <div className={styles.exposureExplorers}>
        <p className={styles.fromGoa}>{`EXPOSURE `}</p>
        <p className={styles.fromGoa}>EXPLORERS</p>
      </div>
    </div>
  )
}

export default Frame36


