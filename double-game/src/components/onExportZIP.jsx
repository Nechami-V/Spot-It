import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


const ExportToZIPButton = ({ cards }) => {
const handleExportZIP = async () => {
  try {
    const zip = new JSZip();

    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
      const card = cards[cardIndex];
      const cardImages = card.images || card;
      
      // Create canvas for card
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const cardSize = 400;
      canvas.width = cardSize;
      canvas.height = cardSize;
      
      // Card background
      const gradient = ctx.createLinearGradient(0, 0, cardSize, cardSize);
      gradient.addColorStop(0, '#fff5f5');
      gradient.addColorStop(1, '#ffe0e0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cardSize, cardSize);
      
      // Draw card circle
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cardSize/2, cardSize/2, cardSize/2 - 20, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Card title
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      // ctx.fillText(`כרטיס ${cardIndex + 1}`, cardSize/2, 40);
      
      // Load and draw images
      const imagePromises = cardImages.map((imgUrl, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const imageSize = 70;
            let x, y;
            
            // Image positions - matching CSS and PDF layout
            const positions = [
              { x: cardSize/2, y: cardSize/2 }, // center (first image)
              { x: cardSize/2, y: cardSize * 0.25 }, // top
              { x: cardSize * 0.75, y: cardSize * 0.4 }, // top right
              { x: cardSize * 0.75, y: cardSize * 0.6 }, // bottom right
              { x: cardSize/2, y: cardSize * 0.75 }, // bottom
              { x: cardSize * 0.25, y: cardSize * 0.6 }, // bottom left
              { x: cardSize * 0.25, y: cardSize * 0.4 }  // top left
            ];
            
            if (i < positions.length) {
              x = positions[i].x;
              y = positions[i].y;
            } else {
              x = cardSize/2;
              y = cardSize/2;
            }
            
            // Draw image as circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, imageSize/2, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(img, x - imageSize/2, y - imageSize/2, imageSize, imageSize);
            ctx.restore();
            
            // Blue border for image
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, imageSize/2, 0, 2 * Math.PI);
            ctx.stroke();
            
            resolve();
          };
          img.onerror = () => resolve();
          img.src = imgUrl;
        });
      });
      
      await Promise.all(imagePromises);
      
      // Convert to blob and save to ZIP
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
      });
      
      zip.file(`card-${cardIndex + 1}.png`, blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'cards.zip');
  } catch (error) {
    console.error('שגיאה בייצוא ZIP:', error);
    alert('שגיאה בייצוא הקובץ');
  }
};

  return (
    <button 
      onClick={handleExportZIP} 
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
      📦 ייצוא ל-ZIP
    </button>
  );
};

export default ExportToZIPButton;
