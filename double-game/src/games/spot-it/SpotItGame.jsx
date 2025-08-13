import React, { useState } from 'react';
import generateDobbleCards from '../../utills/RunGameAlgorithm';
import GenericExportPDF from '../../components/GenericExportPDF';
import GenericExportZIP from '../../components/GenericExportZIP';

function SpotItGame() {
  const [imageCount, setImageCount] = useState(0);
  const [images, setImages] = useState([]);
  const [cards, setCards] = useState([]);

  const handleCountChange = (e) => {
    let count = parseInt(e.target.value);
    if (count === 6) count = 31;
    else if (count === 7) count = 43;
    else count = 57;

    setImageCount(count);
    setImages(Array(count).fill(null)); // Reset images array
    setCards([]); // Reset cards when count changes
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

  // Function to shuffle array elements randomly
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const runGameAlgorithm = () => {
    const selectedImages = images.filter(img => img !== null);

    if (selectedImages.length !== imageCount) {
      alert(`Exactly ${imageCount} images are required`);
      return;
    }

    try {
      const result = generateDobbleCards(selectedImages);
      // Shuffle the images within each card for random positioning
      const shuffledCards = result.map(card => shuffleArray(card));
      setCards(shuffledCards);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="spot-it-game" style={{ padding: '1rem' }}>
      <div className="game-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>🎯 Spot It Game Generator</h1>
        <p>Create your custom Spot It cards with personal images</p>
      </div>

      <label htmlFor="count-select">Select number of images per card:</label>
      <select
        id="count-select"
        onChange={handleCountChange}
        defaultValue=""
        style={{ margin: '0.5rem' }}
      >
        <option value="" disabled>Choose...</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
        <option value={8}>8</option>
      </select>

      {imageCount > 0 && (
        <div style={{ margin: '1rem 0', textAlign: 'center' }}>
          <label htmlFor="multiple-upload" className="upload-button">
            Upload all images at once
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
                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>No image</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index)} />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={runGameAlgorithm} className="generate-button">
          Generate Cards
        </button>
      </div>

      {cards.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Generated Cards: {cards.length} cards, {cards[0]?.length} images per card</h2>
          {cards.map((cardImages, index) => (
            <div
              key={index}
              className="card-container"
            >
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
        <GenericExportPDF 
          gameData={cards} 
          gameType="spot-it" 
          fileName="spot-it-cards.pdf" 
        />
        <GenericExportZIP 
          gameData={cards} 
          gameType="spot-it" 
          fileName="spot-it-cards.zip" 
        />
      </div>
    </div>
  );
}

export default SpotItGame;
