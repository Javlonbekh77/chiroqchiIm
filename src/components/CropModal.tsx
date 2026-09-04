import React, { useState, useRef, useEffect } from 'react';
import './CropModal.css';

interface CropModalProps {
  imageUrl: string;
  imageName?: string;
  onCrop: (croppedFile: File) => void;
  onCancel: () => void;
}

const CropModal: React.FC<CropModalProps> = ({ imageUrl, imageName = 'image.jpg', onCrop, onCancel }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imgRef = useRef<HTMLImageElement>(null);
  const CONTAINER_SIZE = 300;
  const OUTPUT_SIZE = 400;

  useEffect(() => {
    setImgSrc(imageUrl);
  }, [imageUrl]);

  const handleImageLoad = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    // Calculate initial scale to cover the container
    const initialScale = Math.max(
      CONTAINER_SIZE / img.naturalWidth,
      CONTAINER_SIZE / img.naturalHeight
    );
    setMinScale(initialScale);
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Calculate new position
    let newX = clientX - dragStart.x;
    let newY = clientY - dragStart.y;
    
    // Optional: constraint panning so image always covers the circle
    if (imgRef.current) {
      const img = imgRef.current;
      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;
      
      const maxX = (scaledWidth - CONTAINER_SIZE) / 2;
      const maxY = (scaledHeight - CONTAINER_SIZE) / 2;
      
      newX = Math.min(Math.max(newX, -maxX), maxX);
      newY = Math.min(Math.max(newY, -maxY), maxY);
    }
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragStart, scale]);

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    
    // Re-constrain position on scale change
    if (imgRef.current) {
      const img = imgRef.current;
      const scaledWidth = img.naturalWidth * newScale;
      const scaledHeight = img.naturalHeight * newScale;
      
      const maxX = (scaledWidth - CONTAINER_SIZE) / 2;
      const maxY = (scaledHeight - CONTAINER_SIZE) / 2;
      
      setPosition(prev => ({
        x: Math.min(Math.max(prev.x, -maxX), maxX),
        y: Math.min(Math.max(prev.y, -maxY), maxY)
      }));
    }
  };

  const handleCrop = async () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    
    const scaleRatio = OUTPUT_SIZE / CONTAINER_SIZE;
    
    ctx.scale(scaleRatio, scaleRatio);
    ctx.translate(CONTAINER_SIZE / 2, CONTAINER_SIZE / 2);
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    ctx.translate(-img.naturalWidth / 2, -img.naturalHeight / 2);
    
    ctx.drawImage(img, 0, 0);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], imageName, { type: 'image/jpeg' });
      onCrop(croppedFile);
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="crop-modal-overlay">
      <div className="crop-modal-content">
        <h3>Rasmni moslash (Aylana qirqish)</h3>
        
        <div 
          className="crop-container"
          style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <img 
            ref={imgRef}
            src={imgSrc} 
            crossOrigin="anonymous"
            alt="Crop preview" 
            onLoad={handleImageLoad}
            style={{
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
              transformOrigin: 'center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              pointerEvents: 'none',
              maxWidth: 'none'
            }}
          />
          <div className="crop-overlay"></div>
        </div>
        
        <div className="crop-controls">
          <label>Yaqinlashtirish</label>
          <input 
            type="range" 
            min={minScale} 
            max={minScale * 3} 
            step={0.01} 
            value={scale} 
            onChange={handleScaleChange} 
          />
        </div>
        
        <div className="crop-actions">
          <button className="crop-btn-cancel" onClick={onCancel}>Bekor qilish</button>
          <button className="crop-btn-save" onClick={handleCrop}>Saqlash va qirqish</button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
