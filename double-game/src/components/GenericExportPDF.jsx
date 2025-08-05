import React from 'react';
import jsPDF from 'jspdf';

const GenericExportPDF = ({ gameData, gameType, fileName = 'export.pdf' }) => {
  const handleExport = async () => {
    try {
      const pdf = new jsPDF();
      
      switch (gameType) {
        case 'spot-it':
          await exportSpotItCards(pdf, gameData);
          break;
        case 'memory-game':
          await exportMemoryCards(pdf, gameData);
          break;
        case 'snakes-ladders':
          await exportSnakesLaddersBoard(pdf, gameData);
          break;
        case 'bingo-game':
          await exportBingoCards(pdf, gameData);
          break;
        case 'quartets-game':
          await exportQuartetsCards(pdf, gameData);
          break;
        default:
          alert('Game type not supported for PDF export');
          return;
      }
      
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Export error');
    }
  };

  // Spot It specific export logic
  const exportSpotItCards = async (pdf, cards) => {
    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
      if (cardIndex > 0) pdf.addPage();
      
      const card = cards[cardIndex];
      const cardImages = card.images || card;
      const cardSize = 180;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const x = (pageWidth - cardSize) / 2;
      const y = (pageHeight - cardSize) / 2;
      
      // Card circle
      pdf.setDrawColor(231, 76, 60);
      pdf.setLineWidth(2);
      pdf.circle(x + cardSize/2, y + cardSize/2, cardSize/2 - 10);
      
      // Images positioning for Spot It
      const positions = [
        { x: x + cardSize/2, y: y + cardSize/2 },
        { x: x + cardSize/2, y: y + cardSize * 0.25 },
        { x: x + cardSize * 0.75, y: y + cardSize * 0.4 },
        { x: x + cardSize * 0.75, y: y + cardSize * 0.6 },
        { x: x + cardSize/2, y: y + cardSize * 0.75 },
        { x: x + cardSize * 0.25, y: y + cardSize * 0.6 },
        { x: x + cardSize * 0.25, y: y + cardSize * 0.4 }
      ];
      
      await addImagesToPDF(pdf, cardImages, positions, 25);
    }
  };

  // Memory Game specific export logic
  const exportMemoryCards = async (pdf, gameData) => {
    const { images, gridSize, cards } = gameData;
    if (!cards || cards.length === 0) return;
    
    const cardSize = 40;
    const margin = 10;
    const cardsPerPage = 4;
    
    for (let i = 0; i < cards.length; i++) {
      if (i > 0 && i % cardsPerPage === 0) pdf.addPage();
      
      const pagePosition = i % cardsPerPage;
      const x = (pagePosition % 2) * 100 + margin;
      const y = Math.floor(pagePosition / 2) * 100 + margin;
      
      // Card title
      pdf.setFontSize(12);
      pdf.text(`Memory Card ${cards[i].pairId + 1}`, x + cardSize/2, y - 5);
      
      // Card border
      pdf.rect(x, y, cardSize, cardSize);
      
      // Add image
      const imgData = await getImageData(cards[i].image, cardSize - 4, cardSize - 4);
      if (imgData) {
        pdf.addImage(imgData, 'JPEG', x + 2, y + 2, cardSize - 4, cardSize - 4);
      }
    }
  };

  // Snakes and Ladders specific export logic
  const exportSnakesLaddersBoard = async (pdf, gameData) => {
    const { boardSize, customImages, backgroundImage, specialSquares } = gameData;
    
    const boardSizePdf = 180;
    const squareSize = boardSizePdf / boardSize;
    const startX = 15;
    const startY = 15;
    
    // Background
    if (backgroundImage) {
      const bgData = await getImageData(backgroundImage, boardSizePdf, boardSizePdf);
      if (bgData) {
        pdf.addImage(bgData, 'JPEG', startX, startY, boardSizePdf, boardSizePdf);
      }
    }
    
    // Draw grid and numbers
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const x = startX + col * squareSize;
        const y = startY + row * squareSize;
        
        // Calculate square number (snakes and ladders numbering)
        const isEvenRow = (boardSize - 1 - row) % 2 === 0;
        let squareNumber;
        if (isEvenRow) {
          squareNumber = (boardSize - row - 1) * boardSize + col + 1;
        } else {
          squareNumber = (boardSize - row - 1) * boardSize + (boardSize - col);
        }
        
        // Draw square border
        pdf.rect(x, y, squareSize, squareSize);
        
        // Add square number
        pdf.setFontSize(8);
        pdf.text(squareNumber.toString(), x + 2, y + 8);
        
        // Add custom image if exists
        if (customImages[squareNumber]) {
          const imgData = await getImageData(customImages[squareNumber], squareSize - 4, squareSize - 4);
          if (imgData) {
            pdf.addImage(imgData, 'JPEG', x + 2, y + 10, squareSize - 4, squareSize - 6);
          }
        }
      }
    }
  };

  // Bingo Game specific export logic
  const exportBingoCards = async (pdf, gameData) => {
    const { cards, gridSize, gameTitle } = gameData;
    
    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
      if (cardIndex > 0) pdf.addPage();
      
      const card = cards[cardIndex];
      const cardSize = 120;
      const squareSize = cardSize / gridSize;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const x = (pageWidth - cardSize) / 2;
      const y = 30;
      
      // Card title
      pdf.setFontSize(16);
      pdf.text(card.title, pageWidth / 2, 20, { align: 'center' });
      
      // Draw bingo grid
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const squareX = x + col * squareSize;
          const squareY = y + row * squareSize;
          const squareIndex = row * gridSize + col;
          const square = card.squares[squareIndex];
          
          // Draw square border
          pdf.rect(squareX, squareY, squareSize, squareSize);
          
          if (square.type === 'free') {
            // FREE square
            pdf.setFontSize(10);
            pdf.text('FREE', squareX + squareSize/2, squareY + squareSize/2, { align: 'center' });
          } else if (square.image) {
            // Image square
            const imgData = await getImageData(square.image, squareSize - 2, squareSize - 2);
            if (imgData) {
              pdf.addImage(imgData, 'JPEG', squareX + 1, squareY + 1, squareSize - 2, squareSize - 2);
            }
          }
        }
      }
    }
  };

  // Quartets Game specific export logic
  const exportQuartetsCards = async (pdf, gameData) => {
    const { quartets } = gameData;
    
    // Color schemes for different quartets (RGB values for PDF)
    const colorSchemes = [
      { bg: [227, 242, 253], header: [25, 118, 210], accent: [33, 150, 243] },
      { bg: [255, 243, 224], header: [245, 124, 0], accent: [255, 152, 0] },
      { bg: [232, 245, 232], header: [56, 142, 60], accent: [76, 175, 80] },
      { bg: [252, 228, 236], header: [194, 24, 91], accent: [233, 30, 99] },
      { bg: [243, 229, 245], header: [123, 31, 162], accent: [156, 39, 176] },
      { bg: [224, 242, 241], header: [0, 105, 92], accent: [0, 150, 136] },
      { bg: [255, 248, 225], header: [249, 168, 37], accent: [255, 193, 7] },
      { bg: [239, 235, 233], header: [93, 64, 55], accent: [121, 85, 72] },
      { bg: [232, 234, 246], header: [63, 81, 181], accent: [92, 107, 192] },
      { bg: [225, 245, 254], header: [2, 136, 209], accent: [3, 169, 244] }
    ];
    
    for (let quartetIndex = 0; quartetIndex < quartets.length; quartetIndex++) {
      const quartet = quartets[quartetIndex];
      
      // Get color scheme for this quartet (cycle through available colors)
      const colorScheme = colorSchemes[quartetIndex % colorSchemes.length];
      
      for (let cardIndex = 0; cardIndex < quartet.cards.length; cardIndex++) {
        if (quartetIndex > 0 || cardIndex > 0) pdf.addPage();
        
        const card = quartet.cards[cardIndex];
        const cardWidth = 80;
        const cardHeight = 110;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const x = (pageWidth - cardWidth) / 2;
        const y = 30;
        
        // Card background with quartet-specific color
        pdf.setFillColor(colorScheme.bg[0], colorScheme.bg[1], colorScheme.bg[2]);
        pdf.rect(x, y, cardWidth, cardHeight, 'F');
        
        // Card border
        pdf.setDrawColor(51, 51, 51);
        pdf.setLineWidth(1);
        pdf.rect(x, y, cardWidth, cardHeight);
        
        // Header with quartet-specific color
        pdf.setFillColor(colorScheme.header[0], colorScheme.header[1], colorScheme.header[2]);
        pdf.rect(x, y, cardWidth, 15, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.text(quartet.title, x + cardWidth/2, y + 10, { align: 'center' });
        
        // Main image
        pdf.setTextColor(0, 0, 0);
        if (card.image) {
          const imgData = await getImageData(card.image, cardWidth - 10, 50);
          if (imgData) {
            pdf.addImage(imgData, 'JPEG', x + 5, y + 20, cardWidth - 10, 50);
            
            // Add subtle border around image with quartet accent color
            pdf.setDrawColor(colorScheme.accent[0], colorScheme.accent[1], colorScheme.accent[2]);
            pdf.setLineWidth(0.5);
            pdf.rect(x + 5, y + 20, cardWidth - 10, 50);
          }
        } else {
          pdf.setFontSize(8);
          pdf.text('No Image', x + cardWidth/2, y + 45, { align: 'center' });
        }
        
        // Option buttons
        const buttonHeight = 8;
        const buttonY = y + 75;
        for (let buttonIndex = 0; buttonIndex < quartet.cards.length; buttonIndex++) {
          const isActive = buttonIndex === cardIndex;
          const buttonYPos = buttonY + (buttonIndex * (buttonHeight + 2));
          
          // Button background with quartet-specific colors
          if (isActive) {
            pdf.setFillColor(colorScheme.accent[0], colorScheme.accent[1], colorScheme.accent[2]);
            pdf.rect(x + 2, buttonYPos, cardWidth - 4, buttonHeight, 'F');
            pdf.setTextColor(255, 255, 255);
            
            // Button border with header color when active
            pdf.setDrawColor(colorScheme.header[0], colorScheme.header[1], colorScheme.header[2]);
            pdf.setLineWidth(0.5);
            pdf.rect(x + 2, buttonYPos, cardWidth - 4, buttonHeight);
          } else {
            pdf.setFillColor(245, 245, 245);
            pdf.rect(x + 2, buttonYPos, cardWidth - 4, buttonHeight, 'F');
            pdf.setTextColor(51, 51, 51);
            
            // Normal border for inactive buttons
            pdf.setDrawColor(221, 221, 221);
            pdf.setLineWidth(0.3);
            pdf.rect(x + 2, buttonYPos, cardWidth - 4, buttonHeight);
          }
          
          // Button text
          pdf.setFontSize(7);
          const buttonText = quartet.cards[buttonIndex].label || `Option ${buttonIndex + 1}`;
          pdf.text(buttonText, x + cardWidth/2, buttonYPos + 5, { align: 'center' });
        }
      }
    }
  };

  // Helper function to convert image to data URL
  const getImageData = (imageSrc, width, height) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => resolve(null);
      img.src = imageSrc;
    });
  };

  // Helper function to add images to PDF
  const addImagesToPDF = async (pdf, images, positions, imageSize) => {
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
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = imageSize * 2;
          canvas.height = imageSize * 2;
          
          // Draw circular clipped image
          ctx.beginPath();
          ctx.arc(imageSize, imageSize, imageSize, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, 0, 0, imageSize * 2, imageSize * 2);
          
          const imgData = canvas.toDataURL('image/jpeg', 0.8);
          pdf.addImage(imgData, 'JPEG', pos.x - imageSize/2, pos.y - imageSize/2, imageSize, imageSize);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = imgUrl;
      });
    });
    
    await Promise.all(imagePromises);
  };

  return (
    <button 
      onClick={handleExport}
      style={{
        background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
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
      📄 Export to PDF
    </button>
  );
};

export default GenericExportPDF;
