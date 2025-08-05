import React from 'react';
import './GameSelector.css';

const GameSelector = ({ onGameSelect }) => {
  const games = [
    {
      id: 'spot-it',
      title: 'Spot It Game',
      description: 'Create custom Spot It cards with your own images',
      icon: '🎯',
      status: 'available'
    },
    {
      id: 'memory-game',
      title: 'Memory Game Generator',
      description: 'Create memory games with personal pictures',
      icon: '🧠',
      status: 'available'
    },
    {
      id: 'snakes-ladders',
      title: 'Snakes and Ladders',
      description: 'Custom Snakes and Ladders with your images',
      icon: '🐍',
      status: 'available'
    },
    {
      id: 'bingo-game',
      title: 'Personal Bingo',
      description: 'Create custom bingo cards with your memories',
      icon: '🎯',
      status: 'available'
    },
    {
      id: 'quartets-game',
      title: 'Quartets Game',
      description: 'Create themed quartet cards with personal images',
      icon: '🃏',
      status: 'available'
    }
  ];

  return (
    <div className="game-selector-container">
      <header className="game-selector-header">
        <h1>🎮 Game Platform</h1>
        <p>Choose your game and create personalized experiences</p>
      </header>
      
      <div className="games-grid">
        {games.map((game) => (
          <div 
            key={game.id} 
            className={`game-card ${game.status}`}
            onClick={() => game.status === 'available' && onGameSelect(game.id)}
          >
            <div className="game-icon">{game.icon}</div>
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            <div className="game-status">
              {game.status === 'available' ? (
                <button className="play-button">Play Now</button>
              ) : (
                <span className="coming-soon">Coming Soon</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <footer className="platform-footer">
        <p>More games coming soon! 🚀</p>
      </footer>
    </div>
  );
};

export default GameSelector;
