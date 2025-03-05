import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormatSearch from './FormatSearch'
import '../styles/LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()

  const formats = ['svg', 'png', 'jpg', 'ico', 'webp', 'bmp', 'tiff', 'gif', 'pdf']
  
  const [filteredConversions, setFilteredConversions] = useState(
    formats.flatMap(from => 
      formats.filter(to => from !== to).map(to => ({
        from,
        to,
        title: `${from.toUpperCase()} to ${to.toUpperCase()}`
      }))
    )
  )

  const handleFilterChange = ({ fromFormat, toFormat, searchTerm }) => {
    const filtered = formats.flatMap(from => 
      formats.filter(to => from !== to).map(to => ({
        from,
        to,
        title: `${from.toUpperCase()} to ${to.toUpperCase()}`
      }))
    ).filter(option => {
      const matchFromFormat = !fromFormat || option.from === fromFormat
      const matchToFormat = !toFormat || option.to === toFormat
      const matchSearchTerm = !searchTerm || 
        option.title.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchFromFormat && matchToFormat && matchSearchTerm
    })

    setFilteredConversions(filtered)
  }

  const handleTileClick = (from, to) => {
    navigate(`/convert/${from}/${to}`)
  }

  return (
    <div className="landing-container">
      <FormatSearch 
        formats={formats} 
        onFilterChange={handleFilterChange} 
      />
      
      <a target='_blank' href='https://github.com/aminshahid573/pixelmorph'>
        <div className="gradient-div">
          <p>If PixelMorph saved you time, show some love with a star! ⭐</p>
        </div>
      </a>
      
      <div className="conversion-tiles">
        {filteredConversions.map((option, index) => (
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