// Константы для хэштегов
const MAX_HASHTAGS_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;

// ВАЛИДАЦИЯ ХЭШ-ТЕГОВ
const validateHashtags = (value) => {
  // Убираем пробелы в начале и конце
  const trimmedValue = value.trim();
  // Если поле пустое - валидно (тест: "Хэш-теги необязательны")
  if (trimmedValue === '') {
    return true;
  }

  // Разбиваем на отдельные хэштеги
  const hashtags = trimmedValue.split(/\s+/);
  // Проверяем количество хэштегов
  if (hashtags.length > MAX_HASHTAGS_COUNT) {
    return false;
  }

  const seen = new Set();

  for (const hashtag of hashtags) {
    // Приводим к нижнему регистру для проверки дубликатов
    const lowerCaseHashtag = hashtag.toLowerCase();

    // Хэштег не может состоять только из решетки
    if (hashtag === '#') {
      return false;
    }

    // Хэштег должен начинаться с решетки
    if (!hashtag.startsWith('#')) {
      return false;
    }

    // Проверяем длину хэштега
    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return false;
    }

    // Проверяем формат: после # только буквы и цифры (включая кириллицу)
    // Регулярное выражение: ^# - начинается с #
    // [A-Za-zА-Яа-яЁё0-9] - буквы (латиница + кириллица) и цифры
    // {1,19} - от 1 до 19 символов (вместе с # максимум 20)
    if (!/^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(hashtag)) {
      return false;
    }

    // Проверяем на дубликаты (без учета регистра)
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

  const hashtags = trimmedValue.split(/\s+/);
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

    // Проверка максимальной длины
    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return `Максимальная длина хэш-тега - ${MAX_HASHTAG_LENGTH} символов (включая #)`;
    }

    // Проверка формата
    if (!/^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(hashtag)) {
      return 'Хэш-тег должен содержать только буквы и цифры после #';
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
