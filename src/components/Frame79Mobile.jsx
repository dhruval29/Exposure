import React from 'react';
import styles from './Frame79Mobile.module.css';

const members = [
  {
    name: 'Dhruval Vashi',
    role: 'Photographer',
    position: 'Vice President',
    image: '/assets/images/members/IMG_20241227_204306.jpg',
    instagram: '/assets/icons/instagram-svgrepo-com (1).svg',
    link: null
  },
  {
    name: 'Jonathan Paul',
    role: 'Photographer',
    position: 'Head of Photography',
    image: '/assets/images/members/IMG_935211 [1].webp',
    instagram: '/assets/icons/instagram-svgrepo-com (1).svg',
    link: null
  },
  {
    name: 'Ronak Barwar',
    role: 'Photographer',
    position: 'President',
    image: '/assets/images/members/IMG_8107[1] (1).webp',
    instagram: '/assets/icons/icons8-pinterest.svg',
    link: 'https://pin.it/2UVHJTQhA'
  },
  {
    name: 'Aditya Madkaikar',
    role: 'Cinematographer',
    position: 'Head of Videography',
    image: '/assets/images/members/WhatsApp Image 2025-09-12 at 10.52.59_3d59ecb0.jpg',
    instagram: '/assets/icons/instagram-svgrepo-com (1).svg',
    link: null
  },
  {
    name: 'Yashodhan Borkar',
    role: 'Photographer',
    position: 'Advisor',
    image: '/assets/images/members/WhatsApp Image 2025-09-12 at 07.28.01_5d08ba86.jpg',
    instagram: '/assets/icons/instagram-svgrepo-com (1).svg',
    link: null
  },
  {
    name: 'Himesh Solanki',
    role: 'Photographer',
    position: 'Member',
    image: '/assets/images/members/ABC_6513.webp',
    instagram: '/assets/icons/instagram-svgrepo-com (1).svg',
    link: null
  },
  {
    name: 'Piyush Singh',
    role: 'Cinematographer',
    position: 'Member',
    image: '/assets/images/members/ABC_6075.webp',
    instagram: '/assets/icons/instagram-svgrepo-com (1).svg',
    link: null
  },
  {
    name: 'Akil Priyan',
    role: 'Photographer',
    position: 'Member',
    image: '/assets/images/members/WhatsApp Image 2025-09-12 at 13.34.52_4f31c18c.jpg',
    instagram: '/assets/icons/instagram-svgrepo-com (1).svg',
    link: null
  },
  {
    name: 'Pranav Lajeesh',
    role: 'Editor',
    position: 'Member',
    image: '/assets/images/members/ABC_6513.webp',
    instagram: '/assets/icons/instagram-svgrepo-com (1).svg',
    link: null
  }
];

const Frame79Mobile = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}><span>Meet the </span><i className={styles.team}>Team</i></p>
        <p className={styles.subtitle}>Our dedicated team of photographers, cinematographers and editors</p>
      </div>

      <div className={styles.list}>
        {members.map((m) => (
          <article key={m.name} className={styles.card}>
            <div className={styles.imageWrap}>
              <img className={styles.image} src={m.image} alt={m.name} />
            </div>
            <div className={styles.meta}>
              <div className={styles.nameRow}>
                <h3 className={styles.name}>{m.name}</h3>
                {m.link ? (
                  <a href={m.link} target="_blank" rel="noopener noreferrer" className={styles.igLink}>
                    <img className={styles.ig} src={m.instagram} alt="social" />
                  </a>
                ) : (
                  <img className={styles.ig} src={m.instagram} alt="social" />
                )}
              </div>
              <div className={styles.role}>{m.role}</div>
              <div className={styles.position}>{m.position}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Frame79Mobile;


