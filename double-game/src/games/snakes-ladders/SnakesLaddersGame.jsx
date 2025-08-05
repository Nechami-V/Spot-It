import React, { useState } from 'react';
import GenericExportPDF from '../../components/GenericExportPDF';
import GenericExportZIP from '../../components/GenericExportZIP';

function SnakesLaddersGame() {
  const [boardSize, setBoardSize] = useState(10); // 10x10 = 100 squares
  const [customImages, setCustomImages] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [specialSquares, setSpecialSquares] = useState({
    snakes: [
      { start: 98, end: 78 },
      { start: 95, end: 75 },
      { start: 93, end: 73 },
      { start: 87, end: 24 },
      { start: 64, end: 60 },
      { start: 62, end: 19 },
      { start: 56, end: 53 },
      { start: 49, end: 11 },
      { start: 48, end: 26 },
      { start: 16, end: 6 }
    ],
    ladders: [
      { start: 1, end: 38 },
      { start: 4, end: 14 },
      { start: 9, end: 21 },
      { start: 21, end: 42 },
      { start: 28, end: 84 },
      { start: 36, end: 44 },
      { start: 51, end: 67 },
      { start: 71, end: 91 },
      { start: 80, end: 100 }
    ]
  });

  const handleCustomImageChange = (e, squareNumber) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setCustomImages(prev => ({
      ...prev,
      [squareNumber]: imageUrl
    }));
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setBackgroundImage(imageUrl);
  };

  const addSnake = () => {
    const start = parseInt(prompt("Snake head position (1-100):"));
    const end = parseInt(prompt("Snake tail position (1-100):"));
    
    if (start > end && start <= 100 && end >= 1) {
      setSpecialSquares(prev => ({
        ...prev,
        snakes: [...prev.snakes, { start, end }]
      }));
    } else {
      alert("Invalid snake! Head must be higher than tail.");
    }
  };

  const addLadder = () => {
    const start = parseInt(prompt("Ladder bottom position (1-100):"));
    const end = parseInt(prompt("Ladder top position (1-100):"));
    
    if (end > start && start >= 1 && end <= 100) {
      setSpecialSquares(prev => ({
        ...prev,
        ladders: [...prev.ladders, { start, end }]
      }));
    } else {
      alert("Invalid ladder! Top must be higher than bottom.");
    }
  };

  const generateBoard = () => {
    const gameData = {
      boardSize,
      customImages,
      backgroundImage,
      specialSquares,
      totalSquares: boardSize * boardSize
    };

    return gameData;
  };

  const renderBoard = () => {
    const squares = [];
    const totalSquares = boardSize * boardSize;
    
    for (let i = totalSquares; i >= 1; i--) {
      const row = Math.floor((totalSquares - i) / boardSize);
      const isReversedRow = row % 2 === 1;
      let squareNumber;
      
      if (isReversedRow) {
        squareNumber = totalSquares - row * boardSize - (i - row * boardSize - 1);
      } else {
        squareNumber = i;
      }

      const hasSnake = specialSquares.snakes.find(s => s.start === squareNumber);
      const hasLadder = specialSquares.ladders.find(l => l.start === squareNumber);
      const customImage = customImages[squareNumber];

      squares.push(
        <div
          key={squareNumber}
          style={{
            border: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            position: 'relative',
            backgroundColor: hasSnake ? '#ffebee' : hasLadder ? '#e8f5e8' : '#fff',
            backgroundImage: customImage ? `url(${customImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <span style={{ 
            backgroundColor: 'rgba(255,255,255,0.8)', 
            padding: '2px 4px', 
            borderRadius: '3px',
            fontSize: '0.7rem'
          }}>
            {squareNumber}
          </span>
          {hasSnake && <span style={{ color: 'red', fontSize: '1.2rem' }}>🐍</span>}
          {hasLadder && <span style={{ color: 'green', fontSize: '1.2rem' }}>🪜</span>}
        </div>
      );
    }

    return squares;
  };

  return (
    <div className="snakes-ladders-game" style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="game-header">
        <h1>🐍 Snakes and Ladders Generator</h1>
        <p>Create custom Snakes and Ladders boards with your images</p>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <label htmlFor="board-size">Board Size:</label>
        <select
          id="board-size"
          value={boardSize}
          onChange={(e) => setBoardSize(parseInt(e.target.value))}
          style={{ margin: '0.5rem', padding: '0.5rem' }}
        >
          <option value={10}>10x10 (100 squares)</option>
          <option value={8}>8x8 (64 squares)</option>
          <option value={12}>12x12 (144 squares)</option>
        </select>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <h3>Board Customization</h3>
        <div>
          <label htmlFor="background-upload">Board Background:</label>
          <input 
            id="background-upload"
            type="file" 
            accept="image/*" 
            onChange={handleBackgroundChange}
            style={{ margin: '0.5rem' }}
          />
        </div>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <button onClick={addSnake} style={{
          background: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          margin: '0.5rem',
          cursor: 'pointer'
        }}>
          Add Snake 🐍
        </button>
        <button onClick={addLadder} style={{
          background: '#28a745',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          margin: '0.5rem',
          cursor: 'pointer'
        }}>
          Add Ladder 🪜
        </button>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <h3>Custom Square Images</h3>
        <p>Add custom images to specific squares (optional)</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          margin: '1rem 0'
        }}>
          {[1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(square => (
            <div key={square}>
              <label>Square {square}:</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleCustomImageChange(e, square)}
                style={{ display: 'block', margin: '0.5rem 0' }}
              />
              {customImages[square] && (
                <img 
                  src={customImages[square]} 
                  alt={`Square ${square}`}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <h3>🎲 Board Preview</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gap: '1px',
          maxWidth: '500px',
          margin: '0 auto',
          border: '3px solid #333',
          backgroundColor: backgroundImage ? `url(${backgroundImage})` : '#f8f9fa',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {renderBoard()}
        </div>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <GenericExportPDF 
          gameData={generateBoard()} 
          gameType="snakes-ladders" 
          fileName="snakes-ladders-board.pdf" 
        />
        <GenericExportZIP 
          gameData={generateBoard()} 
          gameType="snakes-ladders" 
          fileName="snakes-ladders-board.zip" 
        />
      </div>
    </div>
  );
}

export default SnakesLaddersGame;
