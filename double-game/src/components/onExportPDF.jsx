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
      const margin = 20;
      const cardSize = 80;
      const imageSize = 15;

      for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        const cardImages = card.images || card;
        
        // המרת התמונות ל-base64
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

        // כותרת הכרטיס
        doc.setFontSize(16);
        doc.setTextColor(231, 76, 60);
        doc.text(`כרטיס ${index + 1}`, 105, margin, { align: 'center' });

        // ציור מעגל הכרטיס
        const centerX = 105;
        const centerY = 80;
        
        doc.setDrawColor(231, 76, 60);
        doc.setLineWidth(2);
        doc.setFillColor(255, 245, 245);
        
        // ציור מעגל פשוט
        doc.circle(centerX, centerY, cardSize, 'FD');

        // מיקומי התמונות
        const positions = [
          { x: centerX, y: centerY }, // במרכז
          { x: centerX, y: centerY - 25 }, // למעלה
          { x: centerX + 22, y: centerY - 12 }, // ימין עליון
          { x: centerX + 22, y: centerY + 12 }, // ימין תחתון
          { x: centerX, y: centerY + 25 }, // למטה
          { x: centerX - 22, y: centerY + 12 }, // שמאל תחתון
          { x: centerX - 22, y: centerY - 12 }  // שמאל עליון
        ];

        // הוספת התמונות
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
              
              // גבול לתמונה
              doc.setDrawColor(52, 152, 219);
              doc.setLineWidth(1);
              doc.circle(pos.x, pos.y, imageSize/2);
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
