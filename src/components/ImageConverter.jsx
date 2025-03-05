import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import { useDropzone } from 'react-dropzone'
import { HexColorPicker } from 'react-colorful'
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
  const [quality, setQuality] = useState(90)
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [rotation, setRotation] = useState(0)
  const canvasRef = useRef(null)
  const svgRef = useRef(null)
  const imgRef = useRef(null)

  const onDrop = (acceptedFiles) => {
    handleFileChange({ target: { files: acceptedFiles } })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [`.${from}`],
    },
    multiple: false,
  })

  useEffect(() => {
    if (to) {
      setOutputFormat(to)
    }
  }, [to])

  useEffect(() => {
    if (maintainAspectRatio && aspectRatio) {
      setHeight(Math.round(width / aspectRatio))
    }
  }, [width, maintainAspectRatio, aspectRatio])

  useEffect(() => {
    if (maintainAspectRatio && aspectRatio) {
      setWidth(Math.round(height * aspectRatio))
    }
  }, [height, maintainAspectRatio, aspectRatio])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const fileExt = file.name.split('.').pop().toLowerCase()
    if (fileExt !== from) {
      setError(`Please select a ${from.toUpperCase()} file for this conversion`)
      return
    }

    setError(null)
    setSelectedFile(file)
    setConvertedImage(null)
    
    const nameWithoutExt = file.name.split('.').slice(0, -1).join('.')
    setFileName(nameWithoutExt)

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target.result)
      
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

  const convertToPdf = async (imageUrl) => {
    const img = new Image()
    await new Promise((resolve) => {
      img.onload = resolve
      img.src = imageUrl
    })

    const pdf = new jsPDF({
      orientation: img.width > img.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height]
    })

    pdf.addImage(imageUrl, 'PNG', 0, 0, width, height)
    return pdf.output('datauristring')
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
      const fileUrl = URL.createObjectURL(selectedFile)
      let resultDataUrl

      const canvas = canvasRef.current
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      // Apply background color
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)

      // Load and draw image
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = fileUrl
      })

      // Apply rotation
      ctx.save()
      ctx.translate(canvas.width/2, canvas.height/2)
      ctx.rotate(rotation * Math.PI / 180)
      ctx.drawImage(img, -width/2, -height/2, width, height)
      ctx.restore()

      if (outputFormat === 'pdf') {
        resultDataUrl = await convertToPdf(canvas.toDataURL('image/png', quality/100))
      } else {
        resultDataUrl = canvas.toDataURL(
          outputFormat === 'jpg' || outputFormat === 'jpeg'
            ? 'image/jpeg'
            : `image/${outputFormat}`,
          quality/100
        )
      }

      setConvertedImage({
        dataUrl: resultDataUrl,
        fileName: `${fileName}.${outputFormat}`
      })
      
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
      const response = await fetch(convertedImage.dataUrl)
      const blob = await response.blob()
      saveAs(blob, convertedImage.fileName)
    } catch (err) {
      console.error('Download error:', err)
      setError(`Error during download: ${err.message}`)
    }
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
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag & drop a {from.toUpperCase()} file here, or click to select</p>
          )}
        </div>

        {selectedFile && (
          <div className="conversion-options">
            <div className="option-group">
              <label>Width (px): {width}</label>
              <input
                type="range"
                min="10"
                max="2000"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
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
              <label>Height (px): {height}</label>
              <input
                type="range"
                min="10"
                max="2000"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
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

            <div className="option-group">
              <label>Quality: {quality}%</label>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="slider-input"
              />
            </div>

            <div className="option-group">
              <label>Rotation: {rotation}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="slider-input"
              />
            </div>

            <div className="option-group">
              <label>Background Color</label>
              <div className="color-picker-container">
                <div
                  className="color-preview"
                  style={{ backgroundColor }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                {showColorPicker && (
                  <div className="color-picker-popover">
                    <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                  </div>
                )}
              </div>
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
              <label>Output Filename:</label>
              <input
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
        )}
      </div>

      <div className="preview-section">
        <h3>{convertedImage ? 'Converted Image' : 'Preview'}</h3>
        <div className="preview-container">
          {convertedImage ? (
            outputFormat === 'pdf' ? (
              <div className="pdf-preview">PDF Preview Available</div>
            ) : (
              <img
                src={convertedImage.dataUrl}
                alt="Converted"
                className="image-preview"
              />
            )
          ) : preview ? (
            <img
              ref={imgRef}
              src={preview}
              alt="Preview"
              className="image-preview"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          ) : (
            <div className="no-preview">No file selected</div>
          )}
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div ref={svgRef} style={{ display: 'none' }} />
    </div>
  )
}

export default ImageConverter