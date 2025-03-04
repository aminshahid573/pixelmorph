import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { saveAs } from 'file-saver'
import '../styles/ImageConverter.css'

const ImageConverter = () => {
  const { from, to } = useParams()
  const navigate = useNavigate()
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [outputFormat, setOutputFormat] = useState(to || 'png')
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(300)
  const [fileName, setFileName] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState(null)
  const [convertedImage, setConvertedImage] = useState(null)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const canvasRef = useRef(null)
  const svgRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    // Set the output format based on the URL parameter
    if (to) {
      setOutputFormat(to)
    }
  }, [to])

  // Update height when width changes if maintaining aspect ratio
  useEffect(() => {
    if (maintainAspectRatio && aspectRatio) {
      setHeight(Math.round(width / aspectRatio))
    }
  }, [width, maintainAspectRatio, aspectRatio])

  // Update width when height changes if maintaining aspect ratio
  useEffect(() => {
    if (maintainAspectRatio && aspectRatio) {
      setWidth(Math.round(height * aspectRatio))
    }
  }, [height, maintainAspectRatio, aspectRatio])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check if the file type matches the expected input format
    const fileExt = file.name.split('.').pop().toLowerCase()
    if (fileExt !== from) {
      setError(`Please select a ${from.toUpperCase()} file for this conversion`)
      return
    }

    setError(null)
    setSelectedFile(file)
    setConvertedImage(null)
    
    // Extract filename without extension
    const nameWithoutExt = file.name.split('.').slice(0, -1).join('.')
    setFileName(nameWithoutExt)

    // Create preview and get dimensions
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target.result)
      
      // Get image dimensions
      const img = new Image()
      img.onload = () => {
        setWidth(img.width)
        setHeight(img.height)
        setAspectRatio(img.width / img.height)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const convertSvgToPng = (svgUrl, width, height) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = () => reject(new Error('Failed to load SVG'))
      img.src = svgUrl
    })
  }

  const convertToSvg = async (imageUrl, width, height) => {
    // This is a simplified conversion that embeds the bitmap image in an SVG
    // For a real converter, you would need more sophisticated image tracing
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <image href="${imageUrl}" width="${width}" height="${height}" />
      </svg>
    `
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent)
  }

  const convertToIco = async (imageUrl, width, height) => {
    // For ICO conversion, we'll create multiple sizes
    const sizes = [16, 32, 48]
    const canvases = []
    
    for (const size of sizes) {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      
      const img = new Image()
      await new Promise((resolve) => {
        img.onload = resolve
        img.src = imageUrl
      })
      
      ctx.drawImage(img, 0, 0, size, size)
      canvases.push(canvas)
    }
    
    // For simplicity, we'll just return the PNG data of the 32x32 version
    // In a real ICO converter, you would need to create the actual ICO format
    return canvases[1].toDataURL('image/png')
  }

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setIsConverting(true)
    setError(null)
    setConvertedImage(null)

    try {
      const fileType = selectedFile.type
      const fileExt = selectedFile.name.split('.').pop().toLowerCase()
      
      // Create a URL for the selected file
      const fileUrl = URL.createObjectURL(selectedFile)
      let resultDataUrl

      // SVG to other formats
      if (fileType === 'image/svg+xml' || fileExt === 'svg') {
        if (outputFormat === 'ico') {
          // SVG to ICO (via PNG)
          const pngDataUrl = await convertSvgToPng(fileUrl, width, height)
          resultDataUrl = await convertToIco(pngDataUrl, width, height)
        } else if (outputFormat === 'svg') {
          // SVG to SVG (just pass through)
          resultDataUrl = fileUrl
        } else {
          // SVG to PNG/JPEG
          const img = new Image()
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = fileUrl
          })

          const canvas = canvasRef.current
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          
          resultDataUrl = canvas.toDataURL(
            outputFormat === 'jpg' || outputFormat === 'jpeg' 
              ? 'image/jpeg' 
              : 'image/png'
          )
        }
      } 
      // PNG/JPEG/JPG to other formats
      else if (['image/png', 'image/jpeg', 'image/jpg'].includes(fileType) || 
                ['png', 'jpeg', 'jpg'].includes(fileExt)) {
        const img = new Image()
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = fileUrl
        })

        const canvas = canvasRef.current
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        if (outputFormat === 'ico') {
          resultDataUrl = await convertToIco(canvas.toDataURL('image/png'), width, height)
        } else if (outputFormat === 'svg') {
          resultDataUrl = await convertToSvg(canvas.toDataURL('image/png'), width, height)
        } else {
          resultDataUrl = canvas.toDataURL(
            outputFormat === 'jpg' || outputFormat === 'jpeg' 
              ? 'image/jpeg' 
              : 'image/png'
          )
        }
      } else {
        throw new Error('Unsupported file type')
      }

      // Store the converted image data
      setConvertedImage({
        dataUrl: resultDataUrl,
        fileName: `${fileName}.${outputFormat}`
      })
      
      // Clean up
      URL.revokeObjectURL(fileUrl)
    } catch (err) {
      console.error('Conversion error:', err)
      setError(`Error during conversion: ${err.message}`)
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = async () => {
    if (!convertedImage) return
    
    try {
      // Convert data URL to Blob
      const response = await fetch(convertedImage.dataUrl)
      const blob = await response.blob()
      
      // Save the file
      saveAs(blob, convertedImage.fileName)
    } catch (err) {
      console.error('Download error:', err)
      setError(`Error during download: ${err.message}`)
    }
  }

  const handleWidthSliderChange = (e) => {
    setWidth(Number(e.target.value))
  }

  const handleHeightSliderChange = (e) => {
    setHeight(Number(e.target.value))
  }

  return (
    <div className="converter-container">
      <div className="converter-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Conversions
        </button>
        <h2 className="conversion-title">
          {from.toUpperCase()} to {to.toUpperCase()} Converter
        </h2>
        
      </div>

      <div className="input-section">
        <div className="file-input-container">
          <label htmlFor="file-upload" className="file-input-label">
            Choose {from.toUpperCase()} File
          </label>
          <input
            id="file-upload"
            type="file"
            accept={`.${from}`}
            onChange={handleFileChange}
            className="file-input"
          />
          {selectedFile && (
            <div className="file-info">
              <p>Selected: {selectedFile.name}</p>
            </div>
          )}
        </div>

        <div className="conversion-options">
          <div className="option-group">
            <label htmlFor="width">Width (px): {width}</label>
            <input
              id="width"
              type="range"
              min="10"
              max="2000"
              value={width}
              onChange={handleWidthSliderChange}
              className="slider-input"
            />
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min="1"
              max="5000"
              className="number-input"
            />
          </div>

          <div className="option-group">
            <label htmlFor="height">Height (px): {height}</label>
            <input
              id="height"
              type="range"
              min="10"
              max="2000"
              value={height}
              onChange={handleHeightSliderChange}
              className="slider-input"
            />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min="1"
              max="5000"
              className="number-input"
            />
          </div>

          <div className="option-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              />
              Maintain aspect ratio
            </label>
          </div>

          <div className="option-group">
            <label htmlFor="filename">Output Filename:</label>
            <input
              id="filename"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="text-input"
              placeholder="Enter filename (without extension)"
            />
          </div>

          {!convertedImage ? (
            <button
              onClick={handleConvert}
              disabled={isConverting || !selectedFile}
              className="convert-button"
            >
              {isConverting ? 'Converting...' : `Convert to ${outputFormat.toUpperCase()}`}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="download-button"
            >
              Download {outputFormat.toUpperCase()} File
            </button>
          )}
        </div>
      </div>

      <div className="preview-section">
        <h3>{convertedImage ? 'Converted Image' : 'Preview'}</h3>
        <div className="preview-container">
          {convertedImage ? (
            <img
              src={convertedImage.dataUrl}
              alt="Converted"
              className="image-preview"
            />
          ) : preview ? (
            <img
              ref={imgRef}
              src={preview}
              alt="Preview"
              className="image-preview"
            />
          ) : (
            <div className="no-preview">No file selected</div>
          )}
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Hidden SVG for SVG processing */}
      <div ref={svgRef} style={{ display: 'none' }} />
    </div>
  )
}

export default ImageConverter