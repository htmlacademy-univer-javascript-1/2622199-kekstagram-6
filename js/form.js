import { sendData } from './api.js';
import { showAlert } from './alert.js';

// Элементы формы
const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('#upload-cancel');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');
const submitButton = document.querySelector('#upload-submit');

let pristine = null;
let isSubmitting = false;

// Инициализация Pristine для валидации
const initPristine = () => {
  if (typeof Pristine === 'undefined') {
    throw new Error('Pristine library is not loaded. Please include pristine.min.js in your HTML.');
  }

  pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  // Валидация хэш-тегов (теперь пустые значения разрешены)
  const validateHashtags = (value) => {
    // Хэштеги не обязательны
    if (value.trim() === '') {
      return true;
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

  // Валидация комментария (теперь пустые значения разрешены)
  const validateDescription = (value) => value.length <= 140;

  // Сообщения об ошибках
  const getHashtagsErrorMessage = () => 'До 5 хэш-тегов, разделенных пробелами. Хэш-тег начинается с #, содержит буквы и цифры (1-19 символов), не может повторяться';

  const getDescriptionErrorMessage = () => 'Длина комментария не может превышать 140 символов';

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
};

// Функция проверки, можно ли разблокировать кнопку
const canEnableSubmitButton = () => {
  if (!pristine) { return true; }
  const isHashtagsValid = pristine.validate(hashtagsInput);
  const isDescriptionValid = pristine.validate(descriptionInput);

  return isHashtagsValid && isDescriptionValid;
};

// Функция обновления состояния кнопки
const updateSubmitButtonState = () => {
  if (isSubmitting) {
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    submitButton.style.opacity = '0.6';
    return;
  }

  const isValid = canEnableSubmitButton();

  submitButton.disabled = !isValid;
  submitButton.textContent = 'Опубликовать';
  submitButton.style.opacity = isValid ? '1' : '0.6';
  submitButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
};

// Открытие формы редактирования
const openForm = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  // eslint-disable-next-line no-use-before-define
  document.addEventListener('keydown', onDocumentKeydown);
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
  if (form) {
    form.reset();
  }
  if (pristine) {
    pristine.reset();
  }
  if (fileInput) {
    fileInput.value = '';
  }

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

  const effectSlider = document.querySelector('.effect-level');
  if (effectSlider) {
    effectSlider.classList.add('hidden');
  }

  const imagePreview = document.querySelector('.img-upload__preview img');
  if (imagePreview) {
    imagePreview.src = 'img/upload-default-image.jpg';
    imagePreview.style.filter = '';
    imagePreview.style.transform = '';
  }

  isSubmitting = false;
  updateSubmitButtonState();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !isSubmitting) {
    evt.preventDefault();

    const isHashtagsFocused = document.activeElement === hashtagsInput;
    const isDescriptionFocused = document.activeElement === descriptionInput;

    if (!isHashtagsFocused && !isDescriptionFocused) {
      closeForm();
    }
  }
};

// Обработчик отправки формы с AJAX
const onFormSubmit = async (evt) => {
  evt.preventDefault();
  if (!pristine || isSubmitting) {
    return;
  }

  const isValid = pristine.validate();
  if (!isValid) {
    const firstErrorElement = form.querySelector('.img-upload__field-wrapper--invalid input, .img-upload__field-wrapper--invalid textarea');
    if (firstErrorElement) {
      firstErrorElement.focus();
    }
    return;
  }

  isSubmitting = true;
  updateSubmitButtonState();

  try {
    // Собираем данные формы
    const formData = new FormData(form);
    // Отправляем данные на сервер
    await sendData(formData);
    // Показываем сообщение об успехе
    showAlert('Фотография успешно загружена!', 'success');
    // Сбрасываем форму
    resetForm();
    closeForm();
  } catch (error) {
    // Показываем ошибку
    showAlert(error.message, 'error');
    // Возвращаем кнопку в нормальное состояние
    isSubmitting = false;
    updateSubmitButtonState();
  }
};

// Обработчик выбора файла
const onFileInputChange = () => {
  const file = fileInput.files[0];

  if (file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showAlert('Пожалуйста, выберите файл изображения в формате JPEG, PNG, GIF или WebP', 'error');
      resetForm();
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showAlert('Размер файла не должен превышать 5MB', 'error');
      resetForm();
      return;
    }
    // Показываем превью изображения
    const reader = new FileReader();
    reader.onload = (e) => {
      const imagePreview = document.querySelector('.img-upload__preview img');
      if (imagePreview) {
        imagePreview.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
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
const onInputChange = () => {
  if (pristine) {
    pristine.validate();
    updateSubmitButtonState();
  }
};

// Инициализация модуля
const initForm = () => {
  initPristine();
  fileInput.addEventListener('change', onFileInputChange);
  cancelButton.addEventListener('click', closeForm);
  form.addEventListener('submit', onFormSubmit);

  // Убираем старый action атрибут, чтобы форма не отправлялась обычным способом
  form.removeAttribute('action');

  hashtagsInput.addEventListener('keydown', stopPropagationOnEscape);
  descriptionInput.addEventListener('keydown', stopPropagationOnEscape);

  hashtagsInput.addEventListener('input', onInputChange);
  descriptionInput.addEventListener('input', onInputChange);

  hashtagsInput.addEventListener('blur', onInputChange);
  descriptionInput.addEventListener('blur', onInputChange);

  // Инициализируем состояние кнопки
  updateSubmitButtonState();
};

export { initForm, closeForm, resetForm };
