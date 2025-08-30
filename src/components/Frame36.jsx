import React from 'react'
import styles from './Frame36.module.css'
import instagramIcon from '../assets/instagram-svgrepo-com.svg'
import youtubeIcon from '../assets/youtube-svgrepo-com.svg'
import linkedinIcon from '../assets/linkedin-svgrepo-com.svg'
import markIcon from '../assets/svgviewer-output.svg'
import copyrightC from '../assets/©.svg'

const Frame36 = () => {
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
      <img className={styles.instagramSvgrepoCom2Icon} alt="Instagram" src={instagramIcon} />
      <img className={styles.youtubeSvgrepoCom2Icon} alt="YouTube" src={youtubeIcon} />
      <img className={styles.linkedinSvgrepoCom12} alt="LinkedIn" src={linkedinIcon} />
      <img className={styles.svgviewerOutput2Icon} alt="Mark" src={markIcon} />
      <img className={styles.copyrightIcon} alt="Copyright" src={copyrightC} />
      <div className={styles.exposureExplorers}>
        <p className={styles.fromGoa}>{`EXPOSURE `}</p>
        <p className={styles.fromGoa}>EXPLORERS</p>
      </div>
    </div>
  )
}

export default Frame36


