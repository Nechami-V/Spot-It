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

        // הגדרות כרטיס
        const centerX = 105;
        const centerY = 150;
        const cardRadius = 70;
        const imageSize = 18;

        // רקע עמוד
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');

        // ציור מעגל רקע הכרטיס
        doc.setFillColor(255, 245, 245);
        doc.circle(centerX, centerY, cardRadius, 'F');

        // ציור גבול הכרטיס
        doc.setDrawColor(231, 76, 60);
        doc.setLineWidth(3);
        doc.circle(centerX, centerY, cardRadius);

        // כותרת הכרטיס
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(231, 76, 60);
        doc.setLineWidth(1);
        doc.roundedRect(centerX - 25, centerY - cardRadius + 10, 50, 15, 8, 8, 'FD');
        
        doc.setFontSize(12);
        doc.setTextColor(231, 76, 60);
        doc.text(`כרטיס ${index + 1}`, centerX, centerY - cardRadius + 20, { align: 'center' });

        // מיקומי התמונות - בדיוק כמו ב-CSS
        const positions = [
          { x: centerX, y: centerY }, // במרכז (תמונה ראשונה)
          { x: centerX, y: centerY - 35 }, // למעלה
          { x: centerX + 30, y: centerY - 18 }, // ימין עליון
          { x: centerX + 30, y: centerY + 18 }, // ימין תחתון
          { x: centerX, y: centerY + 35 }, // למטה
          { x: centerX - 30, y: centerY + 18 }, // שמאל תחתון
          { x: centerX - 30, y: centerY - 18 }  // שמאל עליון
        ];

        // הוספת התמונות
        imageDataList.forEach((imgData, i) => {
          if (i < positions.length && imgData) {
            const pos = positions[i];
            try {
              // הוספת התמונה
              doc.addImage(
                imgData, 
                'PNG', 
                pos.x - imageSize/2, 
                pos.y - imageSize/2, 
                imageSize, 
                imageSize
              );
              
              // גבול עגול כחול לתמונה
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
