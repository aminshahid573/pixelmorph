import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
    <BrowserRouter>
    <div className='bg-main'>
      <App />
      </div>
    </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)