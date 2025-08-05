import React, { useState } from 'react';
import GenericExportPDF from '../../components/GenericExportPDF';
import GenericExportZIP from '../../components/GenericExportZIP';

function MemoryGame() {
  const [images, setImages] = useState([]);
  const [gridSize, setGridSize] = useState(4); // 4x4 = 16 cards (8 pairs)
  const [gameCards, setGameCards] = useState([]);

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

    const newImages = files.slice(0, getRequiredImagesCount()).map(file => 
      URL.createObjectURL(file)
    );
    setImages(newImages);
  };

  const getRequiredImagesCount = () => {
    return (gridSize * gridSize) / 2; // Number of unique images needed for pairs
  };

  const generateMemoryCards = () => {
    if (images.length !== getRequiredImagesCount()) {
      alert(`You need exactly ${getRequiredImagesCount()} images for a ${gridSize}x${gridSize} memory game`);
      return;
    }

    // Create pairs of cards
    const cardPairs = [];
    images.forEach((img, index) => {
      cardPairs.push({ id: `${index}_a`, image: img, pairId: index });
      cardPairs.push({ id: `${index}_b`, image: img, pairId: index });
    });

    // Shuffle the cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    setGameCards(shuffledCards);
  };

  const resetGame = () => {
    setImages([]);
    setGameCards([]);
  };

  return (
    <div className="memory-game" style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="game-header">
        <h1>🧠 Memory Game Generator</h1>
        <p>Create personalized memory games with your own images</p>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <label htmlFor="grid-size">Grid Size:</label>
        <select
          id="grid-size"
          value={gridSize}
          onChange={(e) => setGridSize(parseInt(e.target.value))}
          style={{ margin: '0.5rem', padding: '0.5rem' }}
        >
          <option value={4}>4x4 (8 pairs)</option>
          <option value={6}>6x6 (18 pairs)</option>
          <option value={8}>8x8 (32 pairs)</option>
        </select>
        <p>You need {getRequiredImagesCount()} unique images</p>
      </div>

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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '1rem',
        margin: '2rem 0',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {Array(getRequiredImagesCount()).fill(null).map((_, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <div style={{
              border: '2px dashed #888',
              borderRadius: '8px',
              width: '90px',
              height: '90px',
              margin: '0 auto 0.5rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: '#f8f8f8'
            }}>
              {images[index] ? (
                <img src={images[index]} alt={`memory-${index}`} 
                     style={{ maxWidth: '100%', maxHeight: '100%' }} />
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Image {index + 1}</span>
              )}
            </div>
            <input type="file" accept="image/*" 
                   onChange={(e) => handleFileChange(e, index)} 
                   style={{ fontSize: '0.8rem' }} />
          </div>
        ))}
      </div>

      <div style={{ margin: '2rem 0' }}>
        <button 
          onClick={generateMemoryCards}
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginRight: '1rem'
          }}
        >
          Generate Memory Cards
        </button>
        <button 
          onClick={resetGame}
          style={{
            background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Reset
        </button>
      </div>

      {gameCards.length > 0 && (
        <div style={{ margin: '2rem 0' }}>
          <h2>🎮 Memory Game Cards Preview</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '0.5rem',
            maxWidth: '400px',
            margin: '0 auto',
            padding: '1rem',
            border: '2px solid #ddd',
            borderRadius: '10px'
          }}>
            {gameCards.map((card, index) => (
              <div key={card.id} style={{
                width: '40px',
                height: '40px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#f8f9fa'
              }}>
                <img src={card.image} alt={`card-${index}`} 
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          <div style={{ margin: '2rem 0' }}>
            <GenericExportPDF 
              gameData={{ images, gridSize, cards: gameCards }} 
              gameType="memory-game" 
              fileName="memory-game-cards.pdf" 
            />
            <GenericExportZIP 
              gameData={{ images, gridSize, cards: gameCards }} 
              gameType="memory-game" 
              fileName="memory-game-cards.zip" 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
