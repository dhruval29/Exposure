import styles from './Frame53.module.css';

const Frame53 = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Ronak Barwar",
      position: "President",
      image: "/assets/images/image 10.png"
    },
    {
      id: 2,
      name: "Dhruval Vashi",
      position: "Vice President",
      image: "/assets/images/image 10.png"
    },
    {
      id: 3,
      name: "Jonathan Paul",
      position: "Head of Photography",
      image: "/assets/images/image 10.png"
    },
    {
      id: 4,
      name: "Aditya Madkaikar",
      position: "Head of Videography",
      image: "/assets/images/image 10.png"
    },
    {
      id: 5,
      name: "Pranav Lajeesh",
      position: "Head of V.F.X",
      image: "/assets/images/image 10.png"
    },
    {
      id: 6,
      name: "Yashodhan Borkar",
      position: "Senior-Young Member",
      image: "/assets/images/image 10.png"
    },
    {
      id: 7,
      name: "Akil",
      position: "Member",
      image: "/assets/images/image 10.png"
    },
    {
      id: 8,
      name: "Himesh Solanki",
      position: "Member",
      image: "/assets/images/image 10.png"
    }
  ];

  // Duplicate the array to create seamless infinite scroll
  const duplicatedMembers = [...teamMembers, ...teamMembers];

  return (
    <div className={styles.meetOurTeamParent}>
      <div className={styles.headerSection}>
        <b className={styles.meetOurTeamContainer}>
          <p className={styles.meetOur}>{`Meet our `}</p>
          <p className={styles.meetOur}>Team</p>
        </b>
        <div className={styles.ourDedicatedTeamContainer}>
          <p className={styles.meetOur}>Our dedicated team of photographers,</p>
          <p className={styles.meetOur}>cinematographers and editors</p>
        </div>
      </div>
      
      <div className={styles.scrollContainer}>
        <div className={styles.teamMembersWrapper}>
          {duplicatedMembers.map((member, index) => {
            // Calculate horizontal position with consistent spacing
            const basePositions = [0, 309.76, 620, 929.76, 1240, 1549.76, 1860, 2169.76];
            const positionIndex = index % 8;
            const gapBetweenSets = 258.74; // Same gap as between individual members
            const loopOffset = Math.floor(index / 8) * (2428.5 + gapBetweenSets);
            const leftPosition = basePositions[positionIndex] + loopOffset;
            
            // Original vertical positioning for images - some are at top: 0px, others at top: 22px
            const imageTopPositions = [0, 22, 0, 22, 0, 22, 0, 22]; // Based on original code
            const imageTop = imageTopPositions[positionIndex];
            
            // Text positioning based on image position
            // For images at top: 0px, text is at top: 358.16px and 382.8px
            // For images at top: 22px, text is at top: 380.16px and 404.8px
            const textTopPositions = [358.16, 380.16, 358.16, 380.16, 358.16, 380.16, 358.16, 380.16];
            const positionTextTopPositions = [382.8, 404.8, 382.8, 404.8, 382.8, 404.8, 382.8, 404.8];
            
            const nameTop = textTopPositions[positionIndex];
            const positionTop = positionTextTopPositions[positionIndex];
            
            return (
              <div key={`${member.id}-${index}`} className={styles.memberCard} style={{ left: `${leftPosition}px` }}>
                <img 
                  className={styles.memberImage} 
                  alt={member.name} 
                  src={member.image}
                  style={{ top: `${imageTop}px` }}
                />
                <b className={styles.memberName} style={{ top: `${nameTop}px` }}>{member.name}</b>
                <div className={styles.memberPosition} style={{ top: `${positionTop}px` }}>{member.position}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Frame53;
