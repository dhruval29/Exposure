import React, { Suspense, lazy } from 'react'
import './App.css'
import './styles/responsive.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
const Landing = lazy(() => import('./components/Landing'))
const TextCursorOverlay = lazy(() => import('./components/TextCursorOverlay'))
const Frame50 = lazy(() => import('./components/Frame50'))
const MembersPage = lazy(() => import('./components/MembersPage'))
const Featured = lazy(() => import('./components/Featured'))
const FeaturedMobile = lazy(() => import('./components/FeaturedMobile'))
const TeamPage = lazy(() => import('./components/TeamPage'))
const OurJourney = lazy(() => import('./components/OurJourney'))
const Admin = lazy(() => import('./components/Admin'))
const Fly = lazy(() => import('./components/Fly'))
const Events = lazy(() => import('./components/Events'))
const ContactUs = lazy(() => import('./components/ContactUs'))
const ContactUsMobile = lazy(() => import('./components/ContactUsMobile'))

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
      <Suspense fallback={null}>
        <InnerApp />
      </Suspense>
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
