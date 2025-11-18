import { generatePhotosArray } from './data.js';
import { renderThumbnails } from './pictures.js';

const photosArray = generatePhotosArray();

// eslint-disable-next-line no-console
console.log('Сгенерированный массив фотографий:', photosArray);

export { photosArray };

document.addEventListener('DOMContentLoaded', () => {
  renderThumbnails();
});
