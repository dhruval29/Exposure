import './App.css'
import './styles/responsive.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './components/Landing'
import TextCursorOverlay from './components/TextCursorOverlay'
import Frame50 from './components/Frame50'
import TestPage from './components/TestPage'
import MembersPage from './components/MembersPage'
import Featured from './components/Featured'
import TeamPage from './components/TeamPage'
import OurJourney from './components/OurJourney'
import Admin from './components/Admin'
import Fly from './components/Fly'
import Events from './components/Events'

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
        <Route path="/gallery" element={<Featured />} />
        <Route path="/pictures" element={<Featured />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/fly" element={<Fly />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </div>
  );
}

export default App
