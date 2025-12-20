import { loadPhotos } from './api-data.js';
import {
  renderThumbnails,
  initThumbnailsHandlers,
  initFilters,
  setPhotosData
} from './pictures.js';
import { initForm } from './form.js';
import { initScaleEditor } from './scale-photo.js';
import { showAlert } from './alert.js';

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
    // Инициализируем фильтры (показывает блок фильтров)
    initFilters();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка загрузки данных:', error);
    showAlert(error.message);
  }
};

// Инициализация приложения
const initApp = async () => {
  try {
    // Инициализируем редактор масштаба
    initScaleEditor();
    // Инициализируем форму
    initForm();
    // Загружаем данные с сервера
    await loadData();
    // eslint-disable-next-line no-console
    console.log('Приложение инициализировано');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при инициализации:', error);
    showAlert('Ошибка при инициализации приложения');
  }
};

// Запускаем приложение после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
