import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage'
import ImageConverter from './components/ImageConverter'
import MotivationSection from './components/MotivationSection'
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <>
     <Helmet>
        <title>PixelMorph - Image Format Converter</title>
        <meta name="description" content="Convert images instantly with PixelMorph. Support for JPEG, PNG, WebP, and more formats." />
        <meta name="keywords" content="image converter, file format, image processing, web tool" />
        <meta property="og:title" content="PixelMorph - Easy Image Conversion" />
        <meta property="og:description" content="Transform your images with a few clicks" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://pixelmorph.netlify.app" />
      </Helmet>
  
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
    </>
  )
}

export default App