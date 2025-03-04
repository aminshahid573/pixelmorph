import { useNavigate } from 'react-router-dom'
import '../styles/LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()

  const conversionOptions = [
    { from: 'svg', to: 'png', title: 'SVG to PNG' },
    { from: 'svg', to: 'jpg', title: 'SVG to JPG' },
    { from: 'svg', to: 'ico', title: 'SVG to ICO' },
    { from: 'png', to: 'jpg', title: 'PNG to JPG' },
    { from: 'png', to: 'svg', title: 'PNG to SVG' },
    { from: 'png', to: 'ico', title: 'PNG to ICO' },
    { from: 'jpg', to: 'png', title: 'JPG to PNG' },
    { from: 'jpg', to: 'svg', title: 'JPG to SVG' },
    { from: 'jpg', to: 'ico', title: 'JPG to ICO' }
  ]

  const handleTileClick = (from, to) => {
    navigate(`/convert/${from}/${to}`)
  }

  return (
    <div className="landing-container">
      <div className="gradient-div">
      <p >If PixelMorph saved you time, show some love with a star! ⭐</p>
      </div>
      <div className="conversion-tiles">
        {conversionOptions.map((option, index) => (
          <div 
            key={index} 
            className="conversion-tile"
            onClick={() => handleTileClick(option.from, option.to)}
          >
            <div className="tile-content">
              <div className="format-icons">
                <div className="format-icon">{option.from.toUpperCase()}</div>
                <div className="arrow">→</div>
                <div className="format-icon">{option.to.toUpperCase()}</div>
              </div>
              <h3>{option.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LandingPage