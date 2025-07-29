import React from 'react';
import jsPDF from 'jspdf';

const ExportToPDFButton = ({ cards }) => {
  const handleExportPDF = async () => {
    if (!Array.isArray(cards) || cards.length === 0) {
      alert("אין כרטיסים לייצוא");
      return;
    }
    
    try {
      const doc = new jsPDF();

      for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        const cardImages = card.images || card;
        
        // Convert images to base64
        const imageDataList = [];
        for (const imgUrl of cardImages) {
          try {
            const response = await fetch(imgUrl);
            const blob = await response.blob();
            const base64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
            imageDataList.push(base64);
          } catch (err) {
            console.error('שגיאה בטעינת תמונה:', err);
          }
        }

        // Card settings
        const centerX = 105;
        const centerY = 150;
        const cardRadius = 70;
        const imageSize = 18;

        // Page background
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');

        // Draw card background circle
        doc.setFillColor(255, 245, 245);
        doc.circle(centerX, centerY, cardRadius, 'F');

        // Draw card border
        doc.setDrawColor(231, 76, 60);
        doc.setLineWidth(3);
        doc.circle(centerX, centerY, cardRadius);

        // Card title
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(231, 76, 60);
        doc.setLineWidth(1);
        doc.roundedRect(centerX - 25, centerY - cardRadius + 10, 50, 15, 8, 8, 'FD');
        
        doc.setFontSize(12);
        doc.setTextColor(231, 76, 60);
        doc.text(`כרטיס ${index + 1}`, centerX, centerY - cardRadius + 20, { align: 'center' });

        // Image positions - matching CSS layout
        const positions = [
          { x: centerX, y: centerY }, // center (first image)
          { x: centerX, y: centerY - 35 }, // top
          { x: centerX + 30, y: centerY - 18 }, // top right
          { x: centerX + 30, y: centerY + 18 }, // bottom right
          { x: centerX, y: centerY + 35 }, // bottom
          { x: centerX - 30, y: centerY + 18 }, // bottom left
          { x: centerX - 30, y: centerY - 18 }  // top left
        ];

        // Add images
        imageDataList.forEach((imgData, i) => {
          if (i < positions.length && imgData) {
            const pos = positions[i];
            try {
              doc.addImage(
                imgData, 
                'PNG', 
                pos.x - imageSize/2, 
                pos.y - imageSize/2, 
                imageSize, 
                imageSize
              );
              
              // Blue circle border for image
              doc.setDrawColor(52, 152, 219);
              doc.setLineWidth(2);
              doc.circle(pos.x, pos.y, imageSize/2 + 1);
            } catch (err) {
              console.error('שגיאה בהוספת תמונה:', err);
            }
          }
        });

        if (index !== cards.length - 1) {
          doc.addPage();
        }
      }

      doc.save('cards.pdf');
    } catch (error) {
      console.error('שגיאה בייצוא PDF:', error);
      alert('שגיאה בייצוא הקובץ: ' + error.message);
    }
  };

  return (
    <button 
      onClick={handleExportPDF} 
      style={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
      📄 ייצוא ל-PDF
    </button>
  );
};

export default ExportToPDFButton;
