import React, { useState } from 'react';

function CardImageSelector() {
    const [imageCount, setImageCount] = useState(0);
    const [images, setImages] = useState([]);

    const handleCountChange = (e) => {
        let count = parseInt(e.target.value);
        if (count === 6) {
            setImageCount(31);
            count = 31;
        } else if (count === 7) {
            setImageCount(43);
            count = 43;
        } else {
            setImageCount(57);
            count = 57;
        }
        setImages(Array(count).fill(null)); // Reset images array
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        const updatedImages = [...images];
        updatedImages[index] = imageUrl;
        setImages(updatedImages);
    };

    const runGameAlgorithm = () => {
        // כאן תכניס את קוד האלגוריתם שלך
        // לדוגמה - סתם הדפסה
        console.log("הרצת אלגוריתם עם התמונות:", images);
        
        // לדוגמה: אם תרצה לעבור רק על תמונות שהוזנו:
        const selectedImages = images.filter(img => img !== null);
        console.log("תמונות שנבחרו בפועל:", selectedImages);

        // כאן תוכל להריץ את הפונקציה של המשחק עם selectedImages
    };

    return (
        <div style={{ padding: '1rem' }}>
            <label htmlFor="count-select">בחר כמה תמונות יכיל הכרטיס:</label>
            <select
                id="count-select"
                onChange={handleCountChange}
                defaultValue=""
                style={{ margin: '0.5rem' }}
            >
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
            </select>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '1rem',
                    marginTop: '1rem'
                }}
            >
                {images.map((image, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                border: '2px dashed #888',
                                borderRadius: '50%',
                                width: '90px',
                                height: '90px',
                                margin: '0 auto 0.5rem auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                backgroundColor: '#f8f8f8'
                            }}
                        >
                            {image ? (
                                <img src={image} alt={`img-${index}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            ) : (
                                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>ללא תמונה</span>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index)} />
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button onClick={runGameAlgorithm} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
                    הפעל אלגוריתם
                </button>
            </div>
        </div>
    );
}

export default CardImageSelector;
