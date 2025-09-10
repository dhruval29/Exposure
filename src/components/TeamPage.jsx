import React, { useEffect, useState, useRef } from 'react';
import Frame53 from './Frame53';
import './TeamPage.css';
import '../styles/Gallery.css';

const TeamPage = () => {
  const [loading, setLoading] = useState(true);
  const loadingPageRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const timer = setTimeout(() => isMounted && setLoading(false), 1200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="team-page">
      {loading && (
        <div className="c-loading-page" ref={loadingPageRef}>
          <div className="c-loading-page__content">
            <p className="c-loading-page__text">
              {'Team'.split('').map((char, index) => (
                <span key={index} className="char" style={{ animationDelay: `${index * 100}ms` }}>
                  {char}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      <Frame53 />
    </div>
  );
};

export default TeamPage;
