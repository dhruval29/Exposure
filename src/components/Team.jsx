import React from 'react';
import './Team.css';

const Team = () => {
  return (
    <div className="team-container">
      <div className="team-grid">
        <div className="grid-line grid-line-1"></div>
        <div className="grid-line grid-line-2"></div>
        <div className="grid-line grid-line-3"></div>
        <div className="grid-line grid-line-4"></div>
      </div>
      
      <img 
        className="team-image team-image-1" 
        src="/pictures/4ca5bc212bb689a1f9a15d95833b43b8ebb3b9ab.png" 
        alt="Team member 1"
      />
      
      <img 
        className="team-image team-image-2" 
        src="/pictures/66b90841dac09204196c2799eb092dfc82cb4d49.png" 
        alt="Team member 2"
      />
      
      <img 
        className="team-image team-image-3" 
        src="/pictures/e6598e5c25c54119d943da26c46ea508e5daf7cf.png" 
        alt="Team member 3"
      />
      
      <img 
        className="team-image team-image-4" 
        src="/pictures/e7643725a3b70e0bc912211e0911b18522585aa2.png" 
        alt="Team member 4"
      />
      
      <div className="team-text team-text-1">the</div>
      <div className="team-text team-text-2">team</div>
      
      {/* Interactive elements placeholder */}
      <div className="interactive-element interactive-1">
        <div className="element-content">
          <h3>Interactive Element 1</h3>
          <p>Click to explore</p>
        </div>
      </div>
      
      <div className="interactive-element interactive-2">
        <div className="element-content">
          <h3>Interactive Element 2</h3>
          <p>Click to explore</p>
        </div>
      </div>
      
      <div className="interactive-element interactive-3">
        <div className="element-content">
          <h3>Interactive Element 3</h3>
          <p>Click to explore</p>
        </div>
      </div>
      
      <div className="interactive-element interactive-4">
        <div className="element-content">
          <h3>Interactive Element 4</h3>
          <p>Click to explore</p>
        </div>
      </div>
    </div>
  );
};

export default Team;
