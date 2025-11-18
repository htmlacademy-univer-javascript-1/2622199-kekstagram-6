import { generatePhotosArray } from './data.js';

// Функция для создания DOM-элемента на основе шаблона
const createThumbnailElement = (photo) => {
  const template = document.querySelector('#picture').content.querySelector('.picture');
  const thumbnailElement = template.cloneNode(true);
  const image = thumbnailElement.querySelector('.picture__img');
  const likes = thumbnailElement.querySelector('.picture__likes');
  const comments = thumbnailElement.querySelector('.picture__comments');
  // Заполняем данные согласно требованиям
  image.src = photo.url;
  image.alt = photo.description;
  likes.textContent = photo.likes;
  comments.textContent = photo.comments.length;
  // Добавляем данные фото в элемент для дальнейшего использования
  thumbnailElement.dataset.photoId = photo.id;
  return thumbnailElement;
};

// Функция для отрисовки всех миниатюр
const renderThumbnails = () => {
  const photos = generatePhotosArray(); // Получаем временные данные
  const picturesContainer = document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }
  // Очищаем контейнер перед добавлением новых элементов
  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());
  // Создаем DocumentFragment для эффективной вставки
  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    const thumbnailElement = createThumbnailElement(photo);
    fragment.appendChild(thumbnailElement);
  });
  // Вставляем все элементы одним действием
  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };
