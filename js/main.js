import { generatePhotosArray } from './modules/data.js';

const photosArray = generatePhotosArray();

// eslint-disable-next-line no-console
console.log('Сгенерированный массив фотографий:', photosArray);

export { photosArray };

