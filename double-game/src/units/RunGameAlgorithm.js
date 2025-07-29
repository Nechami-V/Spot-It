function generateDobbleCards(imageUrls) {
  const totalImages = imageUrls.length;

  // מחשבים את ערך n כך שיתאים לנוסחה: totalImages = n^2 + n + 1
  const n = Math.floor((-1 + Math.sqrt(1 + 4 * (totalImages - 1))) / 2);

  if (n * n + n + 1 !== totalImages) {
    throw new Error(`Number of images (${totalImages}) is invalid. It must be n^2 + n + 1 for some integer n.`);
  }

  const cards = [];

  // כרטיסים מהצורה: { images: [...] }

  // שלב 1: כרטיס ראשון עם התמונות 0 עד n
  for (let i = 0; i <= n; i++) {
    const card = [0]; // כל הכרטיסים מכילים את התמונה הראשונה
    for (let j = 1; j <= n; j++) {
      card.push(i * n + j);
    }
    cards.push(card);
  }

  // שלב 2: כרטיסים נוספים
  for (let a = 1; a <= n; a++) {
    for (let b = 1; b <= n; b++) {
      const card = [a];
      for (let k = 1; k <= n; k++) {
        const value = n + 1 + n * (k - 1) + ((a * (k - 1) + b - 1) % n);
        card.push(value);
      }
      cards.push(card);
    }
  }

  // המרה לאינדקסים של תמונות
  const finalCards = cards.map(indices => indices.map(i => imageUrls[i]));

  return finalCards;
}
export default generateDobbleCards;