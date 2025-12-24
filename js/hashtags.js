// Константы для хэштегов
const MAX_HASHTAGS_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;

// ВАЛИДАЦИЯ ХЭШ-ТЕГОВ
const validateHashtags = (value) => {
  const trimmedValue = value.trim();
  // Если поле пустое - валидно (необязательное поле)
  if (trimmedValue === '') {
    return true;
  }

  const hashtags = trimmedValue.split(/\s+/).filter(Boolean);

  // Проверка максимального количества
  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    return false;
  }

  const seen = new Set();

  for (const hashtag of hashtags) {
    const lowerCaseHashtag = hashtag.toLowerCase();

    // Хэштег не может состоять только из решетки
    if (hashtag === '#') {
      return false;
    }

    // Хэштег должен начинаться с решетки
    if (!hashtag.startsWith('#')) {
      return false;
    }

    // Проверка формата: после # только буквы/цифры
    if (!/^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(hashtag)) {
      return false;
    }

    // Проверка максимальной длины
    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return false;
    }

    // Проверка на повторение (без учета регистра)
    if (seen.has(lowerCaseHashtag)) {
      return false;
    }
    seen.add(lowerCaseHashtag);
  }

  return true;
};

// СООБЩЕНИЯ ОБ ОШИБКАХ ДЛЯ ХЭШ-ТЕГОВ
const getHashtagErrorMessage = (value) => {
  const trimmedValue = value.trim();
  // Если поле пустое - нет ошибки
  if (trimmedValue === '') {
    return '';
  }

  const hashtags = trimmedValue.split(/\s+/).filter(Boolean);
  const seen = new Set();

  // Проверка на максимальное количество
  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    return `Не более ${MAX_HASHTAGS_COUNT} хэш-тегов`;
  }

  for (const hashtag of hashtags) {
    const lowerCaseHashtag = hashtag.toLowerCase();

    // Хэштег не может состоять только из решетки
    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из решётки';
    }

    // Хэштег должен начинаться с решетки
    if (!hashtag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с символа #';
    }

    // Проверка формата
    if (!/^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(hashtag)) {
      return 'Хэш-тег должен содержать только буквы и цифры после #';
    }

    // Проверка максимальной длины
    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return `Максимальная длина хэш-тега - ${MAX_HASHTAG_LENGTH} символов (включая #)`;
    }

    // Проверка на повторение (без учета регистра)
    if (seen.has(lowerCaseHashtag)) {
      return 'Хэш-теги не должны повторяться';
    }
    seen.add(lowerCaseHashtag);
  }

  return '';
};

export { validateHashtags, getHashtagErrorMessage };
