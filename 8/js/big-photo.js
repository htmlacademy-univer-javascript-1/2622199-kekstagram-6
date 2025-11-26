const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const socialComments = bigPicture.querySelector('.social__comments');
const commentsCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

// Функция для создания элемента комментария
const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;
  return commentElement;
};

// Функция для отрисовки комментариев
const renderComments = (comments) => {
  socialComments.innerHTML = '';
  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    socialComments.appendChild(commentElement);
  });
};

// Функция для открытия полноразмерного изображения
const openFullPhoto = (photoData) => {
  // Заполняем данные
  bigPicture.querySelector('.big-picture__img img').src = photoData.url;
  bigPicture.querySelector('.big-picture__img img').alt = photoData.description;
  bigPicture.querySelector('.likes-count').textContent = photoData.likes;
  bigPicture.querySelector('.comments-count').textContent = photoData.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photoData.description;
  // Отрисовываем комментарии
  renderComments(photoData.comments);
  // Скрываем блоки счётчика комментариев и загрузки новых комментариев
  commentsCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
  // Показываем окно
  bigPicture.classList.remove('hidden');
  // Добавляем класс для body
  document.body.classList.add('modal-open');
};

// Функция для закрытия полноразмерного изображения
const closeFullPhoto = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

// Обработчик закрытия по клику на кнопку
closeButton.addEventListener('click', () => {
  closeFullPhoto();
});

// Обработчик закрытия по клавише Esc
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    closeFullPhoto();
  }
});

// Экспортируем функцию для использования в других модулях
export { openFullPhoto };
