import { openFullPhoto } from './big-photo.js';
import { getPhotos, getRandomPhotos, getDiscussedPhotos } from './api-data.js';

// Сохраняем данные фотографий в глобальной переменной
let photosData = [];

// Функция для создания DOM-элемента на основе шаблона
const createThumbnailElement = (photo) => {
  const template = document.querySelector('#picture').content.querySelector('.picture');
  const thumbnailElement = template.cloneNode(true);
  const image = thumbnailElement.querySelector('.picture__img');
  const likes = thumbnailElement.querySelector('.picture__likes');
  const comments = thumbnailElement.querySelector('.picture__comments');
  // Заполняем данные
  image.src = photo.url;
  image.alt = photo.description;
  likes.textContent = photo.likes;
  comments.textContent = photo.comments.length;
  // Добавляем данные фото в элемент
  thumbnailElement.dataset.photoId = photo.id;
  return thumbnailElement;
};

// Функция для отрисовки миниатюр
const renderThumbnails = (photos = null) => {
  const picturesContainer = document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }
  // Используем переданные фото или берем из глобального состояния
  const photosToRender = photos || photosData;
  // Очищаем контейнер
  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());
  // Создаем DocumentFragment для эффективной вставки
  const fragment = document.createDocumentFragment();
  photosToRender.forEach((photo) => {
    const thumbnailElement = createThumbnailElement(photo);
    fragment.appendChild(thumbnailElement);
  });
  // Вставляем все элементы
  picturesContainer.appendChild(fragment);
};

// Функция для инициализации обработчиков событий
const initThumbnailsHandlers = () => {
  const picturesContainer = document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }
  // Используем делегирование событий для обработки кликов по миниатюрам
  picturesContainer.addEventListener('click', (evt) => {
    const thumbnail = evt.target.closest('.picture');
    if (thumbnail) {
      evt.preventDefault();
      const photoId = parseInt(thumbnail.dataset.photoId, 10);
      const photoData = photosData.find((photo) => photo.id === photoId);
      if (photoData) {
        openFullPhoto(photoData);
      }
    }
  });
};

// Функции для фильтрации
const renderDefaultPhotos = () => {
  photosData = getPhotos();
  renderThumbnails();
};

const renderRandomPhotos = () => {
  photosData = getRandomPhotos(10);
  renderThumbnails();
};

const renderDiscussedPhotos = () => {
  photosData = getDiscussedPhotos();
  renderThumbnails();
};

// Инициализация фильтров
const initFilters = () => {
  const filterButtons = document.querySelectorAll('.img-filters__button');
  const filtersContainer = document.querySelector('.img-filters');
  if (!filtersContainer || filterButtons.length === 0) {
    return;
  }
  // Показываем блок фильтров
  filtersContainer.classList.remove('img-filters--inactive');
  // Добавляем обработчики для кнопок фильтров
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Удаляем активный класс у всех кнопок
      filterButtons.forEach((btn) => btn.classList.remove('img-filters__button--active'));
      // Добавляем активный класс текущей кнопке
      button.classList.add('img-filters__button--active');
      // Обрабатываем фильтр
      const filter = button.id;
      if (filter === 'filter-default') {
        renderDefaultPhotos();
      } else if (filter === 'filter-random') {
        renderRandomPhotos();
      } else if (filter === 'filter-discussed') {
        renderDiscussedPhotos();
      }
    });
  });
  // Устанавливаем фильтр по умолчанию
  const defaultButton = document.getElementById('filter-default');
  if (defaultButton) {
    defaultButton.classList.add('img-filters__button--active');
  }
};

// Функция для установки фотографий (используется при загрузке)
const setPhotosData = (photos) => {
  photosData = photos;
};

export {
  renderThumbnails,
  initThumbnailsHandlers,
  initFilters,
  setPhotosData,
  renderDefaultPhotos,
  renderRandomPhotos,
  renderDiscussedPhotos
};
