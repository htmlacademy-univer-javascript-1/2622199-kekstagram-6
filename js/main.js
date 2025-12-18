import { loadPhotos } from './api-data.js'; // будет создан ниже
import {
  renderThumbnails,
  initThumbnailsHandlers,
  initFilters,
  setPhotosData
} from './pictures.js';
import { initForm } from './form.js';
import { initScaleEditor } from './scale-photo.js';
import { showAlert } from './alert.js'; // будет создан ниже

// Переменная для хранения загруженных фотографий
let photosArray = [];

// Загрузка данных с сервера
const loadData = async () => {
  try {
    // Загружаем фото с сервера
    photosArray = await loadPhotos();
    // eslint-disable-next-line no-console
    console.log('Данные загружены с сервера:', photosArray);
    // Устанавливаем данные в модуль pictures
    setPhotosData(photosArray);
    // Отрисовываем миниатюры
    renderThumbnails();
    // Инициализируем обработчики
    initThumbnailsHandlers();
    // Инициализируем фильтры
    initFilters();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка загрузки данных:', error);
    showAlert(error.message);
  }
};

// Экспортируем для отладки
export { photosArray };

// Инициализация приложения
const initApp = async () => {
  // Инициализируем редактор масштаба
  initScaleEditor();
  // Инициализируем форму
  initForm();
  // Загружаем данные с сервера
  await loadData();
  // eslint-disable-next-line no-console
  console.log('Приложение инициализировано');
};

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  initApp().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Ошибка инициализации приложения:', error);
    showAlert('Не удалось инициализировать приложение');
  });
});
