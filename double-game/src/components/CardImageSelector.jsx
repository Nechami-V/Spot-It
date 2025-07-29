import React, { useState } from 'react';
import generateDobbleCards from '../units/RunGameAlgorithm';
import ExportToPDFButton from './onExportPDF_new';
import ExportToZIPButton from './onExportZIP';
function CardImageSelector() {
  const [imageCount, setImageCount] = useState(0);
  const [images, setImages] = useState([]);
  const [cards, setCards] = useState([]);

  const handleCountChange = (e) => {
    let count = parseInt(e.target.value);
    if (count === 6) count = 31;
    else if (count === 7) count = 43;
    else count = 57;

    setImageCount(count);
    setImages(Array(count).fill(null)); // מאפס את מערך התמונות
    setCards([]); // מאפס את הכרטיסים במקרה של שינוי כמות
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const updatedImages = [...images];
    updatedImages[index] = imageUrl;
    setImages(updatedImages);
  };

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const updatedImages = [...images];
    files.forEach((file, index) => {
      if (index < updatedImages.length) {
        const imageUrl = URL.createObjectURL(file);
        updatedImages[index] = imageUrl;
      }
    });
    setImages(updatedImages);
  };

  const runGameAlgorithm = () => {
    const selectedImages = images.filter(img => img !== null);

    if (selectedImages.length !== imageCount) {
      alert(`נדרש להעלות בדיוק ${imageCount} תמונות`);
      return;
    }

    try {
      const result = generateDobbleCards(selectedImages);
      setCards(result); // המערך כבר מכיל מערכי תמונות
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <label htmlFor="count-select">בחר כמה תמונות יכיל הכרטיס:</label>
      <select
        id="count-select"
        onChange={handleCountChange}
        defaultValue=""
        style={{ margin: '0.5rem' }}
      >
        <option value="" disabled>בחר...</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
        <option value={8}>8</option>
      </select>

      {imageCount > 0 && (
        <div style={{ margin: '1rem 0', textAlign: 'center' }}>
          <label htmlFor="multiple-upload" className="upload-button">
            העלאת כל התמונות בבת אחת
          </label>
          <input 
            id="multiple-upload"
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleMultipleFilesChange}
            style={{ display: 'none' }}
          />
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}
      >
        {images.map((image, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <div
              style={{
                border: '2px dashed #888',
                borderRadius: '50%',
                width: '90px',
                height: '90px',
                margin: '0 auto 0.5rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                backgroundColor: '#f8f8f8'
              }}
            >
              {image ? (
                <img src={image} alt={`img-${index}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>ללא תמונה</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index)} />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={runGameAlgorithm} className="generate-button">
          ליצירת כרטיסים
        </button>
      </div>

      {cards.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>כרטיסים שהתקבלו:</h2>
          {cards.map((cardImages, index) => (
            <div
              key={index}
              className="card-container"
            >
              <h3 className="card-title">כרטיס {index + 1}</h3>
              <div className="image-grid">
                {cardImages.map((imgSrc, i) => (
                  <img
                    key={i}
                    src={imgSrc}
                    alt={`card-${index}-img-${i}`}
                    className="card-image"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <ExportToPDFButton cards={cards} />
        <ExportToZIPButton cards={cards} />
      </div>
    </div>
  );
}

export default CardImageSelector;
