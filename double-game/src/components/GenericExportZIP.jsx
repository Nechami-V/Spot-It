import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const GenericExportZIP = ({ gameData, gameType, fileName = 'export.zip' }) => {
  const handleExport = async () => {
    try {
      const zip = new JSZip();
      
      switch (gameType) {
        case 'spot-it':
          await exportSpotItToZip(zip, gameData);
          break;
        case 'memory-game':
          await exportMemoryGameToZip(zip, gameData);
          break;
        case 'snakes-ladders':
          await exportSnakesLaddersToZip(zip, gameData);
          break;
        case 'bingo-game':
          await exportBingoToZip(zip, gameData);
          break;
        case 'quartets-game':
          await exportQuartetsToZip(zip, gameData);
          break;
        default:
          alert('Game type not supported for ZIP export');
          return;
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, fileName);
    } catch (error) {
      console.error('ZIP export error:', error);
      alert('Export error');
    }
  };

  // Spot It specific ZIP export
  const exportSpotItToZip = async (zip, gameData) => {
    const cards = gameData.cards || gameData;
    const cardTitle = gameData.cardTitle || '';
    const backgroundImage = gameData.backgroundImage || null;
    
    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
      const card = cards[cardIndex];
      const cardImages = card.images || card;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const cardSize = 1200; // Further increased resolution
      canvas.width = cardSize;
      canvas.height = cardSize;
      
      // Enable high quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Card background
      if (backgroundImage) {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        await new Promise(resolve => {
          bgImg.onload = () => {
            // Calculate proper cropping for center-top positioning
            const imgAspectRatio = bgImg.width / bgImg.height;
            let srcX = 0, srcY = 0, srcWidth = bgImg.width, srcHeight = bgImg.height;
            
            if (imgAspectRatio > 1) {
              // Image is wider than tall - crop sides
              srcWidth = bgImg.height; // Make it square
              srcX = (bgImg.width - srcWidth) / 2; // Center horizontally
              srcY = 0; // Keep top
            } else if (imgAspectRatio < 1) {
              // Image is taller than wide - crop bottom
              srcHeight = bgImg.width; // Make it square
              srcX = 0; // Keep left
              srcY = 0; // Keep top (center-top cropping)
            }
            
            ctx.globalAlpha = 0.3; // Very light background
            ctx.drawImage(
              bgImg, 
              srcX, srcY, srcWidth, srcHeight, // Source rectangle (cropped)
              0, 0, cardSize, cardSize // Destination
            );
            ctx.globalAlpha = 1.0;
            resolve();
          };
          bgImg.onerror = () => resolve();
          bgImg.src = backgroundImage;
        });
        
        // Add white overlay for brightness
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(0, 0, cardSize, cardSize);
      } else {
        // Default gradient background
        const gradient = ctx.createLinearGradient(0, 0, cardSize, cardSize);
        gradient.addColorStop(0, '#f0f8ff');
        gradient.addColorStop(1, '#e6f3ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, cardSize, cardSize);
      }
      
      // Card circle with higher quality
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 18; // Increased for higher resolution
      ctx.beginPath();
      ctx.arc(cardSize/2, cardSize/2, cardSize/2 - 60, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Add card title if provided
      if (cardTitle) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 48px Arial'; // Larger font for higher resolution
        ctx.textAlign = 'center';
        ctx.fillText(cardTitle, cardSize/2, 80);
      }
      
      // Spot It specific image positions - ensuring all images stay within card circle
      const positions = [
        { x: cardSize * 0.5, y: cardSize * 0.5 },    // Center image
        { x: cardSize * 0.5, y: cardSize * 0.25 },   // Top center
        { x: cardSize * 0.70, y: cardSize * 0.35 },  // Top right
        { x: cardSize * 0.75, y: cardSize * 0.55 },  // Right center
        { x: cardSize * 0.65, y: cardSize * 0.75 },  // Bottom right
        { x: cardSize * 0.35, y: cardSize * 0.75 },  // Bottom left
        { x: cardSize * 0.25, y: cardSize * 0.55 },  // Left center
        { x: cardSize * 0.30, y: cardSize * 0.35 }   // Top left
      ];
      
      await drawImagesOnCanvas(ctx, cardImages, positions, 180); // Further increased image size
      
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png', 1.0); // Maximum quality
      });
      
      zip.file(`spot-it-card-${cardIndex + 1}.png`, blob);
    }
  };

  // Memory Game specific ZIP export
  const exportMemoryGameToZip = async (zip, gameData) => {
    const { images, gridSize } = gameData;
    
    // Create memory card pairs
    for (let i = 0; i < images.length; i++) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 200;
      
      // Memory card styling
      ctx.fillStyle = '#3498db';
      ctx.fillRect(0, 0, 200, 200);
      ctx.strokeStyle = '#2980b9';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, 200, 200);
      
      // Draw image
      const img = new Image();
      img.src = images[i];
      await new Promise(resolve => {
        img.onload = () => {
          ctx.drawImage(img, 20, 20, 160, 160);
          resolve();
        };
      });
      
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
      });
      
      // Create two identical cards (pair)
      zip.file(`memory-card-${i + 1}a.png`, blob);
      zip.file(`memory-card-${i + 1}b.png`, blob);
    }
  };

  // Snakes and Ladders specific ZIP export
  const exportSnakesLaddersToZip = async (zip, gameData) => {
    const { boardSize, customImages } = gameData;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 800;
    
    // Draw board background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 800, 800);
    
    // Draw grid and add custom images to squares
    const squareSize = 800 / boardSize;
    // Implementation for board layout...
    
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png');
    });
    
    zip.file(`snakes-ladders-board.png`, blob);
  };

  // Helper function to draw images on canvas
  const drawImagesOnCanvas = async (ctx, images, positions, imageSize) => {
    const imagePromises = images.map((imgUrl, i) => {
      return new Promise((resolve) => {
        if (i >= positions.length) {
          resolve();
          return;
        }
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const pos = positions[i];
          
          // Enable high quality image rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Calculate proper cropping for center-top positioning
          const imgAspectRatio = img.width / img.height;
          let srcX = 0, srcY = 0, srcWidth = img.width, srcHeight = img.height;
          
          if (imgAspectRatio > 1) {
            // Image is wider than tall - crop sides
            srcWidth = img.height; // Make it square
            srcX = (img.width - srcWidth) / 2; // Center horizontally
            srcY = 0; // Keep top
          } else if (imgAspectRatio < 1) {
            // Image is taller than wide - crop bottom
            srcHeight = img.width; // Make it square
            srcX = 0; // Keep left
            srcY = 0; // Keep top (center-top cropping)
          }
          
          // Draw image as circle with proper cropping
          ctx.save();
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, imageSize/2, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(
            img, 
            srcX, srcY, srcWidth, srcHeight, // Source rectangle (cropped)
            pos.x - imageSize/2, pos.y - imageSize/2, imageSize, imageSize // Destination
          );
          ctx.restore();
          
          // Black border matching display with higher quality
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 6; // Increased for higher resolution
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, imageSize/2, 0, 2 * Math.PI);
          ctx.stroke();
          
          resolve();
        };
        img.onerror = () => resolve();
        img.src = imgUrl;
      });
    });
    
    await Promise.all(imagePromises);
  };

  // Bingo Game specific ZIP export
  const exportBingoToZip = async (zip, gameData) => {
    const { cards, gridSize } = gameData;
    
    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
      const card = cards[cardIndex];
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const canvasSize = 600;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      
      // Card background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      // Card title
      ctx.fillStyle = '#333';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(card.title, canvasSize / 2, 40);
      
      // Draw bingo grid
      const gridStartY = 70;
      const gridSizePx = canvasSize - 140;
      const squareSize = gridSizePx / gridSize;
      
      // Wait for all images to load and draw
      const imagePromises = [];
      
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const x = 70 + col * squareSize;
          const y = gridStartY + row * squareSize;
          const squareIndex = row * gridSize + col;
          const square = card.squares[squareIndex];
          
          // Draw square border
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, squareSize, squareSize);
          
          if (square.type === 'free') {
            ctx.fillStyle = '#4caf50';
            ctx.fillRect(x + 2, y + 2, squareSize - 4, squareSize - 4);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('FREE', x + squareSize/2, y + squareSize/2 + 6);
          } else if (square.image) {
            // Add image to square with proper async handling
            const imgPromise = new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => {
                ctx.drawImage(img, x + 2, y + 2, squareSize - 4, squareSize - 4);
                resolve();
              };
              img.onerror = resolve;
              img.src = square.image;
            });
            imagePromises.push(imgPromise);
          }
        }
      }
      
      // Wait for all images to load
      await Promise.all(imagePromises);
      
      // Convert to blob and add to ZIP
      await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          zip.file(`bingo-card-${cardIndex + 1}.png`, blob);
          resolve();
        });
      });
    }
  };

  // Quartets Game specific ZIP export
  const exportQuartetsToZip = async (zip, gameData) => {
    const { quartets } = gameData;
    
    // Color schemes for different quartets
    const colorSchemes = [
      { bg: '#e3f2fd', header: '#1976d2', accent: '#2196f3' },
      { bg: '#fff3e0', header: '#f57c00', accent: '#ff9800' },
      { bg: '#e8f5e8', header: '#388e3c', accent: '#4caf50' },
      { bg: '#fce4ec', header: '#c2185b', accent: '#e91e63' },
      { bg: '#f3e5f5', header: '#7b1fa2', accent: '#9c27b0' },
      { bg: '#e0f2f1', header: '#00695c', accent: '#009688' },
      { bg: '#fff8e1', header: '#f9a825', accent: '#ffc107' },
      { bg: '#efebe9', header: '#5d4037', accent: '#795548' },
      { bg: '#e8eaf6', header: '#3f51b5', accent: '#5c6bc0' },
      { bg: '#e1f5fe', header: '#0288d1', accent: '#03a9f4' }
    ];
    
    for (let quartetIndex = 0; quartetIndex < quartets.length; quartetIndex++) {
      const quartet = quartets[quartetIndex];
      const quartetFolder = zip.folder(`quartet-${quartetIndex + 1}-${quartet.title}`);
      
      // Get color scheme for this quartet (cycle through available colors)
      const colorScheme = colorSchemes[quartetIndex % colorSchemes.length];
      
      for (let cardIndex = 0; cardIndex < quartet.cards.length; cardIndex++) {
        const card = quartet.cards[cardIndex];
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const cardWidth = 400;
        const cardHeight = 550;
        canvas.width = cardWidth;
        canvas.height = cardHeight;
        
        // Card background with quartet-specific color
        ctx.fillStyle = colorScheme.bg;
        ctx.fillRect(0, 0, cardWidth, cardHeight);
        
        // Card border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, cardWidth, cardHeight);
        
        // Header background with quartet-specific color
        ctx.fillStyle = colorScheme.header;
        ctx.fillRect(0, 0, cardWidth, 50);
        
        // Header text (quartet title)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(quartet.title, cardWidth / 2, 32);
        
        // Main image
        if (card.image) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve) => {
            img.onload = () => {
              const imageY = 70;
              const imageHeight = 200;
              const imageWidth = cardWidth - 40;
              ctx.drawImage(img, 20, imageY, imageWidth, imageHeight);
              
              // Add subtle border around image with quartet color
              ctx.strokeStyle = colorScheme.accent;
              ctx.lineWidth = 3;
              ctx.strokeRect(20, imageY, imageWidth, imageHeight);
              
              resolve();
            };
            img.onerror = resolve;
            img.src = card.image;
          });
        } else {
          // No image placeholder
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(20, 70, cardWidth - 40, 200);
          ctx.strokeStyle = '#ccc';
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(20, 70, cardWidth - 40, 200);
          ctx.setLineDash([]);
          
          ctx.fillStyle = '#666';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('No Image', cardWidth / 2, 180);
        }
        
        // Option buttons
        const buttonHeight = 40;
        const buttonY = 290;
        const buttonWidth = cardWidth - 40;
        
        for (let buttonIndex = 0; buttonIndex < quartet.cards.length; buttonIndex++) {
          const isActive = buttonIndex === cardIndex;
          const currentButtonY = buttonY + (buttonIndex * (buttonHeight + 5));
          
          // Add debug info
          if (cardIndex === 3) {
            console.log(`Card ${cardIndex}, Button ${buttonIndex}, IsActive: ${isActive}`);
          }
          
          // Button background with quartet-specific colors
          if (isActive) {
            ctx.fillStyle = colorScheme.accent;
          } else {
            ctx.fillStyle = '#f5f5f5';
          }
          ctx.fillRect(20, currentButtonY, buttonWidth, buttonHeight);
          
          // Button border with quartet color
          ctx.strokeStyle = isActive ? colorScheme.header : '#ddd';
          ctx.lineWidth = isActive ? 2 : 1;
          ctx.strokeRect(20, currentButtonY, buttonWidth, buttonHeight);
          
          // Button text
          ctx.fillStyle = isActive ? '#ffffff' : '#333';
          ctx.font = isActive ? 'bold 14px Arial' : '14px Arial';
          ctx.textAlign = 'center';
          const buttonText = quartet.cards[buttonIndex].label || `Option ${buttonIndex + 1}`;
          ctx.fillText(buttonText, cardWidth / 2, currentButtonY + 25);
        }
        
        // Convert to blob and add to ZIP
        await new Promise((resolve) => {
          canvas.toBlob((blob) => {
            quartetFolder.file(`card-${cardIndex + 1}-${card.label || 'untitled'}.png`, blob);
            resolve();
          });
        });
      }
    }
  };

  return (
    <button 
      onClick={handleExport}
      style={{
        background: 'linear-gradient(135deg, #2ed573 0%, #1e90ff 100%)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        margin: '0.5rem',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
    >
      📦 Export to ZIP
    </button>
  );
};

export default GenericExportZIP;
