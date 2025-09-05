import './App.css'
import './styles/responsive.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import TextCursorOverlay from './components/TextCursorOverlay'
import Frame50 from './components/Frame50'
import ScrollTracker from './components/ScrollTracker'
import TestPage from './components/TestPage'
import MembersPage from './components/MembersPage'
import Gallery from './components/Gallery'
import TeamPage from './components/TeamPage'

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <TextCursorOverlay />
        <ScrollTracker defaultVisible={true} />
        <Frame50 />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/effects" element={<div style={{ width: '100%', height: '100vh', background: '#0b74ff' }} />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
