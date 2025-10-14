import React, { Suspense, lazy } from 'react'
import './App.css'
import './styles/responsive.css'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import RouteTransitionLoader from './components/RouteTransitionLoader'
import MobileChromeHider from './components/MobileChromeHider'
import { Analytics } from "@vercel/analytics/react"
import { useMediaQuery } from './hooks/useMediaQuery'
// Import tutorial test helper for development
import './utils/tutorialTestHelper'
// Optimized lazy loading with error boundaries and loading states
const Landing = lazy(() => import('./components/Landing'))
const TextCursorOverlay = lazy(() => import('./components/TextCursorOverlay'))
const Frame50 = lazy(() => import('./components/Frame50'))

// Gallery components with higher priority
const Featured = lazy(() => import('./components/Featured'))
const FeaturedMobile = lazy(() => import('./components/FeaturedMobile'))

// Team components
const TheTeamPage = lazy(() => import('./components/TheTeamPage'))
const TheTeamMobile = lazy(() => import('./components/the-team-mobile'))

// Other pages with lower priority
const AboutUs = lazy(() => import('./components/AboutUs'))
const AboutUsMobile = lazy(() => import('./components/AboutUsMobile'))
const Admin = lazy(() => import('./components/Admin'))
const Fly = lazy(() => import('./components/Fly'))
const Events = lazy(() => import('./components/Events'))
const ContactUs = lazy(() => import('./components/ContactUs'))
const ContactUsMobile = lazy(() => import('./components/ContactUsMobile'))

function ContactRoute() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? <ContactUsMobile /> : <ContactUs />;
}

function FeaturedRoute() {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  return isMobile ? <FeaturedMobile /> : <Featured />;
}

function TheTeamRoute() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? <TheTeamMobile /> : <TheTeamPage />;
}

function AboutUsRoute() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? <AboutUsMobile /> : <AboutUs />;
}

function App() {
  return (
    <Router>
      <Suspense fallback={null}>
        <InnerApp />
      </Suspense>
      <Analytics />
    </Router>
  );
}

function InnerApp() {
  const location = useLocation();
  const showFrame50 = location.pathname === '/';

  return (
    <div className="app-wrapper">
      {location.pathname === '/pictures' && <MobileChromeHider />}
      <RouteTransitionLoader />
      <TextCursorOverlay />
      {showFrame50 && <Frame50 />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about-us" element={<AboutUsRoute />} />
        <Route path="/effects" element={<div style={{ width: '100%', height: '100vh', background: '#0b74ff' }} />} />
        <Route path="/gallery" element={<FeaturedRoute />} />
        <Route path="/pictures" element={<FeaturedRoute />} />
        <Route path="/the-team" element={<TheTeamRoute />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/fly" element={<Fly />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<ContactRoute />} />
      </Routes>
    </div>
  );
}

export default App
