import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Frame57.module.css';

const OurJourney = () => {
  const navigate = useNavigate();
  const [buttonText, setButtonText] = React.useState('Take me Home');

  const handleGoHome = () => {
    navigate('/');
  };

  const handleMouseEnter = () => {
    setButtonText('Country Roads');
  };

  const handleMouseLeave = () => {
    setButtonText('Take me Home');
  };

  return (
    <div className={styles.p1kv8o1121Parent}>
      <div className={styles.p1kv8o1121}>
        <img 
          className={styles.mainIllustration} 
          alt="Page Under Construction Illustration" 
          src="/assets/1584487_220880-P1KV8O-112-1.svg" 
        />
        <button 
          className={styles.takeMeHomeButton}
          onClick={handleGoHome}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className={styles.buttonText}>{buttonText}</span>
        </button>
      </div>
    </div>
  );
};

export default OurJourney;