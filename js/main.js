import { generatePhotosArray } from './data.js';
import { renderThumbnails, initThumbnailsHandlers } from './pictures.js';
import { initForm } from './form.js';
import { initScaleEditor } from './scale-photo.js';

const photosArray = generatePhotosArray();

// eslint-disable-next-line no-console
console.log('Сгенерированный массив фотографий:', photosArray);

export { photosArray };

document.addEventListener('DOMContentLoaded', () => {
  renderThumbnails();
});

// Инициализация приложения
const initApp = () => {
  renderThumbnails();
  initThumbnailsHandlers();
};

// Инициализация формы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initForm();
});
// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  initScaleEditor();
  // eslint-disable-next-line no-console
  console.log('Scale editor initialized');
});
