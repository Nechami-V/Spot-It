import React, { useState } from 'react';
import './App.css';
import GameSelector from './components/GameSelector';
import SpotItGame from './games/spot-it/SpotItGame';
import MemoryGame from './games/memory-game/MemoryGame';
import SnakesLaddersGame from './games/snakes-ladders/SnakesLaddersGame';
import BingoGame from './games/bingo-game/BingoGame';
import QuartetsGame from './games/quartets-game/QuartetsGame';

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const handleGameSelect = (gameId) => {
    setCurrentGame(gameId);
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'spot-it':
        return <SpotItGame />;
      case 'memory-game':
        return <MemoryGame />;
      case 'snakes-ladders':
        return <SnakesLaddersGame />;
      case 'bingo-game':
        return <BingoGame />;
      case 'quartets-game':
        return <QuartetsGame />;
      default:
        return <GameSelector onGameSelect={handleGameSelect} />;
    }
  };

  return (
    <div className="App">
      {currentGame && (
        <div className="back-button-container" style={{ 
          padding: '1rem', 
          background: '#f8f9fa',
          borderBottom: '1px solid #dee2e6'
        }}>
          <button 
            onClick={handleBackToMenu}
            style={{
              background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Back to Games Menu
          </button>
        </div>
      )}
      {renderCurrentGame()}
    </div>
  );
}

export default App;

