import React from 'react';
import ImageStack from './ImageStack';
import './virtual-scroll.css';

const Home = () => {
  return (
    <>
      <div className="virtual-scroll-container" />
      <div className="scroll-container">
        <div className="app">
          <ImageStack />
        </div>
      </div>
    </>
  );
};

export default Home;
