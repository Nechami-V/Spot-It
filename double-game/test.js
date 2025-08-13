function generateDobbleCards(imageUrls) {
  const totalImages = imageUrls.length;
  const n = Math.floor((-1 + Math.sqrt(1 + 4 * (totalImages - 1))) / 2);
  console.log('Total images:', totalImages, 'n:', n, 'Expected images per card:', n+1);
  
  if (n * n + n + 1 !== totalImages) {
    throw new Error(`Number of images (${totalImages}) is invalid.`);
  }

  const cards = [];

  // Step 1: First set of cards
  console.log('\n=== Step 1: Creating first set of cards ===');
  for (let i = 0; i <= n; i++) {
    const card = [0];
    console.log(`Card ${i}: Starting with [0]`);
    for (let j = 1; j <= n; j++) {
      const value = i * n + j;
      card.push(value);
      console.log(`  Adding ${value}, card now: [${card.join(', ')}]`);
    }
    cards.push(card);
    console.log(`Final card ${i}: [${card.join(', ')}] - length: ${card.length}`);
  }

  return cards;
}

// Test with 57 images (n=7, should create cards with 8 images each)
console.log('=== Testing with 57 images ===');
const testImages57 = Array.from({length: 57}, (_, i) => `img${i}`);
const result = generateDobbleCards(testImages57);
console.log('\nFirst 3 cards:');
result.slice(0, 3).forEach((card, i) => {
  console.log(`Card ${i}: ${card.length} images`);
});
