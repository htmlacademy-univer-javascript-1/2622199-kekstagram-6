// Элементы формы
const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('#upload-cancel');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');
const submitButton = document.querySelector('#upload-submit');

// Добавляем action атрибут форме
form.setAttribute('action', 'https://echo.htmlacademy.ru');

// Проверяем, что Pristine доступен
if (typeof Pristine === 'undefined') {
  throw new Error('Pristine library is not loaded. Please include pristine.min.js in your HTML.');
}

// Инициализация Pristine для валидации
const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

// Валидация хэш-тегов - теперь пустые значения НЕ валидны
const validateHashtags = (value) => {
  // Поле обязательно должно быть заполнено
  if (value.trim() === '') {
    return false;
  }

  const hashtags = value.trim().split(/\s+/);
  if (hashtags.length > 5) {
    return false;
  }

  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;
  const seenHashtags = new Set();

  for (const hashtag of hashtags) {
    if (!hashtagRegex.test(hashtag)) {
      return false;
    }
    const lowerCaseHashtag = hashtag.toLowerCase();
    if (seenHashtags.has(lowerCaseHashtag)) {
      return false;
    }
    seenHashtags.add(lowerCaseHashtag);
  }

  return true;
};

// Валидация комментария - теперь пустые значения НЕ валидны
const validateDescription = (value) => value.trim() !== '' && value.length <= 140;

// Сообщения об ошибках
const getHashtagsErrorMessage = () => 'Обязательное поле. До 5 хэш-тегов, разделенных пробелами. Хэш-тег начинается с #, содержит буквы и цифры (1-19 символов), не может повторяться';

const getDescriptionErrorMessage = () => 'Обязательное поле. Длина комментария не может превышать 140 символов';

// Добавление валидаторов
pristine.addValidator(
  hashtagsInput,
  validateHashtags,
  getHashtagsErrorMessage
);

pristine.addValidator(
  descriptionInput,
  validateDescription,
  getDescriptionErrorMessage
);

// Функция проверки, можно ли разблокировать кнопку
const canEnableSubmitButton = () => {
  // Проверяем что оба поля валидны
  const isHashtagsValid = pristine.validate(hashtagsInput);
  const isDescriptionValid = pristine.validate(descriptionInput);

  return isHashtagsValid && isDescriptionValid;
};

// Функция обновления состояния кнопки
const updateSubmitButtonState = () => {
  const isValid = canEnableSubmitButton();

  submitButton.disabled = !isValid;

  if (isValid) {
    submitButton.textContent = 'Опубликовать';
    submitButton.style.opacity = '1';
    submitButton.style.cursor = 'pointer';
  } else {
    submitButton.textContent = 'Опубликовать';
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';
  }
};

// Открытие формы редактирования
const openForm = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  // eslint-disable-next-line no-use-before-define
  document.addEventListener('keydown', onDocumentKeydown);

  // При открытии формы блокируем кнопку (поля пустые)
  updateSubmitButtonState();
};

// Закрытие формы редактирования
const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  // eslint-disable-next-line no-use-before-define
  document.removeEventListener('keydown', onDocumentKeydown);
  // eslint-disable-next-line no-use-before-define
  resetForm();
};

// Полный сброс формы
const resetForm = () => {
  form.reset();
  pristine.reset();
  fileInput.value = '';

  const originalEffect = document.querySelector('#effect-none');
  if (originalEffect) {
    originalEffect.checked = true;
  }

  const scaleInput = document.querySelector('.scale__control--value');
  if (scaleInput) {
    scaleInput.value = '55%';
  }

  const effectLevel = document.querySelector('.effect-level__value');
  if (effectLevel) {
    effectLevel.value = '';
  }

  // Сбрасываем состояние кнопки (будет заблокирована)
  updateSubmitButtonState();
};

// Обработчик клавиатуры
const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();

    const isHashtagsFocused = document.activeElement === hashtagsInput;
    const isDescriptionFocused = document.activeElement === descriptionInput;

    if (!isHashtagsFocused && !isDescriptionFocused) {
      closeForm();
    }
  }
};

// Обработчик отправки формы
const onFormSubmit = (evt) => {
  const isValid = pristine.validate();

  if (!isValid) {
    evt.preventDefault();
    const firstErrorElement = form.querySelector('.img-upload__field-wrapper--invalid input, .img-upload__field-wrapper--invalid textarea');
    if (firstErrorElement) {
      firstErrorElement.focus();
    }
  }
};

// Обработчик выбора файла
const onFileInputChange = () => {
  const file = fileInput.files[0];

  if (file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      // eslint-disable-next-line no-alert
      alert('Пожалуйста, выберите файл изображения в формате JPEG, PNG, GIF или WebP');
      resetForm();
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      // eslint-disable-next-line no-alert
      alert('Размер файла не должен превышать 5MB');
      resetForm();
      return;
    }
    openForm();
  }
};

// Обработчик для предотвращения закрытия формы при фокусе
const stopPropagationOnEscape = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

// Обработчики ввода данных
const onHashtagsInput = () => {
  // Даем небольшую задержку для обновления валидации
  setTimeout(() => {
    pristine.validate(hashtagsInput);
    updateSubmitButtonState();
  }, 10);
};

const onDescriptionInput = () => {
  setTimeout(() => {
    pristine.validate(descriptionInput);
    updateSubmitButtonState();
  }, 10);
};

// Инициализация модуля
const initForm = () => {
  // eslint-disable-next-line no-console
  console.log('Инициализация формы...'); // Для отладки

  fileInput.addEventListener('change', onFileInputChange);
  cancelButton.addEventListener('click', closeForm);
  form.addEventListener('submit', onFormSubmit);

  hashtagsInput.addEventListener('keydown', stopPropagationOnEscape);
  descriptionInput.addEventListener('keydown', stopPropagationOnEscape);

  // Слушаем ввод в полях для обновления состояния кнопки
  hashtagsInput.addEventListener('input', onHashtagsInput);
  descriptionInput.addEventListener('input', onDescriptionInput);

  // Также слушаем blur события
  hashtagsInput.addEventListener('blur', onHashtagsInput);
  descriptionInput.addEventListener('blur', onDescriptionInput);

  // Принудительно блокируем кнопку при инициализации
  submitButton.disabled = true;
  submitButton.textContent = 'Заполните обязательные поля';
  submitButton.style.opacity = '0.6';
  submitButton.style.cursor = 'not-allowed';
  // eslint-disable-next-line no-console
  console.log('Кнопка должна быть заблокирована:', submitButton.disabled); // Для отладки
};

export { initForm, closeForm, resetForm };
