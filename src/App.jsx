import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage'
import ImageConverter from './components/ImageConverter'
import MotivationSection from './components/MotivationSection'

function App() {
  return (
    <div className="app-container">
      <h1>PixelMorph</h1>
      <p className="description">
        Convert between SVG, PNG, JPEG/JPG, and ICO formats
      </p>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/convert/:from/:to" element={<ImageConverter />} />
      </Routes>
      <MotivationSection/>
    </div>
  )
}

export default App