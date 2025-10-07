import React from 'react';
import './TeamPage.css';
import SimpleNav from './SimpleNav';
import FRAME1 from './FRAME1';
import FRAME2 from './FRAME2';
import Frame3 from './Frame3';
import Frame4 from './Frame4';

const TeamPage = () => {
  return (
    <>
      <SimpleNav />
      <div className="team-page">
        <div className="frame frame-1">
          <FRAME1 />
        </div>
        <div className="frame frame-2">
          <FRAME2 />
        </div>
        <div className="frame frame-3">
          <Frame3 />
        </div>
        <div className="frame frame-4">
          <Frame4 />
        </div>
      </div>
    </>
  );
};

export default TeamPage;
