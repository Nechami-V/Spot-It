import React, { useState } from 'react';
import GenericExportPDF from '../../components/GenericExportPDF';
import GenericExportZIP from '../../components/GenericExportZIP';

function QuartetsGame() {
  const [quartets, setQuartets] = useState([]);
  const [currentQuartet, setCurrentQuartet] = useState({
    title: '',
    cards: [
      { id: 1, image: null, label: '', imageFile: null },
      { id: 2, image: null, label: '', imageFile: null },
      { id: 3, image: null, label: '', imageFile: null },
      { id: 4, image: null, label: '', imageFile: null }
    ]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  // Color schemes for different quartets
  const colorSchemes = [
    { bg: '#e3f2fd', header: '#1976d2', accent: '#2196f3', name: 'כחול' },
    { bg: '#fff3e0', header: '#f57c00', accent: '#ff9800', name: 'כתום' },
    { bg: '#e8f5e8', header: '#388e3c', accent: '#4caf50', name: 'ירוק' },
    { bg: '#fce4ec', header: '#c2185b', accent: '#e91e63', name: 'ורוד' },
    { bg: '#f3e5f5', header: '#7b1fa2', accent: '#9c27b0', name: 'סגול' },
    { bg: '#e0f2f1', header: '#00695c', accent: '#009688', name: 'טורקיז' },
    { bg: '#fff8e1', header: '#f9a825', accent: '#ffc107', name: 'צהוב' },
    { bg: '#efebe9', header: '#5d4037', accent: '#795548', name: 'חום' },
    { bg: '#e8eaf6', header: '#3f51b5', accent: '#5c6bc0', name: 'כחול כהה' },
    { bg: '#e1f5fe', header: '#0288d1', accent: '#03a9f4', name: 'תכלת' }
  ];

  const handleTitleChange = (title) => {
    setCurrentQuartet(prev => ({
      ...prev,
      title: title
    }));
  };

  const handleCardImageChange = (cardIndex, file) => {
    if (!file) return;
    
    const imageUrl = URL.createObjectURL(file);
    setCurrentQuartet(prev => ({
      ...prev,
      cards: prev.cards.map((card, index) => 
        index === cardIndex 
          ? { ...card, image: imageUrl, imageFile: file }
          : card
      )
    }));
  };

  const handleCardLabelChange = (cardIndex, label) => {
    setCurrentQuartet(prev => ({
      ...prev,
      cards: prev.cards.map((card, index) => 
        index === cardIndex 
          ? { ...card, label: label }
          : card
      )
    }));
  };

  const saveQuartet = () => {
    if (!currentQuartet.title.trim()) {
      alert('Please enter a quartet title');
      return;
    }

    const incompleteCards = currentQuartet.cards.filter(card => !card.image || !card.label.trim());
    if (incompleteCards.length > 0) {
      alert('Please complete all 4 cards (image and label for each)');
      return;
    }

    if (isEditing) {
      const updatedQuartets = [...quartets];
      updatedQuartets[editingIndex] = { ...currentQuartet, id: Date.now() };
      setQuartets(updatedQuartets);
      setIsEditing(false);
      setEditingIndex(-1);
    } else {
      setQuartets(prev => [...prev, { ...currentQuartet, id: Date.now() }]);
    }

    // Reset current quartet
    setCurrentQuartet({
      title: '',
      cards: [
        { id: 1, image: null, label: '', imageFile: null },
        { id: 2, image: null, label: '', imageFile: null },
        { id: 3, image: null, label: '', imageFile: null },
        { id: 4, image: null, label: '', imageFile: null }
      ]
    });
  };

  const editQuartet = (index) => {
    setCurrentQuartet(quartets[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const deleteQuartet = (index) => {
    if (window.confirm('Are you sure you want to delete this quartet?')) {
      setQuartets(prev => prev.filter((_, i) => i !== index));
    }
  };

  const cancelEdit = () => {
    setCurrentQuartet({
      title: '',
      cards: [
        { id: 1, image: null, label: '', imageFile: null },
        { id: 2, image: null, label: '', imageFile: null },
        { id: 3, image: null, label: '', imageFile: null },
        { id: 4, image: null, label: '', imageFile: null }
      ]
    });
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const renderCard = (card, cardIndex, isPreview = false) => {
    const cardStyle = {
      width: isPreview ? '180px' : '220px',
      height: isPreview ? '250px' : '300px',
      border: '3px solid #333',
      borderRadius: '15px',
      backgroundColor: '#e3f2fd',
      display: 'flex',
      flexDirection: 'column',
      margin: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    };

    const headerStyle = {
      backgroundColor: '#1976d2',
      color: 'white',
      padding: isPreview ? '8px' : '12px',
      textAlign: 'center',
      fontSize: isPreview ? '0.9rem' : '1.1rem',
      fontWeight: 'bold'
    };

    const imageContainerStyle = {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      backgroundColor: '#fff'
    };

    const imageStyle = {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'cover',
      borderRadius: '8px'
    };

    const buttonContainerStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '3px'
    };

    const buttonStyle = (isActive) => ({
      padding: isPreview ? '6px' : '8px',
      backgroundColor: isActive ? '#4caf50' : '#f5f5f5',
      color: isActive ? 'white' : '#333',
      border: '1px solid #ddd',
      fontSize: isPreview ? '0.7rem' : '0.8rem',
      fontWeight: isActive ? 'bold' : 'normal',
      cursor: isPreview ? 'default' : 'pointer'
    });

    return (
      <div style={cardStyle}>
        {/* Header with quartet title */}
        <div style={headerStyle}>
          {currentQuartet.title || 'Quartet Title'}
        </div>

        {/* Main image */}
        <div style={imageContainerStyle}>
          {card.image ? (
            <img src={card.image} alt={`Card ${cardIndex + 1}`} style={imageStyle} />
          ) : (
            <div style={{
              width: '100%',
              height: '120px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              color: '#666',
              borderRadius: '8px',
              border: '2px dashed #ccc'
            }}>
              {isPreview ? 'No Image' : 'Click to add image'}
            </div>
          )}
        </div>

        {/* Four option buttons */}
        <div style={buttonContainerStyle}>
          {currentQuartet.cards.map((buttonCard, buttonIndex) => (
            <button
              key={buttonIndex}
              style={buttonStyle(buttonIndex === cardIndex)}
              disabled={isPreview}
            >
              {buttonCard.label || `Option ${buttonIndex + 1}`}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCardForQuartet = (card, cardIndex, quartet, quartetIndex) => {
    // Get color scheme for this quartet
    const colorScheme = colorSchemes[quartetIndex % colorSchemes.length];
    
    const cardStyle = {
      width: '180px',
      height: '250px',
      border: '3px solid #333',
      borderRadius: '15px',
      backgroundColor: colorScheme.bg,
      display: 'flex',
      flexDirection: 'column',
      margin: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    };

    const headerStyle = {
      backgroundColor: colorScheme.header,
      color: 'white',
      padding: '8px',
      textAlign: 'center',
      fontSize: '0.9rem',
      fontWeight: 'bold'
    };

    const imageContainerStyle = {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      backgroundColor: '#fff',
      border: `2px solid ${colorScheme.accent}`,
      borderRadius: '8px',
      margin: '5px'
    };

    const imageStyle = {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'cover',
      borderRadius: '8px'
    };

    const buttonContainerStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '3px'
    };

    const buttonStyle = (isActive) => ({
      padding: '6px',
      backgroundColor: isActive ? colorScheme.accent : '#f5f5f5',
      color: isActive ? 'white' : '#333',
      border: `1px solid ${isActive ? colorScheme.header : '#ddd'}`,
      fontSize: '0.7rem',
      fontWeight: isActive ? 'bold' : 'normal',
      cursor: 'default'
    });

    return (
      <div style={cardStyle}>
        {/* Header with quartet title */}
        <div style={headerStyle}>
          {quartet.title || 'Quartet Title'}
        </div>

        {/* Main image */}
        <div style={imageContainerStyle}>
          {card.image ? (
            <img src={card.image} alt={`Card ${cardIndex + 1}`} style={imageStyle} />
          ) : (
            <div style={{
              width: '100%',
              height: '120px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              color: '#666',
              borderRadius: '8px',
              border: '2px dashed #ccc'
            }}>
              No Image
            </div>
          )}
        </div>

        {/* Four option buttons */}
        <div style={buttonContainerStyle}>
          {quartet.cards.map((buttonCard, buttonIndex) => (
            <button
              key={buttonIndex}
              style={buttonStyle(buttonIndex === cardIndex)}
              disabled={true}
            >
              {buttonCard.label || `Option ${buttonIndex + 1}`}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="quartets-game" style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="game-header">
        <h1>🃏 Quartets Game Generator</h1>
        <p>Create custom quartet cards with your own themes and images</p>
      </div>

      {/* Quartet Creation Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '15px',
        margin: '2rem 0'
      }}>
        <h2>{isEditing ? 'Edit Quartet' : 'Create New Quartet'}</h2>
        
        {/* Quartet Title Input */}
        <div style={{ margin: '1rem 0' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            Quartet Theme/Title:
          </label>
          <input
            type="text"
            value={currentQuartet.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g., Family Members, Animals, Professions..."
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: 'none',
              width: '300px',
              textAlign: 'center'
            }}
          />
        </div>

        {/* Cards Creation Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          margin: '2rem 0'
        }}>
          {currentQuartet.cards.map((card, cardIndex) => (
            <div key={cardIndex} style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '1rem',
              borderRadius: '10px'
            }}>
              <h4>Card {cardIndex + 1}</h4>
              
              {/* Image Upload */}
              <div style={{ margin: '1rem 0' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCardImageChange(cardIndex, e.target.files[0])}
                  style={{ marginBottom: '0.5rem' }}
                />
                {card.image && (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto',
                    border: '2px solid white',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <img src={card.image} alt={`Preview ${cardIndex + 1}`} 
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Label Input */}
              <input
                type="text"
                value={card.label}
                onChange={(e) => handleCardLabelChange(cardIndex, e.target.value)}
                placeholder={`Label for card ${cardIndex + 1}`}
                style={{
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: 'none',
                  width: '100%',
                  textAlign: 'center'
                }}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ margin: '2rem 0' }}>
          <button
            onClick={saveQuartet}
            style={{
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginRight: '1rem'
            }}
          >
            {isEditing ? 'Update Quartet' : 'Save Quartet'}
          </button>
          
          {isEditing && (
            <button
              onClick={cancelEdit}
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
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {currentQuartet.title && (
        <div style={{ margin: '2rem 0' }}>
          <h3>Card Preview</h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {currentQuartet.cards.map((card, cardIndex) => 
              renderCard(card, cardIndex, true)
            )}
          </div>
        </div>
      )}

      {/* Saved Quartets */}
      {quartets.length > 0 && (
        <div style={{ margin: '3rem 0' }}>
          <h2>🎯 Saved Quartets ({quartets.length})</h2>
          
          {quartets.map((quartet, quartetIndex) => (
            <div key={quartet.id} style={{
              border: '2px solid #ddd',
              borderRadius: '15px',
              padding: '1.5rem',
              margin: '1rem 0',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 style={{ color: colorSchemes[quartetIndex % colorSchemes.length].header }}>
                  {quartet.title} <span style={{ fontSize: '0.8rem', color: '#666' }}>
                    ({colorSchemes[quartetIndex % colorSchemes.length].name})
                  </span>
                </h3>
                <div>
                  <button
                    onClick={() => editQuartet(quartetIndex)}
                    style={{
                      background: '#ffc107',
                      color: 'black',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '0.5rem'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteQuartet(quartetIndex)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                {quartet.cards.map((card, cardIndex) => (
                  <div key={cardIndex}>
                    {renderCardForQuartet(card, cardIndex, quartet, quartetIndex)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ margin: '2rem 0' }}>
            <GenericExportPDF 
              gameData={{ quartets }} 
              gameType="quartets-game" 
              fileName="quartets-cards.pdf" 
            />
            <GenericExportZIP 
              gameData={{ quartets }} 
              gameType="quartets-game" 
              fileName="quartets-cards.zip" 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default QuartetsGame;
