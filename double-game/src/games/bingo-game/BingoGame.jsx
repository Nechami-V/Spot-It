import React, { useState } from 'react';
import GenericExportPDF from '../../components/GenericExportPDF';
import GenericExportZIP from '../../components/GenericExportZIP';

function BingoGame() {
  const [gridSize, setGridSize] = useState(5); // 5x5 bingo card
  const [images, setImages] = useState([]);
  const [bingoCards, setBingoCards] = useState([]);
  const [numberOfCards, setNumberOfCards] = useState(4);
  const [gameTitle, setGameTitle] = useState('Family Bingo');

  const getRequiredImagesCount = () => {
    const totalSquares = gridSize * gridSize;
    const centerFree = gridSize % 2 === 1; // Odd grid sizes have free center
    return centerFree ? totalSquares - 1 + 10 : totalSquares + 10; // Extra images for variety
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

    const newImages = files.slice(0, getRequiredImagesCount()).map(file => 
      URL.createObjectURL(file)
    );
    setImages(newImages);
  };

  const generateBingoCards = () => {
    if (images.length < getRequiredImagesCount()) {
      alert(`You need at least ${getRequiredImagesCount()} images for variety in ${numberOfCards} bingo cards`);
      return;
    }

    const cards = [];
    const totalSquares = gridSize * gridSize;
    const centerIndex = Math.floor(totalSquares / 2);
    const hasFreeCenter = gridSize % 2 === 1;

    for (let cardNum = 0; cardNum < numberOfCards; cardNum++) {
      const cardImages = [];
      const shuffledImages = [...images].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < totalSquares; i++) {
        if (hasFreeCenter && i === centerIndex) {
          cardImages.push({ type: 'free', image: null, text: 'FREE' });
        } else {
          const imageIndex = hasFreeCenter && i > centerIndex ? i - 1 : i;
          cardImages.push({ 
            type: 'image', 
            image: shuffledImages[imageIndex % shuffledImages.length],
            text: null 
          });
        }
      }
      
      cards.push({
        id: cardNum + 1,
        title: `${gameTitle} - Card ${cardNum + 1}`,
        squares: cardImages
      });
    }

    setBingoCards(cards);
  };

  const resetGame = () => {
    setImages([]);
    setBingoCards([]);
  };

  return (
    <div className="bingo-game" style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="game-header">
        <h1>🎯 Personal Bingo Generator</h1>
        <p>Create custom bingo cards with your own images and memories</p>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="game-title">Game Title:</label>
          <input 
            id="game-title"
            type="text"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            style={{ 
              margin: '0.5rem', 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
            placeholder="Enter bingo game title"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="grid-size">Card Size:</label>
          <select
            id="grid-size"
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            style={{ margin: '0.5rem', padding: '0.5rem' }}
          >
            <option value={3}>3x3 (Simple)</option>
            <option value={5}>5x5 (Classic)</option>
            <option value={4}>4x4 (Medium)</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="card-count">Number of Cards:</label>
          <select
            id="card-count"
            value={numberOfCards}
            onChange={(e) => setNumberOfCards(parseInt(e.target.value))}
            style={{ margin: '0.5rem', padding: '0.5rem' }}
          >
            <option value={2}>2 Cards</option>
            <option value={4}>4 Cards</option>
            <option value={6}>6 Cards</option>
            <option value={8}>8 Cards</option>
            <option value={12}>12 Cards</option>
          </select>
        </div>

        <p>You need {getRequiredImagesCount()} images (extra images for variety between cards)</p>
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '0.5rem',
        margin: '2rem 0',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {Array(getRequiredImagesCount()).fill(null).map((_, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <div style={{
              border: '2px dashed #888',
              borderRadius: '8px',
              width: '70px',
              height: '70px',
              margin: '0 auto 0.25rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: '#f8f8f8'
            }}>
              {images[index] ? (
                <img src={images[index]} alt={`bingo-${index}`} 
                     style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '0.6rem', color: '#aaa' }}>{index + 1}</span>
              )}
            </div>
            <input type="file" accept="image/*" 
                   onChange={(e) => handleFileChange(e, index)} 
                   style={{ fontSize: '0.7rem', width: '70px' }} />
          </div>
        ))}
      </div>

      <div style={{ margin: '2rem 0' }}>
        <button 
          onClick={generateBingoCards}
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginRight: '1rem'
          }}
        >
          Generate Bingo Cards
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

      {bingoCards.length > 0 && (
        <div style={{ margin: '2rem 0' }}>
          <h2>🎯 Generated Bingo Cards</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            margin: '1rem 0'
          }}>
            {bingoCards.map((card) => (
              <div key={card.id} style={{
                border: '2px solid #333',
                borderRadius: '10px',
                padding: '1rem',
                backgroundColor: '#fff'
              }}>
                <h4>{card.title}</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gap: '2px',
                  border: '2px solid #000',
                  backgroundColor: '#000'
                }}>
                  {card.squares.map((square, index) => (
                    <div key={index} style={{
                      aspectRatio: '1',
                      backgroundColor: square.type === 'free' ? '#ffeb3b' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: square.type === 'free' ? 'bold' : 'normal'
                    }}>
                      {square.type === 'free' ? (
                        <span>FREE</span>
                      ) : (
                        <img src={square.image} alt={`bingo-square-${index}`}
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ margin: '2rem 0' }}>
            <GenericExportPDF 
              gameData={{ 
                cards: bingoCards, 
                gridSize, 
                gameTitle,
                numberOfCards 
              }} 
              gameType="bingo-game" 
              fileName={`${gameTitle.replace(/\s+/g, '-')}-bingo-cards.pdf`} 
            />
            <GenericExportZIP 
              gameData={{ 
                cards: bingoCards, 
                gridSize, 
                gameTitle,
                numberOfCards 
              }} 
              gameType="bingo-game" 
              fileName={`${gameTitle.replace(/\s+/g, '-')}-bingo-cards.zip`} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BingoGame;
