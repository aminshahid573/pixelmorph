import React from 'react';
import { Star, Zap, Hammer, Globe } from 'lucide-react';
import '../styles/MotivationSection.css';  // Import the CSS file

const MotivationSection = () => {
  return (
    <div className="motivation-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose PixelMorph?</h2>
          <p className="section-subtitle">
            Transform your image conversion workflow with a tool designed for simplicity, speed, and reliability.
          </p>
        </div>
        
        <div className="features-grid">
          {[
            {
              icon: <Zap className="text-blue-500" style={{width: '3rem', height: '3rem'}} />,
              title: "Lightning Fast",
              description: "Instant conversions with minimal processing time"
            },
            {
              icon: <Hammer className="text-green-500" style={{width: '3rem', height: '3rem'}} />,
              title: "Multiple Formats",
              description: "Support for all major image formats"
            },
            {
              icon: <Globe className="text-purple-500" style={{width: '3rem', height: '3rem'}} />,
              title: "Web-First Design",
              description: "Responsive, user-friendly interface"
            },
            {
              icon: <Star className="text-yellow-500" style={{width: '3rem', height: '3rem'}} />,
              title: "Open Source",
              description: "Community-driven development"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="github-link-wrapper">
          <a 
            href="https://github.com/yourusername/pixelmorph" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <Star className="github-link-icon" />
            Star on GitHub 
          </a>
        </div>
      </div>
    </div>
  );
};

export default MotivationSection;