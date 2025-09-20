import React from 'react'
import './App.css'
import './styles/responsive.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './components/Landing'
import TextCursorOverlay from './components/TextCursorOverlay'
import Frame50 from './components/Frame50'
import TestPage from './components/TestPage'
import MembersPage from './components/MembersPage'
import Featured from './components/Featured'
import FeaturedMobile from './components/FeaturedMobile'
import TeamPage from './components/TeamPage'
import OurJourney from './components/OurJourney'
import Admin from './components/Admin'
import Fly from './components/Fly'
import Events from './components/Events'
import ContactUs from './components/ContactUs'
import ContactUsMobile from './components/ContactUsMobile'

function ContactRoute() {
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia('(max-width: 768px)').matches);

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      mq.addListener(handler);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, []);

  return isMobile ? <ContactUsMobile /> : <ContactUs />;
}

function FeaturedRoute() {
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia('(max-width: 1024px)').matches);

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handler = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      mq.addListener(handler);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, []);

  return isMobile ? <FeaturedMobile /> : <Featured />;
}

function App() {
  return (
    <Router>
      <InnerApp />
    </Router>
  );
}

function InnerApp() {
  const location = useLocation();
  const showFrame50 = location.pathname === '/';

  return (
    <div className="app-wrapper">
      <TextCursorOverlay />
      {showFrame50 && <Frame50 />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/our-journey" element={<OurJourney />} />
        <Route path="/effects" element={<div style={{ width: '100%', height: '100vh', background: '#0b74ff' }} />} />
        <Route path="/gallery" element={<FeaturedRoute />} />
        <Route path="/pictures" element={<FeaturedRoute />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/fly" element={<Fly />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<ContactRoute />} />
      </Routes>
    </div>
  );
}

export default App
