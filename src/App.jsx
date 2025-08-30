import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import VideoScroll from './components/VideoScroll' // REMOVED
import MouseEffectPage from './components/MouseEffectPage'
import Team from './components/Team'
// import Navigation from './components/Navigation'
import Landing from './components/Landing'
import TextCursorOverlay from './components/TextCursorOverlay'
import Frame50 from './components/Frame50'
import LanyardPage from './components/LanyardPage'
import TestPage from './components/TestPage'
import MembersPage from './components/MembersPage'
import GalleryPage from './components/GalleryPage'

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <TextCursorOverlay />
        <Frame50 />
        {/* Navigation removed for static wireframe view */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/effects" element={<MouseEffectPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/lanyard" element={<LanyardPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/members" element={<MembersPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
