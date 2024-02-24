"use client"

import FileInput from '@/components/fileInput/FileInput';
import { useState, useRef } from 'react';

export default function Home() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [redVal, setRedVal] = useState(0);
  const [blueVal, setBlueVal] = useState(0);
  // Store timeout id
  const [timeoutId, setTimeoutId] = useState(null);

  const applyFilter = (srcImage: HTMLImageElement): void => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // set canvas dimensions
    canvas.width = srcImage.width;
    canvas.height = srcImage.height;

    // Draw the image onto the canvas
    ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height);

    // Get the pixel data from the canvas
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Iterate over all pixels (r, g, b, a)
    for (let i = 0; i < data.length; i += 4) {
      // modify red and blue channel values
      data[i] = Math.min(data[i] + redVal, 255);   // Red
      data[i + 2] = Math.min(data[i + 2] + blueVal, 255);   // Blue
    }

    // Write the tinted back onto the canvas
    ctx.putImageData(imageData, 0, 0);

    // Update the preview image
    imageRef.current.src = canvas.toDataURL('image/jpeg');
  }

  const handleRangeChange = (event, color) => {
    const value = parseInt(event.target.value);
    if (color === 'red') setRedVal(value);
    if (color === 'blue') setBlueVal(value);

    // Clear previous timeouts
    // debounce 500ms
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      loadImage(imgSrc, applyFilter);
    }, 200); // 500 millisecond delay

    setTimeoutId(newTimeoutId);
  }

  const loadImage = (src, callback) => {
    const img = new Image();
    img.onload = () => callback(img);
    img.src = src;
  }

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImgSrc(reader.result)
      loadImage(reader.result, applyFilter);
    };

    reader.readAsDataURL(file);
  };

  const handleImageExport = () => {
    const link = document.createElement('a');
    link.download = `output_warm-${percentRed}%__cool-${percentBlue}%.jpeg`;
    link.href = imageRef.current.src;
    link.click();
  }

  const resetImage = () => {
    setImgSrc(null);
    setRedVal(0);
    setBlueVal(0);
  }

  const percentRed = Math.round((redVal / 255) * 100);
  const percentBlue = Math.round((blueVal / 255) * 100);

  const FilterImage = () => {
    return (
      <section className={'filter'}>
        <div className={'flex flex-col'}>
          <label>Warmer </label>
          <div>
            <input
              className={'inputRange'}
              type='range'
              min='0'
              max='255'
              value={redVal}
              onChange={(event) => handleRangeChange(event, 'red')}
              style={{
                background: `linear-gradient(90deg, red ${percentRed}%, #ccc ${percentRed}%)`
              }}
            />
          </div>
          <small>{percentRed}%</small>
        </div>

        <div className={'flex flex-col mt-5'}>
          <label>Cooler </label>
          <div>
            <input
              className={'inputRange'}
              type='range'
              min='0'
              max='255'
              value={blueVal}
              onChange={(event) => handleRangeChange(event, 'blue')}
              style={{
                background: `linear-gradient(90deg, blue ${percentBlue}%, #ccc ${percentBlue}%)`
              }}
            />
          </div>
          <small>{percentBlue}%</small>
        </div>
        <button className={'button'} onClick={handleImageExport}>Export
        </button>
      </section>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div>
        {
          !imgSrc ? <FileInput accept="image/jpeg" title="Upload your simple image" subTitle="only accept .jpeg"
                               onFileSelect={handleFileSelect}/> :
            <>
              <div className={'iconDelete'} onClick={resetImage}> X</div>
              <canvas ref={canvasRef} style={{display: 'none'}}/>
              <img width="400" ref={imageRef} alt=""/>
            </>
        }
        {imgSrc && <FilterImage/>}
      </div>
    </main>
  )
}
