import './App.css'
import './styles/responsive.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useMobileDetection } from './hooks/useMobileDetection'
import Landing from './components/Landing'
import TextCursorOverlay from './components/TextCursorOverlay'
import Frame50 from './components/Frame50'
import TestPage from './components/TestPage'
import MembersPage from './components/MembersPage'
import NewGallery from './components/NewGallery'
import PicturesGallery from './components/PicturesGallery'
import TeamPage from './components/TeamPage'
import OurJourney from './components/OurJourney'
import UnderConstruction from './components/UnderConstruction'

function App() {
  const isMobile = useMobileDetection();

  // Show construction page for mobile devices
  if (isMobile) {
    return <UnderConstruction />;
  }

  return (
    <Router>
      <div className="app-wrapper">
        <TextCursorOverlay />
        <Frame50 />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/our-journey" element={<OurJourney />} />
          <Route path="/effects" element={<div style={{ width: '100%', height: '100vh', background: '#0b74ff' }} />} />
          <Route path="/gallery" element={<NewGallery />} />
          <Route path="/pictures" element={<PicturesGallery />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
